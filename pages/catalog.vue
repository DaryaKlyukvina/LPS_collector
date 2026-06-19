<template>
  <div class="catalog-layout">
    <!-- Сайдбар с фильтрами -->
    <aside class="sidebar">
      <div class="filter-group">
        <div class="filter-label">Поколение</div>
        <div class="chip-row">
          <span
            v-for="g in generations" :key="g"
            class="chip" :class="{ on: filters.generations.includes(g) }"
            @click="toggleGen(g)"
          >G{{ g }}</span>
        </div>
      </div>

      <div class="filter-group">
        <div class="filter-label">Редкость</div>
        <div class="filter-opts">
          <label v-for="rt in releaseTypes" :key="rt.value" class="fopt">
            <input v-model="filters.releaseTypeSlugs" type="checkbox" :value="rt.value">
            {{ rt.label }}
          </label>
        </div>
      </div>

      <div class="filter-group">
        <div class="filter-label">Особенности</div>
        <div class="filter-opts">
          <label class="fopt"><input v-model="filters.hasFlocking" type="checkbox"> С флокингом</label>
          <label class="fopt"><input v-model="filters.hasMagnet"   type="checkbox"> С магнитом</label>
          <label class="fopt"><input v-model="filters.hasGlitter"  type="checkbox"> С глиттером</label>
        </div>
      </div>

      <button class="clear-btn" @click="clearFilters">
        <i class="ti ti-rotate" /> Сбросить фильтры
      </button>
    </aside>

    <!-- Основной контент -->
    <main class="catalog-main">
      <div class="toolbar">
        <div class="search-wrap">
          <i class="ti ti-search" />
          <input v-model="filters.search" type="text" placeholder="Поиск по номеру или названию...">
        </div>
        <select v-model="filters.sort" class="sort-sel">
          <option value="number">По номеру</option>
          <option value="name">По названию</option>
          <option value="release_type">По редкости</option>
          <option value="generation">По поколению</option>
        </select>
      </div>

      <div class="result-info">
        Найдено <b>{{ data?.total ?? 0 }} фигурок</b>
      </div>

      <div class="grid">
        <NuxtLink
          v-for="pet in data?.items" :key="pet.id"
          class="pcard" :to="`/pets/${pet.id}`"
        >
          <div class="pimg fig" :class="`tint-${tintFor(pet)}`">
            <img :src="pet.imageUrl ?? '/images/placeholders/pet_thumb.svg'" :alt="pet.name" class="pet-img-el">
          </div>
          <div class="pbody">
            <div class="pnum">#{{ String(pet.number).padStart(4,'0') }}</div>
            <div class="pname">{{ pet.name }}</div>
            <div class="pmeta">{{ pet.generation.label }} · {{ pet.mold.name }}</div>
            <div class="pfoot">
              <span v-if="pet.releaseType" class="rar" :class="pet.releaseType.isExclusive ? 'rar-exclusive' : 'rar-common'">{{ pet.releaseType.label }}</span>
              <span v-if="auth.isLoggedIn" class="like" :class="{ on: isLiked(pet.id) }" @click.prevent="toggleLike(pet.id)">
                <i :class="isLiked(pet.id) ? 'ti ti-heart-filled' : 'ti ti-heart'" />
              </span>
            </div>
          </div>
        </NuxtLink>
      </div>

      <!-- Пагинация -->
      <div class="pager">
        <button class="pg" :disabled="filters.page <= 1" @click="filters.page--">‹</button>
        <button
          v-for="p in visiblePages" :key="p"
          class="pg" :class="{ on: p === filters.page }"
          @click="filters.page = p"
        >{{ p }}</button>
        <button class="pg" :disabled="filters.page >= (data?.totalPages ?? 1)" @click="filters.page++">›</button>
      </div>
    </main>
  </div>
</template>

<script setup lang="ts">
const auth = useAuthStore()

const SPECIES_TINTS: Record<string, string> = {
  'Собака': 'lav', 'Кошка': 'mint', 'Кролик': 'peach',
  'Ёж': 'butter', 'Хомяк': 'pink', 'Лягушка': 'sky',
}
const TINTS = ['lav','mint','peach','butter','pink','sky']
function tintFor(pet: any) {
  return SPECIES_TINTS[pet.mold?.species ?? ''] ?? TINTS[pet.number % TINTS.length]
}

const generations = [1,2,3,4,5,6,7]
const releaseTypes = [
  { value: 'regular',  label: 'Regular' },
  { value: 'special',  label: 'Special' },
  { value: 'advent',   label: 'Advent' },
  { value: 'puzzle',   label: 'Puzzle' },
  { value: 'toysrus',  label: 'Toys"R"Us Exclusive' },
  { value: 'target',   label: 'Target Exclusive' },
  { value: 'walmart',  label: 'Walmart Exclusive' },
  { value: 'costco',   label: 'Costco Exclusive' },
  { value: 'kohls',    label: 'Kohl\'s Exclusive' },
  { value: 'kmart',    label: 'Kmart Exclusive' },
]

