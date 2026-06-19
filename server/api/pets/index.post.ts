// server/api/pets/index.post.ts  — только admin
import { query } from '~/server/db/client'
import { requireRole } from '~/server/utils/auth'

export default defineEventHandler(async (event) => {
  const payload = requireRole(event, 'admin')
  const body = await readBody(event)

  const required = ['number', 'name', 'moldId', 'generationId']
  for (const field of required) {
    if (body?.[field] === undefined || body?.[field] === null || body?.[field] === '') {
      throw createError({ statusCode: 400, message: `Поле ${field} обязательно` })
    }
  }

  const number = Number(body.number)
  if (!Number.isInteger(number) || number <= 0) {
    throw createError({ statusCode: 400, message: 'Номер должен быть положительным целым числом' })
  }

  try {
    const rows = await query(
      `INSERT INTO pets (number, name, mold_id, generation_id, release_type_id,
         has_flocking, has_magnet, has_glitter, color_scheme, image_url, description, created_by)
       VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12)
       RETURNING id`,
      [
        number, body.name, body.moldId, body.generationId,
        body.releaseTypeId ?? null,
        body.hasFlocking ?? false, body.hasMagnet ?? false, body.hasGlitter ?? false,
        body.colorScheme ?? null, body.imageUrl ?? null, body.description ?? null,
        payload.sub,
      ],
    )
    return { id: rows[0].id }
  } catch (e: any) {
    // 23505 — нарушение уникальности (номер уже занят)
    if (e?.code === '23505') {
      throw createError({ statusCode: 409, message: `Фигурка с номером #${number} уже существует` })
    }
    throw e
  }
})
