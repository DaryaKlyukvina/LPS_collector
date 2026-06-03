// server/api/pets/index.get.ts
// GET /api/pets — каталог фигурок с фильтрацией и пагинацией
import { query, queryOne } from '~/server/db/client'
import type { CatalogFilters } from '~/types'

export default defineEventHandler(async (event) => {
  const q = getQuery(event) as Record<string, string>

  // Параметры
  const page    = Math.max(1, Number(q.page)  || 1)
  const limit   = Math.min(50, Number(q.limit) || 24)
  const offset  = (page - 1) * limit
  const search  = q.search?.trim() || ''
  const sort    = q.sort || 'number'

  // Динамически строим WHERE
  const conditions: string[] = []
  const params: unknown[] = []
  let pi = 1 // индекс параметра

  if (search) {
    conditions.push(`(p.name ILIKE $${pi} OR p.number::text ILIKE $${pi})`)
    params.push(`%${search}%`)
    pi++
  }

  if (q.generations) {
    const gens = String(q.generations).split(',').map(Number).filter(Boolean)
    if (gens.length) {
      conditions.push(`g.number = ANY($${pi}::int[])`)
      params.push(gens)
      pi++
    }
  }

  if (q.rarity) {
    const rarities = String(q.rarity).split(',').filter(Boolean)
    if (rarities.length) {
      conditions.push(`p.rarity = ANY($${pi}::text[])`)
      params.push(rarities)
      pi++
    }
  }

  if (q.hasFlocking === 'true')  { conditions.push('p.has_flocking = true') }
  if (q.hasMagnet   === 'true')  { conditions.push('p.has_magnet = true')   }
  if (q.hasGlitter  === 'true')  { conditions.push('p.has_glitter = true')  }

  if (q.moldIds) {
    const ids = String(q.moldIds).split(',').filter(Boolean)
    if (ids.length) {
      conditions.push(`p.mold_id = ANY($${pi}::uuid[])`)
      params.push(ids)
      pi++
    }
  }

  const where = conditions.length ? `WHERE ${conditions.join(' AND ')}` : ''

  // Сортировка (только whitelist!)
  const sortMap: Record<string, string> = {
    number:     'p.number ASC',
    name:       'p.name ASC',
    rarity:     "CASE p.rarity WHEN 'exclusive' THEN 1 WHEN 'special' THEN 2 WHEN 'rare' THEN 3 ELSE 4 END",
    generation: 'g.number ASC, p.number ASC',
  }
  const orderBy = sortMap[sort] ?? sortMap.number

  const sql = `
    SELECT
      p.id, p.number, p.name, p.rarity,
      p.has_flocking, p.has_magnet, p.has_glitter,
      p.image_url, p.created_at,
      m.id AS mold_id, m.name AS mold_name, m.species AS mold_species,
      g.id AS generation_id, g.number AS gen_number, g.label AS gen_label
    FROM pets p
    JOIN molds m       ON m.id = p.mold_id
    JOIN generations g ON g.id = p.generation_id
    ${where}
    ORDER BY ${orderBy}
    LIMIT $${pi} OFFSET $${pi + 1}
  `

  const countSql = `
    SELECT COUNT(*) AS total
    FROM pets p
    JOIN generations g ON g.id = p.generation_id
    ${where}
  `

  const [rows, countRow] = await Promise.all([
    query(sql, [...params, limit, offset]),
    queryOne<{ total: string }>(countSql, params),
  ])

  const total = Number(countRow?.total ?? 0)

  return {
    items: rows.map(r => ({
      id: r.id, number: r.number, name: r.name, rarity: r.rarity,
      hasFlocking: r.has_flocking, hasMagnet: r.has_magnet, hasGlitter: r.has_glitter,
      imageUrl: r.image_url, createdAt: r.created_at,
      mold: { id: r.mold_id, name: r.mold_name, species: r.mold_species },
      generation: { id: r.generation_id, number: r.gen_number, label: r.gen_label },
    })),
    total,
    page,
    limit,
    totalPages: Math.ceil(total / limit),
  }
})
