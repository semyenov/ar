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
    templateId: z.string(),
  })

  const validationResult = schema.safeParse(query)
  if (!validationResult.success) {
    throw createError({
      data: validationResult.error.format(),
      message: 'Invalid query parameters',
      statusCode: 400,
    })
  }

  const { limit = 50, offset = 0, templateId } = validationResult.data

  try {
    // Проверка существования шаблона
    const template = await prisma.formTemplate.findUnique({
      where: { id: templateId },
    })

    if (!template) {
      throw createError({
        message: 'Form template not found',
        statusCode: 404,
      })
    }

    // Получение полей шаблона
    const [formTemplateFields, total] = await Promise.all([
      prisma.formTemplateField.findMany({
        orderBy: { order: 'asc' },
        skip: offset,
        take: limit,
        where: { templateId },
      }),
      prisma.formTemplateField.count({
        where: { templateId },
      }),
    ])

    return {
      items: formTemplateFields,
      limit,
      offset,
      total,
    }
  }
  catch (error) {
    console.error('Failed to list form template fields:', error)
    throw createError({
      message: 'Failed to list form template fields',
      statusCode: 500,
    })
  }
})
