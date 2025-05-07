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
          select: {
            id: true,
            name: true,
            slug: true,
            logo: true,
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
        formFields: {
          select: {
            id: true,
            formField: {
              select: {
                id: true,
                name: true,
                form: {
                  select: {
                    id: true,
                    title: true,
                  },
                },
              },
            },
          },
        },
        sharedWith: {
          select: {
            id: true,
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
            createdAt: true,
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
      share.member.user.id === session.user.id &&
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

    // Обновление времени последнего доступа к файлу
    await prisma.file.update({
      data: {
        accessedAt: new Date(),
      },
      where: { id },
    })

    return file
  }
  catch (error) {
    console.error('Failed to get file:', error)
    throw createError({
      message: 'Failed to get file',
      statusCode: 500,
    })
  }
})
