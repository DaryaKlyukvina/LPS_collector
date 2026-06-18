<template>
  <div>
    <!-- Hero -->
    <section class="hero">
      <div class="badge-pill">
        <i class="ti ti-sparkles" /> Generation 7 уже в каталоге
      </div>
      <h1>Веди учёт своей<br>коллекции <span class="hl">Littlest Pet Shop</span></h1>
      <p>Каталог всех поколений LPS, личная коллекция, вишлист и аналитика — всё в одном месте.</p>
      <div class="hero-btns">
        <NuxtLink class="btn btn-primary btn-lg" to="/catalog">
          <i class="ti ti-layout-grid" /> Смотреть каталог
        </NuxtLink>
        <NuxtLink class="btn btn-ghost btn-lg" to="/auth">
          Создать коллекцию <i class="ti ti-arrow-right" />
        </NuxtLink>
      </div>
      <div class="hero-strip">
        <div v-for="(pet, i) in heroPets" :key="i" class="hs fig" :class="`tint-${pet.tint}`">
          <img :src="pet.imageUrl" :alt="pet.name ?? 'LPS'" class="hs-img">
        </div>
      </div>
    </section>

    <!-- Статистика -->
    <div class="stats">
      <div class="stat"><div class="stat-n">3 200+</div><div class="stat-l">фигурок в базе</div></div>
      <div class="stat"><div class="stat-n">7</div><div class="stat-l">поколений LPS</div></div>
      <div class="stat"><div class="stat-n">840+</div><div class="stat-l">молдов</div></div>
    </div>

    <!-- Недавно добавлены -->
    <div class="section">
      <div class="section-head">
        <span class="sec-hd">Недавно добавлены</span>
        <NuxtLink to="/catalog">Весь каталог <i class="ti ti-chevron-right" /></NuxtLink>
      </div>
    </div>
    <div class="pet-grid">
      <NuxtLink
        v-for="pet in recentPets" :key="pet.id"
        class="pet-card" :to="`/pets/${pet.id}`"
      >
        <div class="pet-img fig" :class="`tint-${pet.tint}`">
          <img :src="pet.imageUrl" :alt="pet.name" class="pet-img-el">
        </div>
        <div class="pet-body">
          <div class="pet-num">#{{ String(pet.number).padStart(4,'0') }}</div>
          <div class="pet-name">{{ pet.name }}</div>
          <div class="pet-sub">{{ pet.genLabel }} · {{ pet.moldName }}</div>
          <span v-if="pet.releaseType" class="rar" :class="pet.releaseType.isExclusive ? 'rar-exclusive' : 'rar-common'">{{ pet.releaseType.label }}</span>
        </div>
      </NuxtLink>
    </div>

    <!-- Возможности -->
    <div class="section">
      <div class="section-head"><span class="sec-hd">Возможности</span></div>
    </div>
    <div class="feats">
      <div v-for="feat in features" :key="feat.icon" class="feat">
        <div class="ic"><i :class="`ti ${feat.icon}`" /></div>
        <div class="feat-t">{{ feat.title }}</div>
        <div class="feat-d">{{ feat.desc }}</div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
const TINTS = ['lav','mint','peach','butter','pink','sky']
const SPECIES_TINTS: Record<string, string> = {
  'Собака': 'lav', 'Кошка': 'mint', 'Кролик': 'peach',
  'Ёж': 'butter', 'Хомяк': 'pink', 'Лягушка': 'sky',
}
function tintFor(pet: any) {
  return SPECIES_TINTS[pet.mold?.species ?? ''] ?? TINTS[pet.number % TINTS.length]
}
function imgFor(pet: any) {
  return pet.imageUrl ?? `/images/placeholders/pet_thumb.svg`
}

// Загружаем последние 6 фигурок из API
const { data: recentData } = await useFetch('/api/pets', { query: { limit: 6, sort: 'number' } })
const recentPets = computed(() =>
  (recentData.value?.items ?? []).map((p: any) => ({
    ...p, tint: tintFor(p), imageUrl: imgFor(p),
  }))
)

// Заглушки для hero-полки пока нет реальных фото
const heroPets = [
  { tint: 'lav',    imageUrl: '/images/pets/placeholder_dog_300.svg',      name: 'Собака'  },
  { tint: 'mint',   imageUrl: '/images/pets/placeholder_cat_300.svg',       name: 'Кошка'   },
  { tint: 'peach',  imageUrl: '/images/pets/placeholder_rabbit_300.svg',    name: 'Кролик'  },
  { tint: 'butter', imageUrl: '/images/pets/placeholder_hedgehog_300.svg',  name: 'Ёжик'    },
  { tint: 'pink',   imageUrl: '/images/pets/placeholder_hamster_300.svg',   name: 'Хомяк'   },
  { tint: 'sky',    imageUrl: '/images/pets/placeholder_frog_300.svg',      name: 'Лягушка' },
]

