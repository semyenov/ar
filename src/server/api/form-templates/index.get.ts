import { z } from 'zod'
import { auth } from '~/lib/auth'
import prisma from '~~/lib/prisma'

export default defineEventHandler(async (event) => {
  // Проверка авторизации пользователя
  const session = await auth.api.getSession({
    headers: event.headers,
  })
  if (!session) {
    throw createError({
      statusCode: 401,
      message: 'Unauthorized',
    })
  }

  // Получение параметров запроса
  const query = getQuery(event)


  const schema = z.object({
    limit: z.string().transform(Number).pipe(z.number().int().positive()).optional(),
    offset: z.string().transform(Number).pipe(z.number().int().nonnegative()).optional(),
    search: z.string().optional(),
  })

  const validationResult = schema.safeParse(query)
  if (!validationResult.success) {
    throw createError({
      statusCode: 400,
      message: 'Invalid query parameters',
      data: validationResult.error.format(),
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
        where,
        orderBy: { updatedAt: 'desc' },
        take: limit,
        skip: offset,
      }),
      prisma.formTemplate.count({
        where,
      }),
    ])

    return {
      items: formTemplates,
      total,
      limit,
      offset,
    }
  } catch (error) {
    console.error('Failed to list form templates:', error)
    throw createError({
      statusCode: 500,
      message: 'Failed to list form templates',
    })
  }
})