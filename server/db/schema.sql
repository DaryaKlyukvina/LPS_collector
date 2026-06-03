-- ============================================================
-- LPS Коллекционер — схема базы данных PostgreSQL v2
-- Изменения:
--   • rarity → release_type (конкретные типы релизов)
--   • убрано поле condition из collection_items
-- ============================================================

CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- ── Поколения ────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS generations (
  id         UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  number     SMALLINT NOT NULL UNIQUE,
  label      VARCHAR(8) NOT NULL,
  year_start SMALLINT NOT NULL,
  year_end   SMALLINT
);

-- ── Молды ────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS molds (
  id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name        VARCHAR(100) NOT NULL,
  species     VARCHAR(100) NOT NULL,
  description TEXT
);

-- ── Типы релизов ─────────────────────────────────────────────
-- Отдельная таблица чтобы легко добавлять новые типы в будущем
CREATE TABLE IF NOT EXISTS release_types (
  id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  slug        VARCHAR(50)  NOT NULL UNIQUE, -- машиночитаемый ключ
  label       VARCHAR(100) NOT NULL,        -- отображаемое название
  is_exclusive BOOLEAN NOT NULL DEFAULT FALSE,
  sort_order  SMALLINT NOT NULL DEFAULT 0
);

-- ── Фигурки ──────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS pets (
  id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  number          INTEGER NOT NULL UNIQUE,
  name            VARCHAR(150) NOT NULL,
  mold_id         UUID NOT NULL REFERENCES molds(id) ON DELETE RESTRICT,
  generation_id   UUID NOT NULL REFERENCES generations(id) ON DELETE RESTRICT,
  release_type_id UUID REFERENCES release_types(id) ON DELETE SET NULL,
  has_flocking    BOOLEAN NOT NULL DEFAULT FALSE,
  has_magnet      BOOLEAN NOT NULL DEFAULT FALSE,
  has_glitter     BOOLEAN NOT NULL DEFAULT FALSE,
  color_scheme    VARCHAR(200),
  image_url       TEXT,
  description     TEXT,
  created_at      TIMESTAMPTZ NOT NULL DEFAULT now(),
  created_by      UUID
);

-- ── Пользователи ─────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS users (
  id            UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  username      VARCHAR(50)  NOT NULL UNIQUE,
  email         VARCHAR(255) NOT NULL UNIQUE,
  password_hash TEXT NOT NULL,
  role          VARCHAR(10)  NOT NULL DEFAULT 'user'
                  CHECK (role IN ('user','admin')),
  bio           TEXT,
  location      VARCHAR(150),
  created_at    TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE pets
  ADD CONSTRAINT pets_created_by_fkey
  FOREIGN KEY (created_by) REFERENCES users(id) ON DELETE SET NULL;

-- ── Коллекция ────────────────────────────────────────────────
-- condition убрано — пользователь хранит только заметку и дату
CREATE TABLE IF NOT EXISTS collection_items (
  id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id     UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  pet_id      UUID NOT NULL REFERENCES pets(id)  ON DELETE CASCADE,
  note        TEXT,
  acquired_at DATE,
  added_at    TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE (user_id, pet_id)
);

-- ── Вишлист ──────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS wishlist_items (
  id       UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id  UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  pet_id   UUID NOT NULL REFERENCES pets(id)  ON DELETE CASCADE,
  added_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE (user_id, pet_id)
);

-- ── Индексы ──────────────────────────────────────────────────
CREATE INDEX IF NOT EXISTS idx_pets_generation   ON pets(generation_id);
CREATE INDEX IF NOT EXISTS idx_pets_mold         ON pets(mold_id);
CREATE INDEX IF NOT EXISTS idx_pets_release_type ON pets(release_type_id);
CREATE INDEX IF NOT EXISTS idx_pets_number       ON pets(number);
CREATE INDEX IF NOT EXISTS idx_col_user          ON collection_items(user_id);
CREATE INDEX IF NOT EXISTS idx_col_pet           ON collection_items(pet_id);
CREATE INDEX IF NOT EXISTS idx_wish_user         ON wishlist_items(user_id);

-- ── Справочные данные ────────────────────────────────────────

INSERT INTO generations (number, label, year_start, year_end) VALUES
  (1, 'G1', 1992, 2000),
  (2, 'G2', 2000, 2004),
  (3, 'G3', 2004, 2008),
  (4, 'G4', 2008, 2012),
  (5, 'G5', 2012, 2016),
  (6, 'G6', 2016, 2022),
  (7, 'G7', 2024, NULL)
ON CONFLICT (number) DO NOTHING;

INSERT INTO molds (name, species) VALUES
  ('Такса',   'Собака'),
  ('Пудель',   'Собака'),
  ('Бульдог',  'Собака'),
  ('Котёнок',  'Кошка'),
  ('Мейнкун', 'Кошка'),
  ('Лежачка', 'Кошка'),
  ('Ангорский кролик',  'Кролик'),
  ('Ёж',    'Ёж'),
  ('Хомяк',   'Хомяк'),
  ('Лягушка', 'Лягушка')
ON CONFLICT DO NOTHING;

-- Типы релизов — slug используется в коде, label отображается в UI
INSERT INTO release_types (slug, label, is_exclusive, sort_order) VALUES
  ('regular',         'Regular',               FALSE,  0),
  ('special',         'Special',               FALSE, 10),
  ('advent',          'Advent',                FALSE, 20),
  ('puzzle',          'Puzzle',                FALSE, 30),
  ('toysrus',         'Toys"R"Us Exclusive',   TRUE,  40),
  ('target',          'Target Exclusive',      TRUE,  50),
  ('walmart',         'Walmart Exclusive',     TRUE,  60),
  ('costco',          'Costco Exclusive',      TRUE,  70),
  ('kohls',           'Kohl''s Exclusive',     TRUE,  80),
  ('kmart',           'Kmart Exclusive',       TRUE,  90)
ON CONFLICT (slug) DO NOTHING;

-- Диалоги между двумя пользователями
CREATE TABLE conversations (
  id         UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_1_id  UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  user_2_id  UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE (user_1_id, user_2_id)
);

-- Сообщения
CREATE TABLE messages (
  id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  conversation_id UUID NOT NULL REFERENCES conversations(id) ON DELETE CASCADE,
  sender_id       UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  text            TEXT,
  pet_id          UUID REFERENCES pets(id) ON DELETE SET NULL, -- прикреплённая фигурка
  is_read         BOOLEAN NOT NULL DEFAULT FALSE,
  created_at      TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Предложения обмена, связанные с сообщениями

CREATE TABLE trade_offers (
  id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  message_id      UUID REFERENCES messages(id) ON DELETE CASCADE,
  sender_id       UUID NOT NULL REFERENCES users(id),
  receiver_id     UUID NOT NULL REFERENCES users(id),
  offered_pet_id  UUID NOT NULL REFERENCES pets(id), -- что предлагает отправитель
  wanted_pet_id   UUID NOT NULL REFERENCES pets(id), -- что хочет получить
  status          VARCHAR(10) NOT NULL DEFAULT 'pending'
                    CHECK (status IN ('pending','accepted','declined')),
  created_at      TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Дополнительные изображения фигурок (для галереи на странице фигурки)

CREATE TABLE pet_images (
  id         UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  pet_id     UUID NOT NULL REFERENCES pets(id) ON DELETE CASCADE,
  url        TEXT NOT NULL,
  is_primary BOOLEAN NOT NULL DEFAULT FALSE,
  sort_order SMALLINT NOT NULL DEFAULT 0,
  uploaded_by UUID REFERENCES users(id) ON DELETE SET NULL
);
