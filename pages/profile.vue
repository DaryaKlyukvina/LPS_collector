<template>
  <div>
    <!-- Шапка профиля -->
    <div class="profile-header">
      <img
        class="av-big"
        :src="user.avatar_url ?? '/images/avatars/default_avatar.svg'"
        :alt="user.username"
      >
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
      <div class="profile-actions">
        <button class="btn btn-soft btn-sm" @click="showEdit = true">
          <i class="ti ti-edit" /> Редактировать
        </button>
        <button class="btn btn-ghost btn-sm" @click="auth.logout()">
          <i class="ti ti-logout" /> Выйти
        </button>
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
          <NuxtLink class="col-link" :to="`/pets/${item.pet.id}`">
            <div class="col-img fig" :class="`tint-${speciesTint(item.pet)}`">
              <img :src="item.pet.imageUrl ?? '/images/placeholders/pet_thumb.svg'" :alt="item.pet.name">
            </div>
            <div class="col-body">
              <div class="col-num">#{{ String(item.pet.number).padStart(4,'0') }}</div>
              <div class="col-name">{{ item.pet.name }}</div>
              <div v-if="item.note" class="col-note">«{{ item.note }}»</div>
              <div class="col-foot">
                <span v-if="item.pet.releaseType" class="rar" :class="item.pet.releaseType.isExclusive ? 'rar-exclusive' : 'rar-common'">
                  {{ item.pet.releaseType.label }}
                </span>
                <span class="oa" title="Редактировать заметку" @click.prevent="editNote(item)">
                  <i class="ti ti-edit" />
                </span>
              </div>
            </div>
          </NuxtLink>
          <button class="remove-btn" @click="removeFromCol(item.id)">
            <i class="ti ti-x" /> Убрать из коллекции
          </button>
        </div>
      </div>
    </div>

    <!-- Вишлист -->
    <div v-if="tab === 'wish'" class="tab-content">
      <div class="wish-grid">
        <div v-for="item in wishlist" :key="item.id" class="wish-card">
          <NuxtLink class="wish-link" :to="`/pets/${item.pet.id}`">
            <div class="wish-img fig" :class="`tint-${speciesTint(item.pet)}`">
              <img :src="item.pet.imageUrl ?? '/images/placeholders/pet_thumb.svg'" :alt="item.pet.name">
            </div>
            <div class="wish-body">
              <div class="wish-num">#{{ String(item.pet.number).padStart(4,'0') }}</div>
              <div class="wish-name">{{ item.pet.name }}</div>
              <div class="wish-gen">{{ item.pet.genLabel }} · {{ item.pet.moldName }}</div>
            </div>
          </NuxtLink>
          <button class="move-btn" @click="moveToCol(item)">
            <i class="ti ti-arrow-right" /> В коллекцию
          </button>
        </div>
      </div>
    </div>

    <!-- Модалка редактирования профиля -->
    <div class="modal-overlay" :class="{ open: showEdit }" @click.self="showEdit = false">
      <div class="modal" style="max-width:420px">
        <div class="modal-head">
          <div class="mh-ic"><i class="ti ti-user" /></div>
          <div class="mh-tt">
            <div class="modal-title">Редактировать профиль</div>
          </div>
          <button class="modal-close" @click="showEdit = false"><i class="ti ti-x" /></button>
        </div>
        <div class="modal-body">
          <div class="edit-field">
            <label>Город / страна</label>
            <input v-model="editData.location" type="text" placeholder="Москва, Россия">
          </div>
          <div class="edit-field">
            <label>О себе</label>
            <textarea v-model="editData.bio" rows="3" placeholder="Расскажи о своей коллекции..."></textarea>
          </div>
        </div>
        <div class="modal-foot">
          <button class="btn btn-ghost" @click="showEdit = false">Отмена</button>
          <button class="btn btn-primary" style="margin-left:auto" @click="saveProfile">
            <i class="ti ti-check" /> Сохранить
          </button>
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
const showEdit = ref(false)

const user = computed(() => auth.user!)
const joinDate = computed(() =>
  new Date(user.value.created_at ?? '').toLocaleDateString('ru-RU', { month: 'long', year: 'numeric' })
)

const SPECIES_TINTS: Record<string, string> = {
  'Собака': 'lav', 'Кошка': 'mint', 'Кролик': 'peach',
  'Ёж': 'butter', 'Хомяк': 'pink', 'Лягушка': 'sky',
}
function speciesTint(pet: any) {
  return SPECIES_TINTS[pet.mold?.species ?? pet.moldSpecies ?? ''] ?? 'lav'
}

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

