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

  try {
    // Parse request body
    const body = await readBody(event)

    // Validate request body
    const schema = z.object({
      logo: z.string()
        .url()
        .optional(),
      metadata: z.string()
        .optional(),
      name: z.string()
        .min(2)
        .max(100),
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
    if (slug) {
      const existingOrg = await prisma.organization.findUnique({
        where: { slug },
      })

      if (existingOrg) {
        throw createError({
          message: 'Organization with this slug already exists',
          statusCode: 400,
        })
      }
    }

    // Generate auto slug if not provided
    const finalSlug = slug || name
      .toLowerCase()
      .replace(/\s+/g, '-')
      .replace(/[^\da-z-]/g, '')
      .slice(0, 50)

    // Create organization
    const organization = await prisma.organization.create({
      data: {
        createdAt: new Date(),
        id: crypto.randomUUID(),
        logo,
        metadata,
        name,
        slug: finalSlug,
      },
      include: {
        _count: {
          select: {
            members: true,
          },
        },
      },
    })

    return {
      data: organization,
      message: 'Organization created successfully',
    }
  }
  catch (error) {
    console.error('Failed to create organization:', error)
    throw createError({
      message: 'Failed to create organization',
      statusCode: 500,
    })
  }
})
