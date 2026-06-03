// server/api/users/index.get.ts  — только admin
import { query } from '~/server/db/client'
import { requireRole } from '~/server/utils/auth'

export default defineEventHandler(async (event) => {
  requireRole(event, 'admin')

  const rows = await query(
    `SELECT
       u.id, u.username, u.email, u.role, u.created_at,
       COUNT(ci.id) AS collection_count
     FROM users u
     LEFT JOIN collection_items ci ON ci.user_id = u.id
     GROUP BY u.id
     ORDER BY u.created_at DESC`,
  )

  return rows.map(r => ({
    id: r.id, username: r.username, email: r.email,
    role: r.role, createdAt: r.created_at,
    collectionCount: Number(r.collection_count),
  }))
})
