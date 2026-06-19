// server/api/collection/index.get.ts
// GET /api/collection — коллекция текущего пользователя
import { query } from '~/server/db/client'
import { requireAuth } from '~/server/utils/auth'

export default defineEventHandler(async (event) => {
  const payload = requireAuth(event)

  const rows = await query(
    `SELECT
       ci.id, ci.note, ci.acquired_at, ci.added_at,
       p.id AS pet_id, p.number, p.name,
       p.has_flocking, p.has_magnet, p.image_url,
       p.release_type_id,
       m.name AS mold_name, m.species,
       g.label AS gen_label, g.number AS gen_number,
       rt.slug AS release_type_slug, rt.label AS release_type_label, rt.is_exclusive
     FROM collection_items ci
     JOIN pets p        ON p.id = ci.pet_id
     JOIN molds m       ON m.id = p.mold_id
     JOIN generations g ON g.id = p.generation_id
     LEFT JOIN release_types rt ON rt.id = p.release_type_id
     WHERE ci.user_id = $1
     ORDER BY ci.added_at DESC`,
    [payload.sub],
  )

  return rows.map(r => ({
    id: r.id, note: r.note,
    acquiredAt: r.acquired_at, addedAt: r.added_at,
    pet: {
      id: r.pet_id, number: r.number, name: r.name,
      hasFlocking: r.has_flocking, hasMagnet: r.has_magnet, imageUrl: r.image_url,
      releaseType: r.release_type_id ? { id: r.release_type_id, slug: r.release_type_slug, label: r.release_type_label, isExclusive: r.is_exclusive } : null,
      mold: { name: r.mold_name, species: r.species },
      generation: { label: r.gen_label, number: r.gen_number },
    },
  }))
})
