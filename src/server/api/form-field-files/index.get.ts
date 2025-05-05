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

  // Получение параметров запроса
  const query = getQuery(event)

  const schema = z.object({
    formFieldId: z.string().uuid(),
    page: z.coerce.number().int().positive().optional().default(1),
    limit: z.coerce.number().int().positive().max(50).optional().default(20),
  })

  const validationResult = schema.safeParse(query)
  if (!validationResult.success) {
    throw createError({
      data: validationResult.error.format(),
      message: 'Invalid query parameters',
      statusCode: 400,
    })
  }

  const { formFieldId, page, limit } = validationResult.data
  const skip = (page - 1) * limit

  try {
    // Проверка существования поля формы и доступа пользователя к нему
    const formField = await prisma.formField.findUnique({
      include: {
        form: {
          select: {
            organizationId: true,
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

    // Проверка прав пользователя на доступ к форме
    if (formField.form.organization.members.length === 0) {
      throw createError({
        message: 'You do not have access to this form',
        statusCode: 403,
      })
    }

    // Получение списка прикрепленных файлов
    const [formFieldFiles, total] = await Promise.all([
      prisma.formFieldFile.findMany({
        include: {
          file: {
            select: {
              id: true,
              filename: true,
              originalName: true,
              mimeType: true,
              size: true,
              accessLevel: true,
              description: true,
              createdAt: true,
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
            },
          },
        },
        orderBy: {
          file: {
            createdAt: 'desc',
          },
        },
        skip,
        take: limit,
        where: { formFieldId },
      }),
      prisma.formFieldFile.count({
        where: { formFieldId },
      }),
    ])

    return {
      data: formFieldFiles,
      meta: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    }
  }
  catch (error) {
    console.error('Failed to list form field files:', error)
    throw createError({
      message: 'Failed to list form field files',
      statusCode: 500,
    })
  }
})