import { auth } from '~/lib/auth'
import { generateId } from '~/lib/utils'
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

  const body = await readBody(event)

  // Проверка данных запроса
  const schema = z.object({
    formId: z.string().uuid(),
    status: z.enum(['OPEN', 'CLOSED']).default('OPEN').optional(),
  })

  const validationResult = schema.safeParse(body)
  if (!validationResult.success) {
    throw createError({
      data: validationResult.error.format(),
      message: 'Invalid request data',
      statusCode: 400,
    })
  }

  const { data } = validationResult

  try {
    // Проверка существования формы и доступа пользователя к ней
    const form = await prisma.form.findFirst({
      include: {
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
      where: { id: data.formId },
    })

    if (!form) {
      throw createError({
        message: 'Form not found',
        statusCode: 404,
      })
    }

    // Проверка прав пользователя (должен быть членом организации)
    if (form.organization.members.length === 0) {
      throw createError({
        message: 'You do not have access to this form',
        statusCode: 403,
      })
    }

    // Проверка, что процесс рассмотрения еще не создан для этой формы
    const existingReviewFlow = await prisma.reviewFlow.findFirst({
      where: { formId: data.formId },
    })

    if (existingReviewFlow) {
      throw createError({
        message: 'Review flow already exists for this form',
        statusCode: 409,
      })
    }

    // Создание процесса рассмотрения
    const reviewFlow = await prisma.reviewFlow.create({
      data: {
        id: generateId(),
        formId: data.formId,
        organizationId: form.organization.id,
        status: data.status || 'OPEN',
        lastModifiedBy: session.user.id,
      },
    })

    // Обновление статуса формы, если она еще в черновике
    if (form.status === 'DRAFT') {
      await prisma.form.update({
        data: {
          status: 'UNDER_REVIEW',
          lastModifiedBy: session.user.id,
          version: { increment: 1 },
        },
        where: { id: data.formId },
      })

      // Добавляем запись в историю формы
      await prisma.formHistory.create({
        data: {
          id: generateId(),
          formId: data.formId,
          status: 'UNDER_REVIEW',
          memberId: form.organization.members[0].id,
          data: JSON.stringify({
            action: 'STATUS_CHANGE',
            from: 'DRAFT',
            to: 'UNDER_REVIEW',
          }),
        },
      })
    }

    return reviewFlow
  }
  catch (error) {
    console.error('Failed to create review flow:', error)
    throw createError({
      message: 'Failed to create review flow',
      statusCode: 500,
    })
  }
})