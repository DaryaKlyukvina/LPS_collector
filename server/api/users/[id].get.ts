// server/api/users/[id].get.ts
// GET /api/users/:id — публичный профиль пользователя
// Доступен всем (гостям тоже), не возвращает email и password_hash
import { queryOne, query } from '~/server/db/client'

export default defineEventHandler(async (event) => {
  const id = getRouterParam(event, 'id')

  const user = await queryOne<Record<string, unknown>>(
    `SELECT
       u.id, u.username, u.bio, u.location, u.avatar_url, u.created_at,
       COUNT(DISTINCT ci.id) AS collection_count,
       COUNT(DISTINCT wi.id) AS wishlist_count
     FROM users u
     LEFT JOIN collection_items ci ON ci.user_id = u.id
     LEFT JOIN wishlist_items   wi ON wi.user_id = u.id
     WHERE u.id = $1
     GROUP BY u.id`,
    [id],
  )

  if (!user) throw createError({ statusCode: 404, message: 'Пользователь не найден' })

  // Поколения в коллекции
  const gens = await query<{ gen_number: number }>(
    `SELECT DISTINCT g.number AS gen_number
     FROM collection_items ci
     JOIN pets p        ON p.id = ci.pet_id
     JOIN generations g ON g.id = p.generation_id
     WHERE ci.user_id = $1
     ORDER BY g.number`,
    [id],
  )

  return {
    id:              user.id,
    username:        user.username,
    bio:             user.bio,
    location:        user.location,
    avatarUrl:       user.avatar_url ?? '/images/avatars/default_avatar.svg',
    createdAt:       user.created_at,
    collectionCount: Number(user.collection_count),
    wishlistCount:   Number(user.wishlist_count),
    generations:     gens.map(g => g.gen_number),
  }
})
