import { z } from 'zod'
import { generateId } from '~/lib/utils'
import { auth } from '~/lib/auth'
import prisma from '~~/lib/prisma'

export default defineEventHandler(async (event) => {
  // Проверка авторизации пользователя
  const session = await auth.api.getSession({
    headers: event.headers,
  })

  if (!session) {
    throw createError({
      statusCode: 401,
      message: 'Unauthorized',
    })
  }

  const body = await readBody(event)


  // Проверка данных запроса
  const schema = z.object({
    templateId: z.string(),
    name: z.string().min(1),
    type: z.enum(['TEXT', 'TEXTAREA', 'NUMBER', 'DATE', 'SELECT', 'CHECKBOX', 'RADIO', 'FILE']),
    defaultValue: z.string().optional(),
    required: z.boolean().default(false),
    order: z.number().int().positive(),
    options: z.string().optional(),
  })

  const validationResult = schema.safeParse(body)
  if (!validationResult.success) {
    throw createError({
      statusCode: 400,
      message: 'Invalid request data',
      data: validationResult.error.format(),
    })
  }

  const data = validationResult.data

  // Проверка существования шаблона
  const template = await prisma.formTemplate.findUnique({
    where: { id: data.templateId },
  })

  if (!template) {
    throw createError({
      statusCode: 404,
      message: 'Form template not found',
    })
  }

  try {
    // Создание поля шаблона
    const formTemplateField = await prisma.formTemplateField.create({
      data: {
        id: generateId(),
        templateId: data.templateId,
        name: data.name,
        type: data.type,
        defaultValue: data.defaultValue,
        required: data.required,
        order: data.order,
        options: data.options,
      },
    })

    // Обновление версии шаблона
    await prisma.formTemplate.update({
      where: { id: data.templateId },
      data: {
        version: { increment: 1 },
        updatedAt: new Date(),
        lastModifiedBy: session.user.id,
      },
    })

    return formTemplateField
  } catch (error) {
    console.error('Failed to create form template field:', error)
    throw createError({
      statusCode: 500,
      message: 'Failed to create form template field',
    })
  }
})