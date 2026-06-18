import { e as createError, u as useRuntimeConfig, k as getHeader, l as getCookie } from './nitro.mjs';
import { randomBytes, scryptSync, createHmac, timingSafeEqual } from 'node:crypto';

function hashPassword(password) {
  const salt = randomBytes(16).toString("hex");
  const hash = scryptSync(password, salt, 64).toString("hex");
  return `${salt}:${hash}`;
}
function verifyPassword(password, stored) {
  const [salt, hash] = stored.split(":");
  const derived = scryptSync(password, salt, 64);
  const storedBuf = Buffer.from(hash, "hex");
  return timingSafeEqual(derived, storedBuf);
}
function b64url(str) {
  return Buffer.from(str).toString("base64").replace(/\+/g, "-").replace(/\//g, "_").replace(/=/g, "");
}
function sign(payload, secret, expiresInSeconds = 60 * 60 * 24 * 7) {
  const header = b64url(JSON.stringify({ alg: "HS256", typ: "JWT" }));
  const body = b64url(JSON.stringify({
    ...payload,
    iat: Math.floor(Date.now() / 1e3),
    exp: Math.floor(Date.now() / 1e3) + expiresInSeconds
  }));
  const sig = createHmac("sha256", secret).update(`${header}.${body}`).digest("base64url");
  return `${header}.${body}.${sig}`;
}
function verify(token, secret) {
  const [header, body, sig] = token.split(".");
  const expected = createHmac("sha256", secret).update(`${header}.${body}`).digest("base64url");
  if (expected !== sig) throw new Error("\u041D\u0435\u0434\u0435\u0439\u0441\u0442\u0432\u0438\u0442\u0435\u043B\u044C\u043D\u0430\u044F \u043F\u043E\u0434\u043F\u0438\u0441\u044C \u0442\u043E\u043A\u0435\u043D\u0430");
  const payload = JSON.parse(Buffer.from(body, "base64url").toString());
  if (payload.exp < Math.floor(Date.now() / 1e3)) throw new Error("\u0422\u043E\u043A\u0435\u043D \u0438\u0441\u0442\u0451\u043A");
  return payload;
}
function createToken(userId, role) {
  const { jwtSecret } = useRuntimeConfig();
  return sign({ sub: userId, role }, jwtSecret);
}
function getTokenPayload(event) {
  var _a, _b;
  try {
    const header = (_a = getHeader(event, "authorization")) != null ? _a : "";
    const token = header.startsWith("Bearer ") ? header.slice(7) : (_b = getCookie(event, "auth_token")) != null ? _b : "";
    if (!token) return null;
    const { jwtSecret } = useRuntimeConfig();
    return verify(token, jwtSecret);
  } catch {
    return null;
  }
}
function requireAuth(event) {
  const payload = getTokenPayload(event);
  if (!payload) throw createError({ statusCode: 401, message: "\u0422\u0440\u0435\u0431\u0443\u0435\u0442\u0441\u044F \u0430\u0432\u0442\u043E\u0440\u0438\u0437\u0430\u0446\u0438\u044F" });
  return payload;
}
function requireRole(event, ...roles) {
  const payload = requireAuth(event);
  if (!roles.includes(payload.role)) {
    throw createError({ statusCode: 403, message: "\u041D\u0435\u0434\u043E\u0441\u0442\u0430\u0442\u043E\u0447\u043D\u043E \u043F\u0440\u0430\u0432" });
  }
  return payload;
}

export { requireRole as a, createToken as c, hashPassword as h, requireAuth as r, verifyPassword as v };
//# sourceMappingURL=auth.mjs.map
