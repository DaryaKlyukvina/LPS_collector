// server/db/client.ts
// Единственное место, где создаётся пул соединений с PostgreSQL.
// Используем встроенный node:postgres через динамический импорт,
// чтобы не тянуть лишние зависимости в клиентский бандл.

import pg from 'pg'

const { Pool } = pg

let _pool: pg.Pool | null = null

export function getPool(): pg.Pool {
  if (!_pool) {
    const config = useRuntimeConfig()
    _pool = new Pool({
      connectionString: config.dbUrl,
      max: 10,               // максимум соединений
      idleTimeoutMillis: 30_000,
      connectionTimeoutMillis: 5_000,
    })

    _pool.on('error', (err) => {
      console.error('[DB] Неожиданная ошибка соединения:', err)
    })
  }
  return _pool
}

// Хелпер: выполнить запрос и вернуть строки
export async function query<T = Record<string, unknown>>(
  sql: string,
  params?: unknown[],
): Promise<T[]> {
  const pool = getPool()
  const result = await pool.query(sql, params)
  return result.rows as T[]
}

// Хелпер: вернуть одну строку или null
export async function queryOne<T = Record<string, unknown>>(
  sql: string,
  params?: unknown[],
): Promise<T | null> {
  const rows = await query<T>(sql, params)
  return rows[0] ?? null
}