const filters = reactive({
  search: '', generations: [] as number[], releaseTypeSlugs: [] as string[],
  hasFlocking: false, hasMagnet: false, hasGlitter: false,
  sort: 'number', page: 1,
})

const { data } = await useFetch('/api/pets', {
  query: computed(() => ({
    search: filters.search || undefined,
    generations: filters.generations.join(',') || undefined,
    releaseTypeSlugs: filters.releaseTypeSlugs.join(',') || undefined,
    hasFlocking: filters.hasFlocking || undefined,
    hasMagnet: filters.hasMagnet || undefined,
    hasGlitter: filters.hasGlitter || undefined,
    sort: filters.sort,
    page: filters.page,
    limit: 12,
  })),
})

// При смене любого фильтра/поиска/сортировки — возвращаемся на первую страницу,
// чтобы не оказаться на несуществующей странице
watch(
  () => [filters.search, filters.releaseTypeSlugs.join(','), filters.hasFlocking, filters.hasMagnet, filters.hasGlitter, filters.sort],
  () => { filters.page = 1 },
)

const visiblePages = computed(() => {
  const total = data.value?.totalPages ?? 1
  const cur = filters.page
  return Array.from({ length: Math.min(total, 5) }, (_, i) => Math.max(1, cur - 2) + i)
    .filter(p => p <= total)
})

function toggleGen(g: number) {
  const idx = filters.generations.indexOf(g)
  idx === -1 ? filters.generations.push(g) : filters.generations.splice(idx, 1)
  filters.page = 1
}

function clearFilters() {
  Object.assign(filters, { search: '', generations: [], releaseTypeSlugs: [], hasFlocking: false, hasMagnet: false, hasGlitter: false, page: 1 })
}

// Лайки (вишлист) — упрощённый стейт
const liked = ref(new Set<string>())
const isLiked = (id: string) => liked.value.has(id)
async function toggleLike(petId: string) {
  // TODO: вызов /api/wishlist
  liked.value.has(petId) ? liked.value.delete(petId) : liked.value.add(petId)
}
</script>

<style lang="scss">
.catalog-layout {
  display: grid;
  grid-template-columns: 208px 1fr;
}

.sidebar {
  border-right: 1px solid $line;
  padding: 18px;
  min-height: 580px;
  background: $bg-sunken;
}

.filter-group  { margin-bottom: 22px; }
.filter-label  { @include section-head; margin-bottom: 10px; }
.filter-opts   { display: flex; flex-direction: column; gap: 3px; }

.fopt {
  @include flex-row(9px);
  font-size: 13px;
  color: $ink;
  cursor: pointer;
  padding: 5px 8px;
  border-radius: $r-sm;
  transition: .14s;
  font-weight: 600;

  &:hover { background: $bg-inset; }
  input { accent-color: $brand; width: 15px; height: 15px; }
}

.clear-btn {
  font-size: 12px; font-weight: 700; color: $brand;
  background: none; border: none; cursor: pointer;
  padding: 0; @include flex-row(4px);
}

.catalog-main { padding: 18px 20px; }

.toolbar { @include flex-row(9px); margin-bottom: 12px; }

.sort-sel {
  font-size: 13px; font-weight: 700;
  padding: 9px 12px; border: 1px solid $line-2;
  border-radius: $r-md; color: $ink-2;
  background: $bg-card; font-family: $font-body; cursor: pointer;
}

.result-info { font-size: 12px; color: $ink-3; margin-bottom: 14px; font-weight: 600; }

.grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 13px; }

.pcard { @include card; cursor: pointer; }
.pimg  { height: 96px; }
.pbody { padding: 10px 12px 12px; }
.pnum  { font-size: 10.5px; color: $ink-3; font-weight: 700; letter-spacing: .02em; }
.pname { @include font-display(14.5px, 600); margin-top: 2px; }
.pmeta { font-size: 11px; color: $ink-2; margin-top: 3px; font-weight: 600; }
.pfoot { @include flex-row(0, space-between); margin-top: 11px; }

.pager { @include flex-center(6px); margin-top: 20px; }
.pg {
  font-size: 13px; font-weight: 700;
  min-width: 32px; height: 32px; padding: 0 8px;
  border: 1px solid $line-2; border-radius: $r-sm;
  cursor: pointer; color: $ink-2; background: $bg-card;
  display: inline-flex; align-items: center; justify-content: center; transition: .14s;

  &:hover:not(:disabled) { border-color: $brand-line; color: $brand-deep; }
  &.on   { background: $brand-tint; border-color: $brand-line; color: $brand-deep; }
  &:disabled { opacity: .4; cursor: default; }
}
.pet-img-el { width:100%; height:100%; object-fit:contain; padding:6px; }
</style>
