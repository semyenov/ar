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
    formId: z.string(),
    name: z.string()
      .min(1),
    options: z.string()
      .optional(),
    order: z.number()
      .int()
      .positive(),
    required: z.boolean()
      .default(false),
    type: z.enum([
      'TEXT',
      'TEXTAREA',
      'NUMBER',
      'DATE',
      'SELECT',
      'CHECKBOX',
      'RADIO',
      'FILE',
    ]),
    validationRules: z.string()
      .optional(),
    value: z.string()
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
    // Проверка существования формы
    const form = await prisma.form.findUnique({
      where: {
        id: data.formId
      },
      include: {
        organization: {
          include: {
            members: {
              where: {
                userId: session.user.id
              }
            }
          }
        }
      }
    })

    if (!form) {
      throw createError({
        message: 'Form not found',
        statusCode: 404,
      })
    }

    // Проверка доступа пользователя
    const userMember = form.organization.members.find(member =>
      member.role === 'ADMIN' ||
      (member.role === 'EXECUTOR' && form.executorMemberId === member.id) ||
      form.creatorMemberId === member.id
    )

    if (!userMember) {
      throw createError({
        message: 'You do not have permission to modify this form',
        statusCode: 403,
      })
    }

    // Проверка, что форма находится в статусе DRAFT или NEEDS_CHANGES
    if (form.status !== 'DRAFT' && form.status !== 'NEEDS_CHANGES') {
      throw createError({
        message: 'Cannot add fields to a form that is not in DRAFT or NEEDS_CHANGES status',
        statusCode: 400,
      })
    }

    // Создание поля формы
    const formField = await prisma.formField.create({
      data: {
        formId: data.formId,
        id: generateId(),
        name: data.name,
        options: data.options,
        order: data.order,
        required: data.required,
        type: data.type,
        validationRules: data.validationRules,
        value: data.value,
      },
    })

    // Обновление версии формы
    await prisma.form.update({
      data: {
        lastModifiedBy: session.user.id,
        updatedAt: new Date(),
        version: { increment: 1 },
      },
      where: { id: data.formId },
    })

    // Создание записи в истории формы
    await prisma.formHistory.create({
      data: {
        data: JSON.stringify({
          action: 'add_field',
          fieldId: formField.id,
          fieldName: data.name,
          fieldType: data.type,
        }),
        formId: data.formId,
        id: generateId(),
        memberId: userMember.id,
        status: form.status,
      },
    })

    return formField
  }
  catch (error) {
    console.error('Failed to create form field:', error)
    throw createError({
      message: 'Failed to create form field',
      statusCode: 500,
    })
  }
})
