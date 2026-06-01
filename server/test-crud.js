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

async function testCRUD() {
  const client = await pool.connect();
  
  try {
    console.log('\n🧪 Probando CRUD en Supabase...\n');
    
    // TEST ROUTES
    console.log('📍 Probando ROUTES:');
    
    // CREATE
    const routeResult = await client.query(
      'INSERT INTO routes (title, date, type, image, description, is_published) VALUES ($1, $2, $3, $4, $5, $6) RETURNING *',
      ['Ruta de Prueba', '2026-06-15', 'Senderismo', '/images/test.jpg', 'Descripción de prueba', true]
    );
    const routeId = routeResult.rows[0].id;
    console.log(`  ✓ CREATE: Ruta creada con ID ${routeId}`);
    
    // READ
    const readRoute = await client.query('SELECT * FROM routes WHERE id = $1', [routeId]);
    console.log(`  ✓ READ: ${readRoute.rows[0].title}`);
    
    // UPDATE
    await client.query(
      'UPDATE routes SET title = $1, description = $2 WHERE id = $3',
      ['Ruta Actualizada', 'Descripción actualizada', routeId]
    );
    const updatedRoute = await client.query('SELECT * FROM routes WHERE id = $1', [routeId]);
    console.log(`  ✓ UPDATE: ${updatedRoute.rows[0].title}`);
    
    // DELETE
    await client.query('DELETE FROM routes WHERE id = $1', [routeId]);
    const deletedRoute = await client.query('SELECT COUNT(*) FROM routes WHERE id = $1', [routeId]);
    console.log(`  ✓ DELETE: Ruta eliminada (count: ${deletedRoute.rows[0].count})`);
    
    // TEST GALLERY
    console.log('\n🖼️  Probando GALLERY:');
    
    // CREATE
    const galleryResult = await client.query(
      'INSERT INTO gallery (title, image, description, category, display_order, is_published) VALUES ($1, $2, $3, $4, $5, $6) RETURNING *',
      ['Imagen de Prueba', '/images/test-gallery.jpg', 'Descripción de prueba', 'Prueba', 99, true]
    );
    const galleryId = galleryResult.rows[0].id;
    console.log(`  ✓ CREATE: Imagen creada con ID ${galleryId}`);
    
    // READ
    const readGallery = await client.query('SELECT * FROM gallery WHERE id = $1', [galleryId]);
    console.log(`  ✓ READ: ${readGallery.rows[0].title}`);
    
    // UPDATE
    await client.query(
      'UPDATE gallery SET title = $1, category = $2 WHERE id = $3',
      ['Imagen Actualizada', 'Categoría Actualizada', galleryId]
    );
    const updatedGallery = await client.query('SELECT * FROM gallery WHERE id = $1', [galleryId]);
    console.log(`  ✓ UPDATE: ${updatedGallery.rows[0].title} - ${updatedGallery.rows[0].category}`);
    
    // DELETE
    await client.query('DELETE FROM gallery WHERE id = $1', [galleryId]);
    const deletedGallery = await client.query('SELECT COUNT(*) FROM gallery WHERE id = $1', [galleryId]);
    console.log(`  ✓ DELETE: Imagen eliminada (count: ${deletedGallery.rows[0].count})`);
    
    // TEST EVENTS
    console.log('\n📅 Probando EVENTS:');
    
    // CREATE
    const eventResult = await client.query(
      'INSERT INTO events (title, event_date, location, capacity, description, image, is_published) VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING *',
      ['Evento de Prueba', '2026-07-01T10:00:00', 'Ubicación Prueba', 50, 'Descripción de prueba', '/images/test-event.jpg', true]
    );
    const eventId = eventResult.rows[0].id;
    console.log(`  ✓ CREATE: Evento creado con ID ${eventId}`);
    
    // READ
    const readEvent = await client.query('SELECT * FROM events WHERE id = $1', [eventId]);
    console.log(`  ✓ READ: ${readEvent.rows[0].title}`);
    
    // UPDATE
    await client.query(
      'UPDATE events SET title = $1, capacity = $2 WHERE id = $3',
      ['Evento Actualizado', 100, eventId]
    );
    const updatedEvent = await client.query('SELECT * FROM events WHERE id = $1', [eventId]);
    console.log(`  ✓ UPDATE: ${updatedEvent.rows[0].title} - Capacidad: ${updatedEvent.rows[0].capacity}`);
    
    // DELETE
    await client.query('DELETE FROM events WHERE id = $1', [eventId]);
    const deletedEvent = await client.query('SELECT COUNT(*) FROM events WHERE id = $1', [eventId]);
    console.log(`  ✓ DELETE: Evento eliminado (count: ${deletedEvent.rows[0].count})`);
    
    // TEST SETTINGS
    console.log('\n⚙️  Probando SETTINGS:');
    
    // UPDATE (INSERT OR UPDATE)
    await client.query(
      'INSERT INTO settings (setting_key, setting_value) VALUES ($1, $2) ON CONFLICT (setting_key) DO UPDATE SET setting_value = $2',
      ['test_setting', 'valor de prueba']
    );
    console.log(`  ✓ CREATE/UPDATE: Setting creado/actualizado`);
    
    // READ
    const readSetting = await client.query('SELECT * FROM settings WHERE setting_key = $1', ['test_setting']);
    console.log(`  ✓ READ: ${readSetting.rows[0].setting_key} = ${readSetting.rows[0].setting_value}`);
    
    // DELETE
    await client.query('DELETE FROM settings WHERE setting_key = $1', ['test_setting']);
    const deletedSetting = await client.query('SELECT COUNT(*) FROM settings WHERE setting_key = $1', ['test_setting']);
    console.log(`  ✓ DELETE: Setting eliminado (count: ${deletedSetting.rows[0].count})`);
    
    // TEST CONTACT MESSAGES
    console.log('\n💬 Probando CONTACT MESSAGES:');
    
    // CREATE
    const messageResult = await client.query(
      'INSERT INTO contact_messages (name, email, phone, subject, message) VALUES ($1, $2, $3, $4, $5) RETURNING *',
      ['Nombre Prueba', 'test@example.com', '+591 12345678', 'Asunto Prueba', 'Mensaje de prueba']
    );
    const messageId = messageResult.rows[0].id;
    console.log(`  ✓ CREATE: Mensaje creado con ID ${messageId}`);
    
    // READ
    const readMessage = await client.query('SELECT * FROM contact_messages WHERE id = $1', [messageId]);
    console.log(`  ✓ READ: ${readMessage.rows[0].name} - ${readMessage.rows[0].email}`);
    
    // UPDATE
    await client.query(
      'UPDATE contact_messages SET is_read = true WHERE id = $1',
      [messageId]
    );
    const updatedMessage = await client.query('SELECT * FROM contact_messages WHERE id = $1', [messageId]);
    console.log(`  ✓ UPDATE: Mensaje marcado como leído (is_read: ${updatedMessage.rows[0].is_read})`);
    
    // DELETE
    await client.query('DELETE FROM contact_messages WHERE id = $1', [messageId]);
    const deletedMessage = await client.query('SELECT COUNT(*) FROM contact_messages WHERE id = $1', [messageId]);
    console.log(`  ✓ DELETE: Mensaje eliminado (count: ${deletedMessage.rows[0].count})`);
    
    console.log('\n✅ Todos los CRUD funcionan correctamente!\n');
    
  } catch (err) {
    console.error('❌ Error:', err);
  } finally {
    client.release();
    pool.end();
  }
}

testCRUD();
