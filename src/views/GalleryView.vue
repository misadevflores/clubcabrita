<script setup lang="ts">
import { ref, onMounted, onUnmounted, computed } from 'vue'

interface GalleryItem {
  id: number
  image: string
  title: string
  description?: string
  category?: string
  display_order?: number
}

const galleryImages = ref<GalleryItem[]>([])
const loading = ref(true)
const error = ref('')

const activeIndex = ref<number | null>(null)
const isLightboxOpen = ref(false)

// Calcular spanClass basado en display_order
const getSpanClass = (index: number): string => {
  const spanClasses = [
    'col-span-2 row-span-2', // 0
    'col-span-2 row-span-1', // 1
    'col-span-1 row-span-2', // 2
    'col-span-1 row-span-1', // 3
    'col-span-1 row-span-1', // 4
    'col-span-2 row-span-2'  // 5
  ]
  return spanClasses[index % spanClasses.length]
}

// Cargar galería desde la BD
const fetchGallery = async () => {
  try {
    loading.value = true
    const response = await fetch('/api/gallery')
    if (!response.ok) throw new Error('Error al cargar galería')
    const data = await response.json()
    
    // Ordenar por display_order
    galleryImages.value = data.sort((a: GalleryItem, b: GalleryItem) => 
      (a.display_order || 0) - (b.display_order || 0)
    )
    error.value = ''
  } catch (err) {
    console.error('Error:', err)
    error.value = 'No se pudo cargar la galería'
    // Cargar datos por defecto si hay error
    loadDefaultGallery()
  } finally {
    loading.value = false
  }
}

// Datos por defecto si no hay en BD
const loadDefaultGallery = () => {
  galleryImages.value = [
    {
      id: 1,
      image: '/images/vertical-img1.jpeg',
      title: '¡Logramos el pico!',
      description: 'Un momento épico en la cumbre',
      category: 'Montaña',
      display_order: 0
    },
    {
      id: 2,
      image: '/images/cafetal-img1.jpeg',
      title: 'Visita al Cafetal',
      description: 'Explorando las plantaciones locales',
      category: 'Naturaleza',
      display_order: 1
    },
    {
      id: 3,
      image: '/images/vertical-img3.jpeg',
      title: 'Atardeceres Andinos',
      description: 'Puesta de sol majestuosa',
      category: 'Paisaje',
      display_order: 2
    },
    {
      id: 4,
      image: '/images/vertical-img2.jpeg',
      title: 'Atardeceres Andinos',
      description: 'Colores del atardecer',
      category: 'Paisaje',
      display_order: 3
    },
    {
      id: 5,
      image: '/images/vertical-img4.jpeg',
      title: 'Montañas del valle',
      description: 'Vista del valle',
      category: 'Montaña',
      display_order: 4
    },
    {
      id: 6,
      image: '/images/vertical-img5.jpeg',
      title: 'Alta Montaña',
      description: 'Cumbre nevada',
      category: 'Montaña',
      display_order: 5
    }
  ]
}

const openLightbox = (index: number) => {
  activeIndex.value = index
  isLightboxOpen.value = true
  document.body.style.overflow = 'hidden'
}

const closeLightbox = () => {
  isLightboxOpen.value = false
  setTimeout(() => activeIndex.value = null, 400) 
  document.body.style.overflow = ''
}

const nextImage = () => {
  if (activeIndex.value !== null) {
    activeIndex.value = (activeIndex.value + 1) % galleryImages.value.length
  }
}

const prevImage = () => {
  if (activeIndex.value !== null) {
    activeIndex.value = (activeIndex.value - 1 + galleryImages.value.length) % galleryImages.value.length
  }
}

const handleKeydown = (e: KeyboardEvent) => {
  if (!isLightboxOpen.value) return
  if (e.key === 'Escape') closeLightbox()
  if (e.key === 'ArrowRight') nextImage()
  if (e.key === 'ArrowLeft') prevImage()
}

