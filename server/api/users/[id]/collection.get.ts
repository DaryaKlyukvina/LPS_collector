// server/api/users/[id]/collection.get.ts
// GET /api/users/:id/collection — публичная коллекция пользователя
// Доступна всем, используется для страницы чужого профиля и модалки обмена
import { query } from '~/server/db/client'

export default defineEventHandler(async (event) => {
  const userId = getRouterParam(event, 'id')

  const rows = await query(
    `SELECT
       ci.id, ci.note, ci.acquired_at, ci.added_at,
       p.id AS pet_id, p.number, p.name, p.image_url,
       m.name   AS mold_name,
       g.label  AS gen_label, g.number AS gen_number,
       rt.slug  AS rt_slug,
       rt.label AS rt_label,
       rt.is_exclusive AS rt_exclusive
     FROM collection_items ci
     JOIN pets p        ON p.id = ci.pet_id
     JOIN molds m       ON m.id = p.mold_id
     JOIN generations g ON g.id = p.generation_id
     LEFT JOIN release_types rt ON rt.id = p.release_type_id
     WHERE ci.user_id = $1
     ORDER BY ci.added_at DESC`,
    [userId],
  )

  return rows.map(r => ({
    id:         r.id,
    note:       r.note,
    acquiredAt: r.acquired_at,
    addedAt:    r.added_at,
    pet: {
      id:       r.pet_id,
      number:   r.number,
      name:     r.name,
      imageUrl: r.image_url ?? '/images/placeholders/pet_thumb.svg',
      moldName: r.mold_name,
      generation: { label: r.gen_label, number: r.gen_number },
      releaseType: r.rt_slug ? {
        slug: r.rt_slug, label: r.rt_label, isExclusive: r.rt_exclusive,
      } : null,
    },
  }))
})
