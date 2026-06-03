// server/api/wishlist/index.post.ts
import { query } from '~/server/db/client'
import { requireAuth } from '~/server/utils/auth'

export default defineEventHandler(async (event) => {
  const payload = requireAuth(event)
  const body = await readBody<{ petId: string }>(event)

  if (!body?.petId) throw createError({ statusCode: 400, message: 'petId обязателен' })

  const rows = await query(
    `INSERT INTO wishlist_items (user_id, pet_id)
     VALUES ($1, $2)
     ON CONFLICT (user_id, pet_id) DO NOTHING
     RETURNING id`,
    [payload.sub, body.petId],
  )

  if (!rows.length) throw createError({ statusCode: 409, message: 'Уже в вишлисте' })

  setResponseStatus(event, 201)
  return { id: rows[0].id }
})
