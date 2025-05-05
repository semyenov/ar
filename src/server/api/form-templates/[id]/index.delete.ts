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
    // Проверка существования шаблона формы
    const existingTemplate = await prisma.formTemplate.findUnique({
      where: { id },
      include: {
        fields: true,
        forms: true,
      },
    })

    if (!existingTemplate) {
      throw createError({
        statusCode: 404,
        message: 'Form template not found',
      })
    }

    // Проверка использования шаблона в формах
    if (existingTemplate.forms.length > 0) {
      throw createError({
        statusCode: 400,
        message: 'Cannot delete template that is used by forms',
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

    return { success: true, message: 'Form template deleted successfully' }
  } catch (error) {
    console.error('Failed to delete form template:', error)
    throw createError({
      statusCode: 500,
      message: 'Failed to delete form template',
    })
  }
})