import { ref } from 'vue'
import { supabase } from '../utils/supabase'
import { useAuthStore } from './auth'

export const useSettingsStore = () => {
  const settings = ref<Record<string, string>>({})
  const isLoading = ref(false)

  const loadSettings = async () => {
    isLoading.value = true
    try {
      const { data, error } = await supabase
        .from('settings')
        .select('setting_key, setting_value')

      if (error) throw error

      const obj: Record<string, string> = {}
      ;(data || []).forEach((s: any) => { obj[s.setting_key] = s.setting_value })
      settings.value = obj
      applyStyles()
    } catch (e) {
      console.error('Error cargando settings:', e)
    } finally {
      isLoading.value = false
    }
  }

  const applyStyles = () => {
    const root = document.documentElement
    if (settings.value.color_primary)
      root.style.setProperty('--color-primary', settings.value.color_primary)
    if (settings.value.color_accent)
      root.style.setProperty('--color-accent', settings.value.color_accent)
    if (settings.value.font_family)
      root.style.setProperty('--font-main', settings.value.font_family)
  }

  const saveSettings = async (newSettings: Record<string, string | boolean>, token: string) => {
    try {
      const res = await fetch('/api/settings', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(
          Object.fromEntries(Object.entries(newSettings).map(([k, v]) => [k, String(v)]))
        )
      })
      if (!res.ok) throw new Error('Failed to save settings')
      await loadSettings()
    } catch (e) {
      console.error('Error guardando settings:', e)
      throw e
    }
  }

  const uploadLogo = async (file: File, type: 'logo_desktop' | 'logo_mobile', token: string): Promise<string> => {
    const formData = new FormData()
    formData.append('logo', file)
    formData.append('logo_type', type)
    const res = await fetch('/api/settings/upload-logo', {
      method: 'POST',
      headers: { 'Authorization': `Bearer ${token}` },
      body: formData
    })
    if (!res.ok) {
      const err = await res.json()
      throw new Error(err.message || 'Upload failed')
    }
    const data = await res.json()
    await loadSettings()
    return data.url
  }

  return { settings, isLoading, loadSettings, saveSettings, uploadLogo }
}
