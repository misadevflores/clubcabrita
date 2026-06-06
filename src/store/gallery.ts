import { ref } from 'vue'
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
            const response = await fetch('/api/gallery')
            if (response.ok) {
                images.value = await response.json() || []
            }
        } catch (e) {
            console.error('Error loading gallery:', e)
        } finally {
            isLoading.value = false
        }
    }

    const addGalleryImage = async (formData: FormData): Promise<boolean> => {
        try {
            const { token } = useAuthStore()
            const response = await fetch('/api/gallery', {
                method: 'POST',
                headers: { 'Authorization': `Bearer ${token.value}` },
                body: formData
            })
            if (response.ok) {
                await loadGallery()
                return true
            }
            return false
        } catch (e) {
            console.error('Error adding gallery image:', e)
            return false
        }
    }

    const updateGalleryImage = async (id: number, formData: FormData): Promise<boolean> => {
        try {
            const { token } = useAuthStore()
            const response = await fetch(`/api/gallery/${id}`, {
                method: 'PUT',
                headers: { 'Authorization': `Bearer ${token.value}` },
                body: formData
            })
            if (response.ok) {
                await loadGallery()
                return true
            }
            return false
        } catch (e) {
            console.error('Error updating gallery image:', e)
            return false
        }
    }

    const deleteGalleryImage = async (id: number): Promise<boolean> => {
        try {
            const { token } = useAuthStore()
            const response = await fetch(`/api/gallery/${id}`, {
                method: 'DELETE',
                headers: { 'Authorization': `Bearer ${token.value}` }
            })
            if (response.ok) {
                images.value = images.value.filter(i => i.id !== id)
                return true
            }
            return false
        } catch (e) {
            console.error('Error deleting gallery image:', e)
            return false
        }
    }

    return {
        images,
        isLoading,
        loadGallery,
        addGalleryImage,
        updateGalleryImage,
        deleteGalleryImage
    }
}
