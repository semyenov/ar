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
    // Check if organization exists
    const existingOrg = await prisma.organization.findUnique({
      include: {
        _count: {
          select: {
            files: true,
            forms: true,
            members: true,
          },
        },
      },
      where: { id: organizationId },
    })

    if (!existingOrg) {
      throw createError({
        message: 'Organization not found',
        statusCode: 404,
      })
    }

    // Check if organization has members, forms, or files
    if (existingOrg._count.members > 0) {
      throw createError({
        message: 'Cannot delete organization with members. Remove all members first.',
        statusCode: 400,
      })
    }

    if (existingOrg._count.forms > 0 || existingOrg._count.files > 0) {
      throw createError({
        message: 'Cannot delete organization with forms or files. Delete all forms and files first.',
        statusCode: 400,
      })
    }

    // Delete organization
    await prisma.organization.delete({
      where: { id: organizationId },
    })

    return {
      message: 'Organization deleted successfully',
    }
  }
  catch (error) {
    console.error('Failed to delete organization:', error)
    throw createError({
      message: 'Failed to delete organization',
      statusCode: 500,
    })
  }
})
