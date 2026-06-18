import { c as defineEventHandler, h as getRouterParam, e as createError } from '../../../_/nitro.mjs';
import { q as queryOne, a as query } from '../../../_/client.mjs';
import { r as requireAuth } from '../../../_/auth.mjs';
import 'node:http';
import 'node:https';
import 'node:events';
import 'node:buffer';
import 'node:fs';
import 'node:path';
import 'node:crypto';
import 'node:url';
import 'pg';

const _userId__get = defineEventHandler(async (event) => {
  var _a;
  const { sub: myId } = requireAuth(event);
  const partnerId = getRouterParam(event, "userId");
  if (myId === partnerId) {
    throw createError({ statusCode: 400, message: "\u041D\u0435\u043B\u044C\u0437\u044F \u043E\u0442\u043A\u0440\u044B\u0442\u044C \u0434\u0438\u0430\u043B\u043E\u0433 \u0441 \u0441\u043E\u0431\u043E\u0439" });
  }
  const [u1, u2] = [myId, partnerId].sort();
  let conv = await queryOne(
    "SELECT id FROM conversations WHERE user_1_id = $1 AND user_2_id = $2",
    [u1, u2]
  );
  if (!conv) {
    const rows = await query(
      "INSERT INTO conversations (user_1_id, user_2_id) VALUES ($1, $2) RETURNING id",
      [u1, u2]
    );
    conv = rows[0];
  }
  const convId = conv.id;
  await query(
    `UPDATE messages SET is_read = TRUE
     WHERE conversation_id = $1 AND sender_id != $2 AND is_read = FALSE`,
    [convId, myId]
  );
  const messages = await query(
    `SELECT
       m.id, m.body, m.sender_id, m.is_read, m.created_at,
       -- \u043F\u0440\u0438\u043A\u0440\u0435\u043F\u043B\u0451\u043D\u043D\u0430\u044F \u0444\u0438\u0433\u0443\u0440\u043A\u0430
       p.id      AS pet_id,
       p.number  AS pet_number,
       p.name    AS pet_name,
       p.image_url AS pet_image,
       -- \u043F\u0440\u0435\u0434\u043B\u043E\u0436\u0435\u043D\u0438\u0435 \u043E\u0431\u043C\u0435\u043D\u0430 (\u0435\u0441\u043B\u0438 \u0435\u0441\u0442\u044C)
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
    [convId]
  );
  const partner = await queryOne(
    "SELECT id, username, avatar_url FROM users WHERE id = $1",
    [partnerId]
  );
  if (!partner) throw createError({ statusCode: 404, message: "\u041F\u043E\u043B\u044C\u0437\u043E\u0432\u0430\u0442\u0435\u043B\u044C \u043D\u0435 \u043D\u0430\u0439\u0434\u0435\u043D" });
  return {
    conversationId: convId,
    partner: {
      id: partner.id,
      username: partner.username,
      avatarUrl: (_a = partner.avatar_url) != null ? _a : "/images/avatars/default_avatar.svg"
    },
    messages: messages.map((m) => {
      var _a2, _b, _c;
      return {
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
          imageUrl: (_a2 = m.pet_image) != null ? _a2 : "/images/placeholders/pet_thumb.svg"
        } : null,
        // предложение обмена
        trade: m.trade_id ? {
          id: m.trade_id,
          status: m.trade_status,
          note: m.trade_note,
          offeredPet: {
            id: m.offered_id,
            number: m.offered_number,
            name: m.offered_name,
            imageUrl: (_b = m.offered_image) != null ? _b : "/images/placeholders/pet_thumb.svg"
          },
          wantedPet: {
            id: m.wanted_id,
            number: m.wanted_number,
            name: m.wanted_name,
            imageUrl: (_c = m.wanted_image) != null ? _c : "/images/placeholders/pet_thumb.svg"
          }
        } : null
      };
    })
  };
});

export { _userId__get as default };
//# sourceMappingURL=_userId_.get.mjs.map
