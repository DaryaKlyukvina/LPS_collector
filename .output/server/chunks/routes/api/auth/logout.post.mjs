import { c as defineEventHandler, g as deleteCookie } from '../../../_/nitro.mjs';
import 'node:http';
import 'node:https';
import 'node:events';
import 'node:buffer';
import 'node:fs';
import 'node:path';
import 'node:crypto';
import 'node:url';

const logout_post = defineEventHandler((event) => {
  deleteCookie(event, "auth_token", {
    httpOnly: true,
    secure: true,
    sameSite: "lax",
    path: "/"
  });
  return { ok: true };
});

export { logout_post as default };
//# sourceMappingURL=logout.post.mjs.map
