<template>
  <div class="admin-dashboard">
    <div class="dashboard-header">
      <h1>Panel de Administración</h1>
      <button @click="logout" class="btn-logout">Cerrar Sesión</button>
    </div>

    <div class="dashboard-nav">
      <button 
        v-for="tab in tabs" 
        :key="tab"
        @click="activeTab = tab"
        :class="{ active: activeTab === tab }"
        class="nav-btn"
      >
        {{ tab }}
      </button>
    </div>

    <!-- RUTAS -->
    <div v-if="activeTab === 'Rutas'" class="tab-content">
      <div class="section-header">
        <h2>Gestionar Rutas</h2>
        <button @click="showRouteForm = !showRouteForm" class="btn-primary">
          {{ showRouteForm ? 'Cancelar' : '+ Nueva Ruta' }}
        </button>
      </div>

      <form v-if="showRouteForm" @submit.prevent="saveRoute" class="form-container">
        <input v-model="currentRoute.title" placeholder="Título" required />
        <input v-model="currentRoute.date" type="date" required />
        <select v-model="currentRoute.type" required>
          <option value="">Selecciona tipo</option>
          <option value="Senderismo">Senderismo</option>
          <option value="Escalada">Escalada</option>
          <option value="Ciclismo">Ciclismo</option>
          <option value="Alta Montaña">Alta Montaña</option>
        </select>
        <input v-model="currentRoute.difficulty" placeholder="Dificultad (Fácil, Moderado, Difícil)" />
        <input v-model.number="currentRoute.distance" type="number" placeholder="Distancia (km)" step="0.1" />
        <input v-model="currentRoute.duration" placeholder="Duración (ej: 1 día, 3 días)" />
        <input v-model="currentRoute.location" placeholder="Ubicación" />
        <textarea v-model="currentRoute.description" placeholder="Descripción" required></textarea>
        <input type="file" @change="handleRouteImage" accept="image/*" />
        <button type="submit" class="btn-success">{{ currentRoute.id ? 'Actualizar' : 'Crear' }}</button>
      </form>

      <div class="items-grid">
        <div v-for="route in routes" :key="route.id" class="item-card">
          <img v-if="route.image" :src="route.image" :alt="route.title" />
          <h3>{{ route.title }}</h3>
          <p>{{ route.date }} - {{ route.type }}</p>
          <div class="card-actions">
            <button @click="editRoute(route)" class="btn-edit">Editar</button>
            <button @click="deleteRoute(route.id)" class="btn-delete">Eliminar</button>
          </div>
        </div>
      </div>
    </div>

    <!-- GALERÍA -->
    <div v-if="activeTab === 'Galería'" class="tab-content">
      <div class="section-header">
        <h2>Gestionar Galería</h2>
        <button @click="showGalleryForm = !showGalleryForm" class="btn-primary">
          {{ showGalleryForm ? 'Cancelar' : '+ Nueva Imagen' }}
        </button>
      </div>

      <form v-if="showGalleryForm" @submit.prevent="saveGallery" class="form-container">
        <input v-model="currentGallery.title" placeholder="Título" required />
        <input v-model="currentGallery.category" placeholder="Categoría" />
        <input v-model.number="currentGallery.display_order" type="number" placeholder="Orden de visualización" min="0" />
        <textarea v-model="currentGallery.description" placeholder="Descripción"></textarea>
        
        <!-- File Input con Preview -->
        <div class="file-input-wrapper">
          <label for="gallery-file" class="file-label">
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path><polyline points="17 8 12 3 7 8"></polyline><line x1="12" y1="3" x2="12" y2="15"></line></svg>
            Seleccionar Imagen
          </label>
          <input 
            id="gallery-file"
            type="file" 
            @change="handleGalleryImage" 
            accept="image/*"
            class="file-input"
          />
          
          <!-- Preview -->
          <div v-if="galleryImagePreview" class="preview-container">
            <img :src="galleryImagePreview" :alt="currentGallery.title" class="preview-image" />
            <button type="button" @click="clearGalleryPreview" class="btn-clear-preview">✕</button>
          </div>
        </div>

        <!-- Publicar/Despublicar -->
        <label class="checkbox-label">
          <input v-model="currentGallery.is_published" type="checkbox" />
          Publicar en galería
        </label>
        
        <button type="submit" class="btn-success">{{ currentGallery.id ? 'Actualizar' : 'Crear' }}</button>
      </form>

      <div class="gallery-grid">
        <div v-for="item in gallery" :key="item.id" class="gallery-item">
          <img v-if="item.image" :src="item.image" :alt="item.title" />
          <h3>{{ item.title }}</h3>
          <div class="card-actions">
            <button @click="editGallery(item)" class="btn-edit">Editar</button>
            <button @click="deleteGallery(item.id)" class="btn-delete">Eliminar</button>
          </div>
        </div>
      </div>
    </div>

    <!-- EVENTOS -->
    <div v-if="activeTab === 'Eventos'" class="tab-content">
      <div class="section-header">
        <h2>Gestionar Eventos</h2>
        <button @click="showEventForm = !showEventForm" class="btn-primary">
          {{ showEventForm ? 'Cancelar' : '+ Nuevo Evento' }}
        </button>
      </div>

      <form v-if="showEventForm" @submit.prevent="saveEvent" class="form-container">
        <input v-model="currentEvent.title" placeholder="Título" required />
        <input v-model="currentEvent.event_date" type="datetime-local" required />
        <input v-model="currentEvent.location" placeholder="Ubicación" />
        <input v-model="currentEvent.capacity" type="number" placeholder="Capacidad" />
        <textarea v-model="currentEvent.description" placeholder="Descripción"></textarea>
        <input type="file" @change="handleEventImage" accept="image/*" />
        <button type="submit" class="btn-success">{{ currentEvent.id ? 'Actualizar' : 'Crear' }}</button>
      </form>

      <div class="items-grid">
        <div v-for="event in events" :key="event.id" class="item-card">
          <img v-if="event.image" :src="event.image" :alt="event.title" />
          <h3>{{ event.title }}</h3>
          <p>{{ event.event_date }} - {{ event.location }}</p>
          <div class="card-actions">
            <button @click="editEvent(event)" class="btn-edit">Editar</button>
            <button @click="deleteEvent(event.id)" class="btn-delete">Eliminar</button>
          </div>
        </div>
      </div>
    </div>

    <!-- MENSAJES DE CONTACTO -->
    <div v-if="activeTab === 'Mensajes'" class="tab-content">
      <h2>Mensajes de Contacto</h2>
      <div class="messages-list">
        <div v-for="msg in messages" :key="msg.id" class="message-item" :class="{ unread: !msg.is_read }">
          <div class="message-header">
            <strong>{{ msg.name }}</strong>
            <span class="message-date">{{ formatDate(msg.created_at) }}</span>
          </div>
          <p><strong>Email:</strong> {{ msg.email }}</p>
          <p><strong>Teléfono:</strong> {{ msg.phone }}</p>
          <p><strong>Asunto:</strong> {{ msg.subject }}</p>
          <p class="message-text">{{ msg.message }}</p>
          <div class="card-actions">
            <button @click="markAsRead(msg.id)" class="btn-edit">Marcar como leído</button>
            <button @click="deleteMessage(msg.id)" class="btn-delete">Eliminar</button>
          </div>
        </div>
      </div>
    </div>

    <!-- PÁGINA PRINCIPAL -->
    <div v-if="activeTab === 'Página Principal'" class="tab-content">
      <h2>Editar Página Principal</h2>
      <form @submit.prevent="savePageSettings" class="form-container">
        <div class="form-section">
          <h3>Sección Hero</h3>
          <input v-model="settings.hero_title" placeholder="Título principal" />
          <textarea v-model="settings.hero_subtitle" placeholder="Subtítulo"></textarea>
        </div>

        <div class="form-section">
          <h3>Información General</h3>
          <input v-model="settings.site_name" placeholder="Nombre del sitio" />
          <textarea v-model="settings.site_description" placeholder="Descripción del sitio"></textarea>
        </div>

        <div class="form-section">
          <h3>Contacto</h3>
          <input v-model="settings.contact_email" type="email" placeholder="Email de contacto" />
          <input v-model="settings.phone" placeholder="Teléfono" />
          <input v-model="settings.address" placeholder="Dirección" />
        </div>

        <div class="form-section">
          <h3>Redes Sociales</h3>
          <input v-model="settings.facebook_url" placeholder="URL Facebook" />
          <input v-model="settings.instagram_url" placeholder="URL Instagram" />
          <input v-model="settings.twitter_url" placeholder="URL Twitter" />
        </div>

        <button type="submit" class="btn-success">Guardar Cambios</button>
      </form>
    </div>

    <!-- CONFIGURACIÓN -->
    <div v-if="activeTab === 'Configuración'" class="tab-content">
      <h2>Configuración del Sitio</h2>
      <form @submit.prevent="saveSettings" class="form-container">
        <label class="checkbox-label">
          <input v-model="settings.maintenance_mode" type="checkbox" />
          Modo mantenimiento
        </label>
        <button type="submit" class="btn-success">Guardar Configuración</button>
      </form>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useAuthStore } from '@/store/auth'
