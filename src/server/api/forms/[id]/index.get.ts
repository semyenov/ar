import { auth } from '~/lib/auth'
import prisma from '~/lib/prisma'

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

  // Получение ID формы из параметров запроса
  const id = getRouterParam(event, 'id')

  if (!id) {
    throw createError({
      message: 'Form ID is required',
      statusCode: 400,
    })
  }

  try {
    // Получение формы с проверкой доступа пользователя
    const form = await prisma.form.findFirst({
      include: {
        creator: {
          include: {
            user: {
              select: {
                email: true,
                image: true,
                name: true,
              },
            },
          },
        },
        executor: {
          include: {
            user: {
              select: {
                email: true,
                image: true,
                name: true,
              },
            },
          },
        },
        fields: {
          orderBy: {
            order: 'asc',
          },
        },
        history: {
          include: {
            member: {
              include: {
                user: {
                  select: {
                    email: true,
                    image: true,
                    name: true,
                  },
                },
              },
            },
          },
          orderBy: {
            createdAt: 'desc',
          },
          take: 10,
        },
        organization: {
          select: {
            id: true,
            name: true,
          },
        },
        reviewFlow: {
          include: {
            comments: {
              include: {
                member: {
                  include: {
                    user: {
                      select: {
                        email: true,
                        image: true,
                        name: true,
                      },
                    },
                  },
                },
              },
              orderBy: {
                createdAt: 'desc',
              },
              take: 10,
            },
          },
        },
        template: {
          select: {
            id: true,
            name: true,
          },
        },
      },
      where: {
        id,
        organization: {
          members: {
            some: {
              userId: session.user.id,
            },
          },
        },
      },
    })

    if (!form) {
      throw createError({
        message: 'Form not found or you do not have access',
        statusCode: 404,
      })
    }

    return form
  }
  catch (error) {
    console.error('Failed to get form:', error)
    throw createError({
      message: 'Failed to get form',
      statusCode: 500,
    })
  }
})
