<template>
  <div class="admin-layout">
    <!-- Сайдбар -->
    <aside class="admin-sidebar">
      <div
        v-for="item in menuItems" :key="item.key"
        class="sb-item" :class="{ on: section === item.key }"
        @click="section = item.key"
      >
        <i :class="`ti ${item.icon}`" /> {{ item.label }}
      </div>
      <div class="sb-sep" />
      <div class="sb-item" @click="auth.logout()">
        <i class="ti ti-logout" /> Выйти
      </div>
    </aside>

    <!-- Контент -->
    <main class="admin-main">

      <!-- Обзор -->
      <template v-if="section === 'overview'">
        <h1>Обзор</h1>
        <div class="stat-cards">
          <div v-for="s in stats" :key="s.label" class="sc">
            <div class="sc-l">{{ s.label }}</div>
            <div class="sc-n">{{ s.value }}</div>
            <div class="sc-d" :class="s.trend > 0 ? 'up' : 'dn'">
              <i :class="`ti ti-arrow-${s.trend > 0 ? 'up' : 'down'}`" /> {{ s.sub }}
            </div>
          </div>
        </div>
      </template>

      <!-- Фигурки -->
      <template v-if="section === 'pets'">
        <div class="section-t">
          Фигурки
          <button class="btn btn-primary btn-sm"><i class="ti ti-plus" /> Добавить</button>
        </div>
        <table class="tbl">
          <thead><tr><th>Фигурка</th><th>Поколение</th><th>Молд</th><th>Редкость</th><th></th></tr></thead>
          <tbody>
            <tr v-for="pet in petsData?.items" :key="pet.id">
              <td>
                <div class="pet-icon fig tint-lav"><span class="glyph">🐾</span></div>
                <span>#{{ pet.number }} {{ pet.name }}</span>
              </td>
              <td>{{ pet.generation.label }}</td>
              <td>{{ pet.mold.name }}</td>
              <td><span class="rar" :class="`rar-${pet.rarity}`">{{ pet.rarity }}</span></td>
              <td>
                <div class="row-act">
                  <span class="ract"><i class="ti ti-edit" /></span>
                  <span class="ract ract-d" @click="deletePet(pet.id)"><i class="ti ti-trash" /></span>
                </div>
              </td>
            </tr>
          </tbody>
        </table>
      </template>

      <!-- Пользователи -->
      <template v-if="section === 'users'">
        <div class="section-t">Пользователи</div>
        <table class="tbl">
          <thead><tr><th>Пользователь</th><th>Роль</th><th>Коллекция</th><th>Дата</th><th></th></tr></thead>
          <tbody>
            <tr v-for="u in usersData" :key="u.id">
              <td>
                <div class="uname">@{{ u.username }}</div>
                <div class="uemail">{{ u.email }}</div>
              </td>
              <td>
                <span class="role-pill" :class="`r-${u.role}`">{{ u.role }}</span>
              </td>
              <td>{{ u.collectionCount }} фиг.</td>
              <td class="muted">{{ new Date(u.createdAt).toLocaleDateString('ru-RU') }}</td>
              <td>
                <div class="row-act">
                  <span class="ract" title="Сменить роль" @click="toggleRole(u)"><i class="ti ti-shield" /></span>
                  <span class="ract ract-d" @click="deleteUser(u.id)"><i class="ti ti-trash" /></span>
                </div>
              </td>
            </tr>
          </tbody>
        </table>
      </template>

    </main>
  </div>
</template>

<script setup lang="ts">
definePageMeta({ middleware: 'admin' })

const auth = useAuthStore()
const section = ref<'overview'|'pets'|'users'|'moderation'>('overview')

const menuItems = [
  { key: 'overview',   icon: 'ti-chart-bar', label: 'Обзор' },
  { key: 'pets',       icon: 'ti-heart',     label: 'Фигурки' },
  { key: 'users',      icon: 'ti-users',     label: 'Пользователи' },
  { key: 'moderation', icon: 'ti-shield',    label: 'Модерация' },
]

const stats = [
  { label: 'Фигурок в базе',       value: '3 214', trend: 1, sub: '+12 за неделю' },
  { label: 'Пользователей',        value: '847',   trend: 1, sub: '+23 за неделю' },
  { label: 'Записей в коллекциях', value: '18 402',trend: 1, sub: '+341 за неделю' },
  { label: 'На модерации',         value: '4',     trend: -1,sub: 'Требует внимания' },
]

const { data: petsData }  = await useFetch('/api/pets', { query: { limit: 20 } })
const { data: usersData, refresh: refreshUsers } = await useFetch('/api/users')

async function deletePet(id: string) {
  if (!confirm('Удалить фигурку?')) return
  await $fetch(`/api/pets/${id}`, { method: 'DELETE' })
  refreshNuxtData()
}

async function deleteUser(id: string) {
  if (!confirm('Удалить пользователя?')) return
  await $fetch(`/api/users/${id}`, { method: 'DELETE' })
  refreshUsers()
}

async function toggleRole(u: any) {
  const newRole = u.role === 'admin' ? 'user' : 'admin'
  await $fetch(`/api/users/${u.id}`, { method: 'PATCH', body: { role: newRole } })
  refreshUsers()
}
</script>

<style lang="scss">
.admin-layout { display: grid; grid-template-columns: 182px 1fr; }

.admin-sidebar {
  border-right: 1px solid $line;
  padding: 14px 0;
  min-height: 580px;
  background: $bg-sunken;
}

.sb-item {
  @include flex-row(10px);
  padding: 10px 18px;
  font-size: 13.5px;
  font-weight: 700;
  color: $ink-2;
  cursor: pointer;
  border-left: 3px solid transparent;
  transition: .14s;

  &:hover { color: $ink; background: $bg-inset; }
  &.on    { background: $brand-tint; color: $brand-deep; border-left-color: $brand; }
  i { font-size: 18px; }
}

.sb-sep { height: 1px; background: $line; margin: 10px 14px; }

.admin-main { padding: 22px; }
.admin-main h1 { @include font-display(19px, 600); color: $ink; margin-bottom: 16px; }

.stat-cards {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 11px;
  margin-bottom: 22px;
}

.sc {
  background: $bg-card;
  border: 1px solid $line;
  border-radius: $r-md;
  padding: 15px;
  box-shadow: $sh-sm;

  &-l { font-size: 11.5px; color: $ink-2; margin-bottom: 6px; font-weight: 600; }
  &-n { @include font-display(23px); color: $ink; }
  &-d { font-size: 10.5px; margin-top: 5px; font-weight: 700; @include flex-row(3px); }
  &-d.up { color: $success; }
  &-d.dn { color: $danger; }
}

.section-t {
  @include section-head;
  @include flex-row(8px, space-between);
  margin-bottom: 12px;
}

.pet-icon { width: 36px; height: 36px; border-radius: $r-sm; .glyph { font-size: 18px; } }
.uname    { font-weight: 700; color: $ink; }
.uemail   { font-size: 10.5px; color: $ink-3; font-weight: 600; }

.row-act { @include flex-row(4px); }
.ract {
  font-size: 15px; color: $ink-3; cursor: pointer;
  padding: 4px; border-radius: 6px; transition: .14s;
  &:hover       { background: $bg-inset; color: $ink; }
  &-d:hover     { color: $danger; background: $danger-tint; }
  &-ok:hover    { color: $success; background: $success-tint; }
}
</style>
