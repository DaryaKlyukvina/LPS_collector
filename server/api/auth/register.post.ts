// server/api/auth/register.post.ts
import { query, queryOne } from '~/server/db/client'
import { hashPassword, createToken } from '~/server/utils/auth'
import type { RegisterPayload } from '~/types'

export default defineEventHandler(async (event) => {
  const body = await readBody<RegisterPayload>(event)

  if (!body?.username || !body?.email || !body?.password) {
    throw createError({ statusCode: 400, message: 'Все поля обязательны' })
  }

  if (body.password.length < 8) {
    throw createError({ statusCode: 400, message: 'Пароль должен быть не менее 8 символов' })
  }

  // Проверка уникальности
  const existing = await queryOne(
    'SELECT id FROM users WHERE email = $1 OR username = $2',
    [body.email.toLowerCase(), body.username],
  )
  if (existing) {
    throw createError({ statusCode: 409, message: 'Пользователь с таким email или именем уже существует' })
  }

  const hash = hashPassword(body.password)

  const rows = await query<{ id: string; username: string; email: string; role: string; bio: string | null; location: string | null; avatar_url: string | null; created_at: string }>(
    `INSERT INTO users (username, email, password_hash, role)
     VALUES ($1, $2, $3, 'user')
     RETURNING id, username, email, role, bio, location, avatar_url, created_at`,
    [body.username, body.email.toLowerCase(), hash],
  )

  const user = rows[0]
  const token = createToken(user.id, user.role as any)

  setCookie(event, 'auth_token', token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    maxAge: 60 * 60 * 24 * 7,
    path: '/',
  })

  return { token, user }
})
