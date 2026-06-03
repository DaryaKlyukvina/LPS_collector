// server/api/pets/[id].get.ts
import { queryOne } from '~/server/db/client'

export default defineEventHandler(async (event) => {
  const id = getRouterParam(event, 'id')

  const pet = await queryOne<Record<string, unknown>>(
    `SELECT
       p.*,
       m.name AS mold_name, m.species AS mold_species, m.description AS mold_desc,
       g.number AS gen_number, g.label AS gen_label,
       g.year_start, g.year_end
     FROM pets p
     JOIN molds m       ON m.id = p.mold_id
     JOIN generations g ON g.id = p.generation_id
     WHERE p.id = $1`,
    [id],
  )

  if (!pet) throw createError({ statusCode: 404, message: 'Фигурка не найдена' })

  return {
    id: pet.id, number: pet.number, name: pet.name,
    rarity: pet.rarity, description: pet.description,
    hasFlocking: pet.has_flocking, hasMagnet: pet.has_magnet, hasGlitter: pet.has_glitter,
    colorScheme: pet.color_scheme, imageUrl: pet.image_url, createdAt: pet.created_at,
    mold: { id: pet.mold_id, name: pet.mold_name, species: pet.mold_species, description: pet.mold_desc },
    generation: {
      id: pet.generation_id, number: pet.gen_number, label: pet.gen_label,
      yearStart: pet.year_start, yearEnd: pet.year_end,
    },
  }
})
