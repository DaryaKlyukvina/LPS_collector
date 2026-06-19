<template>
  <div class="pawed">
    <div class="screen">
      <nav>
        <NuxtLink class="logo" to="/">
          <span class="mark"><i class="ti ti-paw-filled" /></span>
          LPS коллекционер
        </NuxtLink>

        <div class="nav-links">
          <NuxtLink to="/catalog">Каталог</NuxtLink>
          <NuxtLink v-if="auth.isLoggedIn" to="/profile">Моя коллекция</NuxtLink>
          <NuxtLink v-if="auth.isLoggedIn" to="/chat">Сообщения</NuxtLink>
        </div>

        <div class="nav-right">
          <template v-if="auth.isLoggedIn">
            <NuxtLink v-if="auth.isAdmin" to="/admin" class="btn btn-soft btn-sm">
              <i class="ti ti-shield" /> Админ
            </NuxtLink>
            <NuxtLink to="/profile" class="avatar-link">
              <img
                class="avatar"
                :src="auth.user?.avatar_url ?? '/images/avatars/default_avatar.svg'"
                :alt="auth.user?.username"
              >
            </NuxtLink>
          </template>
          <template v-else>
            <NuxtLink class="btn btn-ghost btn-sm" to="/auth/login">Войти</NuxtLink>
            <NuxtLink class="btn btn-primary btn-sm" to="/auth/register">Регистрация</NuxtLink>
          </template>
        </div>
      </nav>

      <slot />

      <footer>
        <div class="footer-l">
          <i class="ti ti-paw-filled" style="color:var(--brand-line)" />
          © 2026 LPS коллекционер
        </div>
        <div class="footer-r">
          <NuxtLink to="/">Главная</NuxtLink>
          <NuxtLink to="/catalog">Каталог</NuxtLink>
        </div>
      </footer>
    </div>
  </div>
</template>

<script setup lang="ts">
const auth = useAuthStore()
</script>

<style lang="scss">
.avatar-link { display: inline-flex; }
.avatar {
  width: 32px; height: 32px;
  border-radius: $r-pill;
  object-fit: cover;
  border: 1px solid $brand-line;
  cursor: pointer;
  transition: .14s;
  &:hover { border-color: $brand; box-shadow: 0 0 0 2px $brand-tint; }
}
</style>
