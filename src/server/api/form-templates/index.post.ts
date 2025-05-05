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

  // Проверка данных запроса
  const body = await readBody(event)

  const schema = z.object({
    name: z.string().min(1),
    description: z.string().optional(),
  })
  console.log('before validation')
  const validationResult = schema.safeParse(body)
  if (!validationResult.success) {
    throw createError({
      statusCode: 400,
      message: 'Invalid request data',
      data: validationResult.error.format(),
    })
  }
  console.log('after validation')
  const data = validationResult.data

  try {
    // Создание шаблона формы
    const formTemplate = await prisma.formTemplate.create({
      data: {
        id: generateId(),
        name: data.name,
        description: data.description,
        version: 1,
        lastModifiedBy: session.user.id,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    })

    return formTemplate
  } catch (error) {
    console.error('Failed to create form template:', error)
    throw createError({
      statusCode: 500,
      message: 'Failed to create form template',
    })
  }
})