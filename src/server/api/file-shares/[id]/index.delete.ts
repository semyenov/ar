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

  // Получение ID доступа
  const id = getRouterParam(event, 'id')
  if (!id) {
    throw createError({
      message: 'Share ID is required',
      statusCode: 400,
    })
  }

  try {
    // Получение информации о доступе к файлу
    const fileShare = await prisma.fileShare.findUnique({
      include: {
        file: {
          select: {
            organizationId: true,
            uploader: {
              select: {
                userId: true,
              },
            },
          },
        },
        member: {
          select: {
            userId: true,
          },
        },
      },
      where: { id },
    })

    if (!fileShare) {
      throw createError({
        message: 'File share not found',
        statusCode: 404,
      })
    }

    // Проверка прав пользователя на удаление доступа
    // Удалить доступ может:
    // 1. Тот, кто загрузил файл
    // 2. Администратор организации
    // 3. Пользователь, которому был предоставлен доступ (отказаться от доступа)

    const isFileUploader = fileShare.file.uploader.userId === session.user.id
    const isSharedWithUser = fileShare.member.userId === session.user.id

    // Проверка, является ли пользователь администратором организации
    const membership = await prisma.member.findFirst({
      where: {
        organizationId: fileShare.file.organizationId,
        userId: session.user.id,
        role: 'ADMIN',
      },
    })

    const isAdmin = !!membership

    if (!isFileUploader && !isAdmin && !isSharedWithUser) {
      throw createError({
        message: 'You do not have permission to delete this file share',
        statusCode: 403,
      })
    }

    // Удаление доступа к файлу
    await prisma.fileShare.delete({
      where: { id },
    })

    return {
      success: true,
      message: 'File share deleted successfully',
    }
  }
  catch (error) {
    console.error('Failed to delete file share:', error)
    throw createError({
      message: 'Failed to delete file share',
      statusCode: 500,
    })
  }
})
