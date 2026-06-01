import pkg from 'pg';
import bcrypt from 'bcryptjs';
const { Pool } = pkg;

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

async function seedAllData() {
  const client = await pool.connect();
  
  try {
    console.log('\n📊 Insertando datos de ejemplo en Supabase...\n');
    
    // 1. USUARIOS
    console.log('👤 Insertando usuarios...');
    await client.query('DELETE FROM users');
    
    const hashedPassword = await bcrypt.hash('admin', 10);
    await client.query(
      'INSERT INTO users (username, email, password, role, is_active) VALUES ($1, $2, $3, $4, $5)',
      ['admin', 'admin@clubcabritas.com', hashedPassword, 'admin', true]
    );
    console.log('✓ Usuario admin creado');
    
    // 2. RUTAS
    console.log('\n🏔️  Insertando rutas...');
    await client.query('DELETE FROM routes');
    
    const routes = [
      {
        title: 'Ascenso al Nevado Condoriri',
        date: '2026-05-15',
        type: 'Alta Montaña',
        image: '/images/route_snow.png',
        description: 'Una expedición inolvidable a una de las cumbres más icónicas de la Cordillera Real.',
        difficulty: 'Difícil',
        distance: 25.5,
        duration: '3 días',
        location: 'Cordillera Real, Bolivia'
      },
      {
        title: 'Trekking Valle de las Ánimas',
        date: '2026-05-22',
        type: 'Senderismo',
        image: '/images/route_green.png',
        description: 'Recorrido por las increíbles y místicas formaciones geológicas a pocos minutos de La Paz.',
        difficulty: 'Moderado',
        distance: 12.0,
        duration: '1 día',
        location: 'Valle de las Ánimas, La Paz'
      },
      {
        title: 'Cicloruta Yungas',
        date: '2026-06-10',
        type: 'Ciclismo',
        image: '/images/route_green.png',
        description: 'Descenso emocionante por la famosa ruta de la muerte con vistas espectaculares.',
        difficulty: 'Moderado',
        distance: 64.0,
        duration: '1 día',
        location: 'Yungas, La Paz'
      }
    ];
    
    for (const route of routes) {
      await client.query(
        'INSERT INTO routes (title, date, type, image, description, difficulty, distance, duration, location, is_published) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)',
        [route.title, route.date, route.type, route.image, route.description, route.difficulty, route.distance, route.duration, route.location, true]
      );
    }
    console.log(`✓ ${routes.length} rutas insertadas`);
    
    // 3. GALERÍA
    console.log('\n🖼️  Insertando galería...');
    await client.query('DELETE FROM gallery');
    
    const gallery = [
      {
        title: '¡Logramos el pico!',
        image: '/images/vertical-img1.jpeg',
        description: 'Un momento épico en la cumbre',
        category: 'Montaña',
        display_order: 0
      },
      {
        title: 'Visita al Cafetal',
        image: '/images/cafetal-img1.jpeg',
        description: 'Explorando las plantaciones locales',
        category: 'Naturaleza',
        display_order: 1
      },
      {
        title: 'Atardeceres Andinos',
        image: '/images/vertical-img3.jpeg',
        description: 'Puesta de sol majestuosa',
        category: 'Paisaje',
        display_order: 2
      },
      {
        title: 'Colores del atardecer',
        image: '/images/vertical-img2.jpeg',
        description: 'Tonalidades cálidas en el horizonte',
        category: 'Paisaje',
        display_order: 3
      },
      {
        title: 'Montañas del valle',
        image: '/images/vertical-img4.jpeg',
        description: 'Vista panorámica del valle',
        category: 'Montaña',
        display_order: 4
      },
      {
        title: 'Alta Montaña',
        image: '/images/vertical-img5.jpeg',
        description: 'Cumbre nevada con vistas espectaculares',
        category: 'Montaña',
        display_order: 5
      }
    ];
    
    for (const item of gallery) {
      await client.query(
        'INSERT INTO gallery (title, image, description, category, display_order, is_published) VALUES ($1, $2, $3, $4, $5, $6)',
        [item.title, item.image, item.description, item.category, item.display_order, true]
      );
    }
    console.log(`✓ ${gallery.length} imágenes de galería insertadas`);
    
    // 4. EVENTOS
    console.log('\n📅 Insertando eventos...');
    await client.query('DELETE FROM events');
    
    const events = [
      {
        title: 'Expedición Condoriri 2026',
        description: 'Expedición de 3 días al Nevado Condoriri con guías expertos',
        event_date: '2026-05-15T08:00:00',
        location: 'Cordillera Real',
        capacity: 15,
        image: '/images/route_snow.png'
      },
      {
        title: 'Trekking Valle de las Ánimas',
        description: 'Caminata de un día por las formaciones geológicas más hermosas',
        event_date: '2026-05-22T07:00:00',
        location: 'Valle de las Ánimas',
        capacity: 20,
        image: '/images/route_green.png'
      },
      {
        title: 'Cicloruta Yungas',
        description: 'Descenso emocionante por la ruta más peligrosa del mundo',
        event_date: '2026-06-10T06:00:00',
        location: 'Yungas',
        capacity: 25,
        image: '/images/route_green.png'
      }
    ];
    
    for (const event of events) {
      await client.query(
        'INSERT INTO events (title, description, event_date, location, capacity, image, is_published) VALUES ($1, $2, $3, $4, $5, $6, $7)',
        [event.title, event.description, event.event_date, event.location, event.capacity, event.image, true]
      );
    }
    console.log(`✓ ${events.length} eventos insertados`);
    
    // 5. CONFIGURACIÓN
    console.log('\n⚙️  Insertando configuración...');
    await client.query('DELETE FROM settings');
    
    const settings = [
      ['site_name', 'Club Cabritas', 'Nombre del sitio'],
      ['site_description', 'Explora las mejores rutas de senderismo y aventura en Bolivia', 'Descripción del sitio'],
      ['hero_title', 'NO SOMOS AGENCIA, SOMOS VIAJEROS', 'Título del hero'],
      ['hero_subtitle', 'Descubre las mejores rutas y ascensos con Club Cabritas', 'Subtítulo del hero'],
      ['contact_email', 'info@clubcabritas.com', 'Email de contacto'],
      ['phone', '+591 12345678', 'Teléfono de contacto'],
      ['address', 'La Paz, Bolivia', 'Dirección'],
      ['facebook_url', 'https://facebook.com/clubcabritas', 'URL de Facebook'],
      ['instagram_url', 'https://instagram.com/clubcabritas', 'URL de Instagram'],
      ['twitter_url', 'https://twitter.com/clubcabritas', 'URL de Twitter'],
      ['maintenance_mode', 'false', 'Modo mantenimiento']
    ];
    
    for (const [key, value, desc] of settings) {
      await client.query(
        'INSERT INTO settings (setting_key, setting_value, description) VALUES ($1, $2, $3)',
        [key, value, desc]
      );
    }
    console.log(`✓ ${settings.length} configuraciones insertadas`);
    
    console.log('\n✅ Todos los datos de ejemplo han sido insertados correctamente\n');
    
    // Mostrar resumen
    const userCount = await client.query('SELECT COUNT(*) FROM users');
    const routeCount = await client.query('SELECT COUNT(*) FROM routes');
    const galleryCount = await client.query('SELECT COUNT(*) FROM gallery');
    const eventCount = await client.query('SELECT COUNT(*) FROM events');
    const settingCount = await client.query('SELECT COUNT(*) FROM settings');
    
    console.log('📊 RESUMEN:');
    console.log(`   Usuarios: ${userCount.rows[0].count}`);
    console.log(`   Rutas: ${routeCount.rows[0].count}`);
    console.log(`   Galería: ${galleryCount.rows[0].count}`);
    console.log(`   Eventos: ${eventCount.rows[0].count}`);
    console.log(`   Configuración: ${settingCount.rows[0].count}\n`);
    
  } catch (err) {
    console.error('❌ Error:', err);
  } finally {
    client.release();
    pool.end();
  }
}

seedAllData();
