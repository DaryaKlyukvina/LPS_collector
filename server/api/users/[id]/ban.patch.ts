// server/api/users/[id]/ban.patch.ts  — забанить / разбанить пользователя, только admin
// PATCH /api/users/:id/ban   body: { banned: boolean, reason?: string }
import { queryOne } from '~/server/db/client'
import { requireRole } from '~/server/utils/auth'
import { PROTECTED_ADMIN_USERNAME } from '~/types'

export default defineEventHandler(async (event) => {
  const adminPayload = requireRole(event, 'admin')
  const id = getRouterParam(event, 'id')
  const body = await readBody<{ banned: boolean; reason?: string }>(event)

  if (typeof body?.banned !== 'boolean') {
    throw createError({ statusCode: 400, message: 'Поле banned обязательно (true/false)' })
  }

  if (id === adminPayload.sub) {
    throw createError({ statusCode: 400, message: 'Нельзя забанить самого себя' })
  }

  const target = await queryOne<{ id: string; username: string }>(
    'SELECT id, username FROM users WHERE id = $1',
    [id],
  )
  if (!target) throw createError({ statusCode: 404, message: 'Пользователь не найден' })

  // Оригинального администратора нельзя забанить
  if (target.username === PROTECTED_ADMIN_USERNAME) {
    throw createError({ statusCode: 403, message: 'Нельзя забанить главного администратора' })
  }

  if (body.banned) {
    const reason = (body.reason ?? '').trim()
    if (!reason) {
      throw createError({ statusCode: 400, message: 'Укажите причину бана' })
    }
    const updated = await queryOne(
      'UPDATE users SET is_banned = TRUE, ban_reason = $1 WHERE id = $2 RETURNING id, username, is_banned, ban_reason',
      [reason, id],
    )
    return updated
  }

  // Разбан — снимаем флаг и причину
  const updated = await queryOne(
    'UPDATE users SET is_banned = FALSE, ban_reason = NULL WHERE id = $1 RETURNING id, username, is_banned, ban_reason',
    [id],
  )
  return updated
})
