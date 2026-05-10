<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useRoutesStore } from '../store/routes'

const router = useRouter()
const { addRoute } = useRoutesStore()

const formData = ref({
  title: '',
  date: '',
  type: 'Senderismo',
  image: '/images/route_green.png', // default placeholder
  description: ''
})

const isSubmitting = ref(false)

const handleUpload = async () => {
  isSubmitting.value = true
  
  // Simulate network request
  setTimeout(() => {
    addRoute({
      title: formData.value.title,
      date: formData.value.date,
      type: formData.value.type,
      image: formData.value.image,
      description: formData.value.description
    })
    
    isSubmitting.value = false
    router.push('/rutas')
  }, 800)
}
</script>

<template>
  <div class="admin-view container pb-8">
    <section class="page-header text-center mt-8 mb-8">
      <h1>Panel Administrativo</h1>
      <p>Sube nuevas excursiones, rutas y montañas para que los usuarios puedan verlas al instante.</p>
    </section>

    <div class="form-container">
      <form @submit.prevent="handleUpload" class="upload-form">
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
          <label for="image">URL de la Imagen (Opcional, usando local por defecto)</label>
          <input type="text" id="image" v-model="formData.image" placeholder="https://ejemplo.com/imagen.jpg" />
          <p class="help-text">Puedes dejar el valor por defecto provisto para ver una imagen de prueba.</p>
        </div>

        <div class="form-group">
          <label for="description">Descripción</label>
          <textarea id="description" v-model="formData.description" required rows="4" placeholder="Describe los detalles principales de esta ruta..."></textarea>
        </div>

        <div class="form-actions text-center mt-8">
          <button type="submit" class="btn btn-primary btn-lg" :disabled="isSubmitting">
            {{ isSubmitting ? 'Guardando Ruta...' : 'Publicar Nueva Ruta' }}
          </button>
        </div>
      </form>
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

.form-group {
  margin-bottom: 2rem;
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
  padding: 1rem;
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
  box-shadow: 0 0 0 4px rgba(249, 115, 22, 0.1);
}

.help-text {
  font-size: 0.8rem;
  color: var(--color-text-muted);
  margin-top: 0.5rem;
}

.btn-lg {
  padding: 1rem 3rem;
  font-size: 1.1rem;
  width: 100%;
}

.pb-8 {
  padding-bottom: 4rem;
}

@media (max-width: 768px) {
  .form-row {
    grid-template-columns: 1fr;
    gap: 0;
  }
  .form-container {
    padding: 2rem;
  }
}
</style>
