import pg from 'pg';
import dotenv from 'dotenv';

dotenv.config();
const { Pool } = pg;
if (!process.env.DATABASE_URL) throw new Error('DATABASE_URL must be set');

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: process.env.NODE_ENV === 'production' && process.env.PGSSL !== 'false'
    ? { rejectUnauthorized: false } : false
});

export const query = (text, params) => pool.query(text, params);
export const closeDatabase = () => pool.end();

export async function connectDatabase() {
  await pool.query('SELECT 1');
  await pool.query(`
    CREATE TABLE IF NOT EXISTS users (
      id BIGSERIAL PRIMARY KEY, email VARCHAR(254) NOT NULL UNIQUE,
      password_hash TEXT NOT NULL, created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
    );
    CREATE TABLE IF NOT EXISTS habits (
      id BIGSERIAL PRIMARY KEY, user_id BIGINT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
      name VARCHAR(100) NOT NULL, icon VARCHAR(10) NOT NULL DEFAULT '📝',
      created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
    );
    CREATE INDEX IF NOT EXISTS habits_user_created_idx ON habits (user_id, created_at DESC);
    CREATE TABLE IF NOT EXISTS habit_tracking (
      habit_id BIGINT NOT NULL REFERENCES habits(id) ON DELETE CASCADE,
      date DATE NOT NULL, completed BOOLEAN NOT NULL DEFAULT FALSE, PRIMARY KEY (habit_id, date)
    );
  `);
}

export default pool;
