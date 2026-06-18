import { c as defineEventHandler, r as readBody, e as createError, i as setResponseStatus } from '../../_/nitro.mjs';
import { q as queryOne, a as query } from '../../_/client.mjs';
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

const index_post = defineEventHandler(async (event) => {
  var _a;
  const { sub: myId } = requireAuth(event);
  const body = await readBody(event);
  const required = ["receiverId", "offeredPetId", "wantedPetId"];
  for (const f of required) {
    if (!(body == null ? void 0 : body[f])) {
      throw createError({ statusCode: 400, message: `\u041F\u043E\u043B\u0435 ${f} \u043E\u0431\u044F\u0437\u0430\u0442\u0435\u043B\u044C\u043D\u043E` });
    }
  }
  if (myId === body.receiverId) {
    throw createError({ statusCode: 400, message: "\u041D\u0435\u043B\u044C\u0437\u044F \u043F\u0440\u0435\u0434\u043B\u043E\u0436\u0438\u0442\u044C \u043E\u0431\u043C\u0435\u043D \u0441\u0430\u043C\u043E\u043C\u0443 \u0441\u0435\u0431\u0435" });
  }
  const ownsPet = await queryOne(
    "SELECT id FROM collection_items WHERE user_id = $1 AND pet_id = $2",
    [myId, body.offeredPetId]
  );
  if (!ownsPet) {
    throw createError({ statusCode: 400, message: "\u041F\u0440\u0435\u0434\u043B\u0430\u0433\u0430\u0435\u043C\u0430\u044F \u0444\u0438\u0433\u0443\u0440\u043A\u0430 \u043D\u0435 \u0432 \u0432\u0430\u0448\u0435\u0439 \u043A\u043E\u043B\u043B\u0435\u043A\u0446\u0438\u0438" });
  }
  const [u1, u2] = [myId, body.receiverId].sort();
  let conv = await queryOne(
    "SELECT id FROM conversations WHERE user_1_id = $1 AND user_2_id = $2",
    [u1, u2]
  );
  if (!conv) {
    const rows = await query(
      "INSERT INTO conversations (user_1_id, user_2_id) VALUES ($1,$2) RETURNING id",
      [u1, u2]
    );
    conv = rows[0];
  }
  const msgRows = await query(
    `INSERT INTO messages (conversation_id, sender_id, body)
     VALUES ($1, $2, NULL)
     RETURNING id, created_at`,
    [conv.id, myId]
  );
  const msgId = msgRows[0].id;
  const tradeRows = await query(
    `INSERT INTO trade_offers
       (message_id, sender_id, receiver_id, offered_pet_id, wanted_pet_id, note)
     VALUES ($1,$2,$3,$4,$5,$6)
     RETURNING id`,
    [msgId, myId, body.receiverId, body.offeredPetId, body.wantedPetId, (_a = body.note) != null ? _a : null]
  );
  setResponseStatus(event, 201);
  return {
    tradeId: tradeRows[0].id,
    messageId: msgId,
    createdAt: msgRows[0].created_at
  };
});

export { index_post as default };
//# sourceMappingURL=index.post4.mjs.map
