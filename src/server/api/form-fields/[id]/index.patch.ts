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

  // Получение ID поля из параметров запроса
  const id = getRouterParam(event, 'id')

  if (!id) {
    throw createError({
      message: 'Field ID is required',
      statusCode: 400,
    })
  }

  const body = await readBody(event)

  // Проверка данных запроса
  const schema = z.object({
    name: z.string()
      .min(1)
      .optional(),
    options: z.string()
      .optional(),
    order: z.number()
      .int()
      .positive()
      .optional(),
    required: z.boolean()
      .optional(),
    status: z.enum([
      'DRAFT',
      'REJECTED',
      'APPROVED',
    ])
      .optional(),
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
    // Получение поля формы
    const formField = await prisma.formField.findUnique({
      include: {
        form: {
          select: {
            creatorMemberId: true,
            executorMemberId: true,
            id: true,
            organizationId: true,
            status: true,
            title: true,
          },
        },
      },
      where: { id },
    })

    if (!formField) {
      throw createError({
        message: 'Form field not found',
        statusCode: 404,
      })
    }

    // Проверка доступа пользователя
    const membership = await prisma.member.findFirst({
      where: {
        organizationId: formField.form.organizationId,
        userId: session.user.id,
      },
    })

    if (!membership) {
      throw createError({
        message: 'You do not have access to this organization',
        statusCode: 403,
      })
    }

    // Проверка прав на редактирование
    const canEdit
      = membership.role === 'owner'
        || formField.form.creatorMemberId === membership.id
        || (formField.form.executorMemberId === membership.id && ['DRAFT', 'NEEDS_CHANGES'].includes(formField.form.status))

    if (!canEdit) {
      throw createError({
        message: 'You do not have permission to edit this field',
        statusCode: 403,
      })
    }

    // Обновление поля формы
    const updatedFormField = await prisma.$transaction(async (tx) => {
      // Обновление поля
      const updated = await tx.formField.update({
        data: {
          name: data.name,
          options: data.options,
          order: data.order,
          required: data.required,
          status: data.status,
          validationRules: data.validationRules,
          value: data.value,
        },
        where: { id },
      })

      // Обновление версии формы
      await tx.form.update({
        data: {
          lastModifiedBy: session.user.id,
          updatedAt: new Date(),
          version: { increment: 1 },
        },
        where: { id: formField.formId },
      })

      // Создание записи в истории формы
      await tx.formHistory.create({
        data: {
          data: JSON.stringify({
            action: 'update_field',
            changes: data,
            fieldId: id,
          }),
          formId: formField.formId,
          id: generateId(),
          memberId: membership.id,
          status: formField.form.status,
        },
      })

      return updated
    })

    return updatedFormField
  }
  catch (error) {
    console.error('Failed to update form field:', error)
    throw createError({
      message: 'Failed to update form field',
      statusCode: 500,
    })
  }
})
