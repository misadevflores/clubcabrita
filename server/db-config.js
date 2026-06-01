import { pool } from './supabase-db.js';

// Usar Supabase como BD principal
export async function getDb() {
  return pool;
}

export async function query(text, params) {
  try {
    const result = await pool.query(text, params);
    return result;
  } catch (err) {
    console.error('Database query error:', err);
    throw err;
  }
}

export async function getOne(text, params) {
  const result = await query(text, params);
  return result.rows[0];
}

export async function getAll(text, params) {
  const result = await query(text, params);
  return result.rows;
}

export async function run(text, params) {
  const result = await query(text, params);
  return result;
}