import { useRouter } from 'vue-router'

const router = useRouter()
const auth = useAuthStore()

const activeTab = ref('Rutas')
const tabs = ['Rutas', 'Galería', 'Eventos', 'Mensajes', 'Página Principal', 'Configuración']

// Routes
const routes = ref([])
const showRouteForm = ref(false)
const currentRoute = ref({ title: '', date: '', type: '', difficulty: '', distance: '', duration: '', location: '', description: '', image: '' })
const routeImageFile = ref(null)

// Gallery
const gallery = ref([])
const showGalleryForm = ref(false)
const currentGallery = ref({ title: '', category: '', description: '', image: '', display_order: 0, is_published: true })
const galleryImageFile = ref(null)
const galleryImagePreview = ref('')

// Events
const events = ref([])
const showEventForm = ref(false)
const currentEvent = ref({ title: '', event_date: '', location: '', capacity: '', description: '', image: '' })
const eventImageFile = ref(null)

// Messages
const messages = ref([])

// Settings
const settings = ref({
  site_name: '',
  site_description: '',
  contact_email: '',
  phone: '',
  address: '',
  facebook_url: '',
  instagram_url: '',
  twitter_url: '',
  maintenance_mode: false
})

const logout = () => {
  auth.logout()
  router.push('/login')
}

