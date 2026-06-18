// server/api/users/me.patch.ts
// PATCH /api/users/me — редактировать свой профиль
import { queryOne } from '~/server/db/client'
import { requireAuth } from '~/server/utils/auth'

export default defineEventHandler(async (event) => {
  const { sub: userId } = requireAuth(event)
  const body = await readBody<{ bio?: string; location?: string; avatarUrl?: string }>(event)

  const fields: string[] = []
  const params: unknown[] = []
  let pi = 1

  if (body.bio      !== undefined) { fields.push(`bio = $${pi}`);        params.push(body.bio);        pi++ }
  if (body.location !== undefined) { fields.push(`location = $${pi}`);   params.push(body.location);   pi++ }
  if (body.avatarUrl !== undefined) { fields.push(`avatar_url = $${pi}`); params.push(body.avatarUrl); pi++ }

  if (!fields.length) throw createError({ statusCode: 400, message: 'Нет полей для обновления' })

  params.push(userId)
  const updated = await queryOne<{ id: string; username: string; bio: string; location: string; avatar_url: string }>(
    `UPDATE users SET ${fields.join(', ')} WHERE id = $${pi}
     RETURNING id, username, bio, location, avatar_url`,
    params,
  )

  return {
    id:        updated!.id,
    username:  updated!.username,
    bio:       updated!.bio,
    location:  updated!.location,
    avatarUrl: updated!.avatar_url ?? '/images/avatars/default_avatar.svg',
  }
})
