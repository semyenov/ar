import { auth } from '~/lib/auth'
import prisma from '~/lib/prisma'

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

  try {
    // Get organization with related data
    const organization = await prisma.organization.findUnique({
      include: {
        _count: {
          select: {
            files: true,
            folders: true,
            forms: true,
            reviewFlows: true,
          },
        },
        members: {
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
        },
      },
      where: { id: organizationId },
    })

    if (!organization) {
      throw createError({
        message: 'Organization not found',
        statusCode: 404,
      })
    }

    return {
      data: organization,
    }
  }
  catch (error) {
    console.error('Failed to get organization:', error)
    throw createError({
      message: 'Failed to get organization',
      statusCode: 500,
    })
  }
})
