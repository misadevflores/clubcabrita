<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { RouterLink, RouterView } from 'vue-router'
import { useSettingsStore } from './store/settings'
import { useAuthStore } from './store/auth'

import { supabase } from '../utils/supabase'

const todos = ref([])

const { settings, loadSettings } = useSettingsStore()
const { isAuthenticated, logout } = useAuthStore()

const menuOpen = ref(false)

// Dynamic logos: fall back to static files if not set in settings
const logoDesktop = computed(() => settings.value.logo_desktop || '/images/clubcabritas.png')
const logoMobile  = computed(() => settings.value.logo_mobile  || '/images/logo.png')


function toggleMenu() {
  menuOpen.value = !menuOpen.value
}

function closeMenu() {
  menuOpen.value = false
}

onMounted(async () => {
    await loadSettings()
})
</script>

<template>
  <header class="navbar">
    <div class="container nav-content">
      <div class="logo">
        <RouterLink to="/" @click="closeMenu">
          <!-- Desktop logo -->
          <img :src="logoDesktop" alt="Club Cabritas" class="logo-img logo-desktop" />
          <!-- Mobile logo (shown on small screens) -->
          <img :src="logoMobile" alt="Club Cabritas" class="logo-img logo-mobile" />
        </RouterLink>
      </div>




      <!-- Desktop Navigation -->
      <nav class="nav-links desktop-only">
        <RouterLink to="/" class="nav-item" active-class="active">Inicio</RouterLink>
        <RouterLink to="/rutas" class="nav-item" active-class="active">Rutas</RouterLink>
        <RouterLink to="/galeria" class="nav-item" active-class="active">Galería</RouterLink>

        <template v-if="isAuthenticated">
          <RouterLink to="/admin" class="nav-item upload-btn">
            <span>Panel Admin</span>
          </RouterLink>
          <button @click="logout" class="nav-item logout-btn">Cerrar Sesión</button>
        </template>
        <template v-else>
          <RouterLink to="/login" class="nav-item upload-btn">
            <span>🔒 Login</span>
          </RouterLink>
        </template>
      </nav>

      <!-- Hamburger button (mobile only) -->
      <button class="hamburger mobile-only" @click="toggleMenu" :aria-expanded="menuOpen" aria-label="Abrir menú">
        <span :class="{ open: menuOpen }"></span>
        <span :class="{ open: menuOpen }"></span>
        <span :class="{ open: menuOpen }"></span>
      </button>
    </div>

    <!-- Mobile menu drawer -->
    <nav class="mobile-menu" :class="{ active: menuOpen }" role="navigation" aria-label="Menú móvil">
      <RouterLink to="/" class="mobile-nav-item" active-class="active" @click="closeMenu">Inicio</RouterLink>
      <RouterLink to="/rutas" class="mobile-nav-item" active-class="active" @click="closeMenu">Rutas</RouterLink>
      <RouterLink to="/galeria" class="mobile-nav-item" active-class="active" @click="closeMenu">Galería</RouterLink>

      <template v-if="isAuthenticated">
        <RouterLink to="/admin" class="mobile-nav-item admin-btn" @click="closeMenu">Panel Admin</RouterLink>
        <button @click="() => { logout(); closeMenu() }" class="mobile-nav-item logout-btn-mobile">Cerrar Sesión</button>
      </template>
      <template v-else>
        <RouterLink to="/login" class="mobile-nav-item admin-btn" @click="closeMenu">🔒 Login</RouterLink>
      </template>
    </nav>
  </header>

  <!-- Overlay to close menu on outside click -->
  <div class="overlay" :class="{ active: menuOpen }" @click="closeMenu"></div>

  <main class="main-content">
    <RouterView v-slot="{ Component }">
      <transition name="fade" mode="out-in">
        <component :is="Component" />
      </transition>
    </RouterView>
  </main>

  <footer class="footer">
    <div class="container footer-content">
      <div class="footer-info">
        <h3>CLUB CABRITAS</h3>
        <p>Ecoturismo a tu alcance.</p>
        <p class="tagline">No somos agencia, somos viajeros.</p>
      </div>
      <div class="footer-social">
        <h4>Síguenos</h4>
        <div class="social-links">
          <a href="https://www.instagram.com/club.cabritas/" target="_blank" rel="noopener" class="social-link">Instagram</a>
          <a href="https://www.tiktok.com/@club.cabritas" target="_blank" rel="noopener" class="social-link">TikTok</a>
        </div>
      </div>
    </div>
    <div class="container footer-bottom">
      <p>&copy; 2026 Club Cabritas. Todos los derechos reservados.</p>
    </div>
  </footer>
</template>

<style scoped>
.navbar {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  z-index: 50;
  background-color: rgba(254, 253, 250, 0.95);
  backdrop-filter: blur(10px);
  border-bottom: 1px solid rgba(0, 0, 0, 0.05);
  transition: all 0.3s ease;
}

.nav-content {
  display: flex;
  justify-content: space-between;
  align-items: center;
  height: 80px;
}

.logo-img {
  height: 48px;
  width: auto;
  display: block;
  object-fit: contain;
}

/* Mobile logo hidden on desktop, desktop logo hidden on mobile */
.logo-mobile {
  display: none;
}

.logo-desktop {
  display: block;
}

/* ── Desktop nav ── */
.nav-links {
  display: flex;
  align-items: center;
  gap: 2rem;
}

.nav-item {
  font-weight: 500;
  color: var(--color-text-dark);
  transition: color 0.3s ease;
  position: relative;
}

.nav-item::after {
  content: '';
  position: absolute;
  width: 0;
  height: 2px;
  bottom: -4px;
  left: 0;
  background-color: var(--color-accent);
  transition: width 0.3s ease;
}

