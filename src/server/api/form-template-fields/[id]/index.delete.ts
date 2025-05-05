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
    // Проверка существования поля шаблона
    const existingField = await prisma.formTemplateField.findUnique({
      where: { id },
      include: {
        template: true,
      },
    })

    if (!existingField) {
      throw createError({
        statusCode: 404,
        message: 'Form template field not found',
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
        where: { id: existingField.templateId },
        data: {
          version: { increment: 1 },
          updatedAt: new Date(),
          lastModifiedBy: session.user.id,
        },
      }),
    ])

    return { success: true, message: 'Form template field deleted successfully' }
  } catch (error) {
    console.error('Failed to delete form template field:', error)
    throw createError({
      statusCode: 500,
      message: 'Failed to delete form template field',
    })
  }
})