import { ref } from 'vue'

const API_URL = 'http://localhost:3000/api'

export const useSettingsStore = () => {
    const settings = ref<Record<string, string>>({})
    const isLoading = ref(false)

    const loadSettings = async () => {
        isLoading.value = true
        try {
            const response = await fetch(`${API_URL}/settings`)
            if (response.ok) {
                const data = await response.json()
                settings.value = data || {}
                applyStyles()
            }
        } catch (e) {
            console.error("Error loading settings:", e)
        } finally {
            isLoading.value = false
        }
    }

    const applyStyles = () => {
        // Apply CSS variables to root to globally override colors
        const root = document.documentElement;
        if (settings.value.color_primary) {
            root.style.setProperty('--color-primary', settings.value.color_primary);
        }
        if (settings.value.color_accent) {
            root.style.setProperty('--color-accent', settings.value.color_accent);
            root.style.setProperty('--color-accent-hover', adjustColorBright(settings.value.color_accent, -15));
        }
        if (settings.value.font_family) {
            root.style.setProperty('--font-main', settings.value.font_family);
        }
    }

    // Helper for hover colors
    const adjustColorBright = (hex: string, percent: number) => {
        let r = parseInt(hex.substring(1, 3), 16)
        let g = parseInt(hex.substring(3, 5), 16)
        let b = parseInt(hex.substring(5, 7), 16)
        r = Math.max(0, Math.min(255, r + percent))
        g = Math.max(0, Math.min(255, g + percent))
        b = Math.max(0, Math.min(255, b + percent))
        return `#${r.toString(16).padStart(2, '0')}${g.toString(16).padStart(2, '0')}${b.toString(16).padStart(2, '0')}`
    }

    const saveSettings = async (newSettings: Record<string, string>, token: string) => {
        try {
            const response = await fetch(`${API_URL}/settings`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify(newSettings)
            });
            if (response.ok) {
                await loadSettings()
            } else {
                throw new Error("Failed to save settings")
            }
        } catch (e) {
            console.error("Error saving settings:", e)
        }
    }

    return {
        settings,
        isLoading,
        loadSettings,
        saveSettings
    }
}
