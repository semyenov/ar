import { auth } from '~/lib/auth'
import prisma from '~~/lib/prisma'

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

  // Получение ID процесса рассмотрения
  const id = getRouterParam(event, 'id')
  if (!id) {
    throw createError({
      message: 'Review flow ID is required',
      statusCode: 400,
    })
  }

  try {
    // Получение процесса рассмотрения с проверкой доступа пользователя
    const reviewFlow = await prisma.reviewFlow.findUnique({
      include: {
        form: {
          select: {
            id: true,
            title: true,
            description: true,
            status: true,
            createdAt: true,
            updatedAt: true,
            creatorMemberId: true,
            executorMemberId: true,
            templateId: true,
            creator: {
              select: {
                id: true,
                role: true,
                user: {
                  select: {
                    id: true,
                    name: true,
                    email: true,
                    image: true,
                  },
                },
              },
            },
            executor: {
              select: {
                id: true,
                role: true,
                user: {
                  select: {
                    id: true,
                    name: true,
                    email: true,
                    image: true,
                  },
                },
              },
            },
            fields: {
              orderBy: {
                order: 'asc',
              },
              select: {
                id: true,
                name: true,
                type: true,
                value: true,
                required: true,
                validationRules: true,
                order: true,
                options: true,
                files: {
                  include: {
                    file: {
                      select: {
                        id: true,
                        filename: true,
                        originalName: true,
                        mimeType: true,
                        size: true,
                        createdAt: true,
                      },
                    },
                  },
                },
              },
            },
          },
        },
        organization: {
          select: {
            id: true,
            name: true,
            slug: true,
            logo: true,
            members: {
              select: {
                id: true,
                role: true,
              },
              where: {
                userId: session.user.id,
              },
            },
          },
        },
        comments: {
          include: {
            member: {
              select: {
                id: true,
                role: true,
                user: {
                  select: {
                    id: true,
                    name: true,
                    email: true,
                    image: true,
                  },
                },
              },
            },
          },
          orderBy: {
            createdAt: 'asc',
          },
        },
      },
      where: { id },
    })

    if (!reviewFlow) {
      throw createError({
        message: 'Review flow not found',
        statusCode: 404,
      })
    }

    // Проверка доступа пользователя к организации
    if (reviewFlow.organization.members.length === 0) {
      throw createError({
        message: 'You do not have access to this review flow',
        statusCode: 403,
      })
    }

    return reviewFlow
  }
  catch (error) {
    console.error('Failed to get review flow:', error)
    throw createError({
      message: 'Failed to get review flow',
      statusCode: 500,
    })
  }
})