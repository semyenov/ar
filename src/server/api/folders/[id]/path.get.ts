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

    // Функция для получения пути к папке
    const buildPathArray = async (folderId: string) => {
      if (!folderId) return []

      const result = []
      let currentFolder = await prisma.fileFolder.findUnique({
        select: {
          id: true,
          name: true,
          parentId: true,
        },
        where: { id: folderId },
      })

      while (currentFolder) {
        result.unshift({
          id: currentFolder.id,
          name: currentFolder.name,
        })

        if (!currentFolder.parentId) break

        currentFolder = await prisma.fileFolder.findUnique({
          select: {
            id: true,
            name: true,
            parentId: true,
          },
          where: { id: currentFolder.parentId },
        })
      }

      return result
    }

    // Получение пути к папке в виде массива папок
    const pathArray = await buildPathArray(id)

    return {
      path: pathArray,
      organization: {
        id: folder.organizationId,
        name: folder.organization.name,
      },
    }
  }
  catch (error) {
    console.error('Failed to get folder path:', error)
    throw createError({
      message: 'Failed to get folder path',
      statusCode: 500,
    })
  }
})