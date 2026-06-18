import { c as defineEventHandler, h as getRouterParam, r as readBody, e as createError } from '../../../_/nitro.mjs';
import { q as queryOne } from '../../../_/client.mjs';
import { a as requireRole } from '../../../_/auth.mjs';
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
  requireRole(event, "admin");
  const id = getRouterParam(event, "id");
  const body = await readBody(event);
  if (!["user", "admin"].includes(body == null ? void 0 : body.role)) {
    throw createError({ statusCode: 400, message: "\u0420\u043E\u043B\u044C \u0434\u043E\u043B\u0436\u043D\u0430 \u0431\u044B\u0442\u044C user \u0438\u043B\u0438 admin" });
  }
  const updated = await queryOne(
    "UPDATE users SET role = $1 WHERE id = $2 RETURNING id, username, role",
    [body.role, id]
  );
  if (!updated) throw createError({ statusCode: 404, message: "\u041F\u043E\u043B\u044C\u0437\u043E\u0432\u0430\u0442\u0435\u043B\u044C \u043D\u0435 \u043D\u0430\u0439\u0434\u0435\u043D" });
  return updated;
});

export { _id__patch as default };
//# sourceMappingURL=_id_.patch.mjs.map