onMounted(() => {
  window.addEventListener('keydown', handleKeydown)
  fetchGallery()
})

onUnmounted(() => window.removeEventListener('keydown', handleKeydown))
</script>

<template>
  <div class="elegant-gallery-view pb-12">
    
    <!-- Header -->
    <header class="gallery-header container">
      <div class="header-content">
        <h1 class="fade-in-up">Nuestras<br/><span class="text-accent">Memorias</span></h1>
        <p class="subtitle fade-in-up delay-1">
          Una colección inmersiva de nuestras pasadas expediciones. No somos agencia, somos viajeros que documentan cada paso.
        </p>
      </div>
    </header>

    <!-- Loading State -->
    <div v-if="loading" class="container text-center py-12">
      <div class="spinner"></div>
      <p class="text-muted mt-4">Cargando galería...</p>
    </div>

    <!-- Error State -->
    <div v-else-if="error" class="container text-center py-12">
      <p class="text-error">{{ error }}</p>
    </div>

    <!-- Masonry-like CSS Grid -->
    <div v-else class="container">
      <div class="bento-grid fade-in-up delay-2">
        <div 
          v-for="(item, index) in galleryImages" 
          :key="item.id" 
          class="grid-item group"
          :class="getSpanClass(index)"
          @click="openLightbox(index)"
        >
          <img :src="item.image" :alt="item.title" class="gallery-image" loading="lazy" />
          
          <div class="image-overlay">
            <div class="overlay-text">
              <span v-if="item.category" class="location">{{ item.category }}</span>
              <h3 class="title">{{ item.title }}</h3>
              <p v-if="item.description" class="description">{{ item.description }}</p>
            </div>
            
            <div class="view-icon">
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-expand"><line x1="21" y1="21" x2="15" y2="15"></line><line x1="21" y1="3" x2="15" y2="9"></line><line x1="3" y1="21" x2="9" y2="15"></line><line x1="3" y1="3" x2="9" y2="9"></line><polyline points="21 16 21 21 16 21"></polyline><polyline points="21 8 21 3 16 3"></polyline><polyline points="3 8 3 3 8 3"></polyline><polyline points="3 16 3 21 8 21"></polyline></svg>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>

  <!-- Cinematic Lightbox -->
  <transition name="fade">
    <div v-if="isLightboxOpen" class="cinematic-lightbox" @click.self="closeLightbox">
      
      <!-- Top controls -->
      <div class="lightbox-toolbar">
        <span class="counter">{{ activeIndex !== null ? activeIndex + 1 : 0 }} / {{ galleryImages.length }}</span>
        <button class="btn-icon" @click="closeLightbox" aria-label="Close" title="Cerrar (Esc)">
          <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
        </button>
      </div>
      
      <!-- Navigation -->
      <button class="nav-arrow prev-arrow" @click.stop="prevImage" aria-label="Previous">
        <svg xmlns="http://www.w3.org/2000/svg" width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><polyline points="15 18 9 12 15 6"></polyline></svg>
      </button>
      
      <!-- Active Image Box -->
      <div class="lightbox-center" v-if="activeIndex !== null">
        <div class="image-wrapper" @click.stop>
          <img :src="galleryImages[activeIndex]?.image" :alt="galleryImages[activeIndex]?.title" class="lightbox-hero-img" />
        </div>
        
        <div class="lightbox-info">
          <h2>{{ galleryImages[activeIndex]?.title }}</h2>
          <p v-if="galleryImages[activeIndex]?.category">
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="display:inline; margin-right:4px;"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0118 0z"></path><circle cx="12" cy="10" r="3"></circle></svg> 
            {{ galleryImages[activeIndex]?.category }}
          </p>
          <p v-if="galleryImages[activeIndex]?.description" class="description-text">
            {{ galleryImages[activeIndex]?.description }}
          </p>
        </div>
      </div>
      
      <button class="nav-arrow next-arrow" @click.stop="nextImage" aria-label="Next">
        <svg xmlns="http://www.w3.org/2000/svg" width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><polyline points="9 18 15 12 9 6"></polyline></svg>
      </button>

    </div>
  </transition>
