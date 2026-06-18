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
  const pet = await queryOne("SELECT id FROM pets WHERE id = $1", [id]);
  if (!pet) throw createError({ statusCode: 404, message: "\u0424\u0438\u0433\u0443\u0440\u043A\u0430 \u043D\u0435 \u043D\u0430\u0439\u0434\u0435\u043D\u0430" });
  const fields = [];
  const params = [];
  let pi = 1;
  const allowed = [
    ["name", "name"],
    ["moldId", "mold_id"],
    ["generationId", "generation_id"],
    ["releaseTypeId", "release_type_id"],
    ["hasFlocking", "has_flocking"],
    ["hasMagnet", "has_magnet"],
    ["hasGlitter", "has_glitter"],
    ["colorScheme", "color_scheme"],
    ["imageUrl", "image_url"],
    ["description", "description"]
  ];
  for (const [jsKey, dbCol] of allowed) {
    if (body[jsKey] !== void 0) {
      fields.push(`${dbCol} = $${pi}`);
      params.push(body[jsKey]);
      pi++;
    }
  }
  if (!fields.length) {
    throw createError({ statusCode: 400, message: "\u041D\u0435\u0442 \u043F\u043E\u043B\u0435\u0439 \u0434\u043B\u044F \u043E\u0431\u043D\u043E\u0432\u043B\u0435\u043D\u0438\u044F" });
  }
  params.push(id);
  await queryOne(
    `UPDATE pets SET ${fields.join(", ")} WHERE id = $${pi}`,
    params
  );
  return { ok: true };
});

export { _id__patch as default };
//# sourceMappingURL=_id_.patch.mjs.map
