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

  // Проверка данных запроса
  const body = await readBody(event)

  const schema = z.object({
    description: z.string()
      .optional(),
    name: z.string()
      .min(1),
  })
  console.log('before validation')
  const validationResult = schema.safeParse(body)
  if (!validationResult.success) {
    throw createError({
      data: validationResult.error.format(),
      message: 'Invalid request data',
      statusCode: 400,
    })
  }
  console.log('after validation')
  const { data } = validationResult

  try {
    // Создание шаблона формы
    const formTemplate = await prisma.formTemplate.create({
      data: {
        createdAt: new Date(),
        description: data.description,
        id: generateId(),
        lastModifiedBy: session.user.id,
        name: data.name,
        updatedAt: new Date(),
        version: 1,
      },
    })

    return formTemplate
  }
  catch (error) {
    console.error('Failed to create form template:', error)
    throw createError({
      message: 'Failed to create form template',
      statusCode: 500,
    })
  }
})
