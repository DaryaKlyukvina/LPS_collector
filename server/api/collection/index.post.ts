// server/api/collection/index.post.ts
// POST /api/collection — добавить фигурку в коллекцию
import { query } from '~/server/db/client'
import { requireAuth } from '~/server/utils/auth'

export default defineEventHandler(async (event) => {
  const payload = requireAuth(event)
  const body = await readBody<{ petId: string; note?: string; condition?: string }>(event)

  if (!body?.petId) throw createError({ statusCode: 400, message: 'petId обязателен' })

  const rows = await query(
    `INSERT INTO collection_items (user_id, pet_id, note, condition)
     VALUES ($1, $2, $3, $4)
     ON CONFLICT (user_id, pet_id) DO NOTHING
     RETURNING id`,
    [payload.sub, body.petId, body.note ?? null, body.condition ?? null],
  )

  if (!rows.length) {
    throw createError({ statusCode: 409, message: 'Фигурка уже есть в коллекции' })
  }

  setResponseStatus(event, 201)
  return { id: rows[0].id }
})
