import { c as defineEventHandler, h as getRouterParam, e as createError } from '../../../_/nitro.mjs';
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

const _id__delete = defineEventHandler(async (event) => {
  const adminPayload = requireRole(event, "admin");
  const id = getRouterParam(event, "id");
  if (id === adminPayload.sub) {
    throw createError({ statusCode: 400, message: "\u041D\u0435\u043B\u044C\u0437\u044F \u0443\u0434\u0430\u043B\u0438\u0442\u044C \u0441\u0430\u043C\u043E\u0433\u043E \u0441\u0435\u0431\u044F" });
  }
  const user = await queryOne("SELECT id FROM users WHERE id = $1", [id]);
  if (!user) throw createError({ statusCode: 404, message: "\u041F\u043E\u043B\u044C\u0437\u043E\u0432\u0430\u0442\u0435\u043B\u044C \u043D\u0435 \u043D\u0430\u0439\u0434\u0435\u043D" });
  await queryOne("DELETE FROM users WHERE id = $1", [id]);
  return { ok: true };
});

export { _id__delete as default };
//# sourceMappingURL=_id_.delete.mjs.map
