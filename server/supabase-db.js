import pkg from 'pg';
const { Pool } = pkg;
import dotenv from 'dotenv';

dotenv.config();

// Use DATABASE_URL from .env if available, otherwise build from parts
const pool = process.env.DATABASE_URL
  ? new Pool({
      connectionString: process.env.DATABASE_URL,
      ssl: { rejectUnauthorized: false }
    })
  : new Pool({
      host: 'db.orxyjpeanhscwzajpbkw.supabase.co',
      port: 5432,
      database: 'postgres',
      user: 'postgres',
      password: process.env.SUPABASE_PASSWORD || 'clubcabritabd',
      ssl: { rejectUnauthorized: false }
    });

export async function connectSupabase() {
  try {
    const client = await pool.connect();
    client.release();
    console.log('✓ Conectado a Supabase PostgreSQL');
    return true;
  } catch (err) {
    console.error('❌ Error conectando a Supabase:', err);
    throw err;
  }
}

export async function initializeSupabaseDb() {
  const client = await pool.connect();

  try {
    console.log('\n📊 Creando tablas en Supabase...\n');

    await client.query(`
      CREATE TABLE IF NOT EXISTS users (
        id SERIAL PRIMARY KEY,
        username VARCHAR(255) UNIQUE NOT NULL,
        password VARCHAR(255) NOT NULL,
        email VARCHAR(255) UNIQUE,
        role VARCHAR(50) DEFAULT 'user',
        is_active BOOLEAN DEFAULT true,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);
    console.log('✓ Tabla users creada');

    await client.query(`
      CREATE TABLE IF NOT EXISTS routes (
        id SERIAL PRIMARY KEY,
        title VARCHAR(255) NOT NULL,
        date DATE NOT NULL,
        type VARCHAR(100) NOT NULL,
        image TEXT,
        description TEXT,
        difficulty VARCHAR(50),
        distance DECIMAL(10, 2),
        duration VARCHAR(100),
        location VARCHAR(255),
        is_published BOOLEAN DEFAULT true,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        created_by INTEGER REFERENCES users(id)
      )
    `);
    console.log('✓ Tabla routes creada');

    await client.query(`
      CREATE TABLE IF NOT EXISTS gallery (
        id SERIAL PRIMARY KEY,
        title VARCHAR(255) NOT NULL,
        image TEXT NOT NULL,
        description TEXT,
        category VARCHAR(100),
        display_order INTEGER DEFAULT 0,
        is_published BOOLEAN DEFAULT true,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        created_by INTEGER REFERENCES users(id)
      )
    `);
    console.log('✓ Tabla gallery creada');

    await client.query(`
      CREATE TABLE IF NOT EXISTS settings (
        id SERIAL PRIMARY KEY,
        setting_key VARCHAR(255) UNIQUE NOT NULL,
        setting_value TEXT,
        description TEXT,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);
    console.log('✓ Tabla settings creada');

    await client.query(`
      CREATE TABLE IF NOT EXISTS contact_messages (
        id SERIAL PRIMARY KEY,
        name VARCHAR(255) NOT NULL,
        email VARCHAR(255) NOT NULL,
        phone VARCHAR(20),
        subject VARCHAR(255),
        message TEXT NOT NULL,
        is_read BOOLEAN DEFAULT false,
        is_replied BOOLEAN DEFAULT false,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);
    console.log('✓ Tabla contact_messages creada');

    await client.query(`
      CREATE TABLE IF NOT EXISTS events (
        id SERIAL PRIMARY KEY,
        title VARCHAR(255) NOT NULL,
        description TEXT,
        event_date TIMESTAMP NOT NULL,
        location VARCHAR(255),
        image TEXT,
        capacity INTEGER,
        registered_count INTEGER DEFAULT 0,
        is_published BOOLEAN DEFAULT true,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        created_by INTEGER REFERENCES users(id)
      )
    `);
    console.log('✓ Tabla events creada');

    await client.query(`
      CREATE TABLE IF NOT EXISTS event_registrations (
        id SERIAL PRIMARY KEY,
        event_id INTEGER NOT NULL REFERENCES events(id) ON DELETE CASCADE,
        name VARCHAR(255) NOT NULL,
        email VARCHAR(255) NOT NULL,
        phone VARCHAR(20),
        number_of_people INTEGER DEFAULT 1,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);
    console.log('✓ Tabla event_registrations creada');

    // Índices
    const indexes = [
      'CREATE INDEX IF NOT EXISTS idx_users_username ON users(username)',
      'CREATE INDEX IF NOT EXISTS idx_routes_date ON routes(date)',
      'CREATE INDEX IF NOT EXISTS idx_routes_is_published ON routes(is_published)',
      'CREATE INDEX IF NOT EXISTS idx_gallery_category ON gallery(category)',
      'CREATE INDEX IF NOT EXISTS idx_gallery_is_published ON gallery(is_published)',
      'CREATE INDEX IF NOT EXISTS idx_gallery_display_order ON gallery(display_order)',
      'CREATE INDEX IF NOT EXISTS idx_settings_key ON settings(setting_key)',
      'CREATE INDEX IF NOT EXISTS idx_contact_messages_is_read ON contact_messages(is_read)',
      'CREATE INDEX IF NOT EXISTS idx_events_event_date ON events(event_date)',
      'CREATE INDEX IF NOT EXISTS idx_events_is_published ON events(is_published)',
    ];
    for (const idx of indexes) await client.query(idx);
    console.log('✓ Índices creados');

    console.log('\n✅ Base de datos Supabase inicializada correctamente\n');
  } catch (err) {
    console.error('❌ Error inicializando BD:', err);
    throw err;
  } finally {
    client.release();
  }
}

export { pool };
