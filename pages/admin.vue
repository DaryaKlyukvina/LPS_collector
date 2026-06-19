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
            <div class="sc-d" :class="s.trend > 0 ? 'up' : (s.trend < 0 ? 'dn' : 'neutral')">
              <i v-if="s.trend > 0" class="ti ti-arrow-up" />
              <i v-else-if="s.trend < 0" class="ti ti-arrow-down" />
              <i v-else class="ti ti-minus" />
              {{ s.sub }}
            </div>
          </div>
        </div>
      </template>

      <!-- Фигурки -->
      <template v-if="section === 'pets'">
        <div class="section-t">
          Фигурки
          <button class="btn btn-primary btn-sm" @click="openCreatePet"><i class="ti ti-plus" /> Добавить</button>
        </div>
        <table class="tbl">
          <thead><tr><th>Фигурка</th><th>Поколение</th><th>Молд</th><th>Редкость</th><th></th></tr></thead>
          <tbody>
            <tr v-for="pet in petsData?.items" :key="pet.id">
              <td>
                <div class="pet-icon fig tint-lav"><img :src="pet.imageUrl ?? '/images/placeholders/pet_thumb.svg'" :alt="pet.name" style="width:100%;height:100%;object-fit:contain;padding:2px"></div>
                <span>#{{ pet.number }} {{ pet.name }}</span>
              </td>
              <td>{{ pet.generation.label }}</td>
              <td>{{ pet.mold.name }}</td>
              <td><span v-if="pet.releaseType" class="rar" :class="`rar-${pet.releaseType.slug}`">{{ pet.releaseType.label }}</span><span v-else class="rar">—</span></td>
              <td>
                <div class="row-act">
                  <span class="ract" title="Редактировать" @click="openEditPet(pet)"><i class="ti ti-edit" /></span>
                  <span class="ract ract-d" title="Удалить" @click="deletePet(pet.id)"><i class="ti ti-trash" /></span>
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
          <thead><tr><th>Пользователь</th><th>Роль</th><th>Статус</th><th>Коллекция</th><th>Дата</th><th></th></tr></thead>
          <tbody>
            <tr v-for="u in usersData" :key="u.id">
              <td>
                <div class="uname">
                  @{{ u.username }}
                  <span v-if="isProtected(u)" class="owner-badge" title="Главный администратор"><i class="ti ti-crown" /></span>
                </div>
                <div class="uemail">{{ u.email }}</div>
              </td>
              <td>
                <span class="role-pill" :class="`r-${u.role}`">{{ u.role }}</span>
              </td>
              <td>
                <span v-if="u.isBanned" class="ban-pill" :title="u.banReason || 'Без причины'">
                  <i class="ti ti-ban" /> Бан
                </span>
                <span v-else class="ok-pill">Активен</span>
              </td>
              <td>{{ u.collectionCount }} фиг.</td>
              <td class="muted">{{ new Date(u.createdAt).toLocaleDateString('ru-RU') }}</td>
              <td>
                <div v-if="!isProtected(u)" class="row-act">
                  <button class="uact" title="Сменить роль" @click="toggleRole(u)">
                    <i class="ti ti-shield" /> {{ u.role === 'admin' ? 'Снять админа' : 'Сделать админом' }}
                  </button>
                  <button v-if="!u.isBanned" class="uact uact-warn" title="Забанить" @click="openBan(u)">
                    <i class="ti ti-ban" /> Забанить
                  </button>
                  <button v-else class="uact uact-ok" title="Разбанить" @click="unbanUser(u)">
                    <i class="ti ti-lock-open" /> Разбанить
                  </button>
                  <button class="uact uact-danger" title="Удалить" @click="deleteUser(u.id)">
                    <i class="ti ti-trash" /> Удалить
                  </button>
                </div>
                <span v-else class="muted" style="font-size:11px">защищён</span>
              </td>
            </tr>
          </tbody>
        </table>
      </template>

    </main>

    <!-- Модалка фигурки (создание / редактирование) -->
    <div class="modal-overlay" :class="{ open: petModal.open }" @click.self="petModal.open = false">
      <div class="modal" style="max-width:560px">
        <div class="modal-head">
          <div class="mh-ic"><i class="ti ti-heart" /></div>
          <div class="mh-tt">
            <div class="modal-title">{{ petModal.id ? 'Редактировать фигурку' : 'Новая фигурка' }}</div>
          </div>
          <button class="modal-close" @click="petModal.open = false"><i class="ti ti-x" /></button>
        </div>
        <div class="modal-body">
          <div class="form-row2">
            <div class="edit-field">
              <label>Номер <span class="req">*</span></label>
              <input v-model.number="petForm.number" type="number" min="1" :disabled="!!petModal.id" placeholder="3847">
            </div>
            <div class="edit-field">
              <label>Название <span class="req">*</span></label>
              <input v-model="petForm.name" type="text" placeholder="Имя фигурки">
            </div>
          </div>

          <div class="form-row2">
            <div class="edit-field">
              <label>Молд <span class="req">*</span></label>
              <select v-model="petForm.moldId">
                <option value="" disabled>— выберите —</option>
                <option v-for="m in meta?.molds" :key="m.id" :value="m.id">{{ m.name }} · {{ m.species }}</option>
              </select>
            </div>
            <div class="edit-field">
              <label>Поколение <span class="req">*</span></label>
              <select v-model="petForm.generationId">
                <option value="" disabled>— выберите —</option>
                <option v-for="g in meta?.generations" :key="g.id" :value="g.id">{{ g.label }}</option>
              </select>
            </div>
          </div>

          <div class="edit-field">
            <label>Тип релиза (редкость)</label>
            <select v-model="petForm.releaseTypeId">
              <option value="">— не указано —</option>
              <option v-for="rt in meta?.releaseTypes" :key="rt.id" :value="rt.id">{{ rt.label }}</option>
            </select>
          </div>

          <div class="edit-field">
            <label>Ссылка на изображение</label>
            <input v-model="petForm.imageUrl" type="text" placeholder="https://example.com/figurine.png">
          </div>
          <div v-if="petForm.imageUrl" class="img-preview">
            <img :src="petForm.imageUrl" alt="превью" @error="imgError = true" @load="imgError = false">
            <span v-if="imgError" class="img-err"><i class="ti ti-alert-triangle" /> Не удалось загрузить изображение по ссылке</span>
          </div>

          <div class="edit-field">
            <label>Расцветка</label>
            <input v-model="petForm.colorScheme" type="text" placeholder="Напр.: розовый с блёстками">
          </div>

          <div class="edit-field">
            <label>Описание</label>
            <textarea v-model="petForm.description" rows="3" placeholder="Описание фигурки..."></textarea>
          </div>

          <div class="feat-row">
            <label class="feat"><input v-model="petForm.hasFlocking" type="checkbox"> Флокинг</label>
            <label class="feat"><input v-model="petForm.hasMagnet" type="checkbox"> Магнит</label>
            <label class="feat"><input v-model="petForm.hasGlitter" type="checkbox"> Блёстки</label>
          </div>
        </div>
        <div class="modal-foot">
          <button class="btn btn-ghost" @click="petModal.open = false">Отмена</button>
          <button class="btn btn-primary" style="margin-left:auto" :disabled="savingPet" @click="savePet">
            <i class="ti ti-check" /> {{ savingPet ? 'Сохраняем...' : (petModal.id ? 'Сохранить' : 'Добавить') }}
          </button>
        </div>
      </div>
    </div>

    <!-- Модалка бана -->
    <div class="modal-overlay" :class="{ open: banModal.open }" @click.self="banModal.open = false">
      <div class="modal" style="max-width:420px">
        <div class="modal-head">
          <div class="mh-ic" style="background:#fde8e8;color:#c0392b"><i class="ti ti-ban" /></div>
          <div class="mh-tt">
            <div class="modal-title">Забанить пользователя</div>
          </div>
          <button class="modal-close" @click="banModal.open = false"><i class="ti ti-x" /></button>
        </div>
        <div class="modal-body">
          <p style="font-size:13px;color:#6b6256;margin-bottom:14px">
            Пользователь <b>@{{ banModal.username }}</b> не сможет войти в аккаунт, пока бан не будет снят.
          </p>
          <div class="edit-field">
            <label>Причина бана <span style="color:#c0392b">*</span></label>
            <textarea v-model="banModal.reason" rows="3" placeholder="Например: спам, оскорбления, мошенничество с обменами..."></textarea>
          </div>
        </div>
        <div class="modal-foot">
          <button class="btn btn-ghost" @click="banModal.open = false">Отмена</button>
          <button class="btn btn-primary" style="margin-left:auto;background:#c0392b;border-color:#c0392b" @click="confirmBan">
            <i class="ti ti-ban" /> Забанить
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { PROTECTED_ADMIN_USERNAME } from '~/types'

