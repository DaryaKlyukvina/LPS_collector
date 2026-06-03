// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  devtools: { enabled: true },

  modules: [
    '@pinia/nuxt',
  ],

  css: ['~/assets/scss/main.scss'],

  vite: {
    css: {
      preprocessorOptions: {
        scss: {
          // Глобально подключаем переменные и миксины во все компоненты
          additionalData: `@use "~/assets/scss/_vars" as *; @use "~/assets/scss/_mixins" as *;`,
        },
      },
    },
  },

  runtimeConfig: {
    // Серверные переменные (не попадают в клиент)
    jwtSecret: process.env.JWT_SECRET || 'CHANGE_ME_IN_PRODUCTION',
    dbUrl: process.env.DATABASE_URL || 'postgresql://lps_user:lps_pass@localhost:5432/lps_db',
    // Публичные переменные (доступны на клиенте)
    public: {
      appName: 'LPS Коллекционер',
    },
  },

  nitro: {
    // Nitro обрабатывает server/api/** как REST endpoints
  },

  compatibilityDate: '2024-11-01',
})
