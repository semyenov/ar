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

  // Получение ID папки
  const id = getRouterParam(event, 'id')
  if (!id) {
    throw createError({
      message: 'Folder ID is required',
      statusCode: 400,
    })
  }

  try {
    // Получение папки с проверкой доступа пользователя
    const folder = await prisma.fileFolder.findUnique({
      include: {
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
        creator: {
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
        parent: {
          select: {
            id: true,
            name: true,
            path: true,
          },
        },
        _count: {
          select: {
            children: true,
            files: true,
          },
        },
      },
      where: { id },
    })

    if (!folder) {
      throw createError({
        message: 'Folder not found',
        statusCode: 404,
      })
    }

    // Проверка доступа пользователя к папке
    if (folder.organization.members.length === 0) {
      throw createError({
        message: 'You do not have access to this folder',
        statusCode: 403,
      })
    }

    return folder
  }
  catch (error) {
    console.error('Failed to get folder:', error)
    throw createError({
      message: 'Failed to get folder',
      statusCode: 500,
    })
  }
})
