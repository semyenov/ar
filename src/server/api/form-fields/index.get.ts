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
    formId: z.string(),
    limit: z.string()
      .transform(Number)
      .pipe(z.number()
        .int()
        .positive())
      .optional(),
    offset: z.string()
      .transform(Number)
      .pipe(z.number()
        .int()
        .nonnegative())
      .optional(),
  })

  const validationResult = schema.safeParse(query)
  if (!validationResult.success) {
    throw createError({
      data: validationResult.error.format(),
      message: 'Invalid query parameters',
      statusCode: 400,
    })
  }

  const { formId, limit = 100, offset = 0 } = validationResult.data

  try {
    // Проверка существования формы и доступа пользователя
    const form = await prisma.form.findFirst({
      where: {
        id: formId,
        organization: {
          members: {
            some: {
              userId: session.user.id,
            },
          },
        },
      },
    })

    if (!form) {
      throw createError({
        message: 'Form not found or you do not have access',
        statusCode: 404,
      })
    }

    // Получение полей формы
    const [formFields, total] = await Promise.all([
      prisma.formField.findMany({
        include: {
          files: {
            include: {
              file: {
                select: {
                  createdAt: true,
                  filename: true,
                  id: true,
                  mimeType: true,
                  originalName: true,
                  size: true,
                },
              },
            },
          },
        },
        orderBy: { order: 'asc' },
        skip: offset,
        take: limit,
        where: { formId },
      }),
      prisma.formField.count({
        where: { formId },
      }),
    ])

    return {
      items: formFields,
      limit,
      offset,
      total,
    }
  }
  catch (error) {
    console.error('Failed to list form fields:', error)
    throw createError({
      message: 'Failed to list form fields',
      statusCode: 500,
    })
  }
})
