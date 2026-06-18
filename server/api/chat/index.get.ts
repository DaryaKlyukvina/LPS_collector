// server/api/chat/index.get.ts
// GET /api/chat — список диалогов текущего пользователя
import { query } from '~/server/db/client'
import { requireAuth } from '~/server/utils/auth'

export default defineEventHandler(async (event) => {
  const { sub: userId } = requireAuth(event)

  // Для каждого диалога берём собеседника, последнее сообщение,
  // количество непрочитанных (от собеседника)
  const rows = await query(
    `SELECT
       c.id,
       c.created_at,
       -- собеседник
       u.id         AS partner_id,
       u.username   AS partner_username,
       u.avatar_url AS partner_avatar,
       -- последнее сообщение
       m.id         AS last_msg_id,
       m.body       AS last_msg_body,
       m.sender_id  AS last_msg_sender,
       m.created_at AS last_msg_at,
       -- непрочитанные (от собеседника, не прочитанные мной)
       (
         SELECT COUNT(*) FROM messages
         WHERE conversation_id = c.id
           AND sender_id != $1
           AND is_read = FALSE
       ) AS unread_count
     FROM conversations c
     JOIN users u ON u.id = CASE
       WHEN c.user_1_id = $1 THEN c.user_2_id
       ELSE c.user_1_id
     END
     LEFT JOIN LATERAL (
       SELECT id, body, sender_id, created_at
       FROM messages
       WHERE conversation_id = c.id
       ORDER BY created_at DESC
       LIMIT 1
     ) m ON TRUE
     WHERE c.user_1_id = $1 OR c.user_2_id = $1
     ORDER BY COALESCE(m.created_at, c.created_at) DESC`,
    [userId],
  )

  return rows.map(r => ({
    id: r.id,
    createdAt: r.created_at,
    partner: {
      id: r.partner_id,
      username: r.partner_username,
      avatarUrl: r.partner_avatar ?? '/images/avatars/default_avatar.svg',
    },
    lastMessage: r.last_msg_id ? {
      id: r.last_msg_id,
      body: r.last_msg_body,
      isMine: r.last_msg_sender === userId,
      createdAt: r.last_msg_at,
    } : null,
    unreadCount: Number(r.unread_count),
  }))
})
