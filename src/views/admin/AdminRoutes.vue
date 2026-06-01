<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useRoutesStore } from '../../store/routes'
import { useAuthStore } from '../../store/auth'

const router = useRouter()
const { addRoute, updateRoute, deleteRoute, routes, loadRoutes } = useRoutesStore()
const { user, logout } = useAuthStore()

const formData = ref({
  title: '',
  date: '',
  type: 'Senderismo',
  description: ''
})

const fileInput = ref<File | null>(null)
const isSubmitting = ref(false)
const editingRouteId = ref<string | null>(null)

onMounted(async () => {
    await loadRoutes()
})

const onFileChange = (e: Event) => {
  const target = e.target as HTMLInputElement
  if (target.files && target.files.length > 0) {
    fileInput.value = target.files[0] ?? null
  }
}

const handleUpload = async () => {
  isSubmitting.value = true
  
  const formPayload = new FormData()
  formPayload.append('title', formData.value.title)
  formPayload.append('date', formData.value.date)
  formPayload.append('type', formData.value.type)
  formPayload.append('description', formData.value.description)
  if (fileInput.value) {
    formPayload.append('image', fileInput.value)
  }
  
  const success = editingRouteId.value 
    ? await updateRoute(editingRouteId.value, formPayload) 
    : await addRoute(formPayload)
  
  isSubmitting.value = false
  if (success) {
    cancelEdit()
  } else {
    alert(editingRouteId.value ? "Hubo un error al actualizar la ruta." : "Hubo un error al crear la ruta.")
  }
}

const editRoute = (route: any) => {
    editingRouteId.value = String(route.id)
    formData.value.title = route.title
    formData.value.date = route.date
    formData.value.type = route.type
    formData.value.description = route.description
    fileInput.value = null
    window.scrollTo({ top: 0, behavior: 'smooth' })
}

const cancelEdit = () => {
    editingRouteId.value = null
    formData.value.title = ''
    formData.value.date = ''
    formData.value.type = 'Senderismo'
    formData.value.description = ''
    fileInput.value = null
    const inputE = document.getElementById('image') as HTMLInputElement
    if(inputE) inputE.value = ''
}

const handleDelete = async (id: string) => {
    if (confirm("¿Estás seguro de eliminar esta ruta?")) {
        await deleteRoute(id)
    }
}

const handleLogout = () => {
  logout()
  router.push('/login')
}
</script>

<template>
  <div class="admin-view container pb-8">
    <section class="page-header text-center mt-8 mb-8">
      <h1>Panel Administrativo</h1>
      <p>Bienvenido, {{ user }}. Administra las rutas del Club Cabritas.</p>
    </section>

    <!-- PANEL DE ADMIN -->
    <div>
        <div class="logout-wrapper mb-8">
            <button @click="handleLogout" class="btn btn-outline">Cerrar Sesión</button>
        </div>

        <div class="form-container mb-12">
            <h2>{{ editingRouteId ? 'Editar Ruta' : 'Crear Nueva Ruta' }}</h2>
            <form @submit.prevent="handleUpload" class="upload-form mt-4">
                <div class="form-group">
                <label for="title">Título de la Ruta</label>
                <input type="text" id="title" v-model="formData.title" required placeholder="Ej. Ascenso al Huayna Potosí" />
                </div>

                <div class="form-row">
                <div class="form-group">
                    <label for="date">Fecha de Salida</label>
                    <input type="text" id="date" v-model="formData.date" required placeholder="Ej. 12 de Junio, 2026" />
                </div>

                <div class="form-group">
                    <label for="type">Categoría</label>
                    <select id="type" v-model="formData.type">
                    <option value="Senderismo">Senderismo</option>
                    <option value="Alta Montaña">Alta Montaña</option>
                    <option value="Escalada">Escalada</option>
                    <option value="Ecoturismo">Ecoturismo</option>
                    </select>
                </div>
                </div>

                <div class="form-group">
                <label for="image">Subir Imagen de la Ruta</label>
                <input type="file" id="image" accept="image/*" @change="onFileChange" :required="!editingRouteId" />
                <p class="help-text">{{ editingRouteId ? 'Deja en blanco si no quieres cambiar la imagen actual.' : 'Selecciona una imagen atractiva desde tu dispositivo.' }}</p>
                </div>

                <div class="form-group">
                <label for="description">Descripción</label>
                <textarea id="description" v-model="formData.description" required rows="4" placeholder="Describe los detalles principales..."></textarea>
                </div>

                <div class="form-actions text-center mt-8">
                <button type="submit" class="btn btn-primary btn-lg" :disabled="isSubmitting">
                    {{ isSubmitting ? 'Guardando...' : (editingRouteId ? 'Actualizar Ruta' : 'Publicar Nueva Ruta') }}
                </button>
                <button v-if="editingRouteId" type="button" @click="cancelEdit" class="btn btn-outline mx-2">
                    Cancelar
                </button>
                </div>
            </form>
        </div>

        <!-- LISTADO DE RUTAS -->
        <h2 class="text-center mb-6">Rutas Actuales</h2>
        <div class="routes-list">
            <div v-for="route in routes" :key="route.id" class="route-item">
                <div class="route-info">
                    <h3>{{ route.title }}</h3>
                    <p>{{ route.date }} - {{ route.type }}</p>
                </div>
                <div class="route-actions">
                    <button @click="editRoute(route)" class="btn edit-btn mr-2">Editar</button>
                    <button @click="handleDelete(route.id)" class="btn delete-btn">Eliminar</button>
                </div>
            </div>
            <p v-if="routes.length === 0" class="text-center">No hay rutas registradas.</p>
        </div>
    </div>

  </div>
