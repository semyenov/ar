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
  // Получение ID поля из параметров запроса
  const id = getRouterParam(event, 'id')

  if (!id) {
    throw createError({
      message: 'Field ID is required',
      statusCode: 400,
    })
  }

  try {
    // Проверка существования поля шаблона
    const existingField = await prisma.formTemplateField.findUnique({
      include: {
        template: true,
      },
      where: { id },
    })

    if (!existingField) {
      throw createError({
        message: 'Form template field not found',
        statusCode: 404,
      })
    }

    // Транзакция для удаления поля и обновления шаблона
    await prisma.$transaction([
      // Удаление поля шаблона
      prisma.formTemplateField.delete({
        where: { id },
      }),

      // Обновление версии шаблона
      prisma.formTemplate.update({
        data: {
          lastModifiedBy: session.user.id,
          updatedAt: new Date(),
          version: { increment: 1 },
        },
        where: { id: existingField.templateId },
      }),
    ])

    return { message: 'Form template field deleted successfully', success: true }
  }
  catch (error) {
    console.error('Failed to delete form template field:', error)
    throw createError({
      message: 'Failed to delete form template field',
      statusCode: 500,
    })
  }
})
