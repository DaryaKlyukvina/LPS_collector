<template>
  <body class="pawed">
    <div class="screen">
      <nav>
        <NuxtLink class="logo" to="/">
          <span class="mark"><i class="ti ti-paw-filled" /></span>
          LPS коллекционер
        </NuxtLink>

        <div class="nav-links">
          <NuxtLink to="/catalog">Каталог</NuxtLink>
          <NuxtLink v-if="auth.isLoggedIn" to="/profile">Моя коллекция</NuxtLink>
          <NuxtLink to="/about">О проекте</NuxtLink>
        </div>

        <div class="nav-right">
          <template v-if="auth.isLoggedIn">
            <NuxtLink v-if="auth.isAdmin" to="/admin" class="btn btn-soft btn-sm">
              <i class="ti ti-shield" /> Админ
            </NuxtLink>
            <button class="avatar" @click="auth.logout()">
              {{ initials }}
            </button>
          </template>
          <template v-else>
            <NuxtLink class="btn btn-ghost btn-sm" to="/auth">Войти</NuxtLink>
            <NuxtLink class="btn btn-primary btn-sm" to="/auth">Регистрация</NuxtLink>
          </template>
        </div>
      </nav>

      <slot />

      <footer>
        <div class="footer-l">© 2025 LPS коллекционер</div>
        <div class="footer-r">
          <NuxtLink to="/about">О проекте</NuxtLink>
          <NuxtLink to="#">Контакты</NuxtLink>
          <NuxtLink to="#">Конфиденциальность</NuxtLink>
        </div>
      </footer>
    </div>
  </body>
</template>

<script setup lang="ts">
const auth = useAuthStore()
const initials = computed(() =>
  auth.user?.username.slice(0, 2).toUpperCase() ?? '?'
)
</script>
