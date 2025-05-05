import { auth } from '~/lib/auth'
import prisma from '~~/lib/prisma'
import { createReadStream, existsSync, statSync } from 'node:fs'
import { join } from 'node:path'

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
          select: {
            id: true,
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
        uploader: {
          select: {
            user: {
              select: {
                id: true,
              },
            },
          },
        },
        sharedWith: {
          select: {
            id: true,
            member: {
              select: {
                userId: true,
              },
            },
            expiresAt: true,
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

    // Проверка доступа пользователя к файлу
    const isUserOrganizationMember = file.organization.members.length > 0
    const isFilePublic = file.accessLevel === 'PUBLIC'
    const isUserFileUploader = file.uploader.user.id === session.user.id
    const isFileSharedWithUser = file.sharedWith.some(share =>
      share.member.userId === session.user.id &&
      (!share.expiresAt || share.expiresAt > new Date())
    )

    const hasAccess = isFilePublic ||
                     (file.accessLevel === 'ORGANIZATION' && isUserOrganizationMember) ||
                     (file.accessLevel === 'PRIVATE' && isUserFileUploader) ||
                     isFileSharedWithUser

    if (!hasAccess) {
      throw createError({
        message: 'You do not have access to this file',
        statusCode: 403,
      })
    }

    // Проверка существования файла на диске
    if (!existsSync(file.path)) {
      throw createError({
        message: 'File content not found',
        statusCode: 404,
      })
    }

    // Получение информации о файле
    const stat = statSync(file.path)
    const fileSize = stat.size

    // Обновление времени последнего доступа к файлу
    await prisma.file.update({
      data: {
        accessedAt: new Date(),
      },
      where: { id },
    })

    // Установка заголовков для скачивания файла
    setResponseHeader(event, 'Content-Type', file.mimeType)
    setResponseHeader(event, 'Content-Length', fileSize)
    setResponseHeader(event, 'Content-Disposition', `attachment; filename="${encodeURIComponent(file.originalName)}"`)
    setResponseHeader(event, 'Accept-Ranges', 'bytes')

    // Обработка частичного скачивания (Range requests)
    const rangeHeader = getRequestHeader(event, 'Range')
    if (rangeHeader) {
      const match = /bytes=(\d+)-(\d*)/.exec(rangeHeader)
      if (match) {
        const start = parseInt(match[1], 10)
        const end = match[2] ? parseInt(match[2], 10) : fileSize - 1
        const contentLength = end - start + 1

        setResponseStatus(event, 206)
        setResponseHeader(event, 'Content-Range', `bytes ${start}-${end}/${fileSize}`)
        setResponseHeader(event, 'Content-Length', contentLength)

        return createReadStream(file.path, { start, end })
      }
    }

    // Скачивание всего файла
    return createReadStream(file.path)
  }
  catch (error) {
    console.error('Failed to download file:', error)
    throw createError({
      message: 'Failed to download file',
      statusCode: 500,
    })
  }
})