import { auth } from '~/lib/auth'
import prisma from '~/lib/prisma'

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

  // Получение ID комментария
  const id = getRouterParam(event, 'id')
  if (!id) {
    throw createError({
      message: 'Comment ID is required',
      statusCode: 400,
    })
  }

  try {
    // Получение комментария с проверкой доступа пользователя
    const comment = await prisma.comment.findUnique({
      include: {
        reviewFlow: {
          select: {
            id: true,
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
      where: { id },
    })

    if (!comment) {
      throw createError({
        message: 'Comment not found',
        statusCode: 404,
      })
    }

    // Проверка доступа пользователя к организации
    if (comment.reviewFlow.organization.members.length === 0) {
      throw createError({
        message: 'You do not have access to this comment',
        statusCode: 403,
      })
    }

    return comment
  }
  catch (error) {
    console.error('Failed to get comment:', error)
    throw createError({
      message: 'Failed to get comment',
      statusCode: 500,
    })
  }
})
