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

  try {
    // Получение поля шаблона
    const formTemplateField = await prisma.formTemplateField.findUnique({
      where: { id },
      include: {
        template: {
          select: {
            id: true,
            name: true,
          },
        },
      },
    })

    if (!formTemplateField) {
      throw createError({
        statusCode: 404,
        message: 'Form template field not found',
      })
    }

    return formTemplateField
  } catch (error) {
    console.error('Failed to get form template field:', error)
    throw createError({
      statusCode: 500,
      message: 'Failed to get form template field',
    })
  }
})