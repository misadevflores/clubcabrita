import { openDb } from './database.js';

async function checkGallery() {
  try {
    const db = await openDb();
    
    console.log('\n📊 VERIFICACIÓN DE GALERÍA\n');
    
    // Contar registros
    const count = await db.get('SELECT COUNT(*) as count FROM gallery');
    console.log(`✓ Total de imágenes: ${count.count}`);
    
    // Mostrar todas las imágenes
    const gallery = await db.all('SELECT * FROM gallery ORDER BY display_order ASC');
    
    if (gallery.length === 0) {
      console.log('❌ No hay imágenes en la galería');
      return;
    }
    
    console.log('\n📸 Imágenes en la BD:\n');
    gallery.forEach((item, index) => {
      console.log(`${index + 1}. ${item.title}`);
      console.log(`   ID: ${item.id}`);
      console.log(`   Imagen: ${item.image}`);
      console.log(`   Categoría: ${item.category}`);
      console.log(`   Orden: ${item.display_order}`);
      console.log(`   Publicada: ${item.is_published ? 'Sí' : 'No'}`);
      console.log(`   Descripción: ${item.description}\n`);
    });
    
    console.log('✅ Verificación completada');
  } catch (err) {
    console.error('❌ Error:', err);
  }
}

checkGallery();
