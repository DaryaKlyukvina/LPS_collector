// server/api/auth/logout.post.ts
// POST /api/auth/logout — сбросить httpOnly куку на сервере
export default defineEventHandler((event) => {
  deleteCookie(event, 'auth_token', {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    path: '/',
  })
  return { ok: true }
})