.nav-item:hover {
  color: var(--color-accent);
}

.nav-item:hover::after,
.nav-item.active::after {
  width: 100%;
}

.nav-item.active {
  color: var(--color-accent);
}

.upload-btn {
  background-color: var(--color-primary);
  color: white !important;
  padding: 0.6rem 1.2rem;
  border-radius: var(--radius-xl);
  font-weight: 600;
  transition: all 0.3s ease;
}

.upload-btn::after {
  display: none;
}

.upload-btn:hover {
  background-color: var(--color-primary-light);
  color: white !important;
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(18, 53, 36, 0.2);
}

.logout-btn {
  background: transparent;
  border: 2px solid var(--color-primary);
  color: var(--color-primary);
  padding: 0.6rem 1.2rem;
  border-radius: var(--radius-xl);
  font-weight: 600;
  cursor: pointer;
  font-family: inherit;
  font-size: inherit;
  transition: all 0.3s ease;
}

.logout-btn:hover {
  background-color: var(--color-primary);
  color: white;
  transform: translateY(-2px);
}

/* ── Hamburger ── */
.hamburger {
  display: none;
  flex-direction: column;
  justify-content: space-between;
  width: 28px;
  height: 20px;
  background: transparent;
  border: none;
  cursor: pointer;
  padding: 0;
}

.hamburger span {
  display: block;
  height: 2px;
  width: 100%;
  background-color: var(--color-text-dark);
  border-radius: 2px;
  transition: all 0.3s ease;
  transform-origin: center;
}

/* Animate to X */
.hamburger span:nth-child(1).open {
  transform: translateY(9px) rotate(45deg);
}
.hamburger span:nth-child(2).open {
  opacity: 0;
  transform: scaleX(0);
}
.hamburger span:nth-child(3).open {
  transform: translateY(-9px) rotate(-45deg);
}

/* ── Mobile menu drawer ── */
.mobile-menu {
  display: none;
  flex-direction: column;
  background-color: rgba(254, 253, 250, 0.98);
  border-top: 1px solid rgba(0, 0, 0, 0.07);
  padding: 1rem 0 1.5rem;
  overflow: hidden;
  max-height: 0;
  transition: max-height 0.35s ease, padding 0.3s ease;
}

.mobile-menu.active {
  max-height: 400px;
  padding: 1rem 0 1.5rem;
}

.mobile-nav-item {
  display: block;
  padding: 0.85rem 1.5rem;
  font-weight: 500;
  font-size: 1.05rem;
  color: var(--color-text-dark);
  transition: background-color 0.2s ease, color 0.2s ease;
  border-left: 3px solid transparent;
}

.mobile-nav-item:hover,
.mobile-nav-item.active {
  background-color: rgba(18, 53, 36, 0.05);
  color: var(--color-accent);
  border-left-color: var(--color-accent);
}

.mobile-nav-item.admin-btn {
  margin: 0.5rem 1.5rem 0;
  padding: 0.75rem 1.2rem;
  background-color: var(--color-primary);
  color: white !important;
  border-radius: var(--radius-xl);
  text-align: center;
  font-weight: 600;
  border-left: none;
}

.mobile-nav-item.admin-btn:hover {
  background-color: var(--color-primary-light);
  border-left: none;
}

.logout-btn-mobile {
  display: block;
  margin: 0.5rem 1.5rem 0;
  padding: 0.75rem 1.2rem;
  background: transparent;
  border: 2px solid var(--color-primary);
  color: var(--color-primary);
  border-radius: var(--radius-xl);
  font-weight: 600;
  cursor: pointer;
  font-family: inherit;
  font-size: 1.05rem;
  width: calc(100% - 3rem);
  text-align: center;
  transition: all 0.3s ease;
}

.logout-btn-mobile:hover {
  background-color: var(--color-primary);
  color: white;
}

/* ── Overlay ── */
.overlay {
  display: none;
  position: fixed;
  inset: 0;
  z-index: 40;
  background-color: rgba(0, 0, 0, 0.3);
  opacity: 0;
  transition: opacity 0.3s ease;
}

.overlay.active {
  opacity: 1;
}

/* ── Main content ── */
.main-content {
  min-height: calc(100vh - 80px);
  padding-top: 80px;
}

/* ── Footer ── */
.footer {
  background-color: var(--color-bg-dark);
  color: var(--color-text-light);
  padding: 4rem 0 2rem;
}

.footer-content {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 2rem;
  margin-bottom: 3rem;
}

.footer-info h3 {
  color: var(--color-bg-light);
  font-size: 1.5rem;
  margin-bottom: 1rem;
}

.tagline {
  color: var(--color-accent);
  font-weight: 600;
  margin-top: 0.5rem;
}

.footer-social h4 {
  color: var(--color-bg-light);
  margin-bottom: 1rem;
}

.social-links {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.social-link {
  color: var(--color-text-light);
  transition: color 0.3s ease;
}

.social-link:hover {
  color: var(--color-accent);
}

.footer-bottom {
  text-align: center;
  padding-top: 2rem;
  border-top: 1px solid rgba(255, 255, 255, 0.1);
  font-size: 0.9rem;
  color: var(--color-text-muted);
}

/* ── Responsive ── */
@media (max-width: 768px) {
  .desktop-only {
    display: none;
  }

  .mobile-only {
    display: flex;
  }

  .hamburger {
    display: flex;
  }

  .mobile-menu {
    display: flex;
  }

  .overlay.active {
    display: block;
  }

  .footer-content {
    grid-template-columns: 1fr;
  }

  /* Swap logos on mobile */
  .logo-desktop {
    display: none;
  }

  .logo-mobile {
    display: block;
  }
}

/* ── Page transition ── */
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.2s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>
