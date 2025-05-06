import { auth } from '~/lib/auth'
import prisma from '~~/lib/prisma'
import { z } from 'zod'

defineRouteMeta({
  openAPI: {
    tags: ["test"],
    description: "Test route description",
    parameters: [{ in: "query", name: "test", required: true }],
  },
});

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
    limit: z.string()
      .transform(Number)
      .pipe(z.number()
        .int()
        .positive())
      .optional(),
    offset: z.string()
      .transform(Number)
      .pipe(z.number()
        .int()
        .nonnegative())
      .optional(),
    organizationId: z.string()
      .optional(),
    status: z.enum([
      'DRAFT',
      'UNDER_REVIEW',
      'NEEDS_CHANGES',
      'APPROVED',
      'REJECTED',
    ])
      .optional(),
  })

  const validationResult = schema.safeParse(query)
  if (!validationResult.success) {
    throw createError({
      data: validationResult.error.format(),
      message: 'Invalid query parameters',
      statusCode: 400,
    })
  }

  const { limit = 50, offset = 0, organizationId, status } = validationResult.data

  try {
    // Проверка членства пользователя в организации, если указан organizationId
    if (organizationId) {
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
    }

    // Формирование условий запроса
    const whereCondition: any = {}

    if (organizationId) {
      whereCondition.organizationId = organizationId
    }

    if (status) {
      whereCondition.status = status
    }

    // Поиск форм, доступных пользователю
    const [forms, total] = await Promise.all([
      prisma.form.findMany({
        include: {
          creator: {
            include: {
              user: {
                select: {
                  email: true,
                  image: true,
                  name: true,
                },
              },
            },
          },
          executor: {
            include: {
              user: {
                select: {
                  email: true,
                  image: true,
                  name: true,
                },
              },
            },
          },
          organization: {
            select: {
              id: true,
              name: true,
            },
          },
          template: {
            select: {
              id: true,
              name: true,
            },
          },
        },
        orderBy: { updatedAt: 'desc' },
        skip: offset,
        take: limit,
        where: {
          ...whereCondition,
          // Пользователь должен быть членом организации
          organization: {
            members: {
              some: {
                userId: session.user.id,
              },
            },
          },
        },
      }),
      prisma.form.count({
        where: {
          ...whereCondition,
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
      items: forms,
      limit,
      offset,
      total,
    }
  }
  catch (error) {
    console.error('Failed to list forms:', error)
    throw createError({
      message: 'Failed to list forms',
      statusCode: 500,
    })
  }
})
