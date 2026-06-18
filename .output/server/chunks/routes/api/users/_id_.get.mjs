import { c as defineEventHandler, h as getRouterParam, e as createError } from '../../../_/nitro.mjs';
import { q as queryOne, a as query } from '../../../_/client.mjs';
import 'node:http';
import 'node:https';
import 'node:events';
import 'node:buffer';
import 'node:fs';
import 'node:path';
import 'node:crypto';
import 'node:url';
import 'pg';

const _id__get = defineEventHandler(async (event) => {
  var _a;
  const id = getRouterParam(event, "id");
  const user = await queryOne(
    `SELECT
       u.id, u.username, u.bio, u.location, u.avatar_url, u.created_at,
       COUNT(DISTINCT ci.id) AS collection_count,
       COUNT(DISTINCT wi.id) AS wishlist_count
     FROM users u
     LEFT JOIN collection_items ci ON ci.user_id = u.id
     LEFT JOIN wishlist_items   wi ON wi.user_id = u.id
     WHERE u.id = $1
     GROUP BY u.id`,
    [id]
  );
  if (!user) throw createError({ statusCode: 404, message: "\u041F\u043E\u043B\u044C\u0437\u043E\u0432\u0430\u0442\u0435\u043B\u044C \u043D\u0435 \u043D\u0430\u0439\u0434\u0435\u043D" });
  const gens = await query(
    `SELECT DISTINCT g.number AS gen_number
     FROM collection_items ci
     JOIN pets p        ON p.id = ci.pet_id
     JOIN generations g ON g.id = p.generation_id
     WHERE ci.user_id = $1
     ORDER BY g.number`,
    [id]
  );
  return {
    id: user.id,
    username: user.username,
    bio: user.bio,
    location: user.location,
    avatarUrl: (_a = user.avatar_url) != null ? _a : "/images/avatars/default_avatar.svg",
    createdAt: user.created_at,
    collectionCount: Number(user.collection_count),
    wishlistCount: Number(user.wishlist_count),
    generations: gens.map((g) => g.gen_number)
  };
});

export { _id__get as default };
//# sourceMappingURL=_id_.get.mjs.map
