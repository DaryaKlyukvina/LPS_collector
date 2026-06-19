// server/api/meta.get.ts
// GET /api/meta — справочные данные для форм (поколения, молды, типы релизов).
// Публичный доступ: это статические справочники без приватных данных.
import { query } from '~/server/db/client'

export default defineEventHandler(async () => {
  const [generations, molds, releaseTypes] = await Promise.all([
    query<{ id: string; number: number; label: string }>(
      'SELECT id, number, label FROM generations ORDER BY number',
    ),
    query<{ id: string; name: string; species: string }>(
      'SELECT id, name, species FROM molds ORDER BY name',
    ),
    query<{ id: string; slug: string; label: string; is_exclusive: boolean }>(
      'SELECT id, slug, label, is_exclusive FROM release_types ORDER BY sort_order',
    ),
  ])

  return {
    generations: generations.map(g => ({ id: g.id, number: g.number, label: g.label })),
    molds:       molds.map(m => ({ id: m.id, name: m.name, species: m.species })),
    releaseTypes: releaseTypes.map(r => ({ id: r.id, slug: r.slug, label: r.label, isExclusive: r.is_exclusive })),
  }
})