const formatDate = (date: string) => {
  return new Date(date).toLocaleDateString('es-ES')
}

// ROUTES FUNCTIONS
const fetchRoutes = async () => {
  try {
    const res = await fetch('/api/routes')
    routes.value = await res.json()
  } catch (err) {
    console.error('Error fetching routes:', err)
  }
}

const handleRouteImage = (e: Event) => {
  routeImageFile.value = (e.target as HTMLInputElement).files?.[0]
}

const saveRoute = async () => {
  try {
    if (!currentRoute.value.title || !currentRoute.value.date || !currentRoute.value.type || !currentRoute.value.description) {
      alert('Por favor completa todos los campos requeridos')
      return
    }

    const formData = new FormData()
    formData.append('title', currentRoute.value.title)
    formData.append('date', currentRoute.value.date)
    formData.append('type', currentRoute.value.type)
    formData.append('difficulty', currentRoute.value.difficulty || '')
    formData.append('distance', currentRoute.value.distance || '')
    formData.append('duration', currentRoute.value.duration || '')
    formData.append('location', currentRoute.value.location || '')
    formData.append('description', currentRoute.value.description)
    if (routeImageFile.value) {
      formData.append('image', routeImageFile.value)
    }

    const method = currentRoute.value.id ? 'PUT' : 'POST'
    const url = currentRoute.value.id ? `/api/routes/${currentRoute.value.id}` : '/api/routes'

    const res = await fetch(url, {
      method,
      headers: { 'Authorization': `Bearer ${auth.token}` },
      body: formData
    })

    if (res.ok) {
      alert(currentRoute.value.id ? 'Ruta actualizada exitosamente' : 'Ruta creada exitosamente')
      fetchRoutes()
      currentRoute.value = { title: '', date: '', type: '', difficulty: '', distance: '', duration: '', location: '', description: '', image: '' }
      routeImageFile.value = null
      showRouteForm.value = false
    } else {
      const error = await res.json()
      alert('Error: ' + (error.message || 'No se pudo guardar la ruta'))
    }
  } catch (err) {
    console.error('Error saving route:', err)
    alert('Error al guardar la ruta: ' + err.message)
  }
}