definePageMeta({ middleware: 'admin' })

const auth = useAuthStore()
const section = ref<'overview'|'pets'|'users'|'moderation'>('overview')

const menuItems = [
  { key: 'overview',   icon: 'ti-chart-bar', label: 'Обзор' },
  { key: 'pets',       icon: 'ti-heart',     label: 'Фигурки' },
  { key: 'users',      icon: 'ti-users',     label: 'Пользователи' },
  { key: 'moderation', icon: 'ti-shield',    label: 'Модерация' },
]

const stats = computed(() => {
  const s = statsData.value
  const fmt = (n: number) => (n ?? 0).toLocaleString('ru-RU')
  return [
    {
      label: 'Фигурок в базе', value: fmt(s?.petsTotal ?? 0),
      trend: (s?.petsWeek ?? 0) > 0 ? 1 : 0,
      sub: `+${s?.petsWeek ?? 0} за неделю`,
    },
    {
      label: 'Пользователей', value: fmt(s?.usersTotal ?? 0),
      trend: (s?.usersWeek ?? 0) > 0 ? 1 : 0,
      sub: `+${s?.usersWeek ?? 0} за неделю`,
    },
    {
      label: 'Успешных обменов', value: fmt(s?.tradesDone ?? 0),
      trend: (s?.tradesDoneWeek ?? 0) > 0 ? 1 : 0,
      sub: `+${s?.tradesDoneWeek ?? 0} за неделю`,
    },
    {
      label: 'Ожидают обмена', value: fmt(s?.tradesPending ?? 0),
      trend: (s?.tradesPending ?? 0) > 0 ? -1 : 0,
      sub: (s?.tradesPending ?? 0) > 0 ? 'Ожидают ответа' : 'Нет ожидающих',
    },
  ]
})

