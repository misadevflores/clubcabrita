import pkg from 'pg';
const { Pool } = pkg;
import dotenv from 'dotenv';

dotenv.config();

const pool = new Pool({
  host: 'db.orxyjpeanhscwzajpbkw.supabase.co',
  port: 5432,
  database: 'postgres',
  user: 'postgres',
  password: 'clubcabritabd',
  ssl: {
    rejectUnauthorized: false
  }
});

export async function connectSupabase() {
  try {
    const client = await pool.connect();
    console.log('✓ Conectado a Supabase PostgreSQL');
    return client;
  } catch (err) {
    console.error('❌ Error conectando a Supabase:', err);
    throw err;
  }
}

export async function initializeSupabaseDb() {
  const client = await connectSupabase();
  
  try {
    console.log('\n📊 Creando tablas en Supabase...\n');

    // Crear tabla users
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

    // Crear tabla routes
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

    // Crear tabla gallery
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

    // Crear tabla settings
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

    // Crear tabla contact_messages
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

    // Crear tabla events
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

    // Crear tabla event_registrations
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

    // Crear tabla audit_logs
    await client.query(`
      CREATE TABLE IF NOT EXISTS audit_logs (
        id SERIAL PRIMARY KEY,
        user_id INTEGER REFERENCES users(id),
        action VARCHAR(100) NOT NULL,
        table_name VARCHAR(100),
        record_id INTEGER,
        old_values JSONB,
        new_values JSONB,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);
    console.log('✓ Tabla audit_logs creada');

    // Crear índices
    await client.query('CREATE INDEX IF NOT EXISTS idx_users_username ON users(username)');
    await client.query('CREATE INDEX IF NOT EXISTS idx_users_email ON users(email)');
    await client.query('CREATE INDEX IF NOT EXISTS idx_routes_date ON routes(date)');
    await client.query('CREATE INDEX IF NOT EXISTS idx_routes_type ON routes(type)');
    await client.query('CREATE INDEX IF NOT EXISTS idx_routes_is_published ON routes(is_published)');
    await client.query('CREATE INDEX IF NOT EXISTS idx_gallery_category ON gallery(category)');
    await client.query('CREATE INDEX IF NOT EXISTS idx_gallery_is_published ON gallery(is_published)');
    await client.query('CREATE INDEX IF NOT EXISTS idx_gallery_display_order ON gallery(display_order)');
    await client.query('CREATE INDEX IF NOT EXISTS idx_settings_key ON settings(setting_key)');
    await client.query('CREATE INDEX IF NOT EXISTS idx_contact_messages_email ON contact_messages(email)');
    await client.query('CREATE INDEX IF NOT EXISTS idx_contact_messages_is_read ON contact_messages(is_read)');
    await client.query('CREATE INDEX IF NOT EXISTS idx_events_event_date ON events(event_date)');
    await client.query('CREATE INDEX IF NOT EXISTS idx_events_is_published ON events(is_published)');
    await client.query('CREATE INDEX IF NOT EXISTS idx_event_registrations_event_id ON event_registrations(event_id)');
    await client.query('CREATE INDEX IF NOT EXISTS idx_event_registrations_email ON event_registrations(email)');
    await client.query('CREATE INDEX IF NOT EXISTS idx_audit_logs_user_id ON audit_logs(user_id)');
    await client.query('CREATE INDEX IF NOT EXISTS idx_audit_logs_created_at ON audit_logs(created_at)');
    console.log('✓ Índices creados');

    // Insertar usuario admin
    const adminExists = await client.query('SELECT id FROM users WHERE username = $1', ['admin']);
    if (adminExists.rows.length === 0) {
      await client.query(
        'INSERT INTO users (username, email, password, role, is_active) VALUES ($1, $2, $3, $4, $5)',
        ['admin', 'admin@clubcabritas.com', '$2a$10$YourHashedPasswordHere', 'admin', true]
      );
      console.log('✓ Usuario admin creado');
    }

    // Insertar configuración por defecto
    const settingsExist = await client.query('SELECT COUNT(*) FROM settings');
    if (settingsExist.rows[0].count === 0) {
      const defaultSettings = [
        ['site_name', 'Club Cabritas', 'Nombre del sitio'],
        ['site_description', 'Explora las mejores rutas de senderismo', 'Descripción del sitio'],
        ['contact_email', 'info@clubcabritas.com', 'Email de contacto'],
        ['phone', '+34 XXX XXX XXX', 'Teléfono de contacto'],
        ['address', 'Ubicación del club', 'Dirección'],
        ['facebook_url', '', 'URL de Facebook'],
        ['instagram_url', '', 'URL de Instagram'],
        ['twitter_url', '', 'URL de Twitter'],
        ['maintenance_mode', 'false', 'Modo mantenimiento']
      ];

      for (const [key, value, desc] of defaultSettings) {
        await client.query(
          'INSERT INTO settings (setting_key, setting_value, description) VALUES ($1, $2, $3)',
          [key, value, desc]
        );
      }
      console.log('✓ Configuración por defecto insertada');
    }

    // Insertar datos de galería
    const galleryExists = await client.query('SELECT COUNT(*) FROM gallery');
    if (galleryExists.rows[0].count === 0) {
      const galleryData = [
        ['¡Logramos el pico!', '/images/vertical-img1.jpeg', 'Un momento épico en la cumbre', 'Montaña', 0],
        ['Visita al Cafetal', '/images/cafetal-img1.jpeg', 'Explorando las plantaciones locales', 'Naturaleza', 1],
        ['Atardeceres Andinos', '/images/vertical-img3.jpeg', 'Puesta de sol majestuosa', 'Paisaje', 2],
        ['Atardeceres Andinos', '/images/vertical-img2.jpeg', 'Colores del atardecer', 'Paisaje', 3],
        ['Montañas del valle', '/images/vertical-img4.jpeg', 'Vista del valle', 'Montaña', 4],
        ['Alta Montaña', '/images/vertical-img5.jpeg', 'Cumbre nevada', 'Montaña', 5]
      ];

      for (const [title, image, description, category, order] of galleryData) {
        await client.query(
          'INSERT INTO gallery (title, image, description, category, display_order, is_published) VALUES ($1, $2, $3, $4, $5, $6)',
          [title, image, description, category, order, true]
        );
      }
      console.log('✓ Datos de galería insertados (6 imágenes)');
    }

    console.log('\n✅ Base de datos Supabase inicializada correctamente\n');
  } catch (err) {
    console.error('❌ Error inicializando BD:', err);
    throw err;
  } finally {
    client.release();
  }
}

export { pool };
