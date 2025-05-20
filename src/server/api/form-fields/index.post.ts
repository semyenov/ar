import type { FieldType } from '@prisma/client'

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
    formId: z.string(),
    formTemplateFieldId: z.string(),
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

  const formTemplateField = await prisma.formTemplateField.findUnique({
    where: {
      id: data.formTemplateFieldId,
    },
  })

  if (!formTemplateField) {
    throw createError({
      message: 'Form template field not found',
      statusCode: 404,
    })
  }

  try {
    // Проверка существования формы
    const form = await prisma.form.findUnique({
      include: {
        organization: {
          include: {
            members: {
              where: {
                userId: session.user.id,
              },
            },
          },
        },
      },
      where: {
        id: data.formId,
      },
    })

    if (!form) {
      throw createError({
        message: 'Form not found',
        statusCode: 404,
      })
    }

    // Проверка доступа пользователя
    const userMember = form.organization.members.find((member) => {
      return member.role === 'admin' || member.role === 'owner'
        || (member.role === 'executor' && form.executorMemberId === member.id)
        || form.creatorMemberId === member.id
    },
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
        name: formTemplateField.name,
        options: formTemplateField.options,
        order: formTemplateField.order,
        required: formTemplateField.required,
        type: formTemplateField.type,
        validationRules: formTemplateField.validationRules,
        value: convertValueForType(formTemplateField.type, data.value),
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
          fieldName: formField.name,
          fieldType: formField.type,
        }),
        formId: formField.formId,
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

function convertValueForType(type: FieldType, value?: string) {
  return JSON.stringify(value)
  // switch (type) {
  //   case 'NUMBER':
  //     return Number(value)
  //   default:
  //     return value
  // }
}
