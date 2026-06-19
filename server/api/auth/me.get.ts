// server/api/auth/me.get.ts
import { queryOne } from '~/server/db/client'
import { requireAuth } from '~/server/utils/auth'

export default defineEventHandler(async (event) => {
  const payload = requireAuth(event)

  const user = await queryOne<{
    id: string; username: string; email: string;
    role: string; bio: string | null; location: string | null; created_at: string;
    is_banned: boolean; ban_reason: string | null
  }>(
    'SELECT id, username, email, role, bio, location, created_at, is_banned, ban_reason FROM users WHERE id = $1',
    [payload.sub],
  )

  if (!user) throw createError({ statusCode: 404, message: 'Пользователь не найден' })

  if (user.is_banned) {
    throw createError({
      statusCode: 403,
      message: user.ban_reason
        ? `Аккаунт заблокирован. Причина: ${user.ban_reason}`
        : 'Аккаунт заблокирован',
    })
  }

  return user
})
