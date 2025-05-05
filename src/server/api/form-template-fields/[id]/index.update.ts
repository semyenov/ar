import { z } from 'zod'
import { auth } from '~/lib/auth'
import prisma from '~~/lib/prisma'


export default defineEventHandler(async (event) => {
  // Проверка авторизации пользователя
  const session = await auth.api.getSession(toWebRequest(event))
  if (!session) {
    throw createError({
      statusCode: 401,
      message: 'Unauthorized',
    })
  }

  // Получение ID поля из параметров запроса
  const id = getRouterParam(event, 'id')
  if (!id) {
    throw createError({
      statusCode: 400,
      message: 'Field ID is required',
    })
  }

  // Проверка данных запроса
  const body = await readBody(event)
  const schema = z.object({
    name: z.string().min(1).optional(),
    type: z.enum(['TEXT', 'TEXTAREA', 'NUMBER', 'DATE', 'SELECT', 'CHECKBOX', 'RADIO', 'FILE']).optional(),
    defaultValue: z.string().optional().nullable(),
    required: z.boolean().optional(),
    order: z.number().int().positive().optional(),
    options: z.string().optional().nullable(),
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

  try {
    // Проверка существования поля шаблона
    const existingField = await prisma.formTemplateField.findUnique({
      where: { id },
      include: {
        template: true,
      },
    })

    if (!existingField) {
      throw createError({
        statusCode: 404,
        message: 'Form template field not found',
      })
    }

    // Обновление поля шаблона
    const formTemplateField = await prisma.formTemplateField.update({
      where: { id },
      data,
    })

    // Обновление версии шаблона
    await prisma.formTemplate.update({
      where: { id: existingField.templateId },
      data: {
        version: { increment: 1 },
        updatedAt: new Date(),
        lastModifiedBy: session.user.id,
      },
    })

    return formTemplateField
  } catch (error) {
    console.error('Failed to update form template field:', error)
    throw createError({
      statusCode: 500,
      message: 'Failed to update form template field',
    })
  }
})