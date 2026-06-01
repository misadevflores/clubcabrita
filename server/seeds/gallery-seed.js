import { openDb } from '../database.js';

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
    title: 'Atardeceres Andinos',
    image: '/images/vertical-img2.jpeg',
    description: 'Colores del atardecer',
    category: 'Paisaje',
    display_order: 3
  },
  {
    title: 'Montañas del valle',
    image: '/images/vertical-img4.jpeg',
    description: 'Vista del valle',
    category: 'Montaña',
    display_order: 4
  },
  {
    title: 'Alta Montaña',
    image: '/images/vertical-img5.jpeg',
    description: 'Cumbre nevada',
    category: 'Montaña',
    display_order: 5
  }
];

export async function seedGallery() {
  try {
    const db = await openDb();
    
    // Verificar si ya hay datos
    const count = await db.get('SELECT COUNT(*) as count FROM gallery');
    
    if (count.count === 0) {
      console.log('Insertando datos de galería...');
      
      for (const item of galleryData) {
        await db.run(
          'INSERT INTO gallery (title, image, description, category, display_order) VALUES (?, ?, ?, ?, ?)',
          [item.title, item.image, item.description, item.category, item.display_order]
        );
      }
      
      console.log(`✓ ${galleryData.length} imágenes insertadas en la galería`);
    } else {
      console.log(`✓ La galería ya contiene ${count.count} imágenes`);
    }
  } catch (err) {
    console.error('Error al insertar datos de galería:', err);
  }
}
