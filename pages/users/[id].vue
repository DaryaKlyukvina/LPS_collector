<template>
  <div v-if="profile">
    <!-- Шапка профиля -->
    <div class="profile-header">
      <img class="av-big" :src="profile.avatarUrl" :alt="profile.username">
      <div class="profile-info">
        <div class="profile-name">@{{ profile.username }}</div>
        <div class="profile-join">
          <i class="ti ti-calendar" /> На сайте с {{ joinDate }}
          <span v-if="profile.location" class="country">
            <i class="ti ti-map-pin" /> {{ profile.location }}
          </span>
        </div>
        <div v-if="profile.bio" class="profile-bio">{{ profile.bio }}</div>
      </div>
      <div class="profile-actions">
        <NuxtLink
          v-if="auth.isLoggedIn && auth.user?.id !== profile.id"
          class="btn btn-primary btn-sm"
          :to="`/chat?with=${profile.id}`"
        >
          <i class="ti ti-message" /> Написать
        </NuxtLink>
      </div>
    </div>

    <!-- Статистика -->
    <div class="stats-row">
      <div class="pstat"><div class="pstat-n">{{ profile.collectionCount }}</div><div class="pstat-l">в коллекции</div></div>
      <div class="pstat"><div class="pstat-n">{{ profile.wishlistCount }}</div><div class="pstat-l">в вишлисте</div></div>
      <div class="pstat"><div class="pstat-n">{{ profile.generations.length }}</div><div class="pstat-l">поколений</div></div>
      <div class="pstat">
        <div class="pstat-n">{{ profile.generations[profile.generations.length - 1] ? `G${profile.generations[profile.generations.length - 1]}` : '—' }}</div>
        <div class="pstat-l">последнее</div>
      </div>
    </div>

    <!-- Вкладки -->
    <div class="tabs">
      <div class="tab" :class="{ on: tab === 'col' }" @click="tab = 'col'">
        Коллекция <span>({{ profile.collectionCount }})</span>
      </div>
    </div>

    <!-- Коллекция -->
    <div class="tab-content">
      <div class="tc-toolbar">
        <div class="search-wrap">
          <i class="ti ti-search" />
          <input v-model="search" type="text" placeholder="Поиск в коллекции...">
        </div>
      </div>

      <div v-if="!filteredCol.length" class="empty-col">
        <i class="ti ti-box" />
        <span>Коллекция пуста</span>
      </div>

      <div class="col-grid">
        <NuxtLink
          v-for="item in filteredCol" :key="item.id"
          class="col-card" :to="`/pets/${item.pet.id}`"
        >
          <div class="col-img fig" :class="`tint-${speciesTint(item.pet)}`">
            <img :src="item.pet.imageUrl" :alt="item.pet.name">
          </div>
          <div class="col-body">
            <div class="col-num">#{{ String(item.pet.number).padStart(4,'0') }}</div>
            <div class="col-name">{{ item.pet.name }}</div>
            <div class="col-sub">{{ item.pet.generation.label }} · {{ item.pet.moldName }}</div>
            <div v-if="item.pet.releaseType" class="col-foot">
              <span class="tag" :class="item.pet.releaseType.isExclusive ? 'tag-gold' : 'tag-brand'" style="font-size:9.5px;padding:2px 7px">
                {{ item.pet.releaseType.label }}
              </span>
            </div>
          </div>
        </NuxtLink>
      </div>
    </div>
  </div>

  <div v-else-if="error" class="page-error">
    <i class="ti ti-mood-sad" />
    <div>Пользователь не найден</div>
    <NuxtLink class="btn btn-ghost" to="/">На главную</NuxtLink>
  </div>
</template>

<script setup lang="ts">
const route = useRoute()
const auth  = useAuthStore()

// Если смотрят свой профиль — редирект на /profile
const { data: profile, error } = await useFetch<any>(`/api/users/${route.params.id}`)

watchEffect(() => {
  if (profile.value && auth.user && profile.value.id === auth.user.id) {
    navigateTo('/profile')
  }
})

const { data: colData } = await useFetch<any[]>(`/api/users/${route.params.id}/collection`)
const collection = computed(() => colData.value ?? [])

const search = ref('')
const filteredCol = computed(() =>
  search.value
    ? collection.value.filter((i: any) =>
        i.pet.name.toLowerCase().includes(search.value.toLowerCase())
      )
    : collection.value
)

const tab = ref('col')

const joinDate = computed(() => {
  if (!profile.value?.createdAt) return ''
  return new Date(profile.value.createdAt).toLocaleDateString('ru-RU', { month: 'long', year: 'numeric' })
})

const SPECIES_TINTS: Record<string, string> = {
  'Собака': 'lav', 'Кошка': 'mint', 'Кролик': 'peach',
  'Ёж': 'butter', 'Хомяк': 'pink', 'Лягушка': 'sky',
}
function speciesTint(pet: any) {
  return SPECIES_TINTS[pet.mold?.species ?? ''] ?? 'lav'
}

useHead({ title: computed(() => profile.value ? `@${profile.value.username} — LPS` : 'LPS') })
</script>

<style lang="scss">
.profile-header {
  display: grid;
  grid-template-columns: auto 1fr auto;
  gap: 18px;
  align-items: start;
  padding: 22px;
  border-bottom: 1px solid $line;
}

.av-big {
  width: 70px; height: 70px;
  border-radius: $r-pill;
  object-fit: cover;
  border: 2px solid $brand-line;
  box-shadow: $sh-sm;
  flex-shrink: 0;
}

.profile-info  { min-width: 0; }
.profile-name  { @include font-display(21px); color: $ink; margin-bottom: 4px; }
.profile-join  { font-size: 12.5px; color: $ink-3; margin-bottom: 9px; @include flex-row(5px); font-weight: 600; }
.profile-bio   { font-size: 13.5px; color: $ink-2; line-height: 1.55; }
.profile-actions { @include flex-row(8px); flex-shrink: 0; }
.country       { color: $brand; }

.stats-row {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  border-bottom: 1px solid $line;
  background: $bg-sunken;
}

.pstat {
  padding: 16px 12px; text-align: center; border-right: 1px solid $line;
  &:last-child { border-right: none; }
  &-n { @include font-display(21px); color: $brand; }
  &-l { font-size: 11.5px; color: $ink-2; margin-top: 3px; font-weight: 600; }
}

.tab-content { padding: 18px 22px; }
.tc-toolbar  { @include flex-row(9px); margin-bottom: 15px; }

.col-grid {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 12px;
}

.col-card { @include card; cursor: pointer; text-decoration: none; color: inherit; }
.col-img  { height: 90px; overflow: hidden; img { width: 100%; height: 100%; object-fit: contain; padding: 6px; } }
.col-body { padding: 9px 11px 11px; }
.col-num  { font-size: 10.5px; color: $ink-3; font-weight: 700; letter-spacing: .02em; }
.col-name { @include font-display(13px, 600); margin-top: 2px; }
.col-sub  { font-size: 11px; color: $ink-2; margin-top: 2px; font-weight: 600; }
.col-foot { margin-top: 7px; }

.empty-col {
  @include flex-center(8px);
  flex-direction: column;
  padding: 48px 20px;
  color: $ink-3;
  i { font-size: 32px; }
  span { font-size: 14px; font-weight: 600; }
}
</style>
