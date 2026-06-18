import { c as defineEventHandler, r as readBody, e as createError, i as setResponseStatus } from '../../_/nitro.mjs';
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
  var _a, _b, _c;
  const { sub: userId } = requireRole(event, "admin");
  const body = await readBody(event);
  if (!(body == null ? void 0 : body.petId) || !(body == null ? void 0 : body.url)) {
    throw createError({ statusCode: 400, message: "petId \u0438 url \u043E\u0431\u044F\u0437\u0430\u0442\u0435\u043B\u044C\u043D\u044B" });
  }
  if (body.isPrimary) {
    await query(
      "UPDATE pet_images SET is_primary = FALSE WHERE pet_id = $1",
      [body.petId]
    );
    await query("UPDATE pets SET image_url = $1 WHERE id = $2", [body.url, body.petId]);
  }
  const rows = await query(
    `INSERT INTO pet_images (pet_id, url, alt, is_primary, sort_order, uploaded_by)
     VALUES ($1, $2, $3, $4, $5, $6)
     RETURNING id`,
    [body.petId, body.url, (_a = body.alt) != null ? _a : null, (_b = body.isPrimary) != null ? _b : false, (_c = body.sortOrder) != null ? _c : 0, userId]
  );
  setResponseStatus(event, 201);
  return { id: rows[0].id };
});

export { index_post as default };
//# sourceMappingURL=index.post2.mjs.map
