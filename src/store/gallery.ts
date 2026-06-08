import { ref } from 'vue'
import { supabase } from '../utils/supabase'
import { useAuthStore } from './auth'

export interface GalleryItem {
  id: number
  title: string
  image: string
  description: string
  category: string
  display_order: number
  is_published: boolean
}

export const useGalleryStore = () => {
  const images = ref<GalleryItem[]>([])
  const isLoading = ref(false)

  const loadGallery = async () => {
    isLoading.value = true
    try {
      const { data, error } = await supabase
        .from('gallery')
        .select('*')
        .eq('is_published', true)
        .order('display_order', { ascending: true })

      if (error) throw error
      images.value = data || []
    } catch (e) {
      console.error('Error cargando galería:', e)
    } finally {
      isLoading.value = false
    }
  }

  const loadAllGallery = async () => {
    isLoading.value = true
    try {
      const { data, error } = await supabase
        .from('gallery')
        .select('*')
        .order('display_order', { ascending: true })

      if (error) throw error
      images.value = data || []
    } catch (e) {
      console.error('Error cargando galería:', e)
    } finally {
      isLoading.value = false
    }
  }

  const addGalleryImage = async (formData: FormData): Promise<boolean> => {
    try {
      const auth = useAuthStore()
      const res = await fetch('/api/gallery', {
        method: 'POST',
        headers: { 'Authorization': `Bearer ${auth.token.value}` },
        body: formData
      })
      if (!res.ok) return false
      await loadAllGallery()
      return true
    } catch (e) {
      console.error('Error agregando imagen:', e)
      return false
    }
  }

  const updateGalleryImage = async (id: number, formData: FormData): Promise<boolean> => {
    try {
      const auth = useAuthStore()
      const res = await fetch(`/api/gallery/${id}`, {
        method: 'PUT',
        headers: { 'Authorization': `Bearer ${auth.token.value}` },
        body: formData
      })
      if (!res.ok) return false
      await loadAllGallery()
      return true
    } catch (e) {
      console.error('Error actualizando imagen:', e)
      return false
    }
  }

  const deleteGalleryImage = async (id: number): Promise<boolean> => {
    try {
      const { error } = await supabase
        .from('gallery')
        .delete()
        .eq('id', id)

      if (error) throw error
      images.value = images.value.filter(i => i.id !== id)
      return true
    } catch (e) {
      console.error('Error eliminando imagen:', e)
      return false
    }
  }

  return { images, isLoading, loadGallery, loadAllGallery, addGalleryImage, updateGalleryImage, deleteGalleryImage }
}
