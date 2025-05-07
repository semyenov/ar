import { auth } from '~/lib/auth'
import prisma from '~/lib/prisma'

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

  try {
    // Получение поля шаблона
    const formTemplateField = await prisma.formTemplateField.findUnique({
      include: {
        template: {
          select: {
            id: true,
            name: true,
          },
        },
      },
      where: { id },
    })

    if (!formTemplateField) {
      throw createError({
        message: 'Form template field not found',
        statusCode: 404,
      })
    }

    return formTemplateField
  }
  catch (error) {
    console.error('Failed to get form template field:', error)
    throw createError({
      message: 'Failed to get form template field',
      statusCode: 500,
    })
  }
})
