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

  // Получение ID связи
  const id = getRouterParam(event, 'id')
  if (!id) {
    throw createError({
      message: 'Form field file ID is required',
      statusCode: 400,
    })
  }

  try {
    // Получение информации о связи поля формы и файла
    const formFieldFile = await prisma.formFieldFile.findUnique({
      include: {
        formField: {
          select: {
            form: {
              select: {
                status: true,
                organizationId: true,
                creatorMemberId: true,
                executorMemberId: true,
                organization: {
                  include: {
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
              },
            },
          },
        },
      },
      where: { id },
    })

    if (!formFieldFile) {
      throw createError({
        message: 'Form field file not found',
        statusCode: 404,
      })
    }

    // Проверка прав пользователя на доступ к форме
    if (formFieldFile.formField.form.organization.members.length === 0) {
      throw createError({
        message: 'You do not have access to this form',
        statusCode: 403,
      })
    }

    // Проверка, что форма не находится в заблокированном статусе
    if (formFieldFile.formField.form.status === 'APPROVED' || formFieldFile.formField.form.status === 'REJECTED') {
      throw createError({
        message: 'Cannot remove files from forms in APPROVED or REJECTED status',
        statusCode: 400,
      })
    }

    // Проверка прав пользователя на удаление файла
    const userRole = formFieldFile.formField.form.organization.members[0].role
    const isAdmin = userRole === 'ADMIN'
    const isCreator = formFieldFile.formField.form.creatorMemberId === formFieldFile.formField.form.organization.members[0].id
    const isExecutor = formFieldFile.formField.form.executorMemberId === formFieldFile.formField.form.organization.members[0].id

    if (!isAdmin && !isCreator && !isExecutor) {
      throw createError({
        message: 'You do not have permission to remove files from this form',
        statusCode: 403,
      })
    }

    // Удаление связи поля формы и файла
    await prisma.formFieldFile.delete({
      where: { id },
    })

    return {
      success: true,
      message: 'File detached from form field successfully',
    }
  }
  catch (error) {
    console.error('Failed to detach file from form field:', error)
    throw createError({
      message: 'Failed to detach file from form field',
      statusCode: 500,
    })
  }
})