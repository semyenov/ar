import { auth } from '~/lib/auth'
import { generateId } from '~/lib/utils'
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

  // Получение ID процесса рассмотрения
  const id = getRouterParam(event, 'id')
  if (!id) {
    throw createError({
      message: 'Review flow ID is required',
      statusCode: 400,
    })
  }

  const body = await readBody(event)

  // Проверка данных запроса
  const schema = z.object({
    status: z.enum(['OPEN', 'CLOSED']).optional(),
    formStatus: z.enum(['UNDER_REVIEW', 'NEEDS_CHANGES', 'APPROVED', 'REJECTED']).optional(),
  })

  const validationResult = schema.safeParse(body)
  if (!validationResult.success) {
    throw createError({
      data: validationResult.error.format(),
      message: 'Invalid request data',
      statusCode: 400,
    })
  }

  const { status, formStatus } = validationResult.data

  // Проверка, что хотя бы одно поле для обновления предоставлено
  if (!status && !formStatus) {
    throw createError({
      message: 'No update parameters provided',
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

    // Проверка прав пользователя (только ADMIN и REVIEWER могут менять статус формы)
    const userRole = reviewFlow.organization.members[0].role
    if (formStatus && userRole !== 'ADMIN' && userRole !== 'REVIEWER') {
      throw createError({
        message: 'You do not have permission to change form status',
        statusCode: 403,
      })
    }

    // Начинаем транзакцию для обновления и reviewFlow, и form если необходимо
    const updatedReviewFlow = await prisma.$transaction(async (tx) => {
      // Обновление процесса рассмотрения
      const updated = await tx.reviewFlow.update({
        data: {
          status: status,
          lastModifiedBy: session.user.id,
          version: { increment: 1 },
        },
        where: { id },
      })

      // Если указан статус формы, обновляем форму и добавляем запись в историю
      if (formStatus && formStatus !== reviewFlow.form.status) {
        const oldStatus = reviewFlow.form.status

        // Обновление статуса формы
        await tx.form.update({
          data: {
            status: formStatus,
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
            status: formStatus,
            memberId: reviewFlow.organization.members[0].id,
            data: JSON.stringify({
              action: 'STATUS_CHANGE',
              from: oldStatus,
              to: formStatus,
              reviewFlowId: id,
            }),
          },
        })

        // Если процесс рассмотрения закрывается и форма одобрена/отклонена,
        // автоматически закрываем процесс рассмотрения
        if (
          (formStatus === 'APPROVED' || formStatus === 'REJECTED') &&
          (!status || status === 'OPEN')
        ) {
          await tx.reviewFlow.update({
            data: {
              status: 'CLOSED',
              lastModifiedBy: session.user.id,
            },
            where: { id },
          })

          updated.status = 'CLOSED'
        }
      }

      return updated
    })

    return updatedReviewFlow
  }
  catch (error) {
    console.error('Failed to update review flow:', error)
    throw createError({
      message: 'Failed to update review flow',
      statusCode: 500,
    })
  }
})
