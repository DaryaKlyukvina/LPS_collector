// server/api/admin/stats.get.ts — сводная статистика для админки (только admin)
import { queryOne } from '~/server/db/client'
import { requireRole } from '~/server/utils/auth'

export default defineEventHandler(async (event) => {
  requireRole(event, 'admin')

  const row = await queryOne<{
    pets_total: string;  pets_week: string;
    users_total: string; users_week: string;
    trades_done: string; trades_done_week: string;
    trades_pending: string;
  }>(`
    SELECT
      (SELECT COUNT(*) FROM pets)  AS pets_total,
      (SELECT COUNT(*) FROM pets  WHERE created_at >= now() - interval '7 days') AS pets_week,
      (SELECT COUNT(*) FROM users) AS users_total,
      (SELECT COUNT(*) FROM users WHERE created_at >= now() - interval '7 days') AS users_week,
      (SELECT COUNT(*) FROM trade_offers WHERE status = 'accepted') AS trades_done,
      (SELECT COUNT(*) FROM trade_offers WHERE status = 'accepted'
              AND created_at >= now() - interval '7 days') AS trades_done_week,
      (SELECT COUNT(*) FROM trade_offers WHERE status = 'pending') AS trades_pending
  `)

  return {
    petsTotal:      Number(row?.pets_total ?? 0),
    petsWeek:       Number(row?.pets_week ?? 0),
    usersTotal:     Number(row?.users_total ?? 0),
    usersWeek:      Number(row?.users_week ?? 0),
    tradesDone:     Number(row?.trades_done ?? 0),
    tradesDoneWeek: Number(row?.trades_done_week ?? 0),
    tradesPending:  Number(row?.trades_pending ?? 0),
  }
})
