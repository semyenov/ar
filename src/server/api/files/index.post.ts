import { auth } from '~/lib/auth'
import { generateId } from '~/lib/utils'
import prisma from '~/lib/prisma'
import { z } from 'zod'
import { createReadStream, readFileSync } from 'node:fs'
import { mkdir, writeFile } from 'node:fs/promises'
import { dirname, join, parse, extname } from 'node:path'
import { createHash } from 'node:crypto'
import { fileTypeFromBuffer as fromBuffer } from 'file-type'

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

  try {
    // Получение формы с файлом
    const formData = await readMultipartFormData(event)
    if (!formData || formData.length === 0) {
      throw createError({
        message: 'No file uploaded',
        statusCode: 400,
      })
    }

    // Получение файла из формы
    const fileField = formData.find(field => field.name === 'file')
    if (!fileField || !fileField.filename) {
      throw createError({
        message: 'No file field found',
        statusCode: 400,
      })
    }

    // Проверка метаданных файла
    const metadataField = formData.find(field => field.name === 'metadata')
    let metadata: any = {}

    if (metadataField && metadataField.data) {
      try {
        metadata = JSON.parse(metadataField.data.toString())
      }
      catch (error) {
        console.error('Failed to parse metadata:', error)
        throw createError({
          message: 'Invalid metadata format',
          statusCode: 400,
        })
      }
    }

    // Проверка метаданных
    const schema = z.object({
      description: z.string().optional(),
      folderId: z.string().min(24).optional(),
      organizationId: z.string().min(24),
      accessLevel: z.enum(['PRIVATE', 'ORGANIZATION', 'PUBLIC']).default('ORGANIZATION').optional(),
    })

    const validationResult = schema.safeParse(metadata)
    if (!validationResult.success) {
      throw createError({
        data: validationResult.error.format(),
        message: 'Invalid metadata',
        statusCode: 400,
      })
    }

    const { organizationId, folderId, description, accessLevel } = validationResult.data

    // Проверка, что пользователь является членом организации
    const membership = await prisma.member.findFirst({
      where: {
        organizationId,
        userId: session.user.id,
      },
    })

    if (!membership) {
      throw createError({
        message: 'You do not have access to this organization',
        statusCode: 403,
      })
    }

    // Проверка существования папки, если указана
    if (folderId) {
      const folder = await prisma.fileFolder.findUnique({
        where: {
          id: folderId,
          organizationId,
        },
      })

      if (!folder) {
        throw createError({
          message: 'Folder not found',
          statusCode: 404,
        })
      }
    }

    // Генерация уникального имени файла
    const originalName = fileField.filename
    const fileId = generateId()
    const fileExtension = extname(originalName)
    const filename = `${fileId}${fileExtension}`

    // Определение MIME типа файла
    const fileBuffer = Uint8Array.from(fileField.data)
    const fileTypeResult = await fromBuffer(fileBuffer)
    const mimeType = fileTypeResult?.mime || 'application/octet-stream'

    // Создание хеша содержимого файла (для проверки целостности)
    const fileHash = createHash('sha256').update(fileBuffer).digest('hex')

    // Определение пути хранения файла
    const baseStoragePath = process.env.FILE_STORAGE_PATH || '/tmp/uploads'
    const datePart = new Date().toISOString().slice(0, 10).replace(/-/g, '/') // YYYY/MM/DD
    const storagePath = join(baseStoragePath, datePart)
    const filePath = join(storagePath, filename)

    // Создание директории, если она не существует
    await mkdir(dirname(filePath), { recursive: true })

    // Сохранение файла
    await writeFile(filePath, fileBuffer)

    // Сохранение информации о файле в БД
    const file = await prisma.file.create({
      data: {
        id: fileId,
        filename,
        originalName,
        path: filePath,
        mimeType,
        size: fileBuffer.length,
        accessLevel: accessLevel || 'ORGANIZATION',
        description,
        organizationId,
        uploaderMemberId: membership.id,
        folderId,
        accessedAt: new Date(),
        lastModifiedBy: session.user.id,
      },
    })

    return file
  }
  catch (error) {
    console.error('Failed to upload file:', error)
    throw createError({
      message: 'Failed to upload file',
      statusCode: 500,
    })
  }
})
