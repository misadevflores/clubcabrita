import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '../views/HomeView.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: HomeView
    },
    {
      path: '/rutas',
      name: 'rutas',
      // route level code-splitting
      // this generates a separate chunk (About.[hash].js) for this route
      // which is lazy-loaded when the route is visited.
      component: () => import('../views/RoutesView.vue')
    },
    {
      path: '/admin',
      name: 'admin',
      component: () => import('../views/admin/AdminDashboard.vue'),
      meta: { requiresAuth: true }
    },
    {
      path: '/login',
      name: 'login',
      component: () => import('../views/LoginView.vue')
    },
    {
      path: '/galeria',
      name: 'galeria',
      component: () => import('../views/GalleryView.vue')
    }
  ],
  scrollBehavior() {
    return { top: 0, behavior: 'smooth' };
  }
})

// Navigation Guard
import { useAuthStore } from '../store/auth'

router.beforeEach((to, from, next) => {
  if (to.meta.requiresAuth) {
    const { isAuthenticated } = useAuthStore()
    if (!isAuthenticated.value) {
      next({ name: 'login' })
    } else {
      next()
    }
  } else {
    next()
  }
})

export default router
