<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '../store/auth'

const username = ref('')
const password = ref('')
const error = ref('')
const isLoading = ref(false)
const authStore = useAuthStore()
const router = useRouter()

const handleLogin = async () => {
  isLoading.value = true
  error.value = ''
  try {
    const success = await authStore.login(username.value, password.value)
    if (success) {
      router.push('/admin')
    } else {
      error.value = 'Credenciales inválidas'
    }
  } catch (err: any) {
    error.value = err.message || 'Error al conectar con el servidor'
  } finally {
    isLoading.value = false
  }
}
</script>

<template>
  <div class="login-view container pb-8 mt-8">
    <div class="login-card">
      <h1 class="text-center">Acceso CMS</h1>
      <p class="text-center text-muted mb-6">Inicia sesión para administrar el sitio</p>
      
      <form @submit.prevent="handleLogin">
        <div class="form-group">
          <label for="username">Usuario</label>
          <input type="text" id="username" v-model="username" required autocomplete="username" />
        </div>
        
        <div class="form-group mb-6">
          <label for="password">Contraseña</label>
          <input type="password" id="password" v-model="password" required autocomplete="current-password" />
        </div>

        <div v-if="error" class="error-message mb-4">
          {{ error }}
        </div>

        <button type="submit" class="btn btn-primary w-full" :disabled="isLoading">
          {{ isLoading ? 'Ingresando...' : 'Iniciar Sesión' }}
        </button>
      </form>
    </div>
  </div>
</template>

<style scoped>
.login-view {
  min-height: 50vh;
  display: flex;
  justify-content: center;
  align-items: center;
}

.login-card {
  background: white;
  padding: 3rem;
  border-radius: var(--radius-lg);
  box-shadow: 0 10px 40px rgba(0,0,0,0.08);
  width: 100%;
  max-width: 450px;
}

h1 {
  font-size: 2rem;
  color: var(--color-primary);
  margin-bottom: 0.5rem;
}

.text-muted {
  color: var(--color-text-muted);
}

.mb-6 {
  margin-bottom: 1.5rem;
}

.mb-4 {
  margin-bottom: 1rem;
}

.form-group {
  margin-bottom: 1.5rem;
  display: flex;
  flex-direction: column;
}

label {
  font-weight: 600;
  color: var(--color-primary);
  margin-bottom: 0.5rem;
  font-size: 0.95rem;
}

input {
  padding: 1rem;
  border: 2px solid #e5e7eb;
  border-radius: var(--radius-md);
  font-family: inherit;
  font-size: 1rem;
  transition: all 0.3s ease;
  background-color: var(--color-bg-light);
  color: var(--color-text-dark);
}

input:focus {
  border-color: var(--color-accent);
  outline: none;
  box-shadow: 0 0 0 4px rgba(249, 115, 22, 0.1);
}

.btn {
  padding: 1rem;
  font-size: 1.1rem;
  cursor: pointer;
  border: none;
  border-radius: var(--radius-md);
  transition: background-color 0.3s;
}

.w-full {
  width: 100%;
}

.error-message {
  color: #ef4444;
  background: #fee2e2;
  padding: 0.75rem;
  border-radius: var(--radius-sm);
  text-align: center;
  font-weight: 500;
}
</style>
