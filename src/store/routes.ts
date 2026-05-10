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
// GOOGLE SHEETS API URL
// Pega aquí la URL que te da Google Apps Script al implementar tu Web App.
// Ejemplo: 'https://script.google.com/macros/s/AKfyc.../exec'
// =========================================================
const GOOGLE_SHEETS_URL = '' // Si está vacío, usará LocalStorage para no romper la app

const defaultRoutes: RouteItem[] = [
    {
        id: '1',
        title: 'Ascenso al Nevado Condoriri',
        date: '15 de Mayo, 2026',
        image: '/images/route_snow.png',
        type: 'Alta Montaña',
        description: 'Una expedición inolvidable a una de las cumbres más icónicas de la Cordillera Real.'
    },
    {
        id: '2',
        title: 'Trekking Valle de las Ánimas',
        date: '22 de Mayo, 2026',
        image: '/images/route_green.png',
        type: 'Senderismo',
        description: 'Recorrido por las increíbles y místicas formaciones geológicas a pocos minutos de La Paz.'
    }
]

export const useRoutesStore = () => {
    const routes = ref<RouteItem[]>([])
    const isLoading = ref(false)

    const loadRoutes = async () => {
        isLoading.value = true
        try {
            if (GOOGLE_SHEETS_URL) {
                const response = await fetch(GOOGLE_SHEETS_URL)
                const data = await response.json()
                if (data.length > 0) {
                    routes.value = data
                } else {
                    routes.value = []
                }
            } else {
                // Fallback a LocalStorage si no hay URL
                const saved = localStorage.getItem('cabritas_routes')
                if (saved) {
                    routes.value = JSON.parse(saved)
                } else {
                    routes.value = [...defaultRoutes]
                }
            }
        } catch (e) {
            console.error("Error al cargar rutas:", e)
        } finally {
            isLoading.value = false
        }
    }

    const addRoute = async (route: Omit<RouteItem, 'id'>) => {
        try {
            if (GOOGLE_SHEETS_URL) {
                await fetch(GOOGLE_SHEETS_URL, {
                    method: 'POST',
                    mode: 'no-cors', // Evita errores de CORS en peticiones a script.google
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify(route)
                })
                // Recargar desde sheets para asegurar consistencia
                setTimeout(() => loadRoutes(), 1000)
            } else {
                // Fallback LocalStorage
                const newRoute = { ...route, id: Date.now().toString() }
                routes.value.unshift(newRoute)
                localStorage.setItem('cabritas_routes', JSON.stringify(routes.value))
            }
        } catch (e) {
            console.error("Error guardando:", e)
        }
    }

    const deleteRoute = (id: string) => {
        if (!GOOGLE_SHEETS_URL) {
            routes.value = routes.value.filter(r => r.id !== id)
            localStorage.setItem('cabritas_routes', JSON.stringify(routes.value))
        }
        // Delete in google sheets require more logic in GS, omitted for basic upload.
    }

    return {
        routes,
        isLoading,
        loadRoutes,
        addRoute,
        deleteRoute
    }
}
