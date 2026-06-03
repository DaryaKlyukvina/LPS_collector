// server/utils/auth.ts
// JWT и хеширование пароля — только на сервере (Nitro)

import { createHmac, randomBytes, scryptSync, timingSafeEqual } from 'node:crypto'
import type { H3Event } from 'h3'
import type { JwtPayload, Role } from '~/types'

// ── Пароли ───────────────────────────────────────────────────

/** Хешируем пароль через scrypt (безопаснее bcrypt при той же простоте) */
export function hashPassword(password: string): string {
  const salt = randomBytes(16).toString('hex')
  const hash = scryptSync(password, salt, 64).toString('hex')
  return `${salt}:${hash}`
}

/** Сравниваем пароль с хешем */
export function verifyPassword(password: string, stored: string): boolean {
  const [salt, hash] = stored.split(':')
  const derived = scryptSync(password, salt, 64)
  const storedBuf = Buffer.from(hash, 'hex')
  return timingSafeEqual(derived, storedBuf)
}

// ── JWT (минимальный, без внешних зависимостей) ──────────────

function b64url(str: string): string {
  return Buffer.from(str)
    .toString('base64')
    .replace(/\+/g, '-').replace(/\//g, '_').replace(/=/g, '')
}

function sign(payload: object, secret: string, expiresInSeconds = 60 * 60 * 24 * 7): string {
  const header = b64url(JSON.stringify({ alg: 'HS256', typ: 'JWT' }))
  const body   = b64url(JSON.stringify({
    ...payload,
    iat: Math.floor(Date.now() / 1000),
    exp: Math.floor(Date.now() / 1000) + expiresInSeconds,
  }))
  const sig = createHmac('sha256', secret)
    .update(`${header}.${body}`)
    .digest('base64url')
  return `${header}.${body}.${sig}`
}

function verify(token: string, secret: string): JwtPayload {
  const [header, body, sig] = token.split('.')
  const expected = createHmac('sha256', secret)
    .update(`${header}.${body}`)
    .digest('base64url')
  if (expected !== sig) throw new Error('Недействительная подпись токена')

  const payload = JSON.parse(Buffer.from(body, 'base64url').toString()) as JwtPayload
  if (payload.exp < Math.floor(Date.now() / 1000)) throw new Error('Токен истёк')
  return payload
}

// ── Публичные хелперы ────────────────────────────────────────

export function createToken(userId: string, role: Role): string {
  const { jwtSecret } = useRuntimeConfig()
  return sign({ sub: userId, role }, jwtSecret)
}

/** Извлекает и верифицирует JWT из заголовка Authorization */
export function getTokenPayload(event: H3Event): JwtPayload | null {
  try {
    const header = getHeader(event, 'authorization') ?? ''
    const token  = header.startsWith('Bearer ') ? header.slice(7) : getCookie(event, 'auth_token') ?? ''
    if (!token) return null
    const { jwtSecret } = useRuntimeConfig()
    return verify(token, jwtSecret)
  } catch {
    return null
  }
}

/** Бросает 401 если не авторизован */
export function requireAuth(event: H3Event): JwtPayload {
  const payload = getTokenPayload(event)
  if (!payload) throw createError({ statusCode: 401, message: 'Требуется авторизация' })
  return payload
}

/** Бросает 403 если роль не совпадает */
export function requireRole(event: H3Event, ...roles: Role[]): JwtPayload {
  const payload = requireAuth(event)
  if (!roles.includes(payload.role)) {
    throw createError({ statusCode: 403, message: 'Недостаточно прав' })
  }
  return payload
}
