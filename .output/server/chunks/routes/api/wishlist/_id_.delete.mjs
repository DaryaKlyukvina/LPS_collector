import { c as defineEventHandler, h as getRouterParam, e as createError } from '../../../_/nitro.mjs';
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

const _id__delete = defineEventHandler(async (event) => {
  const payload = requireAuth(event);
  const id = getRouterParam(event, "id");
  const item = await queryOne(
    "SELECT id FROM wishlist_items WHERE id = $1 AND user_id = $2",
    [id, payload.sub]
  );
  if (!item) throw createError({ statusCode: 404, message: "\u0417\u0430\u043F\u0438\u0441\u044C \u043D\u0435 \u043D\u0430\u0439\u0434\u0435\u043D\u0430" });
  await queryOne("DELETE FROM wishlist_items WHERE id = $1", [id]);
  return { ok: true };
});

export { _id__delete as default };
//# sourceMappingURL=_id_.delete.mjs.map
