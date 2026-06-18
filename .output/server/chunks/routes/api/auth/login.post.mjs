import { c as defineEventHandler, r as readBody, e as createError, f as setCookie } from '../../../_/nitro.mjs';
import { q as queryOne } from '../../../_/client.mjs';
import { v as verifyPassword, c as createToken } from '../../../_/auth.mjs';
import 'node:http';
import 'node:https';
import 'node:events';
import 'node:buffer';
import 'node:fs';
import 'node:path';
import 'node:crypto';
import 'node:url';
import 'pg';

const login_post = defineEventHandler(async (event) => {
  const body = await readBody(event);
  if (!(body == null ? void 0 : body.email) || !(body == null ? void 0 : body.password)) {
    throw createError({ statusCode: 400, message: "Email \u0438 \u043F\u0430\u0440\u043E\u043B\u044C \u043E\u0431\u044F\u0437\u0430\u0442\u0435\u043B\u044C\u043D\u044B" });
  }
  const user = await queryOne(
    "SELECT id, username, email, password_hash, role, bio, location FROM users WHERE email = $1",
    [body.email.toLowerCase()]
  );
  if (!user || !verifyPassword(body.password, user.password_hash)) {
    throw createError({ statusCode: 401, message: "\u041D\u0435\u0432\u0435\u0440\u043D\u044B\u0439 email \u0438\u043B\u0438 \u043F\u0430\u0440\u043E\u043B\u044C" });
  }
  const token = createToken(user.id, user.role);
  setCookie(event, "auth_token", token, {
    httpOnly: true,
    secure: true,
    sameSite: "lax",
    maxAge: 60 * 60 * 24 * 7,
    // 7 дней
    path: "/"
  });
  return {
    token,
    user: {
      id: user.id,
      username: user.username,
      email: user.email,
      role: user.role,
      bio: user.bio,
      location: user.location
    }
  };
});

export { login_post as default };
//# sourceMappingURL=login.post.mjs.map
