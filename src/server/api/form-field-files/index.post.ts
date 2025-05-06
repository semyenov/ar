import { auth } from '~/lib/auth'
import { generateId } from '~/lib/utils'
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

  const body = await readBody(event)

  // Проверка данных запроса
  const schema = z.object({
    formFieldId: z.string().min(24),
    fileId: z.string().min(24),
  })

  const validationResult = schema.safeParse(body)
  if (!validationResult.success) {
    throw createError({
      data: validationResult.error.format(),
      message: 'Invalid request data',
      statusCode: 400,
    })
  }

  const { formFieldId, fileId } = validationResult.data

  try {
    // Проверка существования поля формы и доступа пользователя к нему
    const formField = await prisma.formField.findUnique({
      include: {
        form: {
          select: {
            status: true,
            organizationId: true,
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
        },
      },
      where: { id: formFieldId },
    })

    if (!formField) {
      throw createError({
        message: 'Form field not found',
        statusCode: 404,
      })
    }

    // Проверка, что тип поля - FILE
    if (formField.type !== 'FILE') {
      throw createError({
        message: 'This form field does not accept files',
        statusCode: 400,
      })
    }

    // Проверка, что форма не находится в заблокированном статусе
    if (formField.form.status === 'APPROVED' || formField.form.status === 'REJECTED') {
      throw createError({
        message: 'Cannot attach files to forms in APPROVED or REJECTED status',
        statusCode: 400,
      })
    }

    // Проверка прав пользователя на доступ к форме
    if (formField.form.organization.members.length === 0) {
      throw createError({
        message: 'You do not have access to this form',
        statusCode: 403,
      })
    }

    // Проверка существования файла и доступа пользователя к нему
    const file = await prisma.file.findUnique({
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
        uploader: {
          select: {
            userId: true,
          },
        },
        sharedWith: {
          select: {
            member: {
              select: {
                userId: true,
              },
            },
            expiresAt: true,
          },
        },
      },
      where: { id: fileId, deleted: false },
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
    const isUserFileUploader = file.uploader.userId === session.user.id
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

    // Проверка, что файл и форма принадлежат к одной организации
    if (file.organizationId !== formField.form.organizationId) {
      throw createError({
        message: 'File and form must belong to the same organization',
        statusCode: 400,
      })
    }

    // Проверка, что файл еще не прикреплен к этому полю формы
    const existingAttachment = await prisma.formFieldFile.findFirst({
      where: {
        formFieldId,
        fileId,
      },
    })

    if (existingAttachment) {
      throw createError({
        message: 'File is already attached to this form field',
        statusCode: 409,
      })
    }

    // Прикрепление файла к полю формы
    const formFieldFile = await prisma.formFieldFile.create({
      data: {
        id: generateId(),
        formFieldId,
        fileId,
      },
      include: {
        file: {
          select: {
            id: true,
            filename: true,
            originalName: true,
            mimeType: true,
            size: true,
            createdAt: true,
          },
        },
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
    })

    return formFieldFile
  }
  catch (error) {
    console.error('Failed to attach file to form field:', error)
    throw createError({
      message: 'Failed to attach file to form field',
      statusCode: 500,
    })
  }
})
