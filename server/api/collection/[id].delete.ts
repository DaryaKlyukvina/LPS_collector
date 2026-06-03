// server/api/collection/[id].delete.ts
import { queryOne } from '~/server/db/client'
import { requireAuth } from '~/server/utils/auth'

export default defineEventHandler(async (event) => {
  const payload = requireAuth(event)
  const id = getRouterParam(event, 'id')

  const item = await queryOne(
    'SELECT id FROM collection_items WHERE id = $1 AND user_id = $2',
    [id, payload.sub],
  )
  if (!item) throw createError({ statusCode: 404, message: 'Запись не найдена' })

  await queryOne('DELETE FROM collection_items WHERE id = $1', [id])
  return { ok: true }
})
