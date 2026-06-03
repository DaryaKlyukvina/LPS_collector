// server/api/users/[id].delete.ts  — только admin
import { queryOne } from '~/server/db/client'
import { requireRole } from '~/server/utils/auth'

export default defineEventHandler(async (event) => {
  const adminPayload = requireRole(event, 'admin')
  const id = getRouterParam(event, 'id')

  if (id === adminPayload.sub) {
    throw createError({ statusCode: 400, message: 'Нельзя удалить самого себя' })
  }

  const user = await queryOne('SELECT id FROM users WHERE id = $1', [id])
  if (!user) throw createError({ statusCode: 404, message: 'Пользователь не найден' })

  await queryOne('DELETE FROM users WHERE id = $1', [id])
  return { ok: true }
})
