import { c as defineEventHandler } from '../../_/nitro.mjs';
import { a as query } from '../../_/client.mjs';
import { r as requireAuth } from '../../_/auth.mjs';
import 'node:http';
import 'node:https';
import 'node:events';
import 'node:buffer';
import 'node:fs';
import 'node:path';
import 'node:crypto';
import 'node:url';
import 'pg';

const index_get = defineEventHandler(async (event) => {
  const { sub: userId } = requireAuth(event);
  const rows = await query(
    `SELECT
       c.id,
       c.created_at,
       -- \u0441\u043E\u0431\u0435\u0441\u0435\u0434\u043D\u0438\u043A
       u.id         AS partner_id,
       u.username   AS partner_username,
       u.avatar_url AS partner_avatar,
       -- \u043F\u043E\u0441\u043B\u0435\u0434\u043D\u0435\u0435 \u0441\u043E\u043E\u0431\u0449\u0435\u043D\u0438\u0435
       m.id         AS last_msg_id,
       m.body       AS last_msg_body,
       m.sender_id  AS last_msg_sender,
       m.created_at AS last_msg_at,
       -- \u043D\u0435\u043F\u0440\u043E\u0447\u0438\u0442\u0430\u043D\u043D\u044B\u0435 (\u043E\u0442 \u0441\u043E\u0431\u0435\u0441\u0435\u0434\u043D\u0438\u043A\u0430, \u043D\u0435 \u043F\u0440\u043E\u0447\u0438\u0442\u0430\u043D\u043D\u044B\u0435 \u043C\u043D\u043E\u0439)
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
    [userId]
  );
  return rows.map((r) => {
    var _a;
    return {
      id: r.id,
      createdAt: r.created_at,
      partner: {
        id: r.partner_id,
        username: r.partner_username,
        avatarUrl: (_a = r.partner_avatar) != null ? _a : "/images/avatars/default_avatar.svg"
      },
      lastMessage: r.last_msg_id ? {
        id: r.last_msg_id,
        body: r.last_msg_body,
        isMine: r.last_msg_sender === userId,
        createdAt: r.last_msg_at
      } : null,
      unreadCount: Number(r.unread_count)
    };
  });
});

export { index_get as default };
//# sourceMappingURL=index.get.mjs.map
