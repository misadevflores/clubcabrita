import { ref } from 'vue'

export const useSettingsStore = () => {
    const settings = ref<Record<string, string>>({})
    const isLoading = ref(false)

    const loadSettings = async () => {
        isLoading.value = true
        try {
            const response = await fetch('/api/settings')
            if (response.ok) {
                const data = await response.json()
                settings.value = data || {}
                applyStyles()
            }
        } catch (e) {
            console.error('Error loading settings:', e)
        } finally {
            isLoading.value = false
        }
    }

    const applyStyles = () => {
        const root = document.documentElement
        if (settings.value.color_primary)
            root.style.setProperty('--color-primary', settings.value.color_primary)
        if (settings.value.color_accent) {
            root.style.setProperty('--color-accent', settings.value.color_accent)
            root.style.setProperty('--color-accent-hover', adjustColor(settings.value.color_accent, -15))
        }
        if (settings.value.font_family)
            root.style.setProperty('--font-main', settings.value.font_family)
    }

    const adjustColor = (hex: string, percent: number): string => {
        let r = parseInt(hex.substring(1, 3), 16)
        let g = parseInt(hex.substring(3, 5), 16)
        let b = parseInt(hex.substring(5, 7), 16)
        r = Math.max(0, Math.min(255, r + percent))
        g = Math.max(0, Math.min(255, g + percent))
        b = Math.max(0, Math.min(255, b + percent))
        return `#${r.toString(16).padStart(2, '0')}${g.toString(16).padStart(2, '0')}${b.toString(16).padStart(2, '0')}`
    }

    const saveSettings = async (newSettings: Record<string, string | boolean>, token: string) => {
        try {
            // Convert booleans to strings for consistency
            const normalized: Record<string, string> = {}
            for (const [k, v] of Object.entries(newSettings)) {
                normalized[k] = String(v)
            }
            const response = await fetch('/api/settings', {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify(normalized)
            })
            if (!response.ok) throw new Error('Failed to save settings')
            await loadSettings()
        } catch (e) {
            console.error('Error saving settings:', e)
            throw e
        }
    }

    /**
     * Upload a logo file and save the URL to settings.
     * @param file  The image file to upload
     * @param type  'logo_desktop' | 'logo_mobile'
     * @param token JWT token
     * @returns     The uploaded image URL
     */
    const uploadLogo = async (file: File, type: 'logo_desktop' | 'logo_mobile', token: string): Promise<string> => {
        const formData = new FormData()
        formData.append('logo', file)
        formData.append('logo_type', type)

        const response = await fetch('/api/settings/upload-logo', {
            method: 'POST',
            headers: { 'Authorization': `Bearer ${token}` },
            body: formData
        })
        if (!response.ok) {
            const err = await response.json()
            throw new Error(err.message || 'Upload failed')
        }
        const data = await response.json()
        // Refresh settings so the new logo is applied everywhere
        await loadSettings()
        return data.url
    }

    return {
        settings,
        isLoading,
        loadSettings,
        saveSettings,
        uploadLogo
    }
}
