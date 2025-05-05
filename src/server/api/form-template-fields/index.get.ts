import { z } from 'zod'
import { auth } from '~/lib/auth'
import prisma from '~~/lib/prisma'

export default defineEventHandler(async (event) => {
  // Проверка авторизации пользователя
  const session = await auth.api.getSession(toWebRequest(event))
  if (!session) {
    throw createError({
      statusCode: 401,
      message: 'Unauthorized',
    })
  }

  // Получение параметров запроса
  const query = getQuery(event)

  const schema = z.object({
    templateId: z.string(),
    limit: z.string().transform(Number).pipe(z.number().int().positive()).optional(),
    offset: z.string().transform(Number).pipe(z.number().int().nonnegative()).optional(),
  })

  const validationResult = schema.safeParse(query)
  if (!validationResult.success) {
    throw createError({
      statusCode: 400,
      message: 'Invalid query parameters',
      data: validationResult.error.format(),
    })
  }

  const { templateId, limit = 50, offset = 0 } = validationResult.data

  try {
    // Проверка существования шаблона
    const template = await prisma.formTemplate.findUnique({
      where: { id: templateId },
    })

    if (!template) {
      throw createError({
        statusCode: 404,
        message: 'Form template not found',
      })
    }

    // Получение полей шаблона
    const [formTemplateFields, total] = await Promise.all([
      prisma.formTemplateField.findMany({
        where: { templateId },
        orderBy: { order: 'asc' },
        take: limit,
        skip: offset,
      }),
      prisma.formTemplateField.count({
        where: { templateId },
      }),
    ])

    return {
      items: formTemplateFields,
      total,
      limit,
      offset,
    }
  } catch (error) {
    console.error('Failed to list form template fields:', error)
    throw createError({
      statusCode: 500,
      message: 'Failed to list form template fields',
    })
  }
})