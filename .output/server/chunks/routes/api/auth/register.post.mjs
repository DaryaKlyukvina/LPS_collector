import { c as defineEventHandler, r as readBody, e as createError, f as setCookie } from '../../../_/nitro.mjs';
import { q as queryOne, a as query } from '../../../_/client.mjs';
import { h as hashPassword, c as createToken } from '../../../_/auth.mjs';
import 'node:http';
import 'node:https';
import 'node:events';
import 'node:buffer';
import 'node:fs';
import 'node:path';
import 'node:crypto';
import 'node:url';
import 'pg';

const register_post = defineEventHandler(async (event) => {
  const body = await readBody(event);
  if (!(body == null ? void 0 : body.username) || !(body == null ? void 0 : body.email) || !(body == null ? void 0 : body.password)) {
    throw createError({ statusCode: 400, message: "\u0412\u0441\u0435 \u043F\u043E\u043B\u044F \u043E\u0431\u044F\u0437\u0430\u0442\u0435\u043B\u044C\u043D\u044B" });
  }
  if (body.password.length < 8) {
    throw createError({ statusCode: 400, message: "\u041F\u0430\u0440\u043E\u043B\u044C \u0434\u043E\u043B\u0436\u0435\u043D \u0431\u044B\u0442\u044C \u043D\u0435 \u043C\u0435\u043D\u0435\u0435 8 \u0441\u0438\u043C\u0432\u043E\u043B\u043E\u0432" });
  }
  const existing = await queryOne(
    "SELECT id FROM users WHERE email = $1 OR username = $2",
    [body.email.toLowerCase(), body.username]
  );
  if (existing) {
    throw createError({ statusCode: 409, message: "\u041F\u043E\u043B\u044C\u0437\u043E\u0432\u0430\u0442\u0435\u043B\u044C \u0441 \u0442\u0430\u043A\u0438\u043C email \u0438\u043B\u0438 \u0438\u043C\u0435\u043D\u0435\u043C \u0443\u0436\u0435 \u0441\u0443\u0449\u0435\u0441\u0442\u0432\u0443\u0435\u0442" });
  }
  const hash = hashPassword(body.password);
  const rows = await query(
    `INSERT INTO users (username, email, password_hash, role)
     VALUES ($1, $2, $3, 'user')
     RETURNING id, username, email, role`,
    [body.username, body.email.toLowerCase(), hash]
  );
  const user = rows[0];
  const token = createToken(user.id, user.role);
  setCookie(event, "auth_token", token, {
    httpOnly: true,
    secure: true,
    sameSite: "lax",
    maxAge: 60 * 60 * 24 * 7,
    path: "/"
  });
  return { token, user };
});

export { register_post as default };
//# sourceMappingURL=register.post.mjs.map
