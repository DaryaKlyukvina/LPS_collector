// stores/auth.ts
import { defineStore } from 'pinia'
import type { User, LoginPayload, RegisterPayload } from '~/types'

export const useAuthStore = defineStore('auth', () => {
  const user = ref<User | null>(null)
  const token = ref<string | null>(null)

  const isLoggedIn = computed(() => !!user.value)
  const isAdmin    = computed(() => user.value?.role === 'admin')
  const isGuest    = computed(() => !user.value)

  async function login(payload: LoginPayload) {
    const data = await $fetch<{ token: string; user: User }>('/api/auth/login', {
      method: 'POST',
      body: payload,
    })
    user.value  = data.user
    token.value = data.token
    return data.user
  }

  async function register(payload: RegisterPayload) {
    const data = await $fetch<{ token: string; user: User }>('/api/auth/register', {
      method: 'POST',
      body: payload,
    })
    user.value  = data.user
    token.value = data.token
    return data.user
  }

  async function fetchMe() {
    try {
      const me = await $fetch<User>('/api/auth/me')
      user.value = me
    } catch {
      user.value  = null
      token.value = null
    }
  }

  function logout() {
    user.value  = null
    token.value = null
    // Куки очищает сервер, здесь просто редирект
    navigateTo('/auth')
  }

  return { user, token, isLoggedIn, isAdmin, isGuest, login, register, fetchMe, logout }
})
