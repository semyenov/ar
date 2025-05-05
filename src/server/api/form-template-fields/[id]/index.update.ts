import { auth } from '~/lib/auth'
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

  // Проверка данных запроса
  const body = await readBody(event)

  // Получение ID поля из параметров запроса
  const id = getRouterParam(event, 'id')

  if (!id) {
    throw createError({
      message: 'Field ID is required',
      statusCode: 400,
    })
  }

  const schema = z.object({
    defaultValue: z.string()
      .optional()
      .nullable(),
    name: z.string()
      .min(1)
      .optional(),
    options: z.string()
      .optional()
      .nullable(),
    order: z.number()
      .int()
      .positive()
      .optional(),
    required: z.boolean()
      .optional(),
    type: z.enum([
      'TEXT',
      'TEXTAREA',
      'NUMBER',
      'DATE',
      'SELECT',
      'CHECKBOX',
      'RADIO',
      'FILE',
    ])
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
    // Проверка существования поля шаблона
    const existingField = await prisma.formTemplateField.findUnique({
      include: {
        template: true,
      },
      where: { id },
    })

    if (!existingField) {
      throw createError({
        message: 'Form template field not found',
        statusCode: 404,
      })
    }

    // Обновление поля шаблона
    const formTemplateField = await prisma.formTemplateField.update({
      data,
      where: { id },
    })

    // Обновление версии шаблона
    await prisma.formTemplate.update({
      data: {
        lastModifiedBy: session.user.id,
        updatedAt: new Date(),
        version: { increment: 1 },
      },
      where: { id: existingField.templateId },
    })

    return formTemplateField
  }
  catch (error) {
    console.error('Failed to update form template field:', error)
    throw createError({
      message: 'Failed to update form template field',
      statusCode: 500,
    })
  }
})
