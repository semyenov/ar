import { auth } from '~/lib/auth'
import prisma from '~/lib/prisma'
import { generateId } from '~/lib/utils'
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
    content: z.string()
      .min(1),
    formFieldId: z.string()
      .optional(),
    reviewFlowId: z.string(),
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
    // Проверка существования процесса рассмотрения и доступа пользователя
    const reviewFlow = await prisma.reviewFlow.findFirst({
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
      where: { id: data.reviewFlowId },
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

    // Проверка, что процесс рассмотрения открыт
    if (reviewFlow.status === 'CLOSED') {
      throw createError({
        message: 'Cannot add comments to a closed review flow',
        statusCode: 400,
      })
    }

    // Создание комментария
    const comment = await prisma.comment.create({
      data: {
        content: data.content,
        formFieldId: data.formFieldId,
        id: generateId(),
        memberId: reviewFlow.organization.members[0].id,
        reviewFlowId: data.reviewFlowId,
      },
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
    })

    // Обновление времени последнего изменения процесса рассмотрения
    await prisma.reviewFlow.update({
      data: {
        lastModifiedBy: session.user.id,
        updatedAt: new Date(),
        version: { increment: 1 },
      },
      where: { id: data.reviewFlowId },
    })

    return comment
  }
  catch (error) {
    console.error('Failed to create comment:', error)
    throw createError({
      message: 'Failed to create comment',
      statusCode: 500,
    })
  }
})
