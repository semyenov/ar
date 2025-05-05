import { auth } from '~/lib/auth'
import prisma from '~~/lib/prisma'

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
    // Проверка существования шаблона формы
    const existingTemplate = await prisma.formTemplate.findUnique({
      include: {
        fields: true,
        forms: true,
      },
      where: { id },
    })

    if (!existingTemplate) {
      throw createError({
        message: 'Form template not found',
        statusCode: 404,
      })
    }

    // Проверка использования шаблона в формах
    if (existingTemplate.forms.length > 0) {
      throw createError({
        message: 'Cannot delete template that is used by forms',
        statusCode: 400,
      })
    }

    // Транзакция для удаления шаблона и его полей
    await prisma.$transaction([
      // Удаление полей шаблона
      prisma.formTemplateField.deleteMany({
        where: { templateId: id },
      }),

      // Удаление шаблона формы
      prisma.formTemplate.delete({
        where: { id },
      }),
    ])

    return { message: 'Form template deleted successfully', success: true }
  }
  catch (error) {
    console.error('Failed to delete form template:', error)
    throw createError({
      message: 'Failed to delete form template',
      statusCode: 500,
    })
  }
})