const { data: statsData, refresh: refreshStats } = await useFetch('/api/admin/stats')
const { data: meta } = await useFetch('/api/meta')
const { data: petsData, refresh: refreshPets } = await useFetch('/api/pets', { query: { limit: 20 } })
const { data: usersData, refresh: refreshUsers } = await useFetch('/api/users')

async function deletePet(id: string) {
  if (!confirm('Удалить фигурку?')) return
  try {
    await $fetch(`/api/pets/${id}`, { method: 'DELETE' })
    refreshPets()
    refreshStats()
  } catch (e: any) {
    alert(e?.data?.message ?? 'Не удалось удалить фигурку')
  }
}

// ── Создание / редактирование фигурки ────────────────────────
const petModal = reactive({ open: false, id: null as string | null })
const savingPet = ref(false)
const imgError = ref(false)
const petForm = reactive({
  number: null as number | null,
  name: '',
  moldId: '',
  generationId: '',
  releaseTypeId: '',
  colorScheme: '',
  imageUrl: '',
  description: '',
  hasFlocking: false,
  hasMagnet: false,
  hasGlitter: false,
})

function resetPetForm() {
  petForm.number = null
  petForm.name = ''
  petForm.moldId = ''
  petForm.generationId = ''
  petForm.releaseTypeId = ''
  petForm.colorScheme = ''
  petForm.imageUrl = ''
  petForm.description = ''
  petForm.hasFlocking = false
  petForm.hasMagnet = false
  petForm.hasGlitter = false
  imgError.value = false
}