const editRoute = (route: any) => {
  currentRoute.value = { ...route }
  showRouteForm.value = true
}

const deleteRoute = async (id: number) => {
  if (confirm('¿Estás seguro de que deseas eliminar esta ruta? Esta acción no se puede deshacer.')) {
    try {
      const res = await fetch(`/api/routes/${id}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${auth.token}` }
      })
      
      if (res.ok) {
        alert('✓ Ruta eliminada exitosamente')
        fetchRoutes()
      } else {
        const error = await res.json()
        alert('Error: ' + (error.message || 'No se pudo eliminar la ruta'))
      }
    } catch (err) {
      console.error('Error deleting route:', err)
      alert('Error al eliminar la ruta: ' + err.message)
    }
  }
}

// GALLERY FUNCTIONS
const fetchGallery = async () => {
  try {
    const res = await fetch('/api/gallery/admin/all', {
      headers: { 'Authorization': `Bearer ${auth.token}` }
    })
    gallery.value = await res.json()
  } catch (err) {
    console.error('Error fetching gallery:', err)
  }
}

const handleGalleryImage = (e: Event) => {
  const file = (e.target as HTMLInputElement).files?.[0]
  if (file) {
    galleryImageFile.value = file
    // Crear preview
    const reader = new FileReader()
    reader.onload = (event) => {
      galleryImagePreview.value = event.target?.result as string
    }
    reader.readAsDataURL(file)
  }
}

const clearGalleryPreview = () => {
  galleryImagePreview.value = ''
  galleryImageFile.value = null
}

const saveGallery = async () => {
  try {
    if (!currentGallery.value.title) {
      alert('Por favor ingresa un título')
      return
    }

    if (!galleryImageFile.value && !currentGallery.value.image && !galleryImagePreview.value) {
      alert('Por favor selecciona una imagen')
      return
    }

    const formData = new FormData()
    formData.append('title', currentGallery.value.title)
    formData.append('category', currentGallery.value.category || '')
    formData.append('description', currentGallery.value.description || '')
    formData.append('display_order', currentGallery.value.display_order || 0)
    formData.append('is_published', currentGallery.value.is_published ? 'true' : 'false')
    
    if (galleryImageFile.value) {
      formData.append('image', galleryImageFile.value)
    }

    const method = currentGallery.value.id ? 'PUT' : 'POST'
    const url = currentGallery.value.id ? `/api/gallery/${currentGallery.value.id}` : '/api/gallery'

    const res = await fetch(url, {
      method,
      headers: { 'Authorization': `Bearer ${auth.token}` },
      body: formData
    })

    if (res.ok) {
      alert(currentGallery.value.id ? 'Imagen actualizada exitosamente' : 'Imagen creada exitosamente')
      fetchGallery()
      currentGallery.value = { title: '', category: '', description: '', image: '', display_order: 0, is_published: true }
      galleryImagePreview.value = ''
      galleryImageFile.value = null
      showGalleryForm.value = false
    } else {
      const error = await res.json()
      alert('Error: ' + (error.message || 'No se pudo guardar la imagen'))
    }
  } catch (err) {
    console.error('Error saving gallery:', err)
    alert('Error al guardar la imagen: ' + err.message)
  }
}

const editGallery = (item: any) => {
  currentGallery.value = { ...item }
  galleryImagePreview.value = item.image || ''
  showGalleryForm.value = true
}

const deleteGallery = async (id: number) => {
  if (confirm('¿Estás seguro de que deseas eliminar esta imagen? Esta acción no se puede deshacer.')) {
    try {
      const res = await fetch(`/api/gallery/${id}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${auth.token}` }
      })
      
      if (res.ok) {
        alert('✓ Imagen eliminada exitosamente')
        fetchGallery()
      } else {
        const error = await res.json()
        alert('Error: ' + (error.message || 'No se pudo eliminar la imagen'))
      }
    } catch (err) {
      console.error('Error deleting gallery:', err)
      alert('Error al eliminar la imagen: ' + err.message)
    }
  }
}

