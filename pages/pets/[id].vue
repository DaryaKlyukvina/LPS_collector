<template>
  <div v-if="pet">
    <!-- Хлебные крошки -->
    <div class="breadcrumb">
      <NuxtLink to="/catalog">Каталог</NuxtLink>
      <i class="ti ti-chevron-right" />
      <NuxtLink v-if="pet.generation" :to="`/catalog?generations=${pet.generation.number}`">
        {{ pet.generation.label }}
      </NuxtLink>
      <i class="ti ti-chevron-right" />
      <span>{{ pet.name }} #{{ String(pet.number).padStart(4,'0') }}</span>
    </div>

    <div class="pet-detail">
      <!-- Левая колонка: изображения -->
      <div class="pet-left">
        <div class="pet-preview fig" :class="`tint-${speciesTint}`">
          <img :src="activeImage" :alt="pet.name" class="preview-img">
        </div>

        <!-- Миниатюры доп. изображений -->
        <div v-if="images.length > 1" class="thumbs">
          <div
            v-for="(img, i) in images" :key="i"
            class="thumb fig" :class="[`tint-${speciesTint}`, { on: activeImageIdx === i }]"
            @click="activeImageIdx = i"
          >
            <img :src="img.url" :alt="img.alt ?? pet.name">
          </div>
        </div>

        <!-- Кнопки действий -->
        <div class="pet-actions">
          <template v-if="auth.isLoggedIn">
            <button
              class="btn btn-primary"
              :disabled="inCollection"
              @click="addToCollection"
            >
              <i :class="inCollection ? 'ti ti-check' : 'ti ti-plus'" />
              {{ inCollection ? 'В коллекции' : 'В коллекцию' }}
            </button>
            <button
              class="btn"
              :class="inWishlist ? 'btn-soft' : 'btn-ghost'"
              @click="toggleWishlist"
            >
              <i :class="inWishlist ? 'ti ti-heart-filled' : 'ti ti-heart'" />
              {{ inWishlist ? 'В вишлисте' : 'В вишлист' }}
            </button>
          </template>
          <template v-else>
            <NuxtLink class="btn btn-primary" to="/auth/login">
              <i class="ti ti-login-2" /> Войти чтобы добавить
            </NuxtLink>
          </template>
        </div>
      </div>

      <!-- Правая колонка: информация -->
      <div class="pet-right">
        <div class="pet-num-label">#{{ String(pet.number).padStart(4,'0') }}</div>
        <h1 class="pet-title">{{ pet.name }}</h1>

        <div class="tags-row">
          <span v-if="pet.generation" class="tag tag-brand">
            {{ pet.generation.label }} · {{ pet.generation.yearStart }}–{{ pet.generation.yearEnd ?? 'н.в.' }}
          </span>
          <span v-if="pet.mold" class="tag tag-mint">{{ pet.mold.name }} · {{ pet.mold.species }}</span>
          <span v-if="pet.releaseType" class="tag" :class="pet.releaseType.isExclusive ? 'tag-gold' : 'tag-brand'">
            {{ pet.releaseType.label }}
          </span>
        </div>

        <div class="divider-h" />

        <!-- Характеристики -->
        <div class="props-grid">
          <div class="prop">
            <span class="prop-label">Поколение</span>
            <span class="prop-val">{{ pet.generation?.label ?? '—' }}</span>
          </div>
          <div class="prop">
            <span class="prop-label">Молд</span>
            <span class="prop-val">{{ pet.mold?.name ?? '—' }}</span>
          </div>
          <div class="prop">
            <span class="prop-label">Вид</span>
            <span class="prop-val">{{ pet.mold?.species ?? '—' }}</span>
          </div>
          <div class="prop">
            <span class="prop-label">Тип релиза</span>
            <span class="prop-val">{{ pet.releaseType?.label ?? 'Standard' }}</span>
          </div>
          <div class="prop">
            <span class="prop-label">Год выпуска</span>
            <span class="prop-val">{{ pet.generation?.yearStart ?? '—' }}</span>
          </div>
          <div class="prop">
            <span class="prop-label">Расцветка</span>
            <span class="prop-val">{{ pet.colorScheme ?? '—' }}</span>
          </div>
        </div>

        <div class="divider-h" />

        <!-- Особенности -->
        <div class="sec-hd" style="margin-bottom:10px">Особенности</div>
        <div class="feat-chips">
          <span class="feat-chip" :class="{ on: pet.hasFlocking }">
            <i :class="pet.hasFlocking ? 'ti ti-check' : 'ti ti-x'" />
            Флокинг
          </span>
          <span class="feat-chip" :class="{ on: pet.hasMagnet }">
            <i :class="pet.hasMagnet ? 'ti ti-check' : 'ti ti-x'" />
            Магнит
          </span>
          <span class="feat-chip" :class="{ on: pet.hasGlitter }">
            <i :class="pet.hasGlitter ? 'ti ti-check' : 'ti ti-x'" />
            Глиттер
          </span>
        </div>

        <!-- Описание -->
        <template v-if="pet.description">
          <div class="divider-h" />
          <div class="sec-hd" style="margin-bottom:8px">Описание</div>
          <div class="pet-desc">{{ pet.description }}</div>
        </template>
      </div>
    </div>

    <!-- Похожие фигурки на том же молде -->
    <div v-if="sameMold.length" class="same-mold">
      <div class="section-head-row">
        <span class="sec-hd">Тот же молд · другие расцветки</span>
      </div>
      <div class="same-grid">
        <NuxtLink
          v-for="p in sameMold" :key="p.id"
          class="pcard" :to="`/pets/${p.id}`"
        >
          <div class="pimg fig" :class="`tint-${speciesTint}`">
            <img :src="p.imageUrl ?? '/images/placeholders/pet_thumb.svg'" :alt="p.name">
          </div>
          <div class="pbody">
            <div class="pnum">#{{ String(p.number).padStart(4,'0') }}</div>
            <div class="pname">{{ p.name }}</div>
          </div>
        </NuxtLink>
      </div>
    </div>
  </div>

  <!-- Состояние загрузки / ошибка -->
  <div v-else-if="error" class="page-error">
    <i class="ti ti-mood-sad" />
    <div>Фигурка не найдена</div>
    <NuxtLink class="btn btn-ghost" to="/catalog">← В каталог</NuxtLink>
  </div>