function openCreatePet() {
  petModal.id = null
  resetPetForm()
  petModal.open = true
}

async function openEditPet(pet: any) {
  resetPetForm()
  petModal.id = pet.id
  try {
    // Полные данные (включая расцветку и описание, которых нет в списке)
    const full = await $fetch<any>(`/api/pets/${pet.id}`)
    petForm.number        = full.number
    petForm.name          = full.name ?? ''
    petForm.moldId        = full.mold?.id ?? ''
    petForm.generationId  = full.generation?.id ?? ''
    petForm.releaseTypeId = full.releaseType?.id ?? ''
    petForm.colorScheme   = full.colorScheme ?? ''
    petForm.imageUrl      = full.imageUrl ?? ''
    petForm.description   = full.description ?? ''
    petForm.hasFlocking   = !!full.hasFlocking
    petForm.hasMagnet     = !!full.hasMagnet
    petForm.hasGlitter    = !!full.hasGlitter
    petModal.open = true
  } catch (e: any) {
    alert(e?.data?.message ?? 'Не удалось загрузить данные фигурки')
  }
}

async function savePet() {
  if (!petForm.number || !petForm.name.trim() || !petForm.moldId || !petForm.generationId) {
    alert('Заполните номер, название, молд и поколение')
    return
  }
  savingPet.value = true
  const payload = {
    number:        petForm.number,
    name:          petForm.name.trim(),
    moldId:        petForm.moldId,
    generationId:  petForm.generationId,
    releaseTypeId: petForm.releaseTypeId || null,
    colorScheme:   petForm.colorScheme.trim() || null,
    imageUrl:      petForm.imageUrl.trim() || null,
    description:   petForm.description.trim() || null,
    hasFlocking:   petForm.hasFlocking,
    hasMagnet:     petForm.hasMagnet,
    hasGlitter:    petForm.hasGlitter,
  }
  try {
    if (petModal.id) {
      await $fetch(`/api/pets/${petModal.id}`, { method: 'PATCH', body: payload })
    } else {
      await $fetch('/api/pets', { method: 'POST', body: payload })
    }
    petModal.open = false
    refreshPets()
    refreshStats()
  } catch (e: any) {
    alert(e?.data?.message ?? 'Не удалось сохранить фигурку')
  } finally {
    savingPet.value = false
  }
}

async function deleteUser(id: string) {
  if (!confirm('Удалить пользователя?')) return
  try {
    await $fetch(`/api/users/${id}`, { method: 'DELETE' })
    refreshUsers()
  } catch (e: any) {
    alert(e?.data?.message ?? 'Не удалось удалить пользователя')
  }
}

async function toggleRole(u: any) {
  const newRole = u.role === 'admin' ? 'user' : 'admin'
  try {
    await $fetch(`/api/users/${u.id}`, { method: 'PATCH', body: { role: newRole } })
    refreshUsers()
  } catch (e: any) {
    alert(e?.data?.message ?? 'Не удалось сменить роль')
  }
}

// Главного администратора нельзя трогать
function isProtected(u: any) {
  return u.username === PROTECTED_ADMIN_USERNAME
}

// — Бан / разбан —
const banModal = reactive({ open: false, userId: '', username: '', reason: '' })

function openBan(u: any) {
  banModal.userId = u.id
  banModal.username = u.username
  banModal.reason = ''
  banModal.open = true
}

async function confirmBan() {
  const reason = banModal.reason.trim()
  if (!reason) { alert('Укажите причину бана'); return }
  try {
    await $fetch(`/api/users/${banModal.userId}/ban`, {
      method: 'PATCH',
      body: { banned: true, reason },
    })
    banModal.open = false
    refreshUsers()
  } catch (e: any) {
    alert(e?.data?.message ?? 'Не удалось забанить пользователя')
  }
}