</template>

<style scoped>
.page-header h1 {
  font-size: 2.5rem;
  color: var(--color-primary);
  margin-bottom: 1rem;
}

.page-header p {
  color: var(--color-text-muted);
  font-size: 1.1rem;
  max-width: 600px;
  margin: 0 auto;
}

.form-container {
  max-width: 700px;
  margin: 0 auto;
  background: white;
  padding: 3rem;
  border-radius: var(--radius-lg);
  box-shadow: 0 10px 40px rgba(0,0,0,0.08);
}

.logout-wrapper {
    display: flex;
    justify-content: flex-end;
    max-width: 700px;
    margin: 0 auto;
}

h2 {
    color: var(--color-primary);
    font-size: 1.5rem;
    margin-bottom: 1rem;
}

.form-group {
  margin-bottom: 1.5rem;
  display: flex;
  flex-direction: column;
}

.form-row {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 2rem;
}

label {
  font-weight: 600;
  color: var(--color-primary);
  margin-bottom: 0.5rem;
  font-size: 0.95rem;
}

input, select, textarea {
  padding: 0.8rem;
  border: 2px solid #e5e7eb;
  border-radius: var(--radius-md);
  font-family: inherit;
  font-size: 1rem;
  transition: all 0.3s ease;
  background-color: var(--color-bg-light);
  color: var(--color-text-dark);
}

input:focus, select:focus, textarea:focus {
  border-color: var(--color-accent);
  outline: none;
}

.btn-lg {
  padding: 1rem 3rem;
  font-size: 1.1rem;
  width: 100%;
}

.routes-list {
    max-width: 700px;
    margin: 0 auto;
}

.route-item {
    display: flex;
    justify-content: space-between;
    align-items: center;
    background: white;
    padding: 1.5rem;
    border-radius: var(--radius-md);
    box-shadow: 0 4px 12px rgba(0,0,0,0.05);
    margin-bottom: 1rem;
}

.route-info h3 {
    margin: 0;
    color: var(--color-primary);
    font-size: 1.2rem;
}
.route-info p {
    margin: 0.2rem 0 0 0;
    color: var(--color-text-muted);
    font-size: 0.9rem;
}

.route-actions {
    display: flex;
    gap: 0.5rem;
}

.edit-btn {
    background-color: var(--color-primary);
    color: white;
    padding: 0.5rem 1rem;
}
.edit-btn:hover {
    background-color: #011E26; /* Darker primary */
}

.delete-btn {
    background-color: #ef4444;
    color: white;
    padding: 0.5rem 1rem;
}
.delete-btn:hover {
    background-color: #dc2626;
}

.mx-2 {
    margin-left: 1rem;
    margin-right: 1rem;
}

.mr-2 {
    margin-right: 0.5rem;
}

.mb-12 {
     margin-bottom: 3rem;
}

.mb-6 { margin-bottom: 2rem; }
.mt-6 { margin-top: 2rem; }
.mt-4 { margin-top: 1rem; }

.pb-8 {
  padding-bottom: 4rem;
}
</style>
