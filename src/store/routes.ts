import { ref } from 'vue'

export interface RouteItem {
    id: string
    title: string
    date: string
    type: string
    image: string
    description: string
}

// =========================================================
// EXPRESS API endpoints
// =========================================================
import { useAuthStore } from './auth'

export const useRoutesStore = () => {
    const routes = ref<RouteItem[]>([])
    const isLoading = ref(false)

    const loadRoutes = async () => {
        isLoading.value = true
        try {
            const response = await fetch('/api/routes')
            if (response.ok) {
                const data = await response.json()
                routes.value = data || []
            }
        } catch (e) {
            console.error("Error al cargar rutas:", e)
        } finally {
            isLoading.value = false
        }
    }

    const addRoute = async (formData: FormData) => {
        try {
            const authStore = useAuthStore()
            const response = await fetch('/api/routes', {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${authStore.token}`
                },
                body: formData
            })
            if (response.ok) {
                // Recargar desde API para asegurar consistencia
                await loadRoutes()
                return true
            }
            return false
        } catch (e) {
            console.error("Error guardando:", e)
            return false
        }
    }

    const updateRoute = async (id: string, formData: FormData) => {
        try {
            const authStore = useAuthStore()
            const response = await fetch(`/api/routes/${id}`, {
                method: 'PUT',
                headers: {
                    'Authorization': `Bearer ${authStore.token}`
                },
                body: formData
            })
            if (response.ok) {
                await loadRoutes()
                return true
            }
            return false
        } catch (e) {
            console.error("Error actualizando:", e)
            return false
        }
    }

    const deleteRoute = async (id: string) => {
        try {
            const authStore = useAuthStore()
            const response = await fetch(`/api/routes/${id}`, {
                method: 'DELETE',
                headers: {
                    'Authorization': `Bearer ${authStore.token}`
                }
            })
            if (response.ok) {
                routes.value = routes.value.filter(r => String(r.id) !== String(id))
            }
        } catch (e) {
            console.error("Error eliminando:", e)
        }
    }

    return {
        routes,
        isLoading,
        loadRoutes,
        addRoute,
        updateRoute,
        deleteRoute
    }
}