</template>

<style scoped>
.pb-12 {
  padding-bottom: 8rem;
}

/* Loading Spinner */
.spinner {
  width: 40px;
  height: 40px;
  border: 4px solid rgba(40, 167, 69, 0.2);
  border-top-color: #28a745;
  border-radius: 50%;
  animation: spin 0.8s linear infinite;
  margin: 0 auto;
}

@keyframes spin {
  to { transform: rotate(360deg); }
}

.text-muted {
  color: var(--color-text-muted);
}

.text-error {
  color: #dc3545;
  font-size: 1.1rem;
}

/* Header */
.gallery-header {
  padding: 6rem 1.5rem 3rem;
  text-align: center;
}

.header-content {
  max-width: 800px;
  margin: 0 auto;
}

.gallery-header h1 {
  font-size: clamp(3rem, 6vw, 5rem);
  font-weight: 700;
  line-height: 1.1;
  color: var(--color-primary);
  margin-bottom: 1.5rem;
  letter-spacing: -1px;
}

.text-accent {
  color: var(--color-accent);
}

.subtitle {
  font-size: 1.25rem;
  color: var(--color-text-muted);
  line-height: 1.6;
}

/* Bento/Masonry Grid */
.bento-grid {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  grid-auto-rows: 280px;
  gap: 24px;
}

.grid-item {
  position: relative;
  border-radius: var(--radius-lg);
  overflow: hidden;
  cursor: pointer;
  background: var(--color-bg-dark);
  box-shadow: 0 10px 30px rgba(0,0,0,0.05);
  transition: transform 0.4s cubic-bezier(0.25, 1, 0.5, 1), box-shadow 0.4s ease;
}

.grid-item:hover {
  transform: translateY(-5px);
  box-shadow: 0 15px 40px rgba(0,0,0,0.15);
}

.col-span-2 { grid-column: span 2; }
.col-span-1 { grid-column: span 1; }
.row-span-2 { grid-row: span 2; }
.row-span-1 { grid-row: span 1; }

.gallery-image {
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: transform 0.8s cubic-bezier(0.25, 1, 0.5, 1), filter 0.8s ease;
  filter: brightness(0.9);
}

.grid-item:hover .gallery-image {
  transform: scale(1.08);
  filter: brightness(1.1);
}

.image-overlay {
  position: absolute;
  inset: 0;
  background: linear-gradient(to top, rgba(10, 31, 19, 0.9) 0%, rgba(10, 31, 19, 0) 50%);
  opacity: 0;
  display: flex;
  flex-direction: column;
  justify-content: flex-end;
  padding: 2rem;
  transition: opacity 0.4s ease;
}

.grid-item:hover .image-overlay {
  opacity: 1;
}

.overlay-text {
  transform: translateY(20px);
  transition: transform 0.4s cubic-bezier(0.25, 1, 0.5, 1);
}

.grid-item:hover .overlay-text {
  transform: translateY(0);
}

.location {
  display: block;
  color: var(--color-accent);
  font-size: 0.85rem;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 2px;
  margin-bottom: 0.5rem;
}

.title {
  color: white;
  font-size: 1.8rem;
  font-weight: 600;
  line-height: 1.2;
  margin: 0;
}

.description {
  color: rgba(255, 255, 255, 0.8);
  font-size: 0.9rem;
  margin-top: 0.5rem;
  line-height: 1.4;
}

.view-icon {
  position: absolute;
  top: 1.5rem;
  right: 1.5rem;
  background: rgba(255,255,255,0.2);
  backdrop-filter: blur(8px);
  width: 48px;
  height: 48px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  opacity: 0;
  transform: scale(0.8);
  transition: all 0.4s cubic-bezier(0.25, 1, 0.5, 1);
}

.grid-item:hover .view-icon {
  opacity: 1;
  transform: scale(1);
}

