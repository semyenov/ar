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
    limit: z.coerce.number()
      .int()
      .positive()
      .max(100)
      .optional()
      .default(50),
    page: z.coerce.number()
      .int()
      .positive()
      .optional()
      .default(1),
    reviewFlowId: z.string(),
  })

  const validationResult = schema.safeParse(query)
  if (!validationResult.success) {
    throw createError({
      data: validationResult.error.format(),
      message: 'Invalid query parameters',
      statusCode: 400,
    })
  }

  const { limit, page, reviewFlowId } = validationResult.data
  const skip = (page - 1) * limit

  try {
    // Проверка существования процесса рассмотрения и доступа пользователя
    const reviewFlow = await prisma.reviewFlow.findFirst({
      include: {
        organization: {
          include: {
            members: {
              select: {
                id: true,
              },
              where: {
                userId: session.user.id,
              },
            },
          },
        },
      },
      where: { id: reviewFlowId },
    })

    if (!reviewFlow) {
      throw createError({
        message: 'Review flow not found',
        statusCode: 404,
      })
    }

    // Проверка доступа пользователя к организации
    if (reviewFlow.organization.members.length === 0) {
      throw createError({
        message: 'You do not have access to this review flow',
        statusCode: 403,
      })
    }

    // Получение комментариев
    const [comments, total] = await Promise.all([
      prisma.comment.findMany({
        include: {
          formField: {
            select: {
              id: true,
            },
          },
          member: {
            select: {
              id: true,
              role: true,
              user: {
                select: {
                  email: true,
                  id: true,
                  image: true,
                  name: true,
                },
              },
            },
          },
        },
        orderBy: {
          createdAt: 'asc',
        },
        skip,
        take: limit,
        where: { reviewFlowId },
      }),
      prisma.comment.count({
        where: { reviewFlowId },
      }),
    ])

    return {
      data: comments,
      meta: {
        limit,
        page,
        total,
        totalPages: Math.ceil(total / limit),
      },
    }
  }
  catch (error) {
    console.error('Failed to list comments:', error)
    throw createError({
      message: 'Failed to list comments',
      statusCode: 500,
    })
  }
})
