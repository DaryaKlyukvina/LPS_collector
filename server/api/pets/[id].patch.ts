// server/api/pets/[id].patch.ts  — только admin
// PATCH /api/pets/:id — обновить данные фигурки
import { queryOne } from '~/server/db/client'
import { requireRole } from '~/server/utils/auth'

export default defineEventHandler(async (event) => {
  requireRole(event, 'admin')
  const id = getRouterParam(event, 'id')
  const body = await readBody(event)

  const pet = await queryOne('SELECT id FROM pets WHERE id = $1', [id])
  if (!pet) throw createError({ statusCode: 404, message: 'Фигурка не найдена' })

  // Собираем только переданные поля
  const fields: string[] = []
  const params: unknown[] = []
  let pi = 1

  const allowed = [
    ['name',            'name'],
    ['moldId',          'mold_id'],
    ['generationId',    'generation_id'],
    ['releaseTypeId',   'release_type_id'],
    ['hasFlocking',     'has_flocking'],
    ['hasMagnet',       'has_magnet'],
    ['hasGlitter',      'has_glitter'],
    ['colorScheme',     'color_scheme'],
    ['imageUrl',        'image_url'],
    ['description',     'description'],
  ] as const

  for (const [jsKey, dbCol] of allowed) {
    if (body[jsKey] !== undefined) {
      fields.push(`${dbCol} = $${pi}`)
      params.push(body[jsKey])
      pi++
    }
  }

  if (!fields.length) {
    throw createError({ statusCode: 400, message: 'Нет полей для обновления' })
  }

  params.push(id)
  await queryOne(
    `UPDATE pets SET ${fields.join(', ')} WHERE id = $${pi}`,
    params,
  )

  return { ok: true }
})
