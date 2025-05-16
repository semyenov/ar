import { MemberRole } from '@prisma/client'
import { auth } from '~/lib/auth'
import prisma from '~/lib/prisma'
import { z } from 'zod'

export default defineEventHandler(async (event) => {
  // Get user session
  const session = await auth.api.getSession({
    headers: event.headers,
  })
  if (!session) {
    throw createError({
      message: 'Unauthorized',
      statusCode: 401,
    })
  }

  // Check if user is admin
  const isAdmin = session.user.role === 'admin'

  if (!isAdmin) {
    throw createError({
      message: 'Forbidden: Admin access required',
      statusCode: 403,
    })
  }

  // Get query parameters
  const query = getQuery(event)

  const schema = z.object({
    limit: z.coerce.number()
      .int()
      .positive()
      .max(100)
      .optional()
      .default(50),
    page: z.coerce.number()
      .int()
      .positive()
      .optional()
      .default(1),
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

  const { limit, page, search } = validationResult.data
  const skip = (page - 1) * limit

  try {
    // Build filter conditions
    const whereConditions: any = {}

    if (search) {
      whereConditions.OR = [
        { name: { contains: search, mode: 'insensitive' } },
        { slug: { contains: search, mode: 'insensitive' } },
      ]
    }

    // Get organizations with pagination
    const [organizations, total] = await Promise.all([
      prisma.organization.findMany({
        include: {
          _count: {
            select: {
              files: true,
              forms: true,
              members: true,
            },
          },
        },
        orderBy: {
          name: 'asc',
        },
        skip,
        take: limit,
        where: whereConditions,
      }),
      prisma.organization.count({
        where: whereConditions,
      }),
    ])

    return {
      data: organizations,
      meta: {
        limit,
        page,
        total,
        totalPages: Math.ceil(total / limit),
      },
    }
  }
  catch (error) {
    console.error('Failed to list organizations:', error)
    throw createError({
      message: 'Failed to list organizations',
      statusCode: 500,
    })
  }
})
