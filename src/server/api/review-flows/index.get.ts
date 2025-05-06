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
    status: z.enum(['OPEN', 'CLOSED']).optional(),
    formId: z.string().min(24).optional(),
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

  const { organizationId, status, formId, page, limit } = validationResult.data
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
    }

    if (status) {
      whereConditions.status = status
    }

    if (formId) {
      whereConditions.formId = formId
    }

    // Получение списка процессов рассмотрения с учетом доступа пользователя
    // Пользователь должен иметь доступ к организациям
    const [reviewFlows, total] = await Promise.all([
      prisma.reviewFlow.findMany({
        include: {
          form: {
            select: {
              id: true,
              title: true,
              status: true,
              createdAt: true,
              updatedAt: true,
              creatorMemberId: true,
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
            },
          },
          organization: {
            select: {
              id: true,
              name: true,
              slug: true,
              logo: true,
            },
          },
          comments: {
            select: {
              id: true,
            },
          },
        },
        orderBy: {
          updatedAt: 'desc',
        },
        skip,
        take: limit,
        where: {
          ...whereConditions,
          organization: {
            members: {
              some: {
                userId: session.user.id,
              },
            },
          },
        },
      }),
      prisma.reviewFlow.count({
        where: {
          ...whereConditions,
          organization: {
            members: {
              some: {
                userId: session.user.id,
              },
            },
          },
        },
      }),
    ])

    return {
      data: reviewFlows,
      meta: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    }
  }
  catch (error) {
    console.error('Failed to list review flows:', error)
    throw createError({
      message: 'Failed to list review flows',
      statusCode: 500,
    })
  }
})
