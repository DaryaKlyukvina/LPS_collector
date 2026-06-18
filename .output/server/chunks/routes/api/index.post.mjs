import { c as defineEventHandler, r as readBody, e as createError, i as setResponseStatus } from '../../_/nitro.mjs';
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

const index_post = defineEventHandler(async (event) => {
  var _a, _b;
  const payload = requireAuth(event);
  const body = await readBody(event);
  if (!(body == null ? void 0 : body.petId)) throw createError({ statusCode: 400, message: "petId \u043E\u0431\u044F\u0437\u0430\u0442\u0435\u043B\u0435\u043D" });
  const rows = await query(
    `INSERT INTO collection_items (user_id, pet_id, note, condition)
     VALUES ($1, $2, $3, $4)
     ON CONFLICT (user_id, pet_id) DO NOTHING
     RETURNING id`,
    [payload.sub, body.petId, (_a = body.note) != null ? _a : null, (_b = body.condition) != null ? _b : null]
  );
  if (!rows.length) {
    throw createError({ statusCode: 409, message: "\u0424\u0438\u0433\u0443\u0440\u043A\u0430 \u0443\u0436\u0435 \u0435\u0441\u0442\u044C \u0432 \u043A\u043E\u043B\u043B\u0435\u043A\u0446\u0438\u0438" });
  }
  setResponseStatus(event, 201);
  return { id: rows[0].id };
});

export { index_post as default };
//# sourceMappingURL=index.post.mjs.map
