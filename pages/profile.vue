<template>
  <div>
    <!-- Шапка профиля -->
    <div class="profile-header">
      <div class="av-big">{{ initials }}</div>
      <div>
        <div class="profile-name">{{ user.username }}</div>
        <div class="profile-join">
          <i class="ti ti-calendar" /> На сайте с {{ joinDate }}
          <span v-if="user.location" class="country">
            <i class="ti ti-map-pin" /> {{ user.location }}
          </span>
        </div>
        <div v-if="user.bio" class="profile-bio">{{ user.bio }}</div>
      </div>
      <div v-if="isOwnProfile" class="profile-actions">
        <button class="btn btn-soft btn-sm"><i class="ti ti-edit" /> Редактировать</button>
        <button class="btn btn-ghost btn-sm" @click="auth.logout()"><i class="ti ti-logout" /> Выйти</button>
      </div>
    </div>

    <!-- Статистика -->
    <div class="stats-row">
      <div class="pstat"><div class="pstat-n">{{ collection.length }}</div><div class="pstat-l">в коллекции</div></div>
      <div class="pstat"><div class="pstat-n">{{ wishlist.length }}</div><div class="pstat-l">в вишлисте</div></div>
      <div class="pstat"><div class="pstat-n">{{ uniqGens }}</div><div class="pstat-l">поколений</div></div>
      <div class="pstat"><div class="pstat-n">{{ favGen }}</div><div class="pstat-l">любимое</div></div>
    </div>

    <!-- Вкладки -->
    <div class="tabs">
      <div class="tab" :class="{ on: tab === 'col' }" @click="tab = 'col'">
        Коллекция <span>({{ collection.length }})</span>
      </div>
      <div class="tab" :class="{ on: tab === 'wish' }" @click="tab = 'wish'">
        Вишлист <span>({{ wishlist.length }})</span>
      </div>
    </div>

    <!-- Коллекция -->
    <div v-if="tab === 'col'" class="tab-content">
      <div class="tc-toolbar">
        <div class="search-wrap">
          <i class="ti ti-search" />
          <input v-model="colSearch" type="text" placeholder="Поиск в коллекции...">
        </div>
      </div>
      <div class="col-grid">
        <div v-for="item in filteredCol" :key="item.id" class="col-card">
          <div class="col-img fig tint-lav"><span class="glyph">🐾</span></div>
          <div class="col-body">
            <div class="col-num">#{{ String(item.pet.number).padStart(4,'0') }}</div>
            <div class="col-name">{{ item.pet.name }}</div>
            <div v-if="item.note" class="col-note">«{{ item.note }}»</div>
            <div class="col-foot">
              <span v-if="item.condition" class="cond" :class="`cond-${item.condition}`">
                {{ condLabel[item.condition] }}
              </span>
              <div v-if="isOwnProfile" class="own-actions">
                <span class="oa" title="Редактировать"><i class="ti ti-edit" /></span>
                <span class="oa oa-d" title="Удалить" @click="removeFromCol(item.id)"><i class="ti ti-trash" /></span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Вишлист -->
    <div v-if="tab === 'wish'" class="tab-content">
      <div class="wish-grid">
        <div v-for="item in wishlist" :key="item.id" class="wish-card">
          <div class="wish-img fig tint-butter"><span class="glyph">🐾</span></div>
          <div class="wish-body">
            <div class="wish-num">#{{ String(item.pet.number).padStart(4,'0') }}</div>
            <div class="wish-name">{{ item.pet.name }}</div>
            <div class="wish-foot">
              <span class="wish-gen">{{ item.pet.genLabel }} · {{ item.pet.moldName }}</span>
              <button v-if="isOwnProfile" class="move-btn" @click="moveToCol(item)">
                <i class="ti ti-arrow-right" /> В коллекцию
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
definePageMeta({ middleware: 'auth' })

const auth = useAuthStore()
const tab = ref<'col'|'wish'>('col')
const colSearch = ref('')

const user = computed(() => auth.user!)
const isOwnProfile = computed(() => true) // TODO: поддержка чужого профиля через /users/:id

const initials = computed(() => user.value.username.slice(0, 2).toUpperCase())
const joinDate = computed(() => new Date(user.value.createdAt ?? '').toLocaleDateString('ru-RU', { month: 'long', year: 'numeric' }))

