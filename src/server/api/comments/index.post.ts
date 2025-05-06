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
    reviewFlowId: z.string(),
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
        id: generateId(),
        reviewFlowId: data.reviewFlowId,
        memberId: reviewFlow.organization.members[0].id,
        content: data.content,
        fieldReference: data.fieldReference,
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
    })

    // Обновление времени последнего изменения процесса рассмотрения
    await prisma.reviewFlow.update({
      data: {
        updatedAt: new Date(),
        lastModifiedBy: session.user.id,
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