async function unbanUser(u: any) {
  if (!confirm(`Снять бан с @${u.username}?`)) return
  try {
    await $fetch(`/api/users/${u.id}/ban`, { method: 'PATCH', body: { banned: false } })
    refreshUsers()
  } catch (e: any) {
    alert(e?.data?.message ?? 'Не удалось снять бан')
  }
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
  &-d.neutral { color: $ink-3; }
}

.section-t {
  @include section-head;
  @include flex-row(8px, space-between);
  margin-bottom: 12px;
}

.pet-icon { width: 36px; height: 36px; border-radius: $r-sm; .glyph { font-size: 18px; } }
.uname    { font-weight: 700; color: $ink; }
.uemail   { font-size: 10.5px; color: $ink-3; font-weight: 600; }

.row-act { @include flex-row(4px); flex-wrap: wrap; }
.ract {
  font-size: 15px; color: $ink-3; cursor: pointer;
  padding: 4px; border-radius: 6px; transition: .14s;
  &:hover       { background: $bg-inset; color: $ink; }
  &-d:hover     { color: $danger; background: $danger-tint; }
  &-ok:hover    { color: $success; background: $success-tint; }
}

// Кнопки управления пользователем — с подписями, чтобы их нельзя было не заметить
.uact {
  display: inline-flex; align-items: center; gap: 5px;
  font-family: $font-body; font-size: 11.5px; font-weight: 700;
  padding: 5px 9px; border-radius: $r-sm;
  border: 1px solid $line-2; background: $bg-card; color: $ink-2;
  cursor: pointer; transition: .14s; white-space: nowrap;
  i { font-size: 14px; }

  &:hover { border-color: $brand-line; color: $brand-deep; background: $brand-tint; }

  &-warn { color: $danger; }
  &-warn:hover { color: $danger; border-color: $danger; background: $danger-tint; }

  &-ok { color: $success; }
  &-ok:hover { color: $success; border-color: $success; background: $success-tint; }

  &-danger { color: $danger; }
  &-danger:hover { color: #fff; border-color: $danger; background: $danger; }
}

// — Статус / роль —
.ban-pill {
  @include flex-row(4px);
  display: inline-flex;
  font-size: 11px; font-weight: 700;
  padding: 2px 8px; border-radius: $r-pill;
  color: $danger; background: $danger-tint;
}
.ok-pill {
  font-size: 11px; font-weight: 700;
  padding: 2px 8px; border-radius: $r-pill;
  color: $success; background: $success-tint;
}
.owner-badge {
  color: #d4a017;
  font-size: 13px;
  margin-left: 4px;
  vertical-align: middle;
}

// — Модалка (локальная копия, чтобы /admin был самодостаточен) —
.edit-field {
  margin-bottom: 14px;
  label { display: block; font-size: 12px; color: $ink-2; margin-bottom: 6px; font-weight: 700; }
  input, textarea, select { @include input-base; }
  textarea { resize: vertical; }
  select { cursor: pointer; }
  .req { color: $danger; }
}

// — Форма фигурки —
.form-row2 { display: grid; grid-template-columns: 1fr 1fr; gap: 12px; }
.form-row2 .edit-field { margin-bottom: 14px; }

.feat-row { display: flex; gap: 18px; margin-top: 2px; flex-wrap: wrap; }
.feat {
  @include flex-row(7px);
  font-size: 13px; font-weight: 700; color: $ink-2; cursor: pointer;
  input { width: 16px; height: 16px; accent-color: $brand; }
}

.img-preview {
  margin: -4px 0 14px;
  display: flex; flex-direction: column; gap: 6px;
  img {
    max-height: 120px; max-width: 100%; width: auto;
    border-radius: $r-sm; border: 1px solid $line;
    object-fit: contain; background: $bg-sunken; padding: 4px;
  }
  .img-err { font-size: 11.5px; font-weight: 700; color: $danger; @include flex-row(4px); }
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
