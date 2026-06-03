# LPS Коллекционер

Nuxt 3 + PostgreSQL + SCSS

## Быстрый старт

```bash
# 1. Установи зависимости
npm install

# 2. Настрой окружение
cp .env.example .env
# Заполни DATABASE_URL и JWT_SECRET

# 3. Создай базу данных
psql -U postgres -c "CREATE DATABASE lps_db;"
psql -U postgres -c "CREATE USER lps_user WITH PASSWORD 'lps_pass';"
psql -U postgres -c "GRANT ALL PRIVILEGES ON DATABASE lps_db TO lps_user;"
psql -U postgres -d lps_db -f server/db/schema.sql

# 4. Запусти dev-сервер
npm run dev
```

## Структура

```
├── assets/scss/         # Стили
│   ├── _vars.scss       # Переменные дизайн-системы
│   ├── _mixins.scss     # Миксины (card, flex-row, input-base…)
│   └── main.scss        # Глобальные стили
│
├── pages/               # Страницы (Nuxt file-routing)
│   ├── index.vue        # Главная
│   ├── catalog.vue      # Каталог
│   ├── profile.vue      # Профиль / коллекция / вишлист
│   ├── admin.vue        # Панель администратора
│   └── auth.vue         # Вход / регистрация
│
├── server/
│   ├── api/
│   │   ├── auth/        # login, register, me
│   │   ├── pets/        # каталог CRUD
│   │   ├── collection/  # коллекция пользователя
│   │   ├── wishlist/    # вишлист
│   │   └── users/       # управление пользователями (admin)
│   ├── db/
│   │   ├── schema.sql   # SQL схема БД
│   │   └── client.ts    # Пул соединений PostgreSQL
│   └── utils/
│       └── auth.ts      # JWT + хеширование паролей
│
├── stores/
│   └── auth.ts          # Pinia: авторизация
│
├── middleware/
│   ├── auth.ts          # Только для авторизованных
│   └── admin.ts         # Только для администраторов
│
└── types/
    └── index.ts         # TypeScript типы всего проекта
```

## API endpoints

| Метод | URL | Доступ | Описание |
|-------|-----|--------|----------|
| POST | /api/auth/login | все | Вход |
| POST | /api/auth/register | все | Регистрация |
| GET | /api/auth/me | user/admin | Текущий пользователь |
| GET | /api/pets | все | Каталог с фильтрами |
| GET | /api/pets/:id | все | Карточка фигурки |
| POST | /api/pets | admin | Добавить фигурку |
| GET | /api/collection | user/admin | Моя коллекция |
| POST | /api/collection | user/admin | Добавить в коллекцию |
| PATCH | /api/collection/:id | user/admin | Обновить заметку/состояние |
| DELETE | /api/collection/:id | user/admin | Удалить из коллекции |
| GET | /api/wishlist | user/admin | Вишлист |
| POST | /api/wishlist | user/admin | Добавить в вишлист |
| DELETE | /api/wishlist/:id | user/admin | Удалить из вишлиста |
| GET | /api/users | admin | Список пользователей |
| PATCH | /api/users/:id | admin | Сменить роль |
| DELETE | /api/users/:id | admin | Удалить пользователя |

## База данных

| Таблица | Описание |
|---------|----------|
| `generations` | Поколения G1–G7 |
| `molds` | Молды (формы тела фигурок) |
| `pets` | Фигурки — основной каталог |
| `users` | Пользователи (роли: user, admin) |
| `collection_items` | Личная коллекция пользователя |
| `wishlist_items` | Вишлист пользователя |
