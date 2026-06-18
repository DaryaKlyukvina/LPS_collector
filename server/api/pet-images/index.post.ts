// server/api/pet-images/index.post.ts  — только admin
// POST /api/pet-images — добавить изображение к фигурке
import { query, queryOne } from '~/server/db/client'
import { requireRole } from '~/server/utils/auth'

export default defineEventHandler(async (event) => {
  const { sub: userId } = requireRole(event, 'admin')
  const body = await readBody<{
    petId: string
    url: string      // /images/pets/0001_front.jpg
    alt?: string
    isPrimary?: boolean
    sortOrder?: number
  }>(event)

  if (!body?.petId || !body?.url) {
    throw createError({ statusCode: 400, message: 'petId и url обязательны' })
  }

  // Если ставим primary — сбрасываем старый
  if (body.isPrimary) {
    await query(
      'UPDATE pet_images SET is_primary = FALSE WHERE pet_id = $1',
      [body.petId],
    )
    // Также обновляем быстрый image_url в pets
    await query('UPDATE pets SET image_url = $1 WHERE id = $2', [body.url, body.petId])
  }

  const rows = await query<{ id: string }>(
    `INSERT INTO pet_images (pet_id, url, alt, is_primary, sort_order, uploaded_by)
     VALUES ($1, $2, $3, $4, $5, $6)
     RETURNING id`,
    [body.petId, body.url, body.alt ?? null, body.isPrimary ?? false, body.sortOrder ?? 0, userId],
  )

  setResponseStatus(event, 201)
  return { id: rows[0].id }
})
