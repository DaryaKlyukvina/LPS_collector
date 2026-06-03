// ============================================================
// Типы данных LPS Коллекционер
// ============================================================

// — Роли —
export type Role = 'guest' | 'user' | 'admin'

// — Пользователь —
export interface User {
  id: string
  username: string
  email: string
  role: Role
  bio?: string
  location?: string
  createdAt: string
  // НЕ хранить passwordHash на клиенте
}

// — Поколение —
export interface Generation {
  id: string
  number: number          // 1–7
  label: string           // "G1", "G7" и т.д.
  yearStart: number
  yearEnd?: number        // null если текущее
}

// — Молд (форма тела фигурки) —
export interface Mold {
  id: string
  name: string            // "Такса", "Кошка"
  species: string         // биологический вид
  description?: string
}

// — Редкость —
export type RarityLevel = 'common' | 'rare' | 'special' | 'exclusive'

// — Фигурка (основная единица каталога) —
export interface Pet {
  id: string
  number: number          // уникальный порядковый номер, напр. 3847
  name: string
  moldId: string
  mold?: Mold             // JOIN
  generationId: string
  generation?: Generation // JOIN
  rarity: RarityLevel
  hasFlocking: boolean    // флокинг (бархатистое покрытие)
  hasMagnet: boolean      // магнит в лапке
  hasGlitter: boolean     // блёстки
  colorScheme?: string    // описание расцветки
  imageUrl?: string
  description?: string
  createdAt: string
  createdBy?: string      // userId администратора
}

// — Запись в коллекции пользователя —
export interface CollectionItem {
  id: string
  userId: string
  petId: string
  pet?: Pet               // JOIN
  note?: string           // личная заметка
  condition?: 'mint' | 'good' | 'fair' | 'poor'
  acquiredAt?: string     // дата приобретения
  addedAt: string
}

// — Вишлист —
export interface WishlistItem {
  id: string
  userId: string
  petId: string
  pet?: Pet               // JOIN
  addedAt: string
}

// — Профиль коллекционера (публичный вид) —
export interface CollectorProfile {
  user: User
  collectionCount: number
  wishlistCount: number
  generationsCovered: number[]
  featuredGeneration?: string
}

// — Авторизация —
export interface LoginPayload {
  email: string
  password: string
}

export interface RegisterPayload {
  username: string
  email: string
  password: string
}

export interface AuthResponse {
  token: string
  user: User
}

// — JWT payload (сервер) —
export interface JwtPayload {
  sub: string   // userId
  role: Role
  iat: number
  exp: number
}

// — Фильтры каталога —
export interface CatalogFilters {
  search?: string
  generations?: number[]
  rarity?: RarityLevel[]
  hasFlocking?: boolean
  hasMagnet?: boolean
  hasGlitter?: boolean
  moldIds?: string[]
  page?: number
  limit?: number
  sort?: 'number' | 'name' | 'rarity' | 'generation'
}

// — Пагинированный ответ —
export interface Paginated<T> {
  items: T[]
  total: number
  page: number
  limit: number
  totalPages: number
}

// — API ошибка —
export interface ApiError {
  statusCode: number
  message: string
}
