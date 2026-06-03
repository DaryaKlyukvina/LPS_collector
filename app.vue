<template>
  <NuxtRouteAnnouncer />
  <NuxtLayout>
    <NuxtPage />
  </NuxtLayout>
</template>

<script setup lang="ts">
// При каждом запуске приложения пробуем получить текущего пользователя
// (работает если кука auth_token жива)
const auth = useAuthStore()
await callOnce(auth.fetchMe)
</script>
