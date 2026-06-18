import { u as useRuntimeConfig } from './nitro.mjs';
import pg from 'pg';

const { Pool } = pg;
let _pool = null;
function getPool() {
  if (!_pool) {
    const config = useRuntimeConfig();
    _pool = new Pool({
      connectionString: config.dbUrl,
      max: 10,
      // максимум соединений
      idleTimeoutMillis: 3e4,
      connectionTimeoutMillis: 5e3
    });
    _pool.on("error", (err) => {
      console.error("[DB] \u041D\u0435\u043E\u0436\u0438\u0434\u0430\u043D\u043D\u0430\u044F \u043E\u0448\u0438\u0431\u043A\u0430 \u0441\u043E\u0435\u0434\u0438\u043D\u0435\u043D\u0438\u044F:", err);
    });
  }
  return _pool;
}
async function query(sql, params) {
  const pool = getPool();
  const result = await pool.query(sql, params);
  return result.rows;
}
async function queryOne(sql, params) {
  var _a;
  const rows = await query(sql, params);
  return (_a = rows[0]) != null ? _a : null;
}

export { query as a, queryOne as q };
//# sourceMappingURL=client.mjs.map
