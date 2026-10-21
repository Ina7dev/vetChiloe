import pg from 'pg';
import dotenv from 'dotenv';
import { dirname, resolve } from 'node:path';
import process from 'node:process';
import { fileURLToPath } from 'node:url';

dotenv.config({
  path: resolve(dirname(fileURLToPath(import.meta.url)), '../.env'),
});

pg.types.setTypeParser(1700, (value) => parseFloat(value));
pg.types.setTypeParser(20, (value) => parseInt(value, 10));

const connectionString = process.env.DATABASE_URL_POOLED || process.env.DATABASE_URL;

if (!connectionString) {
  throw new Error('Falta DATABASE_URL_POOLED o DATABASE_URL para conectar con Neon.');
}

const globalForPg = globalThis;

const pool =
  globalForPg.pgPool ??
  new pg.Pool({
    connectionString,
    max: 10,
  });

if (process.env.NODE_ENV !== 'production') {
  globalForPg.pgPool = pool;
}

pool.on('error', (error) => {
  console.error('Error inesperado en una conexión inactiva de PostgreSQL:', error);
});

export const query = (text, params) => pool.query(text, params);

export async function withTransaction(fn) {
  const client = await pool.connect();

  try {
    await client.query('BEGIN');
    const result = await fn(client);
    await client.query('COMMIT');
    return result;
  } catch (error) {
    try {
      await client.query('ROLLBACK');
    } catch (rollbackError) {
      console.error('También falló el rollback de la transacción:', rollbackError);
    }
    throw error;
  } finally {
    client.release();
  }
}

export default pool;