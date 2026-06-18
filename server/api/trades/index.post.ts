// server/api/trades/index.post.ts
// POST /api/trades — создать предложение обмена
import { query, queryOne } from '~/server/db/client'
import { requireAuth } from '~/server/utils/auth'

export default defineEventHandler(async (event) => {
  const { sub: myId } = requireAuth(event)
  const body = await readBody<{
    receiverId: string
    offeredPetId: string   // из моей коллекции
    wantedPetId: string    // из коллекции собеседника
    note?: string
  }>(event)

  // Валидация
  const required = ['receiverId', 'offeredPetId', 'wantedPetId']
  for (const f of required) {
    if (!body?.[f as keyof typeof body]) {
      throw createError({ statusCode: 400, message: `Поле ${f} обязательно` })
    }
  }

  if (myId === body.receiverId) {
    throw createError({ statusCode: 400, message: 'Нельзя предложить обмен самому себе' })
  }

  // Проверяем что предлагаемая фигурка действительно в коллекции отправителя
  const ownsPet = await queryOne(
    'SELECT id FROM collection_items WHERE user_id = $1 AND pet_id = $2',
    [myId, body.offeredPetId],
  )
  if (!ownsPet) {
    throw createError({ statusCode: 400, message: 'Предлагаемая фигурка не в вашей коллекции' })
  }

  // Найти или создать диалог
  const [u1, u2] = [myId, body.receiverId].sort()
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

  // Создаём системное сообщение-заглушку (body = null, trade привяжем к нему)
  const msgRows = await query<{ id: string; created_at: string }>(
    `INSERT INTO messages (conversation_id, sender_id, body)
     VALUES ($1, $2, NULL)
     RETURNING id, created_at`,
    [conv.id, myId],
  )
  const msgId = msgRows[0].id

  // Создаём предложение обмена
  const tradeRows = await query<{ id: string }>(
    `INSERT INTO trade_offers
       (message_id, sender_id, receiver_id, offered_pet_id, wanted_pet_id, note)
     VALUES ($1,$2,$3,$4,$5,$6)
     RETURNING id`,
    [msgId, myId, body.receiverId, body.offeredPetId, body.wantedPetId, body.note ?? null],
  )

  setResponseStatus(event, 201)
  return {
    tradeId: tradeRows[0].id,
    messageId: msgId,
    createdAt: msgRows[0].created_at,
  }
})
