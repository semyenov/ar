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

  try {
    // Получение шаблона формы с полями
    const formTemplate = await prisma.formTemplate.findUnique({
      where: { id },
      include: {
        fields: {
          orderBy: {
            order: 'asc',
          },
        },
      },
    })

    if (!formTemplate) {
      throw createError({
        statusCode: 404,
        message: 'Form template not found',
      })
    }

    return formTemplate
  } catch (error) {
    console.error('Failed to get form template:', error)
    throw createError({
      statusCode: 500,
      message: 'Failed to get form template',
    })
  }
})