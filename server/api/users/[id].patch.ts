// server/api/users/[id].patch.ts  — смена роли, только admin
import { queryOne } from '~/server/db/client'
import { requireRole } from '~/server/utils/auth'

export default defineEventHandler(async (event) => {
  requireRole(event, 'admin')
  const id = getRouterParam(event, 'id')
  const body = await readBody<{ role: 'user' | 'admin' }>(event)

  if (!['user', 'admin'].includes(body?.role)) {
    throw createError({ statusCode: 400, message: 'Роль должна быть user или admin' })
  }

  const updated = await queryOne(
    'UPDATE users SET role = $1 WHERE id = $2 RETURNING id, username, role',
    [body.role, id],
  )
  if (!updated) throw createError({ statusCode: 404, message: 'Пользователь не найден' })

  return updated
})
