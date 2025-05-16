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

  // Get organization ID from route
  const organizationId = getRouterParam(event, 'id')
  if (!organizationId) {
    throw createError({
      message: 'Organization ID is required',
      statusCode: 400,
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
    role: z.enum([
      'owner',
      'admin',
      'reviewer',
      'executor',
      'member',
    ])
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

  const { limit, page, role, search } = validationResult.data
  const skip = (page - 1) * limit

  try {
    // Check if organization exists
    const organization = await prisma.organization.findUnique({
      select: { id: true, name: true },
      where: { id: organizationId },
    })

    if (!organization) {
      throw createError({
        message: 'Organization not found',
        statusCode: 404,
      })
    }

    // Build filter conditions
    const whereConditions: any = {
      organizationId,
    }

    if (role) {
      whereConditions.role = role
    }

    if (search) {
      whereConditions.user = {
        OR: [
          { name: { contains: search, mode: 'insensitive' } },
          { email: { contains: search, mode: 'insensitive' } },
        ],
      }
    }

    // Get members with pagination
    const [members, total] = await Promise.all([
      prisma.member.findMany({
        include: {
          user: {
            select: {
              email: true,
              id: true,
              image: true,
              name: true,
            },
          },
        },
        orderBy: [
          { role: 'asc' },
          { user: { name: 'asc' } },
        ],
        skip,
        take: limit,
        where: whereConditions,
      }),
      prisma.member.count({
        where: whereConditions,
      }),
    ])

    return {
      data: members,
      meta: {
        limit,
        organization: {
          id: organization.id,
          name: organization.name,
        },
        page,
        total,
        totalPages: Math.ceil(total / limit),
      },
    }
  }
  catch (error) {
    console.error('Failed to list organization members:', error)
    throw createError({
      message: 'Failed to list organization members',
      statusCode: 500,
    })
  }
})
