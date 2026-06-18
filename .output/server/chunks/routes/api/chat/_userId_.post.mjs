import { c as defineEventHandler, h as getRouterParam, r as readBody, e as createError, i as setResponseStatus } from '../../../_/nitro.mjs';
import { q as queryOne, a as query } from '../../../_/client.mjs';
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

const _userId__post = defineEventHandler(async (event) => {
  var _a, _b, _c, _d;
  const { sub: myId } = requireAuth(event);
  const partnerId = getRouterParam(event, "userId");
  const body = await readBody(event);
  if (myId === partnerId) {
    throw createError({ statusCode: 400, message: "\u041D\u0435\u043B\u044C\u0437\u044F \u043D\u0430\u043F\u0438\u0441\u0430\u0442\u044C \u0441\u0430\u043C\u043E\u043C\u0443 \u0441\u0435\u0431\u0435" });
  }
  if (!((_a = body == null ? void 0 : body.body) == null ? void 0 : _a.trim()) && !(body == null ? void 0 : body.petId)) {
    throw createError({ statusCode: 400, message: "\u0421\u043E\u043E\u0431\u0449\u0435\u043D\u0438\u0435 \u043D\u0435 \u043C\u043E\u0436\u0435\u0442 \u0431\u044B\u0442\u044C \u043F\u0443\u0441\u0442\u044B\u043C" });
  }
  const [u1, u2] = [myId, partnerId].sort();
  let conv = await queryOne(
    "SELECT id FROM conversations WHERE user_1_id = $1 AND user_2_id = $2",
    [u1, u2]
  );
  if (!conv) {
    const rows2 = await query(
      "INSERT INTO conversations (user_1_id, user_2_id) VALUES ($1,$2) RETURNING id",
      [u1, u2]
    );
    conv = rows2[0];
  }
  const rows = await query(
    `INSERT INTO messages (conversation_id, sender_id, body, pet_id)
     VALUES ($1, $2, $3, $4)
     RETURNING id, created_at`,
    [conv.id, myId, (_c = (_b = body.body) == null ? void 0 : _b.trim()) != null ? _c : null, (_d = body.petId) != null ? _d : null]
  );
  setResponseStatus(event, 201);
  return { id: rows[0].id, createdAt: rows[0].created_at };
});

export { _userId__post as default };
//# sourceMappingURL=_userId_.post.mjs.map
