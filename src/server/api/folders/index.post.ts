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
    name: z.string().min(1),
    description: z.string().optional(),
    organizationId: z.string().min(24),
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

  const { name, description, organizationId, parentId } = validationResult.data

  try {
    // Проверка, что пользователь является членом организации
    const membership = await prisma.member.findFirst({
      where: {
        organizationId,
        userId: session.user.id,
      },
    })

    if (!membership) {
      throw createError({
        message: 'You do not have access to this organization',
        statusCode: 403,
      })
    }

    let parentFolder = null
    let level = 1
    let path = '/'

    // Если указана родительская папка, проверяем ее существование и получаем уровень
    if (parentId) {
      parentFolder = await prisma.fileFolder.findUnique({
        where: {
          id: parentId,
          organizationId,
        },
      })

      if (!parentFolder) {
        throw createError({
          message: 'Parent folder not found',
          statusCode: 404,
        })
      }

      level = parentFolder.level + 1
      path = parentFolder.path ? `${parentFolder.path}/${parentFolder.name}` : `/${parentFolder.name}`
    }

    // Проверка, что папка с таким именем не существует на том же уровне
    const existingFolder = await prisma.fileFolder.findFirst({
      where: {
        name,
        parentId: parentId || null,
        organizationId,
      },
    })

    if (existingFolder) {
      throw createError({
        message: 'A folder with this name already exists at this location',
        statusCode: 409,
      })
    }

    // Создание папки
    const folder = await prisma.fileFolder.create({
      data: {
        id: generateId(),
        name,
        description,
        organizationId,
        creatorMemberId: membership.id,
        parentId,
        level,
        path,
        lastModifiedBy: session.user.id,
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
    })

    return folder
  }
  catch (error) {
    console.error('Failed to create folder:', error)
    throw createError({
      message: 'Failed to create folder',
      statusCode: 500,
    })
  }
})