function editNote(item: any) {
  const note = prompt('Заметка к фигурке:', item.note ?? '')
  if (note !== null) {
    $fetch(`/api/collection/${item.id}`, { method: 'PATCH', body: { note } }).then(() => refreshCol())
  }
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
const uniqGens = computed(() => new Set(collection.value.map((i: any) => i.pet.generation?.number)).size)
const favGen = computed(() => {
  const counts: Record<string, number> = {}
  collection.value.forEach((i: any) => {
    const l = i.pet.generation?.label
    if (l) counts[l] = (counts[l] || 0) + 1
  })
  return Object.entries(counts).sort((a, b) => b[1] - a[1])[0]?.[0] ?? '—'
})

// Редактирование профиля
const editData = reactive({ bio: user.value.bio ?? '', location: user.value.location ?? '' })
watch(showEdit, (v) => {
  if (v) { editData.bio = user.value.bio ?? ''; editData.location = user.value.location ?? '' }
})

async function saveProfile() {
  await auth.updateProfile({ bio: editData.bio, location: editData.location })
  showEdit.value = false
}
</script>

<style lang="scss">
.profile-header {
  display: grid; grid-template-columns: auto 1fr auto;
  gap: 18px; align-items: start; padding: 22px; border-bottom: 1px solid $line;
}
.av-big {
  width: 70px; height: 70px; border-radius: $r-pill; object-fit: cover;
  border: 2px solid $brand-line; box-shadow: $sh-sm; flex-shrink: 0;
}
.profile-name { @include font-display(21px); color: $ink; margin-bottom: 4px; }
.profile-join { font-size: 12.5px; color: $ink-3; margin-bottom: 9px; @include flex-row(5px); font-weight: 600; }
.profile-bio  { font-size: 13.5px; color: $ink-2; line-height: 1.55; }
.profile-actions { display: flex; flex-direction: column; gap: 7px; flex-shrink: 0; }
.country { color: $brand; }

.stats-row {
  display: grid; grid-template-columns: repeat(4, 1fr);
  border-bottom: 1px solid $line; background: $bg-sunken;
}
.pstat {
  padding: 16px 12px; text-align: center; border-right: 1px solid $line;
  &:last-child { border-right: none; }
  &-n { @include font-display(21px); color: $brand; }
  &-l { font-size: 11.5px; color: $ink-2; margin-top: 3px; font-weight: 600; }
}

.tab-content { padding: 18px 22px; }
.tc-toolbar  { @include flex-row(9px); margin-bottom: 15px; }

.col-grid, .wish-grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 13px; }

// Карточка теперь не сама ссылка — внутри неё ссылка + кнопка под ней
.col-card, .wish-card {
  @include card;
  display: flex;
  flex-direction: column;
  overflow: hidden;
}

.col-link, .wish-link { text-decoration: none; color: inherit; display: block; }

.col-img, .wish-img   { height: 82px; overflow: hidden; img { width: 100%; height: 100%; object-fit: contain; padding: 4px; } }
.col-body, .wish-body { padding: 10px 12px 11px; }
.col-num, .wish-num   { font-size: 10.5px; color: $ink-3; font-weight: 700; }
.col-name, .wish-name { @include font-display(13.5px, 600); margin-top: 1px; }
.col-note { font-size: 11px; color: $ink-2; margin-top: 4px; font-style: italic; line-height: 1.4; }
.col-foot { @include flex-row(0, space-between); margin-top: 9px; }
.wish-gen { font-size: 11px; color: $ink-2; font-weight: 600; margin-top: 3px; }

.oa {
  font-size: 15px; color: $ink-3; cursor: pointer; padding: 3px; border-radius: 6px; transition: .14s;
  &:hover { background: $bg-inset; color: $ink; }
}

// Кнопка «Убрать из коллекции» — полноразмерная, во всю ширину карточки
.remove-btn {
  width: 100%;
  font-size: 11.5px; font-weight: 700;
  padding: 8px 9px;
  border: none;
  border-top: 1px solid $line;
  border-radius: 0;
  color: $danger; background: $danger-tint;
  cursor: pointer;
  @include flex-center(5px);
  font-family: $font-body;
  transition: .14s;

  &:hover { filter: brightness(0.96); }
}

// Кнопка «В коллекцию» из вишлиста — тот же принцип, зелёная
.move-btn {
  width: 100%;
  font-size: 11.5px; font-weight: 700;
  padding: 8px 9px;
  border: none;
  border-top: 1px solid $line;
  border-radius: 0;
  color: $success; background: $success-tint;
  cursor: pointer;
  @include flex-center(5px);
  font-family: $font-body;
  transition: .14s;

  &:hover { filter: brightness(.97); }
}

.edit-field {
  margin-bottom: 14px;
  label { display: block; font-size: 12px; color: $ink-2; margin-bottom: 6px; font-weight: 700; }
  input, textarea { @include input-base; }
  textarea { resize: vertical; }
}

.modal-overlay {
  position: fixed; inset: 0; background: rgba(36,31,24,.42); backdrop-filter: blur(2px);
  display: none; align-items: center; justify-content: center; z-index: 50; padding: 24px;
  &.open { display: flex; }
}
.modal {
  background: $bg-card; border-radius: $r-xl; box-shadow: $sh-lg;
  width: 100%; max-height: 88vh; display: flex; flex-direction: column;
  overflow: hidden; border: 1px solid $line;
}
.modal-head { @include flex-row(10px); padding: 16px 20px; border-bottom: 1px solid $line; }
.mh-ic { width: 34px; height: 34px; border-radius: 10px; background: $brand-tint; color: $brand; display: grid; place-items: center; font-size: 18px; flex-shrink: 0; }
.mh-tt { flex: 1; }
.modal-title { @include font-display(16px, 700); color: $ink; }
.modal-close { width: 32px; height: 32px; border-radius: $r-sm; display: grid; place-items: center; cursor: pointer; color: $ink-3; font-size: 20px; border: none; background: transparent; }
.modal-body { padding: 16px 20px; overflow-y: auto; }
.modal-foot { @include flex-row(10px); padding: 14px 20px; border-top: 1px solid $line; background: $bg-sunken; }
</style>
