import { c as defineEventHandler, r as readBody, e as createError } from '../../../_/nitro.mjs';
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

const me_patch = defineEventHandler(async (event) => {
  var _a;
  const { sub: userId } = requireAuth(event);
  const body = await readBody(event);
  const fields = [];
  const params = [];
  let pi = 1;
  if (body.bio !== void 0) {
    fields.push(`bio = $${pi}`);
    params.push(body.bio);
    pi++;
  }
  if (body.location !== void 0) {
    fields.push(`location = $${pi}`);
    params.push(body.location);
    pi++;
  }
  if (body.avatarUrl !== void 0) {
    fields.push(`avatar_url = $${pi}`);
    params.push(body.avatarUrl);
    pi++;
  }
  if (!fields.length) throw createError({ statusCode: 400, message: "\u041D\u0435\u0442 \u043F\u043E\u043B\u0435\u0439 \u0434\u043B\u044F \u043E\u0431\u043D\u043E\u0432\u043B\u0435\u043D\u0438\u044F" });
  params.push(userId);
  const updated = await queryOne(
    `UPDATE users SET ${fields.join(", ")} WHERE id = $${pi}
     RETURNING id, username, bio, location, avatar_url`,
    params
  );
  return {
    id: updated.id,
    username: updated.username,
    bio: updated.bio,
    location: updated.location,
    avatarUrl: (_a = updated.avatar_url) != null ? _a : "/images/avatars/default_avatar.svg"
  };
});

export { me_patch as default };
//# sourceMappingURL=me.patch.mjs.map
