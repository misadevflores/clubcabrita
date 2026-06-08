import { ref } from 'vue'
import { supabase } from '../utils/supabase'
import { useAuthStore } from './auth'

export interface RouteItem {
  id: number
  title: string
  date: string
  type: string
  image: string
  description: string
  difficulty?: string
  distance?: number
  duration?: string
  location?: string
  is_published?: boolean
}

export const useRoutesStore = () => {
  const routes = ref<RouteItem[]>([])
  const isLoading = ref(false)
  const error = ref('')

  const loadRoutes = async () => {
    isLoading.value = true
    error.value = ''
    try {
      const { data, error: err } = await supabase
        .from('routes')
        .select('*')
        .eq('is_published', true)
        .order('date', { ascending: false })

      if (err) throw err
      routes.value = data || []
    } catch (e: any) {
      error.value = e.message
      console.error('Error cargando rutas:', e.message)
    } finally {
      isLoading.value = false
    }
  }

  const loadAllRoutes = async () => {
    isLoading.value = true
    error.value = ''
    try {
      const { data, error: err } = await supabase
        .from('routes')
        .select('*')
        .order('date', { ascending: false })

      if (err) throw err
      routes.value = data || []
    } catch (e: any) {
      error.value = e.message
      console.error('Error cargando rutas:', e.message)
    } finally {
      isLoading.value = false
    }
  }

  const addRoute = async (formData: FormData): Promise<boolean> => {
    try {
      // Upload image via backend (multer), then insert via supabase
      const auth = useAuthStore()
      const res = await fetch('/api/routes', {
        method: 'POST',
        headers: { 'Authorization': `Bearer ${auth.token.value}` },
        body: formData
      })
      if (!res.ok) return false
      await loadAllRoutes()
      return true
    } catch (e) {
      console.error('Error creando ruta:', e)
      return false
    }
  }

  const updateRoute = async (id: number | string, formData: FormData): Promise<boolean> => {
    try {
      const auth = useAuthStore()
      const res = await fetch(`/api/routes/${id}`, {
        method: 'PUT',
        headers: { 'Authorization': `Bearer ${auth.token.value}` },
        body: formData
      })
      if (!res.ok) return false
      await loadAllRoutes()
      return true
    } catch (e) {
      console.error('Error actualizando ruta:', e)
      return false
    }
  }

  const deleteRoute = async (id: number | string): Promise<boolean> => {
    try {
      const { error: err } = await supabase
        .from('routes')
        .delete()
        .eq('id', id)

      if (err) throw err
      routes.value = routes.value.filter(r => r.id !== Number(id))
      return true
    } catch (e) {
      console.error('Error eliminando ruta:', e)
      return false
    }
  }

  return { routes, isLoading, error, loadRoutes, loadAllRoutes, addRoute, updateRoute, deleteRoute }
}
