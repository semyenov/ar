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

  // Получение ID комментария
  const id = getRouterParam(event, 'id')
  if (!id) {
    throw createError({
      message: 'Comment ID is required',
      statusCode: 400,
    })
  }

  const body = await readBody(event)

  // Проверка данных запроса
  const schema = z.object({
    content: z.string().min(1),
    fieldReference: z.string().optional(),
  })

  const validationResult = schema.safeParse(body)
  if (!validationResult.success) {
    throw createError({
      data: validationResult.error.format(),
      message: 'Invalid request data',
      statusCode: 400,
    })
  }

  const { content, fieldReference } = validationResult.data

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
        message: 'Cannot update comments in a closed review flow',
        statusCode: 400,
      })
    }

    // Проверка, что пользователь является автором комментария или администратором
    const userRole = comment.reviewFlow.organization.members[0].role
    const isCommentAuthor = comment.member.userId === session.user.id
    const isAdmin = userRole === 'ADMIN'

    if (!isCommentAuthor && !isAdmin) {
      throw createError({
        message: 'You can only edit your own comments',
        statusCode: 403,
      })
    }

    // Обновление комментария
    const updatedComment = await prisma.comment.update({
      data: {
        content,
        fieldReference,
      },
      include: {
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

    // Обновление времени последнего изменения процесса рассмотрения
    await prisma.reviewFlow.update({
      data: {
        updatedAt: new Date(),
        lastModifiedBy: session.user.id,
        version: { increment: 1 },
      },
      where: { id: comment.reviewFlow.id },
    })

    return updatedComment
  }
  catch (error) {
    console.error('Failed to update comment:', error)
    throw createError({
      message: 'Failed to update comment',
      statusCode: 500,
    })
  }
})
