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

  // Получение ID записи истории из параметров запроса
  const id = getRouterParam(event, 'id')

  if (!id) {
    throw createError({
      message: 'History ID is required',
      statusCode: 400,
    })
  }

  try {
    // Получение записи истории формы с проверкой доступа пользователя
    const formHistory = await prisma.formHistory.findUnique({
      include: {
        form: {
          select: {
            id: true,
            title: true,
            status: true,
            organization: {
              include: {
                members: {
                  select: {
                    id: true,
                    role: true,
                  },
                  where: {
                    userId: session.user.id,
                  },
                },
              },
            },
          },
        },
        member: {
          select: {
            id: true,
            role: true,
            user: {
              select: {
                id: true,
                name: true,
                email: true,
                image: true,
              },
            },
          },
        },
      },
      where: { id },
    })

    if (!formHistory) {
      throw createError({
        message: 'Form history record not found',
        statusCode: 404,
      })
    }

    // Проверка доступа пользователя к организации
    if (formHistory.form.organization.members.length === 0) {
      throw createError({
        message: 'You do not have access to this form history record',
        statusCode: 403,
      })
    }

    // Преобразование поля data из JSON строки в объект, если оно есть
    let parsedData = null
    if (formHistory.data) {
      try {
        parsedData = JSON.parse(formHistory.data)
      }
      catch (e) {
        console.error('Error parsing form history data:', e)
      }
    }

    return {
      ...formHistory,
      data: parsedData,
    }
  }
  catch (error) {
    console.error('Failed to get form history record:', error)
    throw createError({
      message: 'Failed to get form history record',
      statusCode: 500,
    })
  }
})
