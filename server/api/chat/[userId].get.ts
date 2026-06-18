// server/api/chat/[userId].get.ts
// GET /api/chat/:userId — открыть диалог с пользователем
// Создаёт диалог если его ещё нет, возвращает id и историю сообщений
import { query, queryOne } from '~/server/db/client'
import { requireAuth } from '~/server/utils/auth'

export default defineEventHandler(async (event) => {
  const { sub: myId } = requireAuth(event)
  const partnerId = getRouterParam(event, 'userId')!

  if (myId === partnerId) {
    throw createError({ statusCode: 400, message: 'Нельзя открыть диалог с собой' })
  }

  // Нормализуем порядок (CHECK constraint в БД требует user_1_id < user_2_id)
  const [u1, u2] = [myId, partnerId].sort()

  // Найти или создать диалог
  let conv = await queryOne<{ id: string }>(
    'SELECT id FROM conversations WHERE user_1_id = $1 AND user_2_id = $2',
    [u1, u2],
  )

  if (!conv) {
    const rows = await query<{ id: string }>(
      'INSERT INTO conversations (user_1_id, user_2_id) VALUES ($1, $2) RETURNING id',
      [u1, u2],
    )
    conv = rows[0]
  }

  const convId = conv.id

  // Пометить сообщения собеседника как прочитанные
  await query(
    `UPDATE messages SET is_read = TRUE
     WHERE conversation_id = $1 AND sender_id != $2 AND is_read = FALSE`,
    [convId, myId],
  )

  // Загрузить историю сообщений (последние 50)
  const messages = await query(
    `SELECT
       m.id, m.body, m.sender_id, m.is_read, m.created_at,
       -- прикреплённая фигурка
       p.id      AS pet_id,
       p.number  AS pet_number,
       p.name    AS pet_name,
       p.image_url AS pet_image,
       -- предложение обмена (если есть)
       t.id           AS trade_id,
       t.status       AS trade_status,
       t.note         AS trade_note,
       op.id          AS offered_id,
       op.number      AS offered_number,
       op.name        AS offered_name,
       op.image_url   AS offered_image,
       wp.id          AS wanted_id,
       wp.number      AS wanted_number,
       wp.name        AS wanted_name,
       wp.image_url   AS wanted_image
     FROM messages m
     LEFT JOIN pets p ON p.id = m.pet_id
     LEFT JOIN trade_offers t ON t.message_id = m.id
     LEFT JOIN pets op ON op.id = t.offered_pet_id
     LEFT JOIN pets wp ON wp.id = t.wanted_pet_id
     WHERE m.conversation_id = $1
     ORDER BY m.created_at ASC
     LIMIT 50`,
    [convId],
  )

  // Информация о собеседнике
  const partner = await queryOne<{
    id: string; username: string; avatar_url: string | null
  }>(
    'SELECT id, username, avatar_url FROM users WHERE id = $1',
    [partnerId],
  )

  if (!partner) throw createError({ statusCode: 404, message: 'Пользователь не найден' })

  return {
    conversationId: convId,
    partner: {
      id: partner.id,
      username: partner.username,
      avatarUrl: partner.avatar_url ?? '/images/avatars/default_avatar.svg',
    },
    messages: messages.map(m => ({
      id: m.id,
      body: m.body,
      isMine: m.sender_id === myId,
      isRead: m.is_read,
      createdAt: m.created_at,
      // прикреплённая фигурка (упоминание)
      pet: m.pet_id ? {
        id: m.pet_id,
        number: m.pet_number,
        name: m.pet_name,
        imageUrl: m.pet_image ?? '/images/placeholders/pet_thumb.svg',
      } : null,
      // предложение обмена
      trade: m.trade_id ? {
        id: m.trade_id,
        status: m.trade_status,
        note: m.trade_note,
        offeredPet: {
          id: m.offered_id, number: m.offered_number, name: m.offered_name,
          imageUrl: m.offered_image ?? '/images/placeholders/pet_thumb.svg',
        },
        wantedPet: {
          id: m.wanted_id, number: m.wanted_number, name: m.wanted_name,
          imageUrl: m.wanted_image ?? '/images/placeholders/pet_thumb.svg',
        },
      } : null,
    })),
  }
})
