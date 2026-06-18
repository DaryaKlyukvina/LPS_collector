// server/api/pets/[id].delete.ts  — только admin
// DELETE /api/pets/:id — удалить фигурку из каталога
import { queryOne } from '~/server/db/client'
import { requireRole } from '~/server/utils/auth'

export default defineEventHandler(async (event) => {
  requireRole(event, 'admin')
  const id = getRouterParam(event, 'id')

  const pet = await queryOne('SELECT id FROM pets WHERE id = $1', [id])
  if (!pet) throw createError({ statusCode: 404, message: 'Фигурка не найдена' })

  // ON DELETE CASCADE удалит pet_images, collection_items, wishlist_items автоматически
  await queryOne('DELETE FROM pets WHERE id = $1', [id])
  return { ok: true }
})
