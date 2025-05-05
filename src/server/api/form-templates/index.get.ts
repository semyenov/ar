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
    search: z.string()
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

  const { limit = 50, offset = 0, search } = validationResult.data

  try {
    // Формирование условий поиска
    const where = search
      ? {
          OR: [
            { name: { contains: search } },
            { description: { contains: search } },
          ],
        }
      : {}

    // Получение шаблонов форм
    const [formTemplates, total] = await Promise.all([
      prisma.formTemplate.findMany({
        orderBy: { updatedAt: 'desc' },
        skip: offset,
        take: limit,
        where,
      }),
      prisma.formTemplate.count({
        where,
      }),
    ])

    return {
      items: formTemplates,
      limit,
      offset,
      total,
    }
  }
  catch (error) {
    console.error('Failed to list form templates:', error)
    throw createError({
      message: 'Failed to list form templates',
      statusCode: 500,
    })
  }
})
