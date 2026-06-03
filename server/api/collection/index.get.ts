// server/api/collection/index.get.ts
// GET /api/collection — коллекция текущего пользователя
import { query } from '~/server/db/client'
import { requireAuth } from '~/server/utils/auth'

export default defineEventHandler(async (event) => {
  const payload = requireAuth(event)

  const rows = await query(
    `SELECT
       ci.id, ci.note, ci.condition, ci.acquired_at, ci.added_at,
       p.id AS pet_id, p.number, p.name, p.rarity,
       p.has_flocking, p.has_magnet, p.image_url,
       m.name AS mold_name, m.species,
       g.label AS gen_label, g.number AS gen_number
     FROM collection_items ci
     JOIN pets p        ON p.id = ci.pet_id
     JOIN molds m       ON m.id = p.mold_id
     JOIN generations g ON g.id = p.generation_id
     WHERE ci.user_id = $1
     ORDER BY ci.added_at DESC`,
    [payload.sub],
  )

  return rows.map(r => ({
    id: r.id, note: r.note, condition: r.condition,
    acquiredAt: r.acquired_at, addedAt: r.added_at,
    pet: {
      id: r.pet_id, number: r.number, name: r.name, rarity: r.rarity,
      hasFlocking: r.has_flocking, hasMagnet: r.has_magnet, imageUrl: r.image_url,
      mold: { name: r.mold_name, species: r.species },
      generation: { label: r.gen_label, number: r.gen_number },
    },
  }))
})
