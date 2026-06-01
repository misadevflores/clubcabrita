import pkg from 'pg';
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

const galleryData = [
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

async function seedGallery() {
  const client = await pool.connect();
  
  try {
    console.log('\n🖼️  Insertando datos de galería en Supabase...\n');
    
    // Limpiar galería existente
    await client.query('DELETE FROM gallery');
    console.log('✓ Galería limpiada');
    
    // Insertar nuevos datos
    for (const item of galleryData) {
      await client.query(
        'INSERT INTO gallery (title, image, description, category, display_order, is_published) VALUES ($1, $2, $3, $4, $5, $6)',
        [item.title, item.image, item.description, item.category, item.display_order, true]
      );
    }
    
    console.log(`✓ ${galleryData.length} imágenes insertadas exitosamente`);
    
    // Verificar datos
    const result = await client.query('SELECT COUNT(*) FROM gallery');
    console.log(`✓ Total de imágenes en galería: ${result.rows[0].count}`);
    
    console.log('\n✅ Datos de galería insertados correctamente\n');
  } catch (err) {
    console.error('❌ Error al insertar datos:', err);
  } finally {
    client.release();
    pool.end();
  }
}

seedGallery();
