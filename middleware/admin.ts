// middleware/admin.ts
// Использовать в страницах: definePageMeta({ middleware: 'admin' })
export default defineNuxtRouteMiddleware(() => {
  const auth = useAuthStore()
  if (!auth.isLoggedIn) return navigateTo('/auth/login')
  if (!auth.isAdmin)    return navigateTo('/')
})
