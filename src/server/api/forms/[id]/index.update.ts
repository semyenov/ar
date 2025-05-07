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

  // Получение ID формы из параметров запроса
  const id = getRouterParam(event, 'id')

  if (!id) {
    throw createError({
      message: 'Form ID is required',
      statusCode: 400,
    })
  }

  const body = await readBody(event)

  // Проверка данных запроса
  const schema = z.object({
    description: z.string()
      .optional(),
    executorMemberId: z.string()
      .optional(),
    status: z.enum([
      'DRAFT',
      'UNDER_REVIEW',
      'NEEDS_CHANGES',
      'APPROVED',
      'REJECTED',
    ])
      .optional(),
    title: z.string()
      .min(1)
      .optional(),
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
    // Получение формы с проверкой существования
    const form = await prisma.form.findUnique({
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
      where: { id },
    })

    if (!form) {
      throw createError({
        message: 'Form not found',
        statusCode: 404,
      })
    }

    // Проверка доступа пользователя
    if (form.organization.members.length === 0) {
      throw createError({
        message: 'You do not have access to this form',
        statusCode: 403,
      })
    }

    const currentMember = form.organization.members[0]

    // Проверка прав на изменение статуса формы
    if (data.status && data.status !== form.status) {
      // Администраторы и рецензенты могут менять статус формы
      if (currentMember.role !== 'ADMIN' && currentMember.role !== 'REVIEWER') {
        throw createError({
          message: 'You do not have permission to change the form status',
          statusCode: 403,
        })
      }

      // Если форма переходит в статус UNDER_REVIEW, создаем поток рассмотрения,
      // если он еще не существует
      if (data.status === 'UNDER_REVIEW') {
        const existingReviewFlow = await prisma.reviewFlow.findFirst({
          where: {
            formId: id,
          },
        })

        if (!existingReviewFlow) {
          await prisma.reviewFlow.create({
            data: {
              formId: id,
              id: generateId(),
              lastModifiedBy: session.user.id,
              organizationId: form.organizationId,
              status: 'OPEN',
            },
          })
        }
      }
    }

    // Проверка исполнителя, если он указан
    if (data.executorMemberId) {
      const executor = await prisma.member.findUnique({
        where: { id: data.executorMemberId },
      })

      if (!executor) {
        throw createError({
          message: 'Executor not found',
          statusCode: 404,
        })
      }

      if (executor.organizationId !== form.organizationId) {
        throw createError({
          message: 'Executor must be from the same organization',
          statusCode: 400,
        })
      }
    }

    // Обновление формы
    const updatedForm = await prisma.$transaction(async (tx) => {
      // Обновление формы
      const updated = await tx.form.update({
        data: {
          description: data.description,
          executorMemberId: data.executorMemberId,
          lastModifiedBy: session.user.id,
          status: data.status,
          title: data.title,
          updatedAt: new Date(),
          version: { increment: 1 },
        },
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
        where: { id },
      })

      // Создание записи в истории форм
      await tx.formHistory.create({
        data: {
          data: JSON.stringify({
            description: data.description,
            executorMemberId: data.executorMemberId,
            title: data.title,
          }),
          formId: id,
          id: generateId(),
          memberId: currentMember.id,
          status: data.status || form.status,
        },
      })

      return updated
    })

    return updatedForm
  }
  catch (error) {
    console.error('Failed to update form:', error)
    throw createError({
      message: 'Failed to update form',
      statusCode: 500,
    })
  }
})
