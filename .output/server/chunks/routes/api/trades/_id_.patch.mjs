import { c as defineEventHandler, h as getRouterParam, r as readBody, e as createError } from '../../../_/nitro.mjs';
import { q as queryOne } from '../../../_/client.mjs';
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

const _id__patch = defineEventHandler(async (event) => {
  const { sub: myId } = requireAuth(event);
  const tradeId = getRouterParam(event, "id");
  const body = await readBody(event);
  if (!["accepted", "declined"].includes(body == null ? void 0 : body.status)) {
    throw createError({ statusCode: 400, message: "status \u0434\u043E\u043B\u0436\u0435\u043D \u0431\u044B\u0442\u044C accepted \u0438\u043B\u0438 declined" });
  }
  const trade = await queryOne(
    `SELECT id, receiver_id, status, offered_pet_id, wanted_pet_id, sender_id
     FROM trade_offers WHERE id = $1`,
    [tradeId]
  );
  if (!trade) throw createError({ statusCode: 404, message: "\u041F\u0440\u0435\u0434\u043B\u043E\u0436\u0435\u043D\u0438\u0435 \u043D\u0435 \u043D\u0430\u0439\u0434\u0435\u043D\u043E" });
  if (trade.receiver_id !== myId) throw createError({ statusCode: 403, message: "\u041D\u0435\u0442 \u0434\u043E\u0441\u0442\u0443\u043F\u0430" });
  if (trade.status !== "pending") {
    throw createError({ statusCode: 409, message: "\u041F\u0440\u0435\u0434\u043B\u043E\u0436\u0435\u043D\u0438\u0435 \u0443\u0436\u0435 \u043E\u0431\u0440\u0430\u0431\u043E\u0442\u0430\u043D\u043E" });
  }
  await queryOne(
    `UPDATE trade_offers SET status = $1, responded_at = now() WHERE id = $2`,
    [body.status, tradeId]
  );
  if (body.status === "accepted") {
    await queryOne(
      "DELETE FROM collection_items WHERE user_id = $1 AND pet_id = $2",
      [trade.sender_id, trade.offered_pet_id]
    );
    await queryOne(
      `INSERT INTO collection_items (user_id, pet_id)
       VALUES ($1, $2)
       ON CONFLICT (user_id, pet_id) DO NOTHING`,
      [myId, trade.offered_pet_id]
    );
    await queryOne(
      "DELETE FROM collection_items WHERE user_id = $1 AND pet_id = $2",
      [myId, trade.wanted_pet_id]
    );
    await queryOne(
      `INSERT INTO collection_items (user_id, pet_id)
       VALUES ($1, $2)
       ON CONFLICT (user_id, pet_id) DO NOTHING`,
      [trade.sender_id, trade.wanted_pet_id]
    );
  }
  return { ok: true, status: body.status };
});

export { _id__patch as default };
//# sourceMappingURL=_id_.patch.mjs.map
