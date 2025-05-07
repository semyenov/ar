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
    defaultValue: z.string()
      .optional(),
    name: z.string()
      .min(1),
    options: z.string()
      .optional(),
    order: z.number()
      .int()
      .positive(),
    required: z.boolean()
      .default(false),
    templateId: z.string(),
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

  // Проверка существования шаблона
  const template = await prisma.formTemplate.findUnique({
    where: { id: data.templateId },
  })

  if (!template) {
    throw createError({
      message: 'Form template not found',
      statusCode: 404,
    })
  }

  try {
    // Создание поля шаблона
    const formTemplateField = await prisma.formTemplateField.create({
      data: {
        defaultValue: data.defaultValue,
        id: generateId(),
        name: data.name,
        options: data.options,
        order: data.order,
        required: data.required,
        templateId: data.templateId,
        type: data.type,
      },
    })

    // Обновление версии шаблона
    await prisma.formTemplate.update({
      data: {
        lastModifiedBy: session.user.id,
        updatedAt: new Date(),
        version: { increment: 1 },
      },
      where: { id: data.templateId },
    })

    return formTemplateField
  }
  catch (error) {
    console.error('Failed to create form template field:', error)
    throw createError({
      message: 'Failed to create form template field',
      statusCode: 500,
    })
  }
})
