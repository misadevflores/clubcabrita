import { ref } from 'vue'

export interface GalleryItem {
    id: number
    url: string
    title: string
    location: string
    span_class: string
}

const API_URL = 'http://localhost:3000/api'

export const useGalleryStore = () => {
    const images = ref<GalleryItem[]>([])
    const isLoading = ref(false)

    const loadGallery = async () => {
        isLoading.value = true
        try {
            const response = await fetch(`${API_URL}/gallery`)
            if (response.ok) {
                const data = await response.json()
                images.value = data || []
            }
        } catch (e) {
            console.error("Error loading gallery:", e)
        } finally {
            isLoading.value = false
        }
    }

    const addGalleryImage = async (image: Omit<GalleryItem, 'id'>, token: string) => {
        try {
            const response = await fetch(`${API_URL}/gallery`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify(image)
            });
            if (response.ok) {
                await loadGallery()
            } else {
                console.error("Failed to add image.")
            }
        } catch (e) {
            console.error("Error saving gallery:", e)
        }
    }

    const deleteGalleryImage = async (id: number, token: string) => {
        try {
            const response = await fetch(`${API_URL}/gallery/${id}`, {
                method: 'DELETE',
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });
            if (response.ok) {
                images.value = images.value.filter(i => i.id !== id)
            }
        } catch (e) {
            console.error("Error deleting gallery:", e)
        }
    }

    return {
        images,
        isLoading,
        loadGallery,
        addGalleryImage,
        deleteGalleryImage
    }
}
