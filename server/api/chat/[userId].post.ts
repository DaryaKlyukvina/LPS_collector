// server/api/chat/[userId].post.ts
// POST /api/chat/:userId — отправить сообщение пользователю
import { query, queryOne } from '~/server/db/client'
import { requireAuth } from '~/server/utils/auth'

export default defineEventHandler(async (event) => {
  const { sub: myId } = requireAuth(event)
  const partnerId = getRouterParam(event, 'userId')!
  const body = await readBody<{ body?: string; petId?: string }>(event)

  if (myId === partnerId) {
    throw createError({ statusCode: 400, message: 'Нельзя написать самому себе' })
  }

  if (!body?.body?.trim() && !body?.petId) {
    throw createError({ statusCode: 400, message: 'Сообщение не может быть пустым' })
  }

  // Найти или создать диалог
  const [u1, u2] = [myId, partnerId].sort()
  let conv = await queryOne<{ id: string }>(
    'SELECT id FROM conversations WHERE user_1_id = $1 AND user_2_id = $2',
    [u1, u2],
  )
  if (!conv) {
    const rows = await query<{ id: string }>(
      'INSERT INTO conversations (user_1_id, user_2_id) VALUES ($1,$2) RETURNING id',
      [u1, u2],
    )
    conv = rows[0]
  }

  const rows = await query<{ id: string; created_at: string }>(
    `INSERT INTO messages (conversation_id, sender_id, body, pet_id)
     VALUES ($1, $2, $3, $4)
     RETURNING id, created_at`,
    [conv.id, myId, body.body?.trim() ?? null, body.petId ?? null],
  )

  setResponseStatus(event, 201)
  return { id: rows[0].id, createdAt: rows[0].created_at }
})
