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
                role: true,
              },
              where: {
                userId: session.user.id,
              },
            },
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

    // Проверка прав пользователя на удаление папки
    if (folder.organization.members.length === 0) {
      throw createError({
        message: 'You do not have access to this folder',
        statusCode: 403,
      })
    }

    // Только администратор или создатель могут удалить папку
    const userRole = folder.organization.members[0].role
    const isAdmin = userRole === 'ADMIN'
    const isCreator = folder.creatorMemberId === folder.organization.members[0].id

    if (!isAdmin && !isCreator) {
      throw createError({
        message: 'You do not have permission to delete this folder',
        statusCode: 403,
      })
    }

    // Проверка, что папка пуста
    if (folder._count.children > 0 || folder._count.files > 0) {
      throw createError({
        message: 'Cannot delete non-empty folder',
        statusCode: 400,
      })
    }

    // Удаление папки
    await prisma.fileFolder.delete({
      where: { id },
    })

    return {
      success: true,
      message: 'Folder deleted successfully',
    }
  }
  catch (error) {
    console.error('Failed to delete folder:', error)
    throw createError({
      message: 'Failed to delete folder',
      statusCode: 500,
    })
  }
})