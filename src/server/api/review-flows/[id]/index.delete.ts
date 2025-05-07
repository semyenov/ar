import { auth } from '~/lib/auth'
import { generateId } from '~/lib/utils'
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

  // Получение ID процесса рассмотрения
  const id = getRouterParam(event, 'id')
  if (!id) {
    throw createError({
      message: 'Review flow ID is required',
      statusCode: 400,
    })
  }

  try {
    // Получение процесса рассмотрения и проверка доступа пользователя
    const reviewFlow = await prisma.reviewFlow.findUnique({
      include: {
        form: {
          select: {
            id: true,
            status: true,
          },
        },
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
        comments: {
          select: {
            id: true,
          },
        },
      },
      where: { id },
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

    // Проверка прав пользователя (только ADMIN может удалять процесс рассмотрения)
    const userRole = reviewFlow.organization.members[0].role
    if (userRole !== 'ADMIN') {
      throw createError({
        message: 'Only administrators can delete review flows',
        statusCode: 403,
      })
    }

    // Начинаем транзакцию для удаления процесса рассмотрения и связанных комментариев
    await prisma.$transaction(async (tx) => {
      // Удаление комментариев связанных с процессом рассмотрения
      if (reviewFlow.comments.length > 0) {
        await tx.comment.deleteMany({
          where: { reviewFlowId: id },
        })
      }

      // Удаление процесса рассмотрения
      await tx.reviewFlow.delete({
        where: { id },
      })

      // Если форма была в процессе рассмотрения, вернем ее в статус черновика
      if (reviewFlow.form.status === 'UNDER_REVIEW') {
        // Обновление статуса формы
        await tx.form.update({
          data: {
            status: 'DRAFT',
            lastModifiedBy: session.user.id,
            version: { increment: 1 },
          },
          where: { id: reviewFlow.form.id },
        })

        // Добавление записи в историю формы
        await tx.formHistory.create({
          data: {
            id: generateId(),
            formId: reviewFlow.form.id,
            status: 'DRAFT',
            memberId: reviewFlow.organization.members[0].id,
            data: JSON.stringify({
              action: 'STATUS_CHANGE',
              from: reviewFlow.form.status,
              to: 'DRAFT',
              reason: 'REVIEW_FLOW_DELETED',
            }),
          },
        })
      }
    })

    return {
      success: true,
      message: 'Review flow deleted successfully',
    }
  }
  catch (error) {
    console.error('Failed to delete review flow:', error)
    throw createError({
      message: 'Failed to delete review flow',
      statusCode: 500,
    })
  }
})
