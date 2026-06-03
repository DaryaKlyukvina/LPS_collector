// server/api/wishlist/index.get.ts
import { query } from '~/server/db/client'
import { requireAuth } from '~/server/utils/auth'

export default defineEventHandler(async (event) => {
  const payload = requireAuth(event)

  const rows = await query(
    `SELECT
       wi.id, wi.added_at,
       p.id AS pet_id, p.number, p.name, p.rarity, p.image_url,
       m.name AS mold_name,
       g.label AS gen_label
     FROM wishlist_items wi
     JOIN pets p        ON p.id = wi.pet_id
     JOIN molds m       ON m.id = p.mold_id
     JOIN generations g ON g.id = p.generation_id
     WHERE wi.user_id = $1
     ORDER BY wi.added_at DESC`,
    [payload.sub],
  )

  return rows.map(r => ({
    id: r.id, addedAt: r.added_at,
    pet: { id: r.pet_id, number: r.number, name: r.name, rarity: r.rarity,
           imageUrl: r.image_url, moldName: r.mold_name, genLabel: r.gen_label },
  }))
})
