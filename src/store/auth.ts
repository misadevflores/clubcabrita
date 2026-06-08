import { ref, computed } from 'vue'

export const useAuthStore = () => {
  const token = ref(localStorage.getItem('cabritas_token') || null)
  const user  = ref(localStorage.getItem('cabritas_user')  || null)

  const isAuthenticated = computed(() => !!token.value)

  const login = async (username: string, password: string): Promise<boolean> => {
    try {
      const res = await fetch('/api/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password })
      })
      if (!res.ok) return false
      const data = await res.json()
      token.value = data.token
      user.value  = data.username
      localStorage.setItem('cabritas_token', data.token)
      localStorage.setItem('cabritas_user',  data.username)
      return true
    } catch (e) {
      console.error('Login error:', e)
      throw new Error('Error en la conexión')
    }
  }

  const logout = () => {
    token.value = null
    user.value  = null
    localStorage.removeItem('cabritas_token')
    localStorage.removeItem('cabritas_user')
  }

  return { token, user, isAuthenticated, login, logout }
}