</template>

<script setup lang="ts">
const route  = useRoute()
const auth   = useAuthStore()

// Загрузка фигурки
const { data: pet, error } = await useFetch<any>(`/api/pets/${route.params.id}`)

// Изображения: берём из pet_images если есть, иначе image_url, иначе заглушку
const images = computed(() => {
  if (!pet.value) return []
  const imgs: { url: string; alt?: string }[] = []
  if (pet.value.imageUrl) imgs.push({ url: pet.value.imageUrl })
  else imgs.push({ url: '/images/placeholders/pet_card.svg' })
  return imgs
})

const activeImageIdx = ref(0)
const activeImage = computed(() => images.value[activeImageIdx.value]?.url ?? '/images/placeholders/pet_card.svg')

// Тинт по виду животного
const SPECIES_TINTS: Record<string, string> = {
  'Собака': 'lav', 'Кошка': 'mint', 'Кролик': 'peach',
  'Ёж': 'butter', 'Хомяк': 'pink', 'Лягушка': 'sky',
}
const speciesTint = computed(() =>
  SPECIES_TINTS[pet.value?.mold?.species ?? ''] ?? 'lav'
)

// Статус в коллекции / вишлисте
const { data: colData, refresh: refreshCol }   = await useFetch('/api/collection')
const { data: wishData, refresh: refreshWish } = await useFetch('/api/wishlist')

const inCollection = computed(() =>
  (colData.value ?? []).some((i: any) => i.pet.id === pet.value?.id)
)
const inWishlist = computed(() =>
  (wishData.value ?? []).some((i: any) => i.pet.id === pet.value?.id)
)

async function addToCollection() {
  if (!pet.value || inCollection.value) return
  await $fetch('/api/collection', { method: 'POST', body: { petId: pet.value.id } })
  refreshCol()
}

async function toggleWishlist() {
  if (!pet.value) return
  if (inWishlist.value) {
    const item = (wishData.value as any[]).find((i: any) => i.pet.id === pet.value!.id)
    await $fetch(`/api/wishlist/${item.id}`, { method: 'DELETE' })
  } else {
    await $fetch('/api/wishlist', { method: 'POST', body: { petId: pet.value.id } })
  }
  refreshWish()
}

