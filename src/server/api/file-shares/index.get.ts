import { auth } from '~/lib/auth'
import prisma from '~/lib/prisma'
import { z } from 'zod'

export default defineEventHandler(async (event) => {
  // Проверка авторизации пользователя
  const session = await auth.api.getSession({
    headers: event.headers,
  })
  if (!session) {
    throw createError({
      message: 'Unauthorized',
      statusCode: 401,
    })
  }

  // Получение параметров запроса
  const query = getQuery(event)

  const schema = z.object({
    fileId: z.string().min(24).optional(),
    filter: z.enum(['sharedWithMe']).optional(),
    page: z.coerce.number().int().positive().optional().default(1),
    limit: z.coerce.number().int().positive().max(100).optional().default(20),
  })

  const validationResult = schema.safeParse(query)
  if (!validationResult.success) {
    throw createError({
      data: validationResult.error.format(),
      message: 'Invalid query parameters',
      statusCode: 400,
    })
  }

  const { fileId, filter, page, limit } = validationResult.data
  const skip = (page - 1) * limit

  try {
    // Проверка, что хотя бы один из параметров фильтрации указан
    if (!fileId && !filter) {
      throw createError({
        message: 'Either fileId or filter parameter must be provided',
        statusCode: 400,
      })
    }

    // Формирование условий фильтрации
    let whereConditions: any = {}

    if (fileId) {
      // Проверка существования файла и доступа пользователя к нему
      const file = await prisma.file.findUnique({
        include: {
          organization: {
            include: {
              members: {
                select: {
                  id: true,
                  role: true,
                },
                where: {
                  userId: session.user.id,
                },
              },
            },
          },
          uploader: {
            select: {
              userId: true,
            },
          },
        },
        where: { id: fileId, deleted: false },
      })

      if (!file) {
        throw createError({
          message: 'File not found',
          statusCode: 404,
        })
      }

      // Проверка прав пользователя на просмотр информации о доступе к файлу
      const isUserOrganizationMember = file.organization.members.length > 0
      const isUserFileUploader = file.uploader.userId === session.user.id
      const isUserAdmin = isUserOrganizationMember && file.organization.members[0].role === 'ADMIN'

      // Только загрузивший файл пользователь или администратор могут видеть с кем поделились файлом
      if (!isUserFileUploader && !isUserAdmin) {
        throw createError({
          message: 'You do not have permission to view shares for this file',
          statusCode: 403,
        })
      }

      whereConditions.fileId = fileId
    }
    else if (filter === 'sharedWithMe') {
      // Получение ID пользователя в организациях
      const memberIds = await prisma.member.findMany({
        select: {
          id: true,
        },
        where: {
          userId: session.user.id,
        },
      })

      if (memberIds.length === 0) {
        // Если пользователь не является членом ни одной организации, вернуть пустой список
        return {
          data: [],
          meta: {
            page,
            limit,
            total: 0,
            totalPages: 0,
          },
        }
      }

      // Фильтр по файлам, которыми поделились с пользователем
      whereConditions.memberId = {
        in: memberIds.map(member => member.id),
      }

      // Добавляем проверку, что срок доступа еще не истек или срок не указан
      whereConditions.OR = [
        { expiresAt: null },
        { expiresAt: { gt: new Date() } },
      ]

      // Проверка, что файл не удален
      whereConditions.file = {
        deleted: false,
      }
    }

    // Получение списка доступов к файлам
    const [fileShares, total] = await Promise.all([
      prisma.fileShare.findMany({
        include: {
          file: {
            select: {
              id: true,
              filename: true,
              originalName: true,
              mimeType: true,
              size: true,
              accessLevel: true,
              description: true,
              createdAt: true,
              updatedAt: true,
              organization: {
                select: {
                  id: true,
                  name: true,
                  slug: true,
                  logo: true,
                },
              },
              uploader: {
                select: {
                  id: true,
                  role: true,
                  user: {
                    select: {
                      id: true,
                      name: true,
                      email: true,
                      image: true,
                    },
                  },
                },
              },
            },
          },
          member: {
            select: {
              id: true,
              role: true,
              user: {
                select: {
                  id: true,
                  name: true,
                  email: true,
                  image: true,
                },
              },
            },
          },
        },
        orderBy: {
          createdAt: 'desc',
        },
        skip,
        take: limit,
        where: whereConditions,
      }),
      prisma.fileShare.count({
        where: whereConditions,
      }),
    ])

    return {
      data: fileShares,
      meta: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    }
  }
  catch (error) {
    console.error('Failed to list file shares:', error)
    throw createError({
      message: 'Failed to list file shares',
      statusCode: 500,
    })
  }
})
