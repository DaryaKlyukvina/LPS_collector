import { c as defineEventHandler, r as readBody, e as createError } from '../../_/nitro.mjs';
import { a as query } from '../../_/client.mjs';
import { a as requireRole } from '../../_/auth.mjs';
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
  var _a, _b, _c, _d, _e, _f, _g;
  const payload = requireRole(event, "admin");
  const body = await readBody(event);
  const required = ["number", "name", "moldId", "generationId"];
  for (const field of required) {
    if (!(body == null ? void 0 : body[field])) throw createError({ statusCode: 400, message: `\u041F\u043E\u043B\u0435 ${field} \u043E\u0431\u044F\u0437\u0430\u0442\u0435\u043B\u044C\u043D\u043E` });
  }
  const rows = await query(
    `INSERT INTO pets (number, name, mold_id, generation_id, release_type_id,
       has_flocking, has_magnet, has_glitter, color_scheme, image_url, description, created_by)
     VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12)
     RETURNING id`,
    [
      body.number,
      body.name,
      body.moldId,
      body.generationId,
      (_a = body.releaseTypeId) != null ? _a : null,
      (_b = body.hasFlocking) != null ? _b : false,
      (_c = body.hasMagnet) != null ? _c : false,
      (_d = body.hasGlitter) != null ? _d : false,
      (_e = body.colorScheme) != null ? _e : null,
      (_f = body.imageUrl) != null ? _f : null,
      (_g = body.description) != null ? _g : null,
      payload.sub
    ]
  );
  return { id: rows[0].id };
});

export { index_post as default };
//# sourceMappingURL=index.post3.mjs.map