// EVENTS FUNCTIONS
const fetchEvents = async () => {
  try {
    const res = await fetch('/api/events')
    events.value = await res.json()
  } catch (err) {
    console.error('Error fetching events:', err)
  }
}

const handleEventImage = (e: Event) => {
  eventImageFile.value = (e.target as HTMLInputElement).files?.[0]
}

const saveEvent = async () => {
  try {
    if (!currentEvent.value.title || !currentEvent.value.event_date) {
      alert('Por favor completa los campos requeridos (Título y Fecha)')
      return
    }

    const formData = new FormData()
    formData.append('title', currentEvent.value.title)
    formData.append('event_date', currentEvent.value.event_date)
    formData.append('location', currentEvent.value.location || '')
    formData.append('capacity', currentEvent.value.capacity || '')
    formData.append('description', currentEvent.value.description || '')
    if (eventImageFile.value) {
      formData.append('image', eventImageFile.value)
    }

    const method = currentEvent.value.id ? 'PUT' : 'POST'
    const url = currentEvent.value.id ? `/api/events/${currentEvent.value.id}` : '/api/events'

    const res = await fetch(url, {
      method,
      headers: { 'Authorization': `Bearer ${auth.token}` },
      body: formData
    })

    if (res.ok) {
      alert(currentEvent.value.id ? 'Evento actualizado exitosamente' : 'Evento creado exitosamente')
      fetchEvents()
      currentEvent.value = { title: '', event_date: '', location: '', capacity: '', description: '', image: '' }
      eventImageFile.value = null
      showEventForm.value = false
    } else {
      const error = await res.json()
      alert('Error: ' + (error.message || 'No se pudo guardar el evento'))
    }
  } catch (err) {
    console.error('Error saving event:', err)
    alert('Error al guardar el evento: ' + err.message)
  }
}

const editEvent = (event: any) => {
  currentEvent.value = { ...event }
  showEventForm.value = true
}

const deleteEvent = async (id: number) => {
  if (confirm('¿Estás seguro de que deseas eliminar este evento? Esta acción no se puede deshacer.')) {
    try {
      const res = await fetch(`/api/events/${id}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${auth.token}` }
      })
      
      if (res.ok) {
        alert('✓ Evento eliminado exitosamente')
        fetchEvents()
      } else {
        const error = await res.json()
        alert('Error: ' + (error.message || 'No se pudo eliminar el evento'))
      }
    } catch (err) {
      console.error('Error deleting event:', err)
      alert('Error al eliminar el evento: ' + err.message)
    }
  }
}

// MESSAGES FUNCTIONS
const fetchMessages = async () => {
  try {
    const res = await fetch('/api/contact-messages', {
      headers: { 'Authorization': `Bearer ${auth.token}` }
    })
    messages.value = await res.json()
  } catch (err) {
    console.error('Error fetching messages:', err)
  }
}

const markAsRead = async (id: number) => {
  try {
    const res = await fetch(`/api/contact-messages/${id}/read`, {
      method: 'PUT',
      headers: { 'Authorization': `Bearer ${auth.token}` }
    })
    
    if (res.ok) {
      fetchMessages()
    } else {
      const error = await res.json()
      alert('Error: ' + (error.message || 'No se pudo marcar como leído'))
    }
  } catch (err) {
    console.error('Error marking message as read:', err)
    alert('Error al marcar como leído: ' + err.message)
  }
}

const deleteMessage = async (id: number) => {
  if (confirm('¿Estás seguro de que deseas eliminar este mensaje? Esta acción no se puede deshacer.')) {
    try {
      const res = await fetch(`/api/contact-messages/${id}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${auth.token}` }
      })
      
      if (res.ok) {
        alert('✓ Mensaje eliminado exitosamente')
        fetchMessages()
      } else {
        const error = await res.json()
        alert('Error: ' + (error.message || 'No se pudo eliminar el mensaje'))
      }
    } catch (err) {
      console.error('Error deleting message:', err)
      alert('Error al eliminar el mensaje: ' + err.message)
    }
  }
}

