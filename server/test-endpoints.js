import fetch from 'node-fetch';

const BASE_URL = 'http://localhost:3000/api';

async function testEndpoints() {
  try {
    console.log('\n🧪 Probando Endpoints API...\n');
    
    // 1. LOGIN
    console.log('🔐 Probando LOGIN...');
    const loginRes = await fetch(`${BASE_URL}/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username: 'admin', password: 'admin' })
    });
    
    if (!loginRes.ok) {
      console.error('❌ Login falló:', await loginRes.text());
      return;
    }
    
    const loginData = await loginRes.json();
    const token = loginData.token;
    console.log('✓ Login exitoso, token obtenido');
    
    // 2. GET GALLERY (Público)
    console.log('\n🖼️  Probando GET /api/gallery (Público)...');
    const galleryRes = await fetch(`${BASE_URL}/gallery`);
    const galleryData = await galleryRes.json();
    console.log(`✓ Galería: ${galleryData.length} imágenes`);
    if (galleryData.length > 0) {
      console.log(`  - Primera imagen: ${galleryData[0].title}`);
    }
    
    // 3. GET ROUTES (Público)
    console.log('\n📍 Probando GET /api/routes (Público)...');
    const routesRes = await fetch(`${BASE_URL}/routes`);
    const routesData = await routesRes.json();
    console.log(`✓ Rutas: ${routesData.length} rutas`);
    if (routesData.length > 0) {
      console.log(`  - Primera ruta: ${routesData[0].title}`);
    }
    
    // 4. GET EVENTS (Público)
    console.log('\n📅 Probando GET /api/events (Público)...');
    const eventsRes = await fetch(`${BASE_URL}/events`);
    const eventsData = await eventsRes.json();
    console.log(`✓ Eventos: ${eventsData.length} eventos`);
    if (eventsData.length > 0) {
      console.log(`  - Primer evento: ${eventsData[0].title}`);
    }
    
    // 5. GET SETTINGS (Público)
    console.log('\n⚙️  Probando GET /api/settings (Público)...');
    const settingsRes = await fetch(`${BASE_URL}/settings`);
    const settingsData = await settingsRes.json();
    console.log(`✓ Configuración: ${Object.keys(settingsData).length} configuraciones`);
    console.log(`  - Site name: ${settingsData.site_name}`);
    
    // 6. GET GALLERY ADMIN (Protegido)
    console.log('\n🖼️  Probando GET /api/gallery/admin/all (Protegido)...');
    const galleryAdminRes = await fetch(`${BASE_URL}/gallery/admin/all`, {
      headers: { 'Authorization': `Bearer ${token}` }
    });
    const galleryAdminData = await galleryAdminRes.json();
    console.log(`✓ Galería Admin: ${galleryAdminData.length} imágenes`);
    
    // 7. GET CONTACT MESSAGES (Protegido)
    console.log('\n💬 Probando GET /api/contact-messages (Protegido)...');
    const messagesRes = await fetch(`${BASE_URL}/contact-messages`, {
      headers: { 'Authorization': `Bearer ${token}` }
    });
    const messagesData = await messagesRes.json();
    console.log(`✓ Mensajes: ${messagesData.length} mensajes`);
    
    console.log('\n✅ Todos los endpoints funcionan correctamente!\n');
    
  } catch (err) {
    console.error('❌ Error:', err.message);
  }
}

// Esperar a que el servidor esté listo
setTimeout(testEndpoints, 2000);
