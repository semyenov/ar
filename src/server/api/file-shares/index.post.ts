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
    fileId: z.string().min(24),
    memberId: z.string().min(24),
    expiresAt: z.string().datetime().optional().nullable(),
  })

  const validationResult = schema.safeParse(body)
  if (!validationResult.success) {
    throw createError({
      data: validationResult.error.format(),
      message: 'Invalid request data',
      statusCode: 400,
    })
  }

  const { fileId, memberId, expiresAt } = validationResult.data

  try {
    // Проверка существования файла и доступа пользователя к нему
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
            userId: true,
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

    // Проверка прав пользователя на доступ к файлу
    const isUserOrganizationMember = file.organization.members.length > 0
    const isUserFileUploader = file.uploader.userId === session.user.id
    const isUserAdmin = isUserOrganizationMember && file.organization.members[0].role === 'ADMIN'

    // Только загрузивший файл пользователь или администратор могут делиться файлом
    if (!isUserFileUploader && !isUserAdmin) {
      throw createError({
        message: 'You do not have permission to share this file',
        statusCode: 403,
      })
    }

    // Проверка, что пользователь с которым делятся файлом существует и принадлежит к той же организации
    const member = await prisma.member.findUnique({
      where: {
        id: memberId,
        organizationId: file.organizationId,
      },
    })

    if (!member) {
      throw createError({
        message: 'Member not found in this organization',
        statusCode: 404,
      })
    }

    // Проверка, что с этим пользователем еще не поделились файлом
    const existingShare = await prisma.fileShare.findFirst({
      where: {
        fileId,
        memberId,
      },
    })

    if (existingShare) {
      throw createError({
        message: 'File is already shared with this member',
        statusCode: 409,
      })
    }

    // Создание записи о доступе к файлу
    const fileShare = await prisma.fileShare.create({
      data: {
        id: generateId(),
        fileId,
        memberId,
        expiresAt: expiresAt ? new Date(expiresAt) : null,
      },
      include: {
        file: {
          select: {
            id: true,
            filename: true,
            originalName: true,
            mimeType: true,
            size: true,
          },
        },
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
      },
    })

    return fileShare
  }
  catch (error) {
    console.error('Failed to share file:', error)
    throw createError({
      message: 'Failed to share file',
      statusCode: 500,
    })
  }
})
