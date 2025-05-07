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

  // Получение ID файла
  const id = getRouterParam(event, 'id')
  if (!id) {
    throw createError({
      message: 'File ID is required',
      statusCode: 400,
    })
  }

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
        formFields: {
          select: {
            id: true,
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

    // Проверка прав пользователя на удаление файла
    // Только загрузивший пользователь или администратор могут удалить файл
    const isUserFileUploader = file.uploader.user.id === session.user.id
    const isUserAdmin = file.organization.members.length > 0 && file.organization.members[0].role === 'ADMIN'

    if (!isUserFileUploader && !isUserAdmin) {
      throw createError({
        message: 'You do not have permission to delete this file',
        statusCode: 403,
      })
    }

    // Проверка, что файл не используется в полях форм
    if (file.formFields.length > 0) {
      throw createError({
        message: 'Cannot delete file that is used in forms',
        statusCode: 400,
      })
    }

    // Мягкое удаление файла (пометка как удаленный, но без фактического удаления файла с диска)
    await prisma.$transaction(async (tx) => {
      // Удаление всех связей доступа к файлу
      await tx.fileShare.deleteMany({
        where: { fileId: id },
      })

      // Пометка файла как удаленный
      await tx.file.update({
        data: {
          deleted: true,
          updatedAt: new Date(),
          lastModifiedBy: session.user.id,
          version: { increment: 1 },
        },
        where: { id },
      })
    })

    return {
      success: true,
      message: 'File deleted successfully',
    }
  }
  catch (error) {
    console.error('Failed to delete file:', error)
    throw createError({
      message: 'Failed to delete file',
      statusCode: 500,
    })
  }
})
