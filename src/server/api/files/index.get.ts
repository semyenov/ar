import { auth } from '~/lib/auth'
import prisma from '~~/lib/prisma'
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
    organizationId: z.string().min(24).optional(),
    folderId: z.string().min(24).optional().nullable(),
    accessLevel: z.enum(['PRIVATE', 'ORGANIZATION', 'PUBLIC']).optional(),
    search: z.string().optional(),
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

  const { organizationId, folderId, accessLevel, search, page, limit } = validationResult.data
  const skip = (page - 1) * limit

  try {
    // Формирование условий фильтрации
    const whereConditions: any = {
      deleted: false,
    }

    if (organizationId) {
      // Проверка, что пользователь является членом организации
      const membership = await prisma.member.findFirst({
        where: {
          organizationId,
          userId: session.user.id,
        },
      })

      if (!membership) {
        throw createError({
          message: 'You do not have access to this organization',
          statusCode: 403,
        })
      }

      whereConditions.organizationId = organizationId
    }

    // Использовать null для корневого каталога, undefined для любого уровня
    if (folderId !== undefined) {
      whereConditions.folderId = folderId
    }

    if (accessLevel) {
      whereConditions.accessLevel = accessLevel
    }

    if (search) {
      whereConditions.OR = [
        { originalName: { contains: search, mode: 'insensitive' } },
        { description: { contains: search, mode: 'insensitive' } },
      ]
    }

    // Добавляем проверку доступа пользователя к файлам:
    // 1. Файлы из организаций, где пользователь является членом
    // 2. Публичные файлы
    // 3. Приватные файлы, загруженные пользователем
    const accessConditions = {
      OR: [
        {
          organization: {
            members: {
              some: {
                userId: session.user.id,
              },
            },
          },
          accessLevel: 'ORGANIZATION',
        },
        { accessLevel: 'PUBLIC' },
        {
          uploader: {
            userId: session.user.id,
          },
          accessLevel: 'PRIVATE',
        },
      ],
    }

    // Объединяем условия фильтрации и доступа
    const finalWhereConditions = {
      ...whereConditions,
      ...accessConditions,
    }

    // Получение списка файлов с учетом доступа пользователя
    const [files, total] = await Promise.all([
      prisma.file.findMany({
        include: {
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
          folder: {
            select: {
              id: true,
              name: true,
              path: true,
            },
          },
        },
        orderBy: {
          updatedAt: 'desc',
        },
        skip,
        take: limit,
        where: finalWhereConditions,
      }),
      prisma.file.count({
        where: finalWhereConditions,
      }),
    ])

    // Обновляем время последнего доступа к файлам
    if (files.length > 0) {
      const fileIds = files.map(file => file.id)
      await prisma.file.updateMany({
        data: {
          accessedAt: new Date(),
        },
        where: {
          id: { in: fileIds },
        },
      })
    }

    return {
      data: files,
      meta: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    }
  }
  catch (error) {
    console.error('Failed to list files:', error)
    throw createError({
      message: 'Failed to list files',
      statusCode: 500,
    })
  }
})