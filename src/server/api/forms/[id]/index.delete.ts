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

  // Получение ID формы из параметров запроса
  const id = getRouterParam(event, 'id')

  if (!id) {
    throw createError({
      message: 'Form ID is required',
      statusCode: 400,
    })
  }

  try {
    // Получение формы с проверкой существования
    const form = await prisma.form.findUnique({
      include: {
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
      where: { id },
    })

    if (!form) {
      throw createError({
        message: 'Form not found',
        statusCode: 404,
      })
    }

    // Проверка доступа пользователя
    if (form.organization.members.length === 0) {
      throw createError({
        message: 'You do not have access to this form',
        statusCode: 403,
      })
    }

    const currentMember = form.organization.members[0]

    // Проверка прав на удаление формы (только администраторы и создатель формы)
    if (currentMember.role !== 'ADMIN' && form.creatorMemberId !== currentMember.id) {
      throw createError({
        message: 'You do not have permission to delete this form',
        statusCode: 403,
      })
    }

    // Удаление формы (каскадное удаление полей формы, истории и потока рассмотрения настроено в схеме Prisma)
    await prisma.form.delete({
      where: { id },
    })

    return { message: 'Form deleted successfully', success: true }
  }
  catch (error) {
    console.error('Failed to delete form:', error)
    throw createError({
      message: 'Failed to delete form',
      statusCode: 500,
    })
  }
})
