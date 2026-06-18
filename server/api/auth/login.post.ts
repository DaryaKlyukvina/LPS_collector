// server/api/auth/login.post.ts
import { queryOne } from '~/server/db/client'
import { verifyPassword, createToken } from '~/server/utils/auth'
import type { LoginPayload } from '~/types'

export default defineEventHandler(async (event) => {
  const body = await readBody<LoginPayload>(event)

  if (!body?.email || !body?.password) {
    throw createError({ statusCode: 400, message: 'Email и пароль обязательны' })
  }
  // Debug: log incoming email
  console.log('[auth/login] attempt for email:', body.email)

  const user = await queryOne<{
    id: string; username: string; email: string;
    password_hash: string; role: string; bio: string | null; location: string | null
  }>(
    'SELECT id, username, email, password_hash, role, bio, location FROM users WHERE email = $1',
    [body.email.toLowerCase()],
  )

  // Debug: show whether user found and hash length
  console.log('[auth/login] user found:', !!user, 'email:', user?.email, 'hash_len:', user?.password_hash?.length)

  if (!user || !verifyPassword(body.password, user.password_hash)) {
    throw createError({ statusCode: 401, message: 'Неверный email или пароль' })
  }

  const token = createToken(user.id, user.role as any)

  // Устанавливаем httpOnly cookie
  setCookie(event, 'auth_token', token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    maxAge: 60 * 60 * 24 * 7, // 7 дней
    path: '/',
  })

  return {
    token,
    user: {
      id: user.id,
      username: user.username,
      email: user.email,
      role: user.role,
      bio: user.bio,
      location: user.location,
    },
  }
})
