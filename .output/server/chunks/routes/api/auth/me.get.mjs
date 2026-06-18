import { c as defineEventHandler, e as createError } from '../../../_/nitro.mjs';
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

const me_get = defineEventHandler(async (event) => {
  const payload = requireAuth(event);
  const user = await queryOne(
    "SELECT id, username, email, role, bio, location, created_at FROM users WHERE id = $1",
    [payload.sub]
  );
  if (!user) throw createError({ statusCode: 404, message: "\u041F\u043E\u043B\u044C\u0437\u043E\u0432\u0430\u0442\u0435\u043B\u044C \u043D\u0435 \u043D\u0430\u0439\u0434\u0435\u043D" });
  return user;
});

export { me_get as default };
//# sourceMappingURL=me.get.mjs.map
