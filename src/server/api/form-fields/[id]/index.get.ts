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
    // Получение поля формы с проверкой доступа пользователя
    const formField = await prisma.formField.findUnique({
      include: {
        files: {
          include: {
            file: {
              select: {
                createdAt: true,
                filename: true,
                id: true,
                mimeType: true,
                originalName: true,
                size: true,
              },
            },
          },
        },
        form: {
          select: {
            id: true,
            organization: {
              include: {
                members: {
                  select: {
                    id: true,
                  },
                  where: {
                    userId: session.user.id,
                  },
                },
              },
            },
            organizationId: true,
            status: true,
            title: true,
          },
        },
      },
      where: { id },
    })

    if (!formField) {
      throw createError({
        message: 'Form field not found',
        statusCode: 404,
      })
    }

    // Проверка доступа пользователя к организации
    if (formField.form.organization.members.length === 0) {
      throw createError({
        message: 'You do not have access to this form field',
        statusCode: 403,
      })
    }

    return formField
  }
  catch (error) {
    console.error('Failed to get form field:', error)
    throw createError({
      message: 'Failed to get form field',
      statusCode: 500,
    })
  }
})
