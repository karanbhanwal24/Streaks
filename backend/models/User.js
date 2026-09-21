import { query } from '../db.js';

const mapUser = row => row && ({ _id: String(row.id), email: row.email, password: row.password_hash, createdAt: row.created_at });

export const findUserByEmail = async email => {
  const { rows } = await query('SELECT id, email, password_hash, created_at FROM users WHERE email = $1', [email]);
  return mapUser(rows[0]);
};

export const createUser = async ({ email, password }) => {
  const { rows } = await query(
    'INSERT INTO users (email, password_hash) VALUES ($1, $2) RETURNING id, email, password_hash, created_at', [email, password]
  );
  return mapUser(rows[0]);
};
