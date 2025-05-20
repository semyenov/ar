import { auth } from '~/lib/auth'
import prisma from '~/lib/prisma'
import { generateId } from '~/lib/utils'

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

  // Получение ID поля из параметров запроса
  const id = getRouterParam(event, 'id')

  if (!id) {
    throw createError({
      message: 'Field ID is required',
      statusCode: 400,
    })
  }

  try {
    // Получение поля формы
    const formField = await prisma.formField.findUnique({
      include: {
        form: {
          select: {
            creatorMemberId: true,
            executorMemberId: true,
            id: true,
            organizationId: true,
            status: true,
            title: true,
          },
        },
      },
      where: { id },
    })

    if (!formField) {
      throw createError({
        message: 'Form field not found',
        statusCode: 404,
      })
    }

    // Проверка доступа пользователя
    const membership = await prisma.member.findFirst({
      where: {
        organizationId: formField.form.organizationId,
        userId: session.user.id,
      },
    })

    if (!membership) {
      throw createError({
        message: 'You do not have access to this organization',
        statusCode: 403,
      })
    }

    // Проверка прав на удаление
    const canDelete
      = membership.role === 'owner'
        || formField.form.creatorMemberId === membership.id
        || (formField.form.executorMemberId === membership.id && ['DRAFT', 'NEEDS_CHANGES'].includes(formField.form.status))

    if (!canDelete) {
      throw createError({
        message: 'You do not have permission to delete this field',
        statusCode: 403,
      })
    }

    // Проверка, что форма находится в статусе DRAFT или NEEDS_CHANGES
    if (formField.form.status !== 'DRAFT' && formField.form.status !== 'NEEDS_CHANGES') {
      throw createError({
        message: 'Cannot delete fields from a form that is not in DRAFT or NEEDS_CHANGES status',
        statusCode: 400,
      })
    }

    // Удаление поля формы
    await prisma.$transaction(async (tx) => {
      // Проверка и удаление связанных файлов поля
      const formFieldFiles = await tx.formFieldFile.findMany({
        where: { formFieldId: id },
      })

      if (formFieldFiles.length > 0) {
        await tx.formFieldFile.deleteMany({
          where: { formFieldId: id },
        })
      }

      // Удаление поля
      await tx.formField.delete({
        where: { id },
      })

      // Обновление версии формы
      await tx.form.update({
        data: {
          lastModifiedBy: session.user.id,
          updatedAt: new Date(),
          version: { increment: 1 },
        },
        where: { id: formField.formId },
      })

      // Создание записи в истории формы
      await tx.formHistory.create({
        data: {
          data: JSON.stringify({
            action: 'delete_field',
            fieldId: id,
            fieldName: formField.name,
            fieldType: formField.type,
          }),
          formId: formField.formId,
          id: generateId(),
          memberId: membership.id,
          status: formField.form.status,
        },
      })
    })

    return { message: 'Form field deleted successfully', success: true }
  }
  catch (error) {
    console.error('Failed to delete form field:', error)
    throw createError({
      message: 'Failed to delete form field',
      statusCode: 500,
    })
  }
})
