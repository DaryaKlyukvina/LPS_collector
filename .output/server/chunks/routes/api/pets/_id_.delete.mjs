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
  requireRole(event, "admin");
  const id = getRouterParam(event, "id");
  const pet = await queryOne("SELECT id FROM pets WHERE id = $1", [id]);
  if (!pet) throw createError({ statusCode: 404, message: "\u0424\u0438\u0433\u0443\u0440\u043A\u0430 \u043D\u0435 \u043D\u0430\u0439\u0434\u0435\u043D\u0430" });
  await queryOne("DELETE FROM pets WHERE id = $1", [id]);
  return { ok: true };
});

export { _id__delete as default };
//# sourceMappingURL=_id_.delete.mjs.map
