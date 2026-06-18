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
  const payload = requireAuth(event);
  const body = await readBody(event);
  if (!(body == null ? void 0 : body.petId)) throw createError({ statusCode: 400, message: "petId \u043E\u0431\u044F\u0437\u0430\u0442\u0435\u043B\u0435\u043D" });
  const rows = await query(
    `INSERT INTO wishlist_items (user_id, pet_id)
     VALUES ($1, $2)
     ON CONFLICT (user_id, pet_id) DO NOTHING
     RETURNING id`,
    [payload.sub, body.petId]
  );
  if (!rows.length) throw createError({ statusCode: 409, message: "\u0423\u0436\u0435 \u0432 \u0432\u0438\u0448\u043B\u0438\u0441\u0442\u0435" });
  setResponseStatus(event, 201);
  return { id: rows[0].id };
});

export { index_post as default };
//# sourceMappingURL=index.post5.mjs.map
