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
  var _a;
  requireRole(event, "admin");
  const id = getRouterParam(event, "id");
  const img = await queryOne(
    "SELECT id, is_primary, pet_id FROM pet_images WHERE id = $1",
    [id]
  );
  if (!img) throw createError({ statusCode: 404, message: "\u0418\u0437\u043E\u0431\u0440\u0430\u0436\u0435\u043D\u0438\u0435 \u043D\u0435 \u043D\u0430\u0439\u0434\u0435\u043D\u043E" });
  await queryOne("DELETE FROM pet_images WHERE id = $1", [id]);
  if (img.is_primary) {
    const next = await queryOne(
      "SELECT url FROM pet_images WHERE pet_id = $1 ORDER BY sort_order ASC LIMIT 1",
      [img.pet_id]
    );
    await queryOne(
      "UPDATE pets SET image_url = $1 WHERE id = $2",
      [(_a = next == null ? void 0 : next.url) != null ? _a : null, img.pet_id]
    );
    if (next) {
      await queryOne(
        "UPDATE pet_images SET is_primary = TRUE WHERE url = $1 AND pet_id = $2",
        [next.url, img.pet_id]
      );
    }
  }
  return { ok: true };
});

export { _id__delete as default };
//# sourceMappingURL=_id_.delete.mjs.map
