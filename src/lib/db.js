import pg from 'pg';

const { Pool, types } = pg;
// BIGINT -> number, NUMERIC -> number, DATE -> string 'YYYY-MM-DD' (hindari geser zona waktu)
types.setTypeParser(20, (v) => parseInt(v, 10));
types.setTypeParser(1700, (v) => parseFloat(v));
types.setTypeParser(1082, (v) => v);

export const pool =
    globalThis.__pgPool ?? new Pool({ connectionString: process.env.DATABASE_URL });
if (process.env.NODE_ENV !== 'production') globalThis.__pgPool = pool;

// Semua query memakai parameterized query ($1, $2, ...) - tidak ada SQL dari input mentah.
export async function query(text, params = []) {
    const res = await pool.query(text, params);
    return res.rows;
}

export async function queryOne(text, params = []) {
    const rows = await query(text, params);
    return rows[0] ?? null;
}

// BEGIN / COMMIT / ROLLBACK
export async function withTransaction(fn) {
    const client = await pool.connect();
    try {
    await client.query('BEGIN');
    const result = await fn(client);
    await client.query('COMMIT');
    return result;
    } catch (err) {
    await client.query('ROLLBACK');
    throw err;
    } finally {
    client.release();
}
}