// Похожие фигурки (тот же молд, другой id)
const { data: sameMoldData } = await useFetch('/api/pets', {
  query: computed(() => pet.value?.mold?.id ? { moldIds: pet.value.mold.id, limit: 8 } : {}),
})
const sameMold = computed(() =>
  (sameMoldData.value?.items ?? [])
    .filter((p: any) => p.id !== pet.value?.id)
    .slice(0, 6)
)

// SEO
useHead({ title: computed(() => pet.value ? `${pet.value.name} #${pet.value.number} — LPS` : 'LPS') })
</script>

<style lang="scss">
.breadcrumb {
  @include flex-row(8px);
  padding: 12px 22px;
  font-size: 12.5px;
  color: $ink-3;
  border-bottom: 1px solid $line;
  flex-wrap: wrap;

  a { color: $ink-2; text-decoration: none; font-weight: 600; &:hover { color: $brand; } }
  i { font-size: 14px; }
  span { color: $ink; font-weight: 600; }
}

.pet-detail {
  display: grid;
  grid-template-columns: 240px 1fr;
  gap: 0;
}

// Левая колонка
.pet-left {
  padding: 22px;
  border-right: 1px solid $line;
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.pet-preview {
  height: 200px;
  border-radius: $r-lg;
  border: 1px solid $line;
  overflow: hidden;

  .preview-img { width: 100%; height: 100%; object-fit: contain; padding: 8px; }
}

.thumbs { @include flex-row(6px); flex-wrap: wrap; }
.thumb {
  width: 48px; height: 48px;
  border-radius: $r-sm; border: 1px solid $line;
  cursor: pointer; overflow: hidden;
  transition: .14s;

  img { width: 100%; height: 100%; object-fit: cover; }
  &.on { border-color: $brand; box-shadow: 0 0 0 2px $brand-tint; }
  &:hover { border-color: $brand-line; }
}

.pet-actions { display: flex; flex-direction: column; gap: 8px; }
.pet-actions .btn { justify-content: center; padding: 10px; }

// Правая колонка
.pet-right { padding: 22px 24px; }

.pet-num-label { font-size: 12px; color: $ink-3; font-weight: 700; letter-spacing: .04em; margin-bottom: 4px; }

.pet-title { @include font-display(26px); color: $ink; margin-bottom: 12px; line-height: 1.2; }

.tags-row { @include flex-row(6px); flex-wrap: wrap; margin-bottom: 0; }

.divider-h { height: 1px; background: $line; margin: 18px 0; }

.props-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 10px 20px;
  margin-bottom: 0;
}

.prop { display: flex; flex-direction: column; gap: 3px; }
.prop-label { font-size: 10.5px; color: $ink-3; font-weight: 700; letter-spacing: .05em; text-transform: uppercase; }
.prop-val   { font-size: 14px; color: $ink; font-weight: 600; }

.feat-chips { @include flex-row(8px); flex-wrap: wrap; }
.feat-chip {
  @include flex-row(5px);
  font-size: 12.5px; font-weight: 700;
  padding: 5px 12px; border-radius: $r-pill;
  border: 1px solid $line-2; color: $ink-3;
  background: $bg-sunken;

  i { font-size: 14px; }
  &.on { background: $success-tint; border-color: $success-line; color: $success; }
}

.pet-desc {
  font-size: 13.5px; color: $ink-2; line-height: 1.65;
}

// Блок похожих фигурок
.same-mold {
  border-top: 1px solid $line;
  padding: 18px 22px 24px;
}

.section-head-row { margin-bottom: 14px; }

.same-grid {
  display: grid;
  grid-template-columns: repeat(6, 1fr);
  gap: 10px;
}

.pcard { @include card; cursor: pointer; }
.pimg  { height: 80px; overflow: hidden; img { width: 100%; height: 100%; object-fit: contain; padding: 4px; } }
.pbody { padding: 7px 9px 9px; }
.pnum  { font-size: 10px; color: $ink-3; font-weight: 700; }
.pname { @include font-display(12px, 600); margin-top: 1px; }

.page-error {
  display: flex; flex-direction: column; align-items: center; gap: 12px;
  padding: 60px 20px; color: $ink-3;
  i { font-size: 40px; }
  div { font-size: 16px; font-weight: 600; }
}
</style>
