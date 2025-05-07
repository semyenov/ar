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
    organizationId: z.string().min(24).optional(),
    parentId: z.string().min(24).optional().nullable(),
    search: z.string().optional(),
    page: z.coerce.number().int().positive().optional().default(1),
    limit: z.coerce.number().int().positive().max(100).optional().default(50),
  })

  const validationResult = schema.safeParse(query)
  if (!validationResult.success) {
    throw createError({
      data: validationResult.error.format(),
      message: 'Invalid query parameters',
      statusCode: 400,
    })
  }

  const { organizationId, parentId, search, page, limit } = validationResult.data
  const skip = (page - 1) * limit

  try {
    // Формирование условий фильтрации
    const whereConditions: any = {}

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
    } else {
      // Если организация не указана, показать папки только из организаций, где пользователь является членом
      whereConditions.organization = {
        members: {
          some: {
            userId: session.user.id,
          },
        },
      }
    }

    // Использовать null для корневого каталога, undefined для поиска на любом уровне
    if (parentId !== undefined) {
      whereConditions.parentId = parentId
    }

    if (search) {
      whereConditions.OR = [
        { name: { contains: search, mode: 'insensitive' } },
        { description: { contains: search, mode: 'insensitive' } },
      ]
    }

    // Получение списка папок с учетом доступа пользователя
    const [folders, total] = await Promise.all([
      prisma.fileFolder.findMany({
        include: {
          organization: {
            select: {
              id: true,
              name: true,
              slug: true,
              logo: true,
            },
          },
          creator: {
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
          parent: {
            select: {
              id: true,
              name: true,
              path: true,
            },
          },
          _count: {
            select: {
              children: true,
              files: true,
            },
          },
        },
        orderBy: {
          name: 'asc',
        },
        skip,
        take: limit,
        where: whereConditions,
      }),
      prisma.fileFolder.count({
        where: whereConditions,
      }),
    ])

    // Если указана родительская папка, также получим информацию о ней для навигации
    let parentFolder = null
    if (parentId) {
      parentFolder = await prisma.fileFolder.findUnique({
        select: {
          id: true,
          name: true,
          path: true,
          parentId: true,
        },
        where: { id: parentId },
      })
    }

    return {
      data: folders,
      meta: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
        parent: parentFolder,
      },
    }
  }
  catch (error) {
    console.error('Failed to list folders:', error)
    throw createError({
      message: 'Failed to list folders',
      statusCode: 500,
    })
  }
})
