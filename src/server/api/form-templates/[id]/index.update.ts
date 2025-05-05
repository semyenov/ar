import { z } from 'zod'
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

  // Получение ID шаблона из параметров запроса
  const id = getRouterParam(event, 'id')
  if (!id) {
    throw createError({
      statusCode: 400,
      message: 'Template ID is required',
    })
  }

  // Проверка данных запроса
  const body = await readBody(event)
  const schema = z.object({
    name: z.string().min(1).optional(),
    description: z.string().optional().nullable(),
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
    // Проверка существования шаблона формы
    const existingTemplate = await prisma.formTemplate.findUnique({
      where: { id },
    })

    if (!existingTemplate) {
      throw createError({
        statusCode: 404,
        message: 'Form template not found',
      })
    }

    // Обновление шаблона формы
    const formTemplate = await prisma.formTemplate.update({
      where: { id },
      data: {
        ...data,
        version: { increment: 1 },
        updatedAt: new Date(),
        lastModifiedBy: session.user.id,
      },
    })

    return formTemplate
  } catch (error) {
    console.error('Failed to update form template:', error)
    throw createError({
      statusCode: 500,
      message: 'Failed to update form template',
    })
  }
})