// SETTINGS FUNCTIONS
const fetchSettings = async () => {
  try {
    const res = await fetch('/api/settings')
    const data = await res.json()
    settings.value = { ...settings.value, ...data }
  } catch (err) {
    console.error('Error fetching settings:', err)
  }
}

const savePageSettings = async () => {
  try {
    const res = await fetch('/api/settings', {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${auth.token}`
      },
      body: JSON.stringify({
        hero_title: settings.value.hero_title,
        hero_subtitle: settings.value.hero_subtitle,
        site_name: settings.value.site_name,
        site_description: settings.value.site_description,
        contact_email: settings.value.contact_email,
        phone: settings.value.phone,
        address: settings.value.address,
        facebook_url: settings.value.facebook_url,
        instagram_url: settings.value.instagram_url,
        twitter_url: settings.value.twitter_url
      })
    })

    if (res.ok) {
      alert('✓ Página principal actualizada exitosamente')
    } else {
      const error = await res.json()
      alert('Error: ' + (error.message || 'No se pudo guardar los cambios'))
    }
  } catch (err) {
    console.error('Error saving page settings:', err)
    alert('Error al guardar los cambios: ' + err.message)
  }
}

const saveSettings = async () => {
  try {
    const res = await fetch('/api/settings', {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${auth.token}`
      },
      body: JSON.stringify({
        maintenance_mode: settings.value.maintenance_mode ? 'true' : 'false'
      })
    })

    if (res.ok) {
      alert('✓ Configuración guardada exitosamente')
    } else {
      const error = await res.json()
      alert('Error: ' + (error.message || 'No se pudo guardar la configuración'))
    }
  } catch (err) {
    console.error('Error saving settings:', err)
    alert('Error al guardar la configuración: ' + err.message)
  }
}

onMounted(() => {
  if (!auth.isAuthenticated) {
    router.push('/login')
  }
  fetchRoutes()
  fetchGallery()
  fetchEvents()
  fetchMessages()
  fetchSettings()
})
</script>

<style scoped>
.admin-dashboard {
  max-width: 1400px;
  margin: 0 auto;
  padding: 20px;
  background: #f5f5f5;
  min-height: 100vh;
}

.dashboard-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 30px;
  background: white;
  padding: 20px;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0,0,0,0.1);
}

.dashboard-header h1 {
  margin: 0;
  color: #333;
}

.btn-logout {
  background: #dc3545;
  color: white;
  border: none;
  padding: 10px 20px;
  border-radius: 4px;
  cursor: pointer;
  font-weight: 600;
}

.btn-logout:hover {
  background: #c82333;
}

.dashboard-nav {
  display: flex;
  gap: 10px;
  margin-bottom: 20px;
  flex-wrap: wrap;
}

.nav-btn {
  padding: 12px 20px;
  background: white;
  border: 2px solid #ddd;
  border-radius: 4px;
  cursor: pointer;
  font-weight: 600;
  transition: all 0.3s;
}

.nav-btn.active {
  background: #28a745;
  color: white;
  border-color: #28a745;
}

.nav-btn:hover {
  border-color: #28a745;
}

.tab-content {
  background: white;
  padding: 20px;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0,0,0,0.1);
}

.section-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
}

.section-header h2 {
  margin: 0;
  color: #333;
}

.form-container {
  background: #f9f9f9;
  padding: 20px;
  border-radius: 8px;
  margin-bottom: 20px;
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 15px;
}

.form-container input,
.form-container textarea,
.form-container select {
  padding: 10px;
  border: 1px solid #ddd;
  border-radius: 4px;
  font-family: inherit;
  font-size: 14px;
}

/* File Input Styling */
.file-input-wrapper {
  grid-column: 1 / -1;
  position: relative;
}

.file-input {
  display: none;
}

.file-label {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 10px;
  padding: 20px;
  border: 2px dashed #28a745;
  border-radius: 8px;
  background: #f0f8f5;
  cursor: pointer;
  font-weight: 600;
  color: #28a745;
  transition: all 0.3s;
}

.file-label:hover {
  background: #e8f5f0;
  border-color: #218838;
  color: #218838;
}