const features = [
  { icon: 'ti-layout-grid', title: 'Полный каталог', desc: 'Все поколения G1–G7, молды, редкость, фото и описания каждой фигурки.' },
  { icon: 'ti-bookmarks',   title: 'Личная коллекция', desc: 'Добавляй фигурки из каталога, пиши заметки, отмечай состояние.' },
  { icon: 'ti-chart-bar',   title: 'Аналитика', desc: 'Статистика по поколениям, молдам, редкости и стоимости коллекции.' },
]
</script>

<style lang="scss">
// — Hero —
.hero {
  position: relative;
  padding: 54px 28px 40px;
  text-align: center;
  overflow: hidden;
  background:
    radial-gradient(120% 120% at 50% -10%, #f4f1ff 0%, rgba(244,241,255,0) 55%),
    $bg-sunken;
  border-bottom: 1px solid $line;

  &::before {
    content: '';
    position: absolute;
    inset: 0;
    background-image: $paw-tile;
    mask-image: radial-gradient(120% 95% at 50% 0%, #000 25%, transparent 75%);
  }

  > * { position: relative; }
}

.badge-pill {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  font-size: 12px;
  font-weight: 700;
  padding: 5px 13px;
  border-radius: $r-pill;
  background: $bg-card;
  color: $brand;
  margin-bottom: 18px;
  border: 1px solid $brand-line;
  box-shadow: $sh-sm;
}

h1 {
  @include font-display(33px);
  line-height: 1.18;
  letter-spacing: -.015em;
  color: $ink;
  margin-bottom: 13px;

  .hl { color: $brand; }
}

.hero p {
  font-size: 15px;
  color: $ink-2;
  max-width: 460px;
  margin: 0 auto 26px;
  line-height: 1.6;
}

.hero-btns { @include flex-center(11px); flex-wrap: wrap; }

.hero-strip {
  @include flex-center(10px);
  margin-top: 34px;
}

.hs {
  width: 60px;
  height: 60px;
  border-radius: $r-md;
  box-shadow: $sh-sm;
  border: 1px solid $line;

  .glyph { font-size: 28px; }
}

// — Статистика —
.stats {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  background: $bg-card;
}

.stat {
  padding: 22px 12px;
  text-align: center;
  border-right: 1px solid $line;

  &:last-child { border-right: none; }

  &-n { @include font-display(26px); color: $brand; }
  &-l { font-size: 12px; color: $ink-2; margin-top: 4px; font-weight: 600; }
}

// — Секция —
.section {
  padding: 22px 22px 8px;

  &-head {
    display: flex;
    align-items: baseline;
    justify-content: space-between;
    margin-bottom: 14px;

    a {
      font-size: 12.5px;
      font-weight: 700;
      color: $brand;
      text-decoration: none;
      @include flex-row(3px);
    }
  }
}

// — Сетка фигурок —
.pet-grid {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 12px;
  padding: 0 22px 24px;
}

.pet-card {
  @include card;
  cursor: pointer;

  &:hover { transform: translateY(-3px); }
}

.pet-img  { height: 90px; }
.pet-body { padding: 10px 11px 12px; }
.pet-num  { font-size: 10.5px; color: $ink-3; font-weight: 700; letter-spacing: .02em; }
.pet-name { @include font-display(14px); margin-top: 2px; }
.pet-sub  { font-size: 11px; color: $ink-2; margin-top: 3px; font-weight: 600; }
.pet-card .rar { margin-top: 9px; }

// — Возможности —
.feats {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 12px;
  padding: 0 22px 26px;
}

.feat {
  @include card;
  padding: 20px 18px;

  .ic {
    width: 40px;
    height: 40px;
    border-radius: 11px;
    display: grid;
    place-items: center;
    font-size: 21px;
    background: $brand-tint;
    color: $brand;
    margin-bottom: 13px;
  }

  &-t { @include font-display(15px, 600); color: $ink; margin-bottom: 6px; }
  &-d { font-size: 12.5px; color: $ink-2; line-height: 1.6; }
}

.hs-img { width: 100%; height: 100%; object-fit: contain; padding: 4px; }
.pet-img-el { width: 100%; height: 100%; object-fit: contain; padding: 6px; }

</style>
