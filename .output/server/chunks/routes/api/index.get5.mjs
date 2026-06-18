import { c as defineEventHandler } from '../../_/nitro.mjs';
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

const index_get = defineEventHandler(async (event) => {
  const payload = requireAuth(event);
  const rows = await query(
    `SELECT
       wi.id, wi.added_at,
       p.id AS pet_id, p.number, p.name, p.image_url,
       p.release_type_id,
       m.name AS mold_name,
       g.label AS gen_label,
       rt.slug AS release_type_slug, rt.label AS release_type_label, rt.is_exclusive
     FROM wishlist_items wi
     JOIN pets p        ON p.id = wi.pet_id
     JOIN molds m       ON m.id = p.mold_id
     JOIN generations g ON g.id = p.generation_id
     LEFT JOIN release_types rt ON rt.id = p.release_type_id
     WHERE wi.user_id = $1
     ORDER BY wi.added_at DESC`,
    [payload.sub]
  );
  return rows.map((r) => ({
    id: r.id,
    addedAt: r.added_at,
    pet: {
      id: r.pet_id,
      number: r.number,
      name: r.name,
      imageUrl: r.image_url,
      releaseType: r.release_type_id ? { id: r.release_type_id, slug: r.release_type_slug, label: r.release_type_label, isExclusive: r.is_exclusive } : null,
      moldName: r.mold_name,
      genLabel: r.gen_label
    }
  }));
});

export { index_get as default };
//# sourceMappingURL=index.get5.mjs.map
