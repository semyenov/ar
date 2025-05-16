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

  try {
    // Check if organization exists
    const existingOrg = await prisma.organization.findUnique({
      where: { id: organizationId },
    })

    if (!existingOrg) {
      throw createError({
        message: 'Organization not found',
        statusCode: 404,
      })
    }

    // Parse request body
    const body = await readBody(event)

    // Validate request body
    const schema = z.object({
      logo: z.string()
        .url()
        .optional()
        .nullable(),
      metadata: z.string()
        .optional()
        .nullable(),
      name: z.string()
        .min(2)
        .max(100)
        .optional(),
      slug: z.string()
        .min(2)
        .max(50)
        .regex(/^[\da-z-]+$/, 'Slug must contain only lowercase letters, numbers, and hyphens')
        .optional(),
    })

    const validationResult = schema.safeParse(body)
    if (!validationResult.success) {
      throw createError({
        data: validationResult.error.format(),
        message: 'Invalid organization data',
        statusCode: 400,
      })
    }

    const { logo, metadata, name, slug } = validationResult.data

    // Check if slug is available if provided
    if (slug && slug !== existingOrg.slug) {
      const slugExists = await prisma.organization.findUnique({
        where: { slug },
      })

      if (slugExists) {
        throw createError({
          message: 'Organization with this slug already exists',
          statusCode: 400,
        })
      }
    }

    // Update organization
    const organization = await prisma.organization.update({
      data: {
        logo,
        metadata,
        name: name || existingOrg.name,
        slug: slug || existingOrg.slug,
      },
      where: { id: organizationId },
    })

    return {
      data: organization,
      message: 'Organization updated successfully',
    }
  }
  catch (error) {
    console.error('Failed to update organization:', error)
    throw createError({
      message: 'Failed to update organization',
      statusCode: 500,
    })
  }
})
