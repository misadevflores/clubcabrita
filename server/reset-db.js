import { initializeSupabaseDb } from './supabase-db.js';

async function resetDatabase() {
  try {
    console.log('\n🔄 Reseteando base de datos Supabase...\n');
    
    // Reinicializar la base de datos (crea tablas si no existen)
    await initializeSupabaseDb();
    
    console.log('✅ Base de datos reseteada exitosamente\n');
  } catch (err) {
    console.error('❌ Error al resetear BD:', err);
    process.exit(1);
  }
}

resetDatabase();
