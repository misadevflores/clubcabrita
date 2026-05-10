<script setup lang="ts">
import { RouterLink, RouterView } from 'vue-router'
</script>

<template>
  <header class="navbar">
    <div class="container nav-content">
      <div class="logo">
        <RouterLink to="/">
          <span class="logo-text">CLUB CABRITAS</span>
        </RouterLink>
      </div>
      
      <!-- Desktop Navigation -->
      <nav class="nav-links desktop-only">
        <RouterLink to="/" class="nav-item" active-class="active">Inicio</RouterLink>
        <RouterLink to="/rutas" class="nav-item" active-class="active">Rutas</RouterLink>
        <RouterLink to="/galeria" class="nav-item" active-class="active">Galería</RouterLink>
        <RouterLink to="/admin" class="nav-item upload-btn">
          <span>Subir Ruta</span>
        </RouterLink>
      </nav>
    </div>
  </header>

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
  background-color: rgba(254, 253, 250, 0.9);
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

.logo-text {
  font-size: 1.5rem;
  font-weight: 700;
  color: var(--color-primary);
  letter-spacing: 1px;
}

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
  color: white;
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
  color: white;
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(18, 53, 36, 0.2);
}

.main-content {
  min-height: calc(100vh - 80px);
  padding-top: 80px;
}

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

@media (max-width: 768px) {
  .desktop-only {
    display: none;
  }
  .footer-content {
    grid-template-columns: 1fr;
  }
}
</style>