/* Media Queries for Grid */
@media (max-width: 1024px) {
  .bento-grid {
    grid-template-columns: repeat(2, 1fr);
  }
}
@media (max-width: 640px) {
  .bento-grid {
    grid-template-columns: 1fr;
    grid-auto-rows: 300px;
  }
  .col-span-2 { grid-column: span 1; }
  .row-span-2 { grid-row: span 1; height: 400px; }
  .gallery-header { padding: 4rem 1.5rem 2rem; }
}

/* Animations */
.fade-in-up {
  opacity: 0;
  animation: fadeInUp 0.8s ease forwards;
}
.delay-1 { animation-delay: 0.2s; }
.delay-2 { animation-delay: 0.4s; }

@keyframes fadeInUp {
  from { opacity: 0; transform: translateY(30px); }
  to { opacity: 1; transform: translateY(0); }
}

/* ---------------------------------
   CINEMATIC LIGHTBOX 
   --------------------------------*/
.cinematic-lightbox {
  position: fixed;
  inset: 0;
  background-color: rgba(6, 15, 10, 0.98);
  backdrop-filter: blur(15px);
  z-index: 9999;
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
}

.lightbox-toolbar {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  padding: 2rem 3rem;
  display: flex;
  justify-content: space-between;
  align-items: center;
  z-index: 10001;
}

.counter {
  font-size: 1.1rem;
  font-weight: 500;
  letter-spacing: 2px;
  color: rgba(255,255,255,0.6);
}

.btn-icon {
  background: transparent;
  border: none;
  color: rgba(255,255,255,0.6);
  cursor: pointer;
  transition: color 0.3s, transform 0.3s;
}

.btn-icon:hover {
  color: white;
  transform: rotate(90deg);
}

.nav-arrow {
  position: absolute;
  top: 50%;
  transform: translateY(-50%);
  background: transparent;
  border: none;
  color: rgba(255,255,255,0.3);
  cursor: pointer;
  padding: 2rem;
  z-index: 10001;
  transition: all 0.3s ease;
}

.nav-arrow:hover {
  color: white;
  transform: translateY(-50%) scale(1.2);
}

.prev-arrow { left: 1rem; }
.next-arrow { right: 1rem; }

.lightbox-center {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  width: 100%;
  height: 100%;
  padding: 6rem 5rem 2rem;
  box-sizing: border-box;
}

.image-wrapper {
  flex: 1;
  width: 100%;
  max-height: calc(100vh - 200px);
  display: flex;
  align-items: center;
  justify-content: center;
  animation: cinematicReveal 0.6s cubic-bezier(0.2, 0.8, 0.2, 1) forwards;
  opacity: 0;
  transform: scale(0.95);
}

@keyframes cinematicReveal {
  to {
    opacity: 1;
    transform: scale(1);
  }
}

.lightbox-hero-img {
  max-width: 100%;
  max-height: 100%;
  object-fit: contain;
  box-shadow: 0 30px 100px rgba(0,0,0,0.6);
}

.lightbox-info {
  margin-top: 2rem;
  text-align: center;
  animation: fadeInUp 0.6s 0.2s ease forwards;
  opacity: 0;
}

.lightbox-info h2 {
  font-size: 2rem;
  font-weight: 400;
  letter-spacing: 1px;
  margin-bottom: 0.5rem;
}

.lightbox-info p {
  color: var(--color-accent);
  font-size: 1rem;
  letter-spacing: 2px;
  text-transform: uppercase;
  margin: 0.5rem 0;
}

.description-text {
  color: rgba(255, 255, 255, 0.8) !important;
  font-size: 1rem !important;
  letter-spacing: normal !important;
  text-transform: none !important;
  margin-top: 1rem !important;
}

.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.4s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}

@media (max-width: 768px) {
  .lightbox-toolbar { padding: 1.5rem; }
  .nav-arrow { padding: 0.5rem; }
  .lightbox-info h2 { font-size: 1.5rem; }
}
</style>
