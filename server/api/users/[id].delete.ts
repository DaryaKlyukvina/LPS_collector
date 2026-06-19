// server/api/users/[id].delete.ts  — только admin
import { queryOne } from '~/server/db/client'
import { requireRole } from '~/server/utils/auth'
import { PROTECTED_ADMIN_USERNAME } from '~/types'

export default defineEventHandler(async (event) => {
  const adminPayload = requireRole(event, 'admin')
  const id = getRouterParam(event, 'id')

  if (id === adminPayload.sub) {
    throw createError({ statusCode: 400, message: 'Нельзя удалить самого себя' })
  }

  const user = await queryOne<{ id: string; username: string }>(
    'SELECT id, username FROM users WHERE id = $1',
    [id],
  )
  if (!user) throw createError({ statusCode: 404, message: 'Пользователь не найден' })

  // Оригинального администратора нельзя удалить
  if (user.username === PROTECTED_ADMIN_USERNAME) {
    throw createError({ statusCode: 403, message: 'Нельзя удалить главного администратора' })
  }

  await queryOne('DELETE FROM users WHERE id = $1', [id])
  return { ok: true }
})
