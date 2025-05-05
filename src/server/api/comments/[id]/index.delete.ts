import { auth } from '~/lib/auth'
import prisma from '~~/lib/prisma'

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
            status: true,
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
          },
        },
        member: {
          select: {
            id: true,
            userId: true,
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

    // Проверка, что процесс рассмотрения открыт
    if (comment.reviewFlow.status === 'CLOSED') {
      throw createError({
        message: 'Cannot delete comments in a closed review flow',
        statusCode: 400,
      })
    }

    // Проверка, что пользователь является автором комментария или администратором
    const userRole = comment.reviewFlow.organization.members[0].role
    const isCommentAuthor = comment.member.userId === session.user.id
    const isAdmin = userRole === 'ADMIN'

    if (!isCommentAuthor && !isAdmin) {
      throw createError({
        message: 'You can only delete your own comments',
        statusCode: 403,
      })
    }

    // Удаление комментария
    await prisma.comment.delete({
      where: { id },
    })

    // Обновление времени последнего изменения процесса рассмотрения
    await prisma.reviewFlow.update({
      data: {
        updatedAt: new Date(),
        lastModifiedBy: session.user.id,
        version: { increment: 1 },
      },
      where: { id: comment.reviewFlow.id },
    })

    return {
      success: true,
      message: 'Comment deleted successfully',
    }
  }
  catch (error) {
    console.error('Failed to delete comment:', error)
    throw createError({
      message: 'Failed to delete comment',
      statusCode: 500,
    })
  }
})