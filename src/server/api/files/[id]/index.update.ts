import { auth } from '~/lib/auth'
import prisma from '~/lib/prisma'
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

  // Получение ID файла
  const id = getRouterParam(event, 'id')
  if (!id) {
    throw createError({
      message: 'File ID is required',
      statusCode: 400,
    })
  }

  const body = await readBody(event)

  // Проверка данных запроса
  const schema = z.object({
    description: z.string().optional(),
    folderId: z.string().min(24).optional().nullable(),
    accessLevel: z.enum(['PRIVATE', 'ORGANIZATION', 'PUBLIC']).optional(),
  })

  const validationResult = schema.safeParse(body)
  if (!validationResult.success) {
    throw createError({
      data: validationResult.error.format(),
      message: 'Invalid request data',
      statusCode: 400,
    })
  }

  const { description, folderId, accessLevel } = validationResult.data

  try {
    // Получение файла с проверкой доступа пользователя
    const file = await prisma.file.findUnique({
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
        uploader: {
          select: {
            user: {
              select: {
                id: true,
              },
            },
          },
        },
      },
      where: { id, deleted: false },
    })

    if (!file) {
      throw createError({
        message: 'File not found',
        statusCode: 404,
      })
    }

    // Проверка прав пользователя на редактирование файла
    // Только загрузивший пользователь или администратор могут редактировать файл
    const isUserFileUploader = file.uploader.user.id === session.user.id
    const isUserAdmin = file.organization.members.length > 0 && file.organization.members[0].role === 'ADMIN'

    if (!isUserFileUploader && !isUserAdmin) {
      throw createError({
        message: 'You do not have permission to update this file',
        statusCode: 403,
      })
    }

    // Проверка существования папки, если указана
    if (folderId !== undefined && folderId !== null) {
      const folder = await prisma.fileFolder.findUnique({
        where: {
          id: folderId,
          organizationId: file.organizationId,
        },
      })

      if (!folder) {
        throw createError({
          message: 'Folder not found',
          statusCode: 404,
        })
      }
    }

    // Обновление файла
    const updatedFile = await prisma.file.update({
      data: {
        description: description !== undefined ? description : file.description,
        folderId: folderId !== undefined ? folderId : file.folderId,
        accessLevel: accessLevel || file.accessLevel,
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
        uploader: {
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
        folder: {
          select: {
            id: true,
            name: true,
            path: true,
          },
        },
      },
      where: { id },
    })

    return updatedFile
  }
  catch (error) {
    console.error('Failed to update file:', error)
    throw createError({
      message: 'Failed to update file',
      statusCode: 500,
    })
  }
})
