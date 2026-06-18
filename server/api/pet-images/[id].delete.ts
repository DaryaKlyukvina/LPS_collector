// server/api/pet-images/[id].delete.ts  — только admin
import { queryOne } from '~/server/db/client'
import { requireRole } from '~/server/utils/auth'

export default defineEventHandler(async (event) => {
  requireRole(event, 'admin')
  const id = getRouterParam(event, 'id')

  const img = await queryOne<{ id: string; is_primary: boolean; pet_id: string }>(
    'SELECT id, is_primary, pet_id FROM pet_images WHERE id = $1',
    [id],
  )
  if (!img) throw createError({ statusCode: 404, message: 'Изображение не найдено' })

  await queryOne('DELETE FROM pet_images WHERE id = $1', [id])

  // Если удалили primary — обновляем image_url в pets на следующее изображение
  if (img.is_primary) {
    const next = await queryOne<{ url: string }>(
      'SELECT url FROM pet_images WHERE pet_id = $1 ORDER BY sort_order ASC LIMIT 1',
      [img.pet_id],
    )
    await queryOne(
      'UPDATE pets SET image_url = $1 WHERE id = $2',
      [next?.url ?? null, img.pet_id],
    )
    if (next) {
      await queryOne('UPDATE pet_images SET is_primary = TRUE WHERE url = $1 AND pet_id = $2',
        [next.url, img.pet_id])
    }
  }

  return { ok: true }
})
