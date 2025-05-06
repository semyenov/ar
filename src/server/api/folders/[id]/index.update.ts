import { auth } from '~/lib/auth'
import prisma from '~~/lib/prisma'
import { z } from 'zod'

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

  const body = await readBody(event)

  // Проверка данных запроса
  const schema = z.object({
    name: z.string().min(1).optional(),
    description: z.string().optional(),
    parentId: z.string().min(24).optional().nullable(),
  })

  const validationResult = schema.safeParse(body)
  if (!validationResult.success) {
    throw createError({
      data: validationResult.error.format(),
      message: 'Invalid request data',
      statusCode: 400,
    })
  }

  const { name, description, parentId } = validationResult.data

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
      },
      where: { id },
    })

    if (!folder) {
      throw createError({
        message: 'Folder not found',
        statusCode: 404,
      })
    }

    // Проверка прав пользователя на редактирование папки
    if (folder.organization.members.length === 0) {
      throw createError({
        message: 'You do not have access to this folder',
        statusCode: 403,
      })
    }

    // Только администратор или создатель могут редактировать папку
    const userRole = folder.organization.members[0].role
    const isAdmin = userRole === 'ADMIN'
    const isCreator = folder.creatorMemberId === folder.organization.members[0].id

    if (!isAdmin && !isCreator) {
      throw createError({
        message: 'You do not have permission to update this folder',
        statusCode: 403,
      })
    }

    // Проверка изменения родительской папки
    let newParentFolder = null
    let level = folder.level
    let path = folder.path

    if (parentId !== undefined && parentId !== folder.parentId) {
      // Проверка цикличности - нельзя переместить папку в свою подпапку
      if (parentId === id) {
        throw createError({
          message: 'Cannot move folder into itself',
          statusCode: 400,
        })
      }

      // Проверка родительской папки
      if (parentId) {
        newParentFolder = await prisma.fileFolder.findUnique({
          where: {
            id: parentId,
            organizationId: folder.organizationId,
          },
        })

        if (!newParentFolder) {
          throw createError({
            message: 'Parent folder not found',
            statusCode: 404,
          })
        }

        // Проверка, что новая родительская папка не является потомком текущей папки
        let isDescendant = false
        let checkFolder = newParentFolder
        while (checkFolder && checkFolder.parentId) {
          if (checkFolder.parentId === id) {
            isDescendant = true
            break
          }
          const nextFolder = await prisma.fileFolder.findUnique({
            where: { id: checkFolder.parentId },
          })
          if (!nextFolder) break
          checkFolder = nextFolder
        }

        if (isDescendant) {
          throw createError({
            message: 'Cannot move folder into its descendant',
            statusCode: 400,
          })
        }

        level = newParentFolder.level + 1
        path = newParentFolder.path
          ? `${newParentFolder.path}/${newParentFolder.name}`
          : `/${newParentFolder.name}`
      } else {
        // Если перемещаем в корень
        level = 1
        path = '/'
      }

      // Проверка, что папка с таким именем не существует в новой родительской папке
      const existingFolder = await prisma.fileFolder.findFirst({
        where: {
          name: name || folder.name,
          parentId: parentId,
          organizationId: folder.organizationId,
          id: { not: id }, // Исключаем текущую папку
        },
      })

      if (existingFolder) {
        throw createError({
          message: 'A folder with this name already exists at the new location',
          statusCode: 409,
        })
      }
    }

    // Проверка при изменении имени, что папка с таким именем не существует
    if (name && name !== folder.name && parentId === undefined) {
      const existingFolder = await prisma.fileFolder.findFirst({
        where: {
          name,
          parentId: folder.parentId,
          organizationId: folder.organizationId,
          id: { not: id }, // Исключаем текущую папку
        },
      })

      if (existingFolder) {
        throw createError({
          message: 'A folder with this name already exists at this location',
          statusCode: 409,
        })
      }
    }

    // Обновление папки
    const updatedFolder = await prisma.fileFolder.update({
      data: {
        name: name,
        description: description,
        parentId: parentId,
        level: level,
        path: path,
        updatedAt: new Date(),
        lastModifiedBy: session.user.id,
        version: { increment: 1 },
      },
      include: {
        organization: {
          select: {
            id: true,
            name: true,
            slug: true,
            logo: true,
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
      },
      where: { id },
    })

    return updatedFolder
  }
  catch (error) {
    console.error('Failed to update folder:', error)
    throw createError({
      message: 'Failed to update folder',
      statusCode: 500,
    })
  }
})
