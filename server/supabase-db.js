import pkg from 'pg';
const { Pool } = pkg;
import dotenv from 'dotenv';

dotenv.config();

// El pooler de Supabase (aws-0-us-east-1.pooler.supabase.com) resuelve a IPv4
// El host directo (db.*.supabase.co) solo resuelve a IPv6 — no funciona en redes sin IPv6
const connectionString = process.env.DATABASE_URL ||
  'postgresql://postgres.orxyjpeanhscwzajpbkw:clubcabritalink@aws-0-us-east-1.pooler.supabase.com:6543/postgres';

const pool = new Pool({
  connectionString,
  ssl: { rejectUnauthorized: false },
  // El pooler de Supabase usa pgBouncer en modo transaction — 
  // no soporta prepared statements
  max: 10,
  idleTimeoutMillis: 30000,
  connectionTimeoutMillis: 10000,
});

pool.on('error', (err) => {
  console.error('⚠️  Unexpected pool error:', err.message);
});

export async function connectSupabase() {
  try {
    const client = await pool.connect();
    await client.query('SELECT 1');
    client.release();
    console.log('✓ Conectado a Supabase PostgreSQL (pooler IPv4)');
    return true;
  } catch (err) {
    console.error('❌ Error conectando a Supabase:', err.message);
    throw err;
  }
}

export { pool };
