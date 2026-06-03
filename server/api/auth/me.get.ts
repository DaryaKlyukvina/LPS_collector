// server/api/auth/me.get.ts
import { queryOne } from '~/server/db/client'
import { requireAuth } from '~/server/utils/auth'

export default defineEventHandler(async (event) => {
  const payload = requireAuth(event)

  const user = await queryOne<{
    id: string; username: string; email: string;
    role: string; bio: string | null; location: string | null; created_at: string
  }>(
    'SELECT id, username, email, role, bio, location, created_at FROM users WHERE id = $1',
    [payload.sub],
  )

  if (!user) throw createError({ statusCode: 404, message: 'Пользователь не найден' })

  return user
})
