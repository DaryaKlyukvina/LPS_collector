// server/api/trades/[id].patch.ts
// PATCH /api/trades/:id — принять или отклонить предложение обмена
import { queryOne } from '~/server/db/client'
import { requireAuth } from '~/server/utils/auth'

export default defineEventHandler(async (event) => {
  const { sub: myId } = requireAuth(event)
  const tradeId = getRouterParam(event, 'id')!
  const body = await readBody<{ status: 'accepted' | 'declined' }>(event)

  if (!['accepted', 'declined'].includes(body?.status)) {
    throw createError({ statusCode: 400, message: 'status должен быть accepted или declined' })
  }

  // Проверяем что это предложение адресовано мне и ещё pending
  const trade = await queryOne<{
    id: string; receiver_id: string; status: string;
    offered_pet_id: string; wanted_pet_id: string;
    sender_id: string;
  }>(
    `SELECT id, receiver_id, status, offered_pet_id, wanted_pet_id, sender_id
     FROM trade_offers WHERE id = $1`,
    [tradeId],
  )

  if (!trade) throw createError({ statusCode: 404, message: 'Предложение не найдено' })
  if (trade.receiver_id !== myId) throw createError({ statusCode: 403, message: 'Нет доступа' })
  if (trade.status !== 'pending') {
    throw createError({ statusCode: 409, message: 'Предложение уже обработано' })
  }

  // Обновляем статус
  await queryOne(
    `UPDATE trade_offers SET status = $1, responded_at = now() WHERE id = $2`,
    [body.status, tradeId],
  )

  // Если принято — меняем фигурки в коллекциях
  if (body.status === 'accepted') {
    // Удаляем offered_pet у отправителя, добавляем к получателю
    await queryOne(
      'DELETE FROM collection_items WHERE user_id = $1 AND pet_id = $2',
      [trade.sender_id, trade.offered_pet_id],
    )
    await queryOne(
      `INSERT INTO collection_items (user_id, pet_id)
       VALUES ($1, $2)
       ON CONFLICT (user_id, pet_id) DO NOTHING`,
      [myId, trade.offered_pet_id],
    )

    // Удаляем wanted_pet у получателя (меня), добавляем отправителю
    await queryOne(
      'DELETE FROM collection_items WHERE user_id = $1 AND pet_id = $2',
      [myId, trade.wanted_pet_id],
    )
    await queryOne(
      `INSERT INTO collection_items (user_id, pet_id)
       VALUES ($1, $2)
       ON CONFLICT (user_id, pet_id) DO NOTHING`,
      [trade.sender_id, trade.wanted_pet_id],
    )
  }

  return { ok: true, status: body.status }
})
