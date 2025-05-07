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

  // Получение ID шаблона из параметров запроса
  const id = getRouterParam(event, 'id')
  if (!id) {
    throw createError({
      message: 'Template ID is required',
      statusCode: 400,
    })
  }

  try {
    // Получение шаблона формы с полями
    const formTemplate = await prisma.formTemplate.findUnique({
      include: {
        fields: {
          orderBy: {
            order: 'asc',
          },
        },
      },
      where: { id },
    })

    if (!formTemplate) {
      throw createError({
        message: 'Form template not found',
        statusCode: 404,
      })
    }

    return formTemplate
  }
  catch (error) {
    console.error('Failed to get form template:', error)
    throw createError({
      message: 'Failed to get form template',
      statusCode: 500,
    })
  }
})
