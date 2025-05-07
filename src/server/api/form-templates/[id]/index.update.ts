import { auth } from '~/lib/auth'
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

  // Получение ID шаблона из параметров запроса
  const id = getRouterParam(event, 'id')
  if (!id) {
    throw createError({
      message: 'Template ID is required',
      statusCode: 400,
    })
  }

  // Проверка данных запроса
  const body = await readBody(event)
  const schema = z.object({
    description: z.string()
      .optional()
      .nullable(),
    name: z.string()
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
    // Проверка существования шаблона формы
    const existingTemplate = await prisma.formTemplate.findUnique({
      where: { id },
    })

    if (!existingTemplate) {
      throw createError({
        message: 'Form template not found',
        statusCode: 404,
      })
    }

    // Обновление шаблона формы
    const formTemplate = await prisma.formTemplate.update({
      data: {
        ...data,
        lastModifiedBy: session.user.id,
        updatedAt: new Date(),
        version: { increment: 1 },
      },
      where: { id },
    })

    return formTemplate
  }
  catch (error) {
    console.error('Failed to update form template:', error)
    throw createError({
      message: 'Failed to update form template',
      statusCode: 500,
    })
  }
})
