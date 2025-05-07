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

  const body = await readBody(event)

  // Проверка данных запроса
  const schema = z.object({
    description: z.string()
      .optional(),
    executorMemberId: z.string()
      .optional(),
    organizationId: z.string(),
    templateId: z.string()
      .optional(),
    title: z.string()
      .min(1),
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
    // Проверка членства пользователя в организации
    const membership = await prisma.member.findFirst({
      where: {
        organizationId: data.organizationId,
        userId: session.user.id,
      },
    })

    if (!membership) {
      throw createError({
        message: 'You do not have access to this organization',
        statusCode: 403,
      })
    }

    // Проверка шаблона, если он указан
    if (data.templateId) {
      const template = await prisma.formTemplate.findUnique({
        include: {
          fields: true,
        },
        where: { id: data.templateId },
      })

      if (!template) {
        throw createError({
          message: 'Form template not found',
          statusCode: 404,
        })
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

      if (executor.organizationId !== data.organizationId) {
        throw createError({
          message: 'Executor must be from the same organization',
          statusCode: 400,
        })
      }
    }

    // Создание формы
    const formId = generateId()
    const form = await prisma.form.create({
      data: {
        creatorMemberId: membership.id,
        description: data.description,
        executorMemberId: data.executorMemberId,
        id: formId,
        lastModifiedBy: session.user.id,
        organizationId: data.organizationId,
        status: 'DRAFT',
        templateId: data.templateId,
        title: data.title,
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
        executor: data.executorMemberId
          ? {
              include: {
                user: {
                  select: {
                    email: true,
                    image: true,
                    name: true,
                  },
                },
              },
            }
          : undefined,
        organization: {
          select: {
            id: true,
            name: true,
          },
        },
        template: data.templateId
          ? {
              select: {
                id: true,
                name: true,
              },
            }
          : undefined,
      },
    })

    // Создание записи в истории форм
    await prisma.formHistory.create({
      data: {
        data: JSON.stringify({
          description: data.description,
          executorMemberId: data.executorMemberId,
          templateId: data.templateId,
          title: data.title,
        }),
        formId,
        id: generateId(),
        memberId: membership.id,
        status: 'DRAFT',
      },
    })

    // Если указан шаблон, создаем поля формы на основе полей шаблона
    if (data.templateId) {
      const template = await prisma.formTemplate.findUnique({
        include: {
          fields: {
            orderBy: {
              order: 'asc',
            },
          },
        },
        where: { id: data.templateId },
      })

      if (template && template.fields.length > 0) {
        await Promise.all(
          template.fields.map((templateField) => {
            return prisma.formField.create({
              data: {
                formId,
                id: generateId(),
                name: templateField.name,
                options: templateField.options,
                order: templateField.order,
                required: templateField.required,
                type: templateField.type,
                value: templateField.defaultValue,
              },
            })
          }),
        )
      }
    }

    return form
  }
  catch (error) {
    console.error('Failed to create form:', error)
    throw createError({
      message: 'Failed to create form',
      statusCode: 500,
    })
  }
})