const condLabel: Record<string, string> = { mint: 'Отличное', good: 'Хорошее', fair: 'Удовлетворительное', poor: 'Плохое' }

// Коллекция
const { data: colData, refresh: refreshCol } = await useFetch('/api/collection')
const collection = computed(() => colData.value ?? [])

const filteredCol = computed(() =>
  colSearch.value
    ? collection.value.filter((i: any) => i.pet.name.toLowerCase().includes(colSearch.value.toLowerCase()))
    : collection.value
)

async function removeFromCol(id: string) {
  await $fetch(`/api/collection/${id}`, { method: 'DELETE' })
  refreshCol()
}

// Вишлист
const { data: wishData, refresh: refreshWish } = await useFetch('/api/wishlist')
const wishlist = computed(() => wishData.value ?? [])

async function moveToCol(item: any) {
  await $fetch('/api/collection', { method: 'POST', body: { petId: item.pet.id } })
  await $fetch(`/api/wishlist/${item.id}`, { method: 'DELETE' })
  refreshCol()
  refreshWish()
}

// Статистика
const uniqGens = computed(() => new Set(collection.value.map((i: any) => i.pet.generation.number)).size)
const favGen = computed(() => {
  const counts: Record<string, number> = {}
  collection.value.forEach((i: any) => { const l = i.pet.generation.label; counts[l] = (counts[l] || 0) + 1 })
  return Object.entries(counts).sort((a,b) => b[1]-a[1])[0]?.[0] ?? '—'
})
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
  @include avatar-base(70px, 24px);
  @include font-display(24px);
  background: linear-gradient(150deg, $brand-tint, $brand-tint-2);
  border: 2px solid $brand-line;
  color: $brand;
  box-shadow: $sh-sm;
}

.profile-name { @include font-display(21px); color: $ink; margin-bottom: 4px; }
.profile-join { font-size: 12.5px; color: $ink-3; margin-bottom: 9px; @include flex-row(5px); font-weight: 600; }
.profile-bio  { font-size: 13.5px; color: $ink-2; line-height: 1.55; }
.profile-actions { @include flex-row(0); flex-direction: column; gap: 7px; flex-shrink: 0; }
.country { color: $brand; }

.stats-row {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  border-bottom: 1px solid $line;
  background: $bg-sunken;
}

.pstat {
  padding: 16px 12px;
  text-align: center;
  border-right: 1px solid $line;
  &:last-child { border-right: none; }

  &-n { @include font-display(21px); color: $brand; }
  &-l { font-size: 11.5px; color: $ink-2; margin-top: 3px; font-weight: 600; }
}

.tab-content { padding: 18px 22px; }
.tc-toolbar  { @include flex-row(9px); margin-bottom: 15px; }

.col-grid, .wish-grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 13px; }

.col-card, .wish-card { @include card; }
.col-img, .wish-img   { height: 82px; .glyph { font-size: 30px; } }
.col-body, .wish-body { padding: 10px 12px 11px; }
.col-num, .wish-num   { font-size: 10.5px; color: $ink-3; font-weight: 700; }
.col-name, .wish-name { @include font-display(13.5px, 600); margin-top: 1px; }
.col-note { font-size: 11px; color: $ink-2; margin-top: 4px; font-style: italic; line-height: 1.4; }
.col-foot, .wish-foot { @include flex-row(0, space-between); margin-top: 9px; }

.cond {
  font-size: 9.5px; font-weight: 700; padding: 3px 8px; border-radius: $r-pill;
  &-mint { background: #eaf3de; color: #3b6d11; }
  &-good { background: $gold-tint; color: $gold-ink; }
}

.own-actions { @include flex-row(3px); }
.oa {
  font-size: 15px; color: $ink-3; cursor: pointer;
  padding: 3px; border-radius: 6px; transition: .14s;
  &:hover { background: $bg-inset; color: $ink; }
  &-d:hover { color: $danger; background: $danger-tint; }
}

.wish-gen { font-size: 11px; color: $ink-2; font-weight: 600; }
.move-btn {
  font-size: 10.5px; font-weight: 700; padding: 4px 9px;
  border-radius: $r-pill; border: 1px solid $success-line;
  color: $success; background: $success-tint; cursor: pointer;
  @include flex-row(3px); font-family: $font-body;
  &:hover { filter: brightness(.97); }
}
</style>