.preview-container {
  position: relative;
  margin-top: 15px;
  border-radius: 8px;
  overflow: hidden;
  background: #f9f9f9;
  padding: 10px;
}

.preview-image {
  width: 100%;
  max-height: 300px;
  object-fit: cover;
  border-radius: 4px;
}

.btn-clear-preview {
  position: absolute;
  top: 15px;
  right: 15px;
  background: rgba(220, 53, 69, 0.9);
  color: white;
  border: none;
  width: 32px;
  height: 32px;
  border-radius: 50%;
  cursor: pointer;
  font-size: 18px;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.3s;
}

.btn-clear-preview:hover {
  background: #dc3545;
  transform: scale(1.1);
}

.form-container textarea {
  grid-column: 1 / -1;
  min-height: 100px;
  resize: vertical;
}

.form-section {
  grid-column: 1 / -1;
  padding: 15px;
  background: white;
  border-radius: 8px;
  border-left: 4px solid #28a745;
  margin-bottom: 10px;
}

.form-section h3 {
  margin: 0 0 15px 0;
  color: #333;
  font-size: 16px;
}

.form-section input,
.form-section textarea {
  width: 100%;
  margin-bottom: 10px;
  padding: 10px;
  border: 1px solid #ddd;
  border-radius: 4px;
  font-family: inherit;
  font-size: 14px;
}

.form-section textarea {
  min-height: 80px;
  resize: vertical;
}

.btn-primary,
.btn-success,
.btn-edit,
.btn-delete {
  padding: 10px 20px;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-weight: 600;
  transition: all 0.3s;
}

.btn-primary {
  background: #007bff;
  color: white;
}

.btn-primary:hover {
  background: #0056b3;
}

.btn-success {
  background: #28a745;
  color: white;
  grid-column: 1 / -1;
}

.btn-success:hover {
  background: #218838;
}

.btn-edit {
  background: #17a2b8;
  color: white;
  padding: 8px 12px;
  font-size: 12px;
}

.btn-edit:hover {
  background: #138496;
}

.btn-delete {
  background: #dc3545;
  color: white;
  padding: 8px 12px;
  font-size: 12px;
}

.btn-delete:hover {
  background: #c82333;
}

.items-grid,
.gallery-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
  gap: 20px;
}

.item-card,
.gallery-item {
  background: #f9f9f9;
  border-radius: 8px;
  overflow: hidden;
  box-shadow: 0 2px 4px rgba(0,0,0,0.1);
  transition: transform 0.3s;
}

.item-card:hover,
.gallery-item:hover {
  transform: translateY(-5px);
  box-shadow: 0 4px 8px rgba(0,0,0,0.15);
}

.item-card img,
.gallery-item img {
  width: 100%;
  height: 200px;
  object-fit: cover;
}

.item-card h3,
.gallery-item h3 {
  padding: 10px;
  margin: 0;
  font-size: 16px;
  color: #333;
}

.item-card p {
  padding: 0 10px;
  margin: 5px 0;
  font-size: 12px;
  color: #666;
}

.card-actions {
  display: flex;
  gap: 10px;
  padding: 10px;
}

.card-actions button {
  flex: 1;
}

.messages-list {
  display: grid;
  gap: 15px;
}

.message-item {
  background: #f9f9f9;
  padding: 15px;
  border-radius: 8px;
  border-left: 4px solid #ddd;
}

.message-item.unread {
  border-left-color: #28a745;
  background: #f0f8f5;
}

.message-header {
  display: flex;
  justify-content: space-between;
  margin-bottom: 10px;
}

.message-date {
  font-size: 12px;
  color: #999;
}

.message-item p {
  margin: 8px 0;
  font-size: 14px;
  color: #333;
}

.message-text {
  background: white;
  padding: 10px;
  border-radius: 4px;
  margin: 10px 0;
  font-style: italic;
}

@media (max-width: 768px) {
  .dashboard-header {
    flex-direction: column;
    gap: 15px;
    text-align: center;
  }

  .form-container {
    grid-template-columns: 1fr;
  }

  .items-grid,
  .gallery-grid {
    grid-template-columns: 1fr;
  }
}
</style>
