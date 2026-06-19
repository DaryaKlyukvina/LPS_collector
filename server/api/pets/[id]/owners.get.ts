// server/api/pets/[id]/owners.get.ts
// GET /api/pets/:id/owners — список коллекционеров, у кого эта фигурка в коллекции
import { query } from '~/server/db/client'

export default defineEventHandler(async (event) => {
  const petId = getRouterParam(event, 'id')

  const rows = await query<{
    user_id: string; username: string; location: string | null; avatar_url: string | null
  }>(
    `SELECT
       u.id AS user_id, u.username, u.location, u.avatar_url
     FROM collection_items ci
     JOIN users u ON u.id = ci.user_id
     WHERE ci.pet_id = $1
     ORDER BY ci.added_at ASC`,
    [petId],
  )

  return rows.map(r => ({
    id:        r.user_id,
    username:  r.username,
    location:  r.location,
    avatarUrl: r.avatar_url ?? '/images/avatars/default_avatar.svg',
  }))
})
