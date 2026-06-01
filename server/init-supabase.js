import { initializeSupabaseDb } from './supabase-db.js';

async function main() {
  try {
    console.log('🚀 Inicializando Supabase PostgreSQL...\n');
    await initializeSupabaseDb();
    process.exit(0);
  } catch (err) {
    console.error('Error:', err);
    process.exit(1);
  }
}

main();
