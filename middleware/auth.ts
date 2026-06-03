// middleware/auth.ts
// Использовать в страницах: definePageMeta({ middleware: 'auth' })
export default defineNuxtRouteMiddleware(() => {
  const auth = useAuthStore()
  if (!auth.isLoggedIn) return navigateTo('/auth')
})
