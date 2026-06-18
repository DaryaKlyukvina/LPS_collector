import { c as defineEventHandler } from '../../_/nitro.mjs';
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

const index_get = defineEventHandler(async (event) => {
  requireRole(event, "admin");
  const rows = await query(
    `SELECT
       u.id, u.username, u.email, u.role, u.created_at,
       COUNT(ci.id) AS collection_count
     FROM users u
     LEFT JOIN collection_items ci ON ci.user_id = u.id
     GROUP BY u.id
     ORDER BY u.created_at DESC`
  );
  return rows.map((r) => ({
    id: r.id,
    username: r.username,
    email: r.email,
    role: r.role,
    createdAt: r.created_at,
    collectionCount: Number(r.collection_count)
  }));
});

export { index_get as default };
//# sourceMappingURL=index.get4.mjs.map
