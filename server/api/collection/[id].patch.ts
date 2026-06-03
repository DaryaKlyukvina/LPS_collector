// server/api/collection/[id].patch.ts
// PATCH /api/collection/:id — обновить заметку / состояние
import { queryOne } from '~/server/db/client'
import { requireAuth } from '~/server/utils/auth'

export default defineEventHandler(async (event) => {
  const payload = requireAuth(event)
  const id = getRouterParam(event, 'id')
  const body = await readBody<{ note?: string; condition?: string }>(event)

  const item = await queryOne(
    'SELECT id FROM collection_items WHERE id = $1 AND user_id = $2',
    [id, payload.sub],
  )
  if (!item) throw createError({ statusCode: 404, message: 'Запись не найдена' })

  await queryOne(
    `UPDATE collection_items SET
       note = COALESCE($1, note),
       condition = COALESCE($2, condition)
     WHERE id = $3`,
    [body.note ?? null, body.condition ?? null, id],
  )

  return { ok: true }
})
