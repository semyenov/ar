import { z } from 'zod'
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

  // Валидация параметров запроса
  const query = getQuery(event)
  const schema = z.object({
    formId: z.string().min(24),
    page: z.coerce.number().int().positive().optional().default(1),
    limit: z.coerce.number().int().positive().max(100).optional().default(20),
  })

  const validationResult = schema.safeParse(query)
  if (!validationResult.success) {
    throw createError({
      message: 'Invalid query parameters',
      statusCode: 400,
      data: validationResult.error.format(),
    })
  }

  const { formId, page, limit } = validationResult.data
  const skip = (page - 1) * limit

  try {
    // Сначала проверяем доступ пользователя к форме
    const form = await prisma.form.findUnique({
      select: {
        id: true,
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
      where: { id: formId },
    })

    if (!form) {
      throw createError({
        message: 'Form not found',
        statusCode: 404,
      })
    }

    // Проверка доступа пользователя к организации
    if (form.organization.members.length === 0) {
      throw createError({
        message: 'You do not have access to this form history',
        statusCode: 403,
      })
    }

    // Получение истории формы с пагинацией
    const [history, total] = await Promise.all([
      prisma.formHistory.findMany({
        include: {
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
        orderBy: {
          createdAt: 'desc',
        },
        skip,
        take: limit,
        where: { formId },
      }),
      prisma.formHistory.count({
        where: { formId },
      }),
    ])

    return {
      data: history,
      meta: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    }
  }
  catch (error) {
    console.error('Failed to get form history:', error)
    throw createError({
      message: 'Failed to get form history',
      statusCode: 500,
    })
  }
})
