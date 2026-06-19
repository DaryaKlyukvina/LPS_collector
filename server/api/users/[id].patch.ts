// server/api/users/[id].patch.ts  — смена роли, только admin
import { queryOne } from '~/server/db/client'
import { requireRole } from '~/server/utils/auth'
import { PROTECTED_ADMIN_USERNAME } from '~/types'

export default defineEventHandler(async (event) => {
  requireRole(event, 'admin')
  const id = getRouterParam(event, 'id')
  const body = await readBody<{ role: 'user' | 'admin' }>(event)

  if (!['user', 'admin'].includes(body?.role)) {
    throw createError({ statusCode: 400, message: 'Роль должна быть user или admin' })
  }

  const target = await queryOne<{ id: string; username: string }>(
    'SELECT id, username FROM users WHERE id = $1',
    [id],
  )
  if (!target) throw createError({ statusCode: 404, message: 'Пользователь не найден' })

  // Оригинального администратора нельзя трогать
  if (target.username === PROTECTED_ADMIN_USERNAME) {
    throw createError({ statusCode: 403, message: 'Нельзя менять роль главного администратора' })
  }

  const updated = await queryOne(
    'UPDATE users SET role = $1 WHERE id = $2 RETURNING id, username, role',
    [body.role, id],
  )

  return updated
})
