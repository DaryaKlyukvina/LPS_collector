// stores/auth.ts
import { defineStore } from 'pinia'
import type { User, LoginPayload, RegisterPayload } from '~/types'

export const useAuthStore = defineStore('auth', () => {
  const user  = ref<User | null>(null)
  const token = ref<string | null>(null)

  const isLoggedIn = computed(() => !!user.value)
  const isAdmin    = computed(() => user.value?.role === 'admin')
  const isGuest    = computed(() => !user.value)

  async function login(payload: LoginPayload) {
    const data = await $fetch<{ token: string; user: User }>('/api/auth/login', {
      method: 'POST', body: payload,
    })
    user.value  = data.user
    token.value = data.token
    return data.user
  }

  async function register(payload: RegisterPayload) {
    const data = await $fetch<{ token: string; user: User }>('/api/auth/register', {
      method: 'POST', body: payload,
    })
    user.value  = data.user
    token.value = data.token
    return data.user
  }

  async function fetchMe() {
    try {
      user.value = await $fetch<User>('/api/auth/me')
    } catch {
      user.value  = null
      token.value = null
    }
  }

  async function logout() {
    // Сбрасываем куку на сервере
    await $fetch('/api/auth/logout', { method: 'POST' }).catch(() => {})
    user.value  = null
    token.value = null
    navigateTo('/')
  }

  async function updateProfile(data: { bio?: string; location?: string; avatar_url?: string }) {
    const updated = await $fetch<User>('/api/users/me', { method: 'PATCH', body: data })
    if (user.value) Object.assign(user.value, updated)
    return updated
  }

  return { user, token, isLoggedIn, isAdmin, isGuest, login, register, fetchMe, logout, updateProfile }
})
