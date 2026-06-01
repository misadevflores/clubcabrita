<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue'
import { RouterLink } from 'vue-router'

const featuredRoutes = ref([
  {
    id: 1,
    title: 'Cumbre Nevado Condoriri',
    date: '15 de Mayo, 2026',
    image: '/images/route_snow.png',
    type: 'Alta Montaña',
    difficulty: 'Extrema',
    elevation: '5,550 m',
    duration: '3 días'
  },
  {
    id: 2,
    title: 'Trekking Valle de las Ánimas',
    date: '22 de Mayo, 2026',
    image: '/images/route_green.png',
    type: 'Senderismo',
    difficulty: 'Media',
    elevation: '3,800 m',
    duration: '1 día'
  },
  {
    id: 3,
    title: 'Expedición Huayna Potosí',
    date: '02 de Junio, 2026',
    image: '/images/vertical-img3.jpeg',
    type: 'Alta Montaña',
    difficulty: 'Alta',
    elevation: '6,088 m',
    duration: '2 días'
  },
  {
    id: 4,
    title: 'Aventura Andina Norte',
    date: '14 de Junio, 2026',
    image: '/images/vertical-img2.jpeg',
    type: 'Senderismo',
    difficulty: 'Moderada',
    elevation: '4,200 m',
    duration: '1 día'
  }
])

const guides = ref([
  { id: 1, name: 'Mateo Quispe', role: 'Guía de Alta Montaña (UIAGM)', avatar: 'https://i.pravatar.cc/300?u=guides1', expeditions: 45 },
  { id: 2, name: 'Valeria López', role: 'Expertise en Ecoturismo', avatar: 'https://i.pravatar.cc/300?u=guides2', expeditions: 38 },
  { id: 3, name: 'Diego Arana', role: 'Rescatista y Logística', avatar: 'https://i.pravatar.cc/300?u=guides3', expeditions: 52 },
])

const stats = ref([
  { number: '500+', label: 'Viajeros Satisfechos', icon: '👥' },
  { number: '25+', label: 'Rutas Exploradas', icon: '🗺️' },
  { number: '8,000+', label: 'Metros de Altitud', icon: '⛰️' },
  { number: '100%', label: 'Seguridad Garantizada', icon: '✓' }
])

const marqueeImages = [
  '/images/gallery_1.png', '/images/gallery_2.png', '/images/gallery_3.png',
  '/images/route_snow.png', '/images/route_green.png', '/images/hero_bg.png'
]

const observer = ref<IntersectionObserver | null>(null)
const scrollY = ref(0)
const mousePos = ref({ x: 0, y: 0 })
const isHoveringPlay = ref(false)

onMounted(() => {
  // Intersection Observer for the Advanced Reveal Animations
  observer.value = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('is-revealed')
      }
    })
  }, { threshold: 0.15, rootMargin: '0px 0px -100px 0px' })

  document.querySelectorAll('.reveal-trigger').forEach((el) => {
    observer.value?.observe(el)
  })

  window.addEventListener('scroll', handleScroll)
  window.addEventListener('mousemove', handleMouseMove)
})

onUnmounted(() => {
  if (observer.value) observer.value.disconnect()
  window.removeEventListener('scroll', handleScroll)
  window.removeEventListener('mousemove', handleMouseMove)
})

const handleScroll = () => { scrollY.value = window.scrollY }
const handleMouseMove = (e: MouseEvent) => {
  mousePos.value = { x: e.clientX, y: e.clientY }
}
</script>

<template>
  <div class="home-view">
    
    <!-- Custom interactive cursor for video hover -->
    <div v-show="isHoveringPlay" class="custom-cursor" :style="{ left: mousePos.x + 'px', top: mousePos.y + 'px' }">
      PLAY
    </div>

    <!-- 1. CINEMATIC HERO -->
    <section class="hero">
      <div class="hero-bg" :style="{ transform: `translateY(${scrollY * 0.4}px) scale(${1 + scrollY * 0.0005})` }"></div>
      <div class="hero-overlay"></div>
      
      <!-- Granular compass/topo lines overlay -->
      <div class="topo-pattern"></div>

      <div class="container hero-content">
        <div class="reveal-trigger">
           <span class="hero-badge reveal-item slide-up-clip">ECOTURISMO DE AUTOR</span>
        </div>
        
        <div class="reveal-trigger">
          <h1 class="hero-title">
            <span class="reveal-item slide-up-clip line-1">No somos</span>
            <span class="reveal-item slide-up-clip line-2 text-accent">agencia.</span><br/>
            <span class="reveal-item slide-up-clip line-3">Somos viajeros.</span>
          </h1>
        </div>

        <div class="reveal-trigger">
          <p class="hero-desc reveal-item fade-in delay-800">
            Descubre las montañas ocultas de Bolivia, rutas exclusivas sin masificación y crónicas de expediciones creadas por y para exploradores reales.
          </p>
        </div>
        
        <div class="reveal-trigger hero-actions">
          <div class="reveal-item fade-in delay-1000 flex-gap">
            <RouterLink to="/rutas" class="btn-premium">Descubrir Aventuras</RouterLink>
            <a href="#video-tour" class="play-btn-circle" @mouseenter="isHoveringPlay=true" @mouseleave="isHoveringPlay=false">
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="currentColor"><polygon points="5 3 19 12 5 21 5 3"></polygon></svg>
            </a>
            <span class="play-label">Ver El Documental</span>
          </div>
        </div>
      </div>
      
      <!-- Bottom Social / Scroll Anchor -->
      <div class="hero-bottom reveal-trigger">
        <div class="reveal-item fade-in delay-1200 bottom-flex container">
          <div class="social-links-minimal">
            <a href="https://instagram.com/club.cabritas" target="_blank">IG</a>
            <a href="https://tiktok.com/@club.cabritas" target="_blank">TK</a>
          </div>
          <div class="scroll-mouse">
             <div class="wheel"></div>
          </div>
          <div class="club-est">EST. <br> 2023</div>
        </div>
      </div>
    </section>

    <!-- 2. ESTADÍSTICAS DESTACADAS -->
    <section class="stats-section">
      <div class="container">
        <div class="stats-grid">
          <div v-for="(stat, index) in stats" :key="index" class="stat-card reveal-trigger">
            <div class="reveal-item fade-in" :style="{ transitionDelay: `${index * 100}ms` }">
              <div class="stat-icon">{{ stat.icon }}</div>
              <div class="stat-number">{{ stat.number }}</div>
              <div class="stat-label">{{ stat.label }}</div>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- 3. INFINITE MARQUEE STRIP -->
    <div class="marquee-strip">
       <div class="marquee-scroll">
         <span v-for="i in 5" :key="i" class="marquee-text">LA NATURALEZA ES EL ÚNICO DESTINO &nbsp;✦&nbsp; </span>
       </div>
    </div>

    <!-- 4. LA FILOSOFÍA (AWWWARDS STYLE) -->
    <section class="section philosophy bg-ultra-light" id="filosofia">
      <div class="container">
         <div class="split-layout">
           <div class="split-left reveal-trigger">
             <h2 class="huge-title reveal-item slide-up-clip">El camino<br>del viajero.</h2>
             <RouterLink to="/galeria" class="magnetic-btn reveal-item fade-in delay-400 mt-12">Ver Galería</RouterLink>
           </div>
           <div class="split-right">
             <div class="feat-row reveal-trigger">
               <div class="reveal-item slide-up-clip">
                 <span class="feat-num">01</span>
                 <h3 class="feat-title">Conexión Auténtica</h3>
                 <p class="feat-text">Lejos del turismo tradicional. Forjamos vínculos reales con la naturaleza, con las comunidades y entre nosotros mismos, en cada paso y cada cumbre.</p>
               </div>
             </div>
             <div class="feat-row reveal-trigger">
               <div class="reveal-item slide-up-clip">
                 <span class="feat-num">02</span>
                 <h3 class="feat-title">Seguridad (UIAGM)</h3>
                 <p class="feat-text">Desafiamos las alturas más imponentes de la Cordillera de los Andes boliviana siempre respaldados por guías profesionales de talla internacional.</p>
               </div>
             </div>
             <div class="feat-row reveal-trigger">
               <div class="reveal-item slide-up-clip">
                 <span class="feat-num">03</span>
                 <h3 class="feat-title">Turismo Circular</h3>
                 <p class="feat-text">Nuestra huella debe ser positiva. Integramos y favorecemos el crecimiento económico de las familias que custodian las faldas de nuestras montañas.</p>
               </div>
             </div>
           </div>
         </div>
      </div>
    </section>

    <!-- 5. EXPEDICIONES DESTACADAS -->
    <section class="section featured-routes bg-white relative">
      <div class="container">
        <div class="flex-headline reveal-trigger">
          <h2 class="section-title reveal-item slide-up-clip">Aventuras al<br/>Cambio</h2>
          <div class="reveal-item fade-in delay-200">
            <RouterLink to="/rutas" class="circle-link-btn">Explorar<br/>Todo ➔</RouterLink>
          </div>
        </div>

        <div class="premium-grid mt-16">
          <div v-for="(route, index) in featuredRoutes" :key="route.id" class="premium-card reveal-trigger" @mouseenter="isHoveringPlay=true" @mouseleave="isHoveringPlay=false">
            <div class="reveal-item fade-in" :style="{ transitionDelay: `${index * 150}ms` }">
              <div class="img-zoom-wrapper">
                <img :src="route.image" :alt="route.title" class="img-zoom" loading="lazy" />
                <div class="card-overlay"></div>
                <div class="card-badges">
                  <span class="pill-primary">{{ route.type }}</span>
                  <span class="pill-outline">{{ route.difficulty }}</span>
                </div>
              </div>
              <div class="card-meta mt-6">
                <span class="card-date">{{ route.date }}</span>
                <h3 class="card-title">{{ route.title }}</h3>
                <div class="card-details">
                  <span class="detail-item">
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path><circle cx="12" cy="10" r="3"></circle></svg>
                    {{ route.elevation }}
                  </span>
                  <span class="detail-item">
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"></circle><polyline points="12 6 12 12 16 14"></polyline></svg>
                    {{ route.duration }}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- 6. NUESTROS GUÍAS (THE TEAM) -->
    <section class="section team-section bg-ultra-light">
      <div class="container text-center reveal-trigger">
        <h2 class="section-title reveal-item slide-up-clip text-center">Nuestros Guías</h2>
        <p class="section-desc reveal-item fade-in delay-200 mx-auto mt-6" style="max-width: 600px;">
          Tu seguridad y aprendizaje dependen de quienes te acompañan. Conoce al equipo de expertos que te llevará hasta la cima.
        </p>

        <div class="team-grid mt-16">
          <div v-for="(guide, index) in guides" :key="guide.id" class="team-member reveal-trigger">
            <div class="reveal-item slide-up-clip" :style="{ transitionDelay: `${index * 200}ms` }">
              <div class="member-avatar">
                <img :src="guide.avatar" :alt="guide.name" />
                <div class="expeditions-badge">{{ guide.expeditions }} expediciones</div>
              </div>
              <h3 class="member-name">{{ guide.name }}</h3>
              <p class="member-role">{{ guide.role }}</p>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- 7. VIDEO / MASSIVE CTA -->
    <section class="section massive-cta" id="video-tour" @mouseenter="isHoveringPlay=true" @mouseleave="isHoveringPlay=false">
      <div class="cta-parallax-bg" :style="{ transform: `translateY(${-scrollY * 0.15 + 200}px)` }"></div>
      <div class="cta-overlay-dark"></div>
      
      <div class="container cta-flex reveal-trigger">
        <div class="cta-text reveal-item slide-up-clip">
          <h2 class="massive-title">No hay Wi-Fi en la montaña,<br>pero encontrarás <span class="text-accent">una mejor conexión.</span></h2>
          <form class="email-capture mt-12" @submit.prevent>
            <input type="email" placeholder="Tu correo electrónico para unirte" required />
            <button type="submit" class="submit-arrow">→</button>
          </form>
          <p class="mt-4 text-sm text-gray font-mono uppercase tracking-widest">Recibe alertas de próximas salidas</p>
        </div>
      </div>
    </section>
  </div>
</template>

<style scoped>
/* GENERAL VARIABLES & RESETS */
.bg-ultra-light { background-color: #fcfdfc; }
.bg-white { background-color: #ffffff; }
.text-accent { color: var(--color-accent); }
.text-gray { color: #a1a1aa; }

/* CUSTOM CURSOR */
.custom-cursor {
  position: fixed;
  width: 100px;
  height: 100px;
  background: var(--color-accent);
  color: white;
  border-radius: 50%;
  pointer-events: none;
  z-index: 10000;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: 800;
  letter-spacing: 2px;
  font-size: 0.9rem;
  transform: translate(-50%, -50%) scale(0);
  animation: popIn 0.3s cubic-bezier(0.2, 0.8, 0.2, 1) forwards;
  mix-blend-mode: hard-light;
}
@keyframes popIn {
  to { transform: translate(-50%, -50%) scale(1); }
}

/* 1. CINEMATIC HERO */
.hero {
  position: relative;
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  justify-content: center;
  color: white;
  overflow: hidden;
  padding-top: 80px; /* Offset the fixed nav */
  margin-top: -80px;
}
.hero-bg {
  position: absolute; inset: -10%; width: 120%; height: 120%;
  background-image: url('/images/hero_bg.png');
  background-size: cover; background-position: center; z-index: 0;
  will-change: transform;
}
.hero-overlay {
  position: absolute; inset: 0; background: linear-gradient(to right, rgba(6, 17, 10, 0.9) 0%, rgba(6, 17, 10, 0.4) 100%); z-index: 1;
}
.topo-pattern {
  position: absolute; inset: 0; opacity: 0.05; z-index: 2;
  background-image: radial-gradient(circle at 2px 2px, white 1px, transparent 0); background-size: 32px 32px;
}

.hero-content {
  position: relative; z-index: 10; max-width: 1200px; width: 100%;
}

.hero-badge {
  display: inline-block; font-size: 0.85rem; font-weight: 800; letter-spacing: 4px; border: 1px solid rgba(255,255,255,0.3); padding: 0.5rem 1.5rem; border-radius: 100px; margin-bottom: 2rem; backdrop-filter: blur(10px);
}

.hero-title {
  font-size: clamp(4rem, 8vw, 7.5rem); font-weight: 800; line-height: 0.95; margin-bottom: 2rem; letter-spacing: -2px; text-transform: uppercase;
}
.hero-title span { display: block; } /* For clip path per line */

.hero-desc {
  font-size: clamp(1.2rem, 2vw, 1.5rem); line-height: 1.6; max-width: 650px; opacity: 0.9; margin-bottom: 3.5rem; font-weight: 400;
}

.hero-actions .flex-gap {
  display: flex; align-items: center; gap: 2rem;
}

.btn-premium {
  background: white; color: var(--color-primary); padding: 1.2rem 3rem; font-size: 1.1rem; font-weight: 800; text-transform: uppercase; border-radius: 100px; transition: transform 0.3s, box-shadow 0.3s;
}
.btn-premium:hover {
  transform: translateY(-5px); box-shadow: 0 15px 30px rgba(255,255,255,0.2);
}

.play-btn-circle {
  width: 60px; height: 60px; border-radius: 50%; border: 1px solid rgba(255,255,255,0.4); display: flex; align-items: center; justify-content: center; backdrop-filter: blur(10px); transition: all 0.3s; cursor: none;
}
.play-btn-circle:hover { background: white; color: var(--color-primary); transform: scale(1.1); }
.play-label { font-weight: 600; font-size: 1rem; text-transform: uppercase; letter-spacing: 1px;}

.hero-bottom {
  position: absolute; bottom: 0; left: 0; width: 100%; padding: 2rem 0; z-index: 10; border-top: 1px solid rgba(255,255,255,0.1);
}
.bottom-flex { display: flex; justify-content: space-between; align-items: center; font-size: 0.9rem; font-weight: 600; letter-spacing: 2px;}
.social-links-minimal { display: flex; gap: 2rem;}
.social-links-minimal a { opacity: 0.7; transition: opacity 0.3s; } .social-links-minimal a:hover { opacity: 1; }
.scroll-mouse { position: relative; }
.scroll-mouse .wheel { width: 2px; height: 15px; background: white; animation: scrollAnim 1.5s infinite ease-in-out; }
@keyframes scrollAnim { 0% { transform: translateY(-5px); opacity: 0;} 50% { transform: translateY(5px); opacity: 1;} 100% { transform: translateY(15px); opacity: 0;} }
.club-est { opacity: 0.7; text-align: right;}


/* 2. ESTADÍSTICAS DESTACADAS */
.stats-section {
  background: linear-gradient(135deg, var(--color-primary) 0%, #1a4d2e 100%);
  color: white;
  padding: 6rem 0;
  position: relative;
  overflow: hidden;
}

.stats-section::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-image: radial-gradient(circle at 20% 50%, rgba(255,255,255,0.1) 0%, transparent 50%),
                    radial-gradient(circle at 80% 80%, rgba(255,255,255,0.05) 0%, transparent 50%);
  pointer-events: none;
}

.stats-grid {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 3rem;
  position: relative;
  z-index: 1;
}

.stat-card {
  text-align: center;
  padding: 2rem;
  border-radius: 12px;
  background: rgba(255,255,255,0.05);
  backdrop-filter: blur(10px);
  border: 1px solid rgba(255,255,255,0.1);
  transition: all 0.3s ease;
}

.stat-card:hover {
  background: rgba(255,255,255,0.1);
  transform: translateY(-5px);
  border-color: rgba(255,255,255,0.3);
}

.stat-icon {
  font-size: 3rem;
  margin-bottom: 1rem;
}

.stat-number {
  font-size: 2.5rem;
  font-weight: 800;
  margin-bottom: 0.5rem;
  letter-spacing: -1px;
}

.stat-label {
  font-size: 1rem;
  opacity: 0.9;
  font-weight: 600;
}

/* 3. INFINITE MARQUEE STRIP -->
.marquee-strip {
  background: var(--color-primary); color: white; padding: 1.5rem 0; overflow: hidden; display: flex; align-items: center;
}
.marquee-scroll {
  display: flex; width: max-content; animation: slideText 20s linear infinite;
}
.marquee-text {
  font-size: 1.2rem; font-weight: 800; letter-spacing: 4px; padding-right: 2rem; white-space: nowrap;
}
@keyframes slideText { 100% { transform: translateX(-50%); } }


/* 3. PHILOSOPHY / AWWWARDS SPLIT */
.section { padding: 8rem 0; }
.split-layout { display: grid; grid-template-columns: 1fr 1.5fr; gap: 6rem; align-items: start; }

.huge-title { font-size: clamp(3rem, 6vw, 4.5rem); font-weight: 800; line-height: 1; color: var(--color-primary); letter-spacing: -2px;}
.magnetic-btn {
  display: inline-flex; align-items: center; justify-content: center; width: 150px; height: 150px; border-radius: 50%;
  background: var(--color-accent); color: white; font-weight: 700; text-transform: uppercase; letter-spacing: 1px;
  text-align: center; transition: transform 0.4s cubic-bezier(0.2, 0.8, 0.2, 1);
}
.magnetic-btn:hover { transform: scale(1.1) rotate(-10deg); }

.feat-row {
  border-top: 1px solid rgba(0,0,0,0.1); padding: 3rem 0; display: flex; gap: 3rem;
}
.feat-row:last-child { border-bottom: 1px solid rgba(0,0,0,0.1); }
.feat-num { font-size: 1.2rem; font-weight: 800; color: var(--color-accent); font-family: monospace;}
.feat-title { font-size: 2rem; font-weight: 700; color: var(--color-text-dark); margin-bottom: 1rem;}
.feat-text { font-size: 1.2rem; color: var(--color-text-muted); line-height: 1.6;}


/* 4. PREMIUM EXPEDITIONS GRID */
.flex-headline { display: flex; justify-content: space-between; align-items: flex-end; border-bottom: 2px solid var(--color-text-dark); padding-bottom: 2rem;}
.section-title { font-size: clamp(3rem, 6vw, 4.5rem); font-weight: 800; line-height: 1.1; letter-spacing: -1px; color: var(--color-primary); }

.circle-link-btn {
  display: flex; align-items: center; justify-content: center; width: 120px; height: 120px; border-radius: 50%; border: 1px solid var(--color-primary); color: var(--color-primary); font-weight: 700; text-align: center; line-height: 1.2; transition: all 0.3s;
}
.circle-link-btn:hover { background: var(--color-primary); color: white; transform: scale(1.05); }

.premium-grid {
  display: grid; grid-template-columns: repeat(2, 1fr); gap: 4rem 3rem;
}
.premium-card { cursor: none; } /* Relies on custom cursor play button */

.img-zoom-wrapper {
  position: relative; border-radius: var(--radius-lg); overflow: hidden; height: 500px;
}
.img-zoom-wrapper:hover .img-zoom { transform: scale(1.08); }
.img-zoom {
  width: 100%; height: 100%; object-fit: cover; transition: transform 1s cubic-bezier(0.2, 1, 0.3, 1);
}
.card-overlay { position: absolute; inset: 0; background: rgba(0,0,0,0.2); transition: background 0.5s; }
.img-zoom-wrapper:hover .card-overlay { background: rgba(0,0,0,0.1); }

.card-badges {
  position: absolute; top: 2rem; left: 2rem; display: flex; gap: 1rem; z-index: 2;
}
.pill-primary { background: var(--color-accent); color: white; padding: 0.5rem 1.2rem; border-radius: 100px; font-weight: 800; font-size: 0.8rem; text-transform: uppercase;}
.pill-outline { background: rgba(255,255,255,0.2); backdrop-filter: blur(5px); color: white; padding: 0.5rem 1.2rem; border-radius: 100px; border: 1px solid white; font-weight: 800; font-size: 0.8rem; text-transform: uppercase;}

.card-meta { display: flex; flex-direction: column; gap: 0.5rem; }
.card-date { color: var(--color-text-muted); font-size: 1rem; font-weight: 600; }
.card-title { font-size: 2rem; font-weight: 700; color: var(--color-text-dark); transition: color 0.3s; }
.premium-card:hover .card-title { color: var(--color-accent); }

.card-details {
  display: flex;
  gap: 2rem;
  margin-top: 1rem;
  padding-top: 1rem;
  border-top: 1px solid rgba(0,0,0,0.1);
}

.detail-item {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-size: 0.95rem;
  color: var(--color-text-muted);
  font-weight: 600;
}

.detail-item svg {
  color: var(--color-accent);
}


/* 5. TEAM / GUIDES */
.team-section .section-desc { font-size: 1.2rem; color: var(--color-text-muted); line-height: 1.6;}
.team-grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 3rem; }
.member-avatar { width: 100%; aspect-ratio: 1/1; border-radius: 50%; overflow: hidden; margin-bottom: 2rem; position: relative; }
.member-avatar img { width: 100%; height: 100%; object-fit: cover; filter: grayscale(100%); transition: all 0.5s ease;}
.team-member:hover .member-avatar img { filter: grayscale(0%); transform: scale(1.05); }

.expeditions-badge {
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  background: linear-gradient(to top, rgba(0,0,0,0.8), transparent);
  color: white;
  padding: 1rem;
  text-align: center;
  font-weight: 700;
  font-size: 0.9rem;
  opacity: 0;
  transition: opacity 0.3s ease;
}

.team-member:hover .expeditions-badge {
  opacity: 1;
}

.member-name { font-size: 1.8rem; font-weight: 800; color: var(--color-primary); }
.member-role { font-size: 1.1rem; color: var(--color-text-muted); margin-top: 0.5rem; }


/* 6. MASSIVE CTA / IMMERSIVE VIDEO PLACEHOLDER */
.massive-cta {
  position: relative; min-height: 90vh; display: flex; align-items: center; justify-content: center; overflow: hidden; cursor: none;
}
.cta-parallax-bg {
  position: absolute; top: -20%; left: 0; width: 100%; height: 150%;
  background-image: url('/images/route_green.png'); background-size: cover; background-position: center; z-index: 0; will-change: transform; filter: brightness(0.8);
}
.cta-overlay-dark { position: absolute; inset: 0; background: rgba(6,17,10, 0.8); z-index: 1; }
.cta-flex { position: relative; z-index: 10; text-align: center; }

.massive-title { font-size: clamp(3rem, 7vw, 6rem); color: white; font-weight: 800; line-height: 1.05; letter-spacing: -2px; }
.email-capture {
  display: flex; max-width: 600px; margin: 0 auto; border-bottom: 2px solid rgba(255,255,255,0.3); padding-bottom: 1rem; transition: border 0.3s;
}
.email-capture:focus-within { border-color: white; }
.email-capture input {
  flex: 1; background: transparent; border: none; outline: none; color: white; font-size: 1.5rem; padding: 0.5rem;
}
.email-capture input::placeholder { color: rgba(255,255,255,0.4); }
.submit-arrow {
  background: transparent; border: none; color: white; font-size: 2rem; cursor: pointer; transition: transform 0.3s;
}
.email-capture:focus-within .submit-arrow { transform: translateX(10px); color: var(--color-accent); }


/* ---------------------------------
   ADVANCED REVEAL ANIMATIONS 
   --------------------------------*/
.reveal-trigger {
  /* Invisible boundary to observe */
}
.reveal-item { opacity: 0; will-change: transform, opacity, clip-path; }

/* Clip-path reveal for ultra-premium text feel */
.slide-up-clip {
  transform: translateY(100%);
  clip-path: inset(0 0 100% 0);
  transition: transform 1s cubic-bezier(0.16, 1, 0.3, 1), clip-path 1s cubic-bezier(0.16, 1, 0.3, 1), opacity 1s cubic-bezier(0.16, 1, 0.3, 1);
}
.is-revealed .slide-up-clip {
  transform: translateY(0);
  clip-path: inset(-20% 0 -20% 0); /* bleed out to prevent clipping shadows */
  opacity: 1;
}

/* Stagger lines */
.is-revealed .line-1 { transition-delay: 0.1s; }
.is-revealed .line-2 { transition-delay: 0.25s; }
.is-revealed .line-3 { transition-delay: 0.4s; }

.fade-in {
  transform: translateY(30px); transition: opacity 0.8s ease, transform 0.8s cubic-bezier(0.2, 0.8, 0.2, 1);
}
.is-revealed .fade-in { opacity: 1; transform: translateY(0); }

.delay-200 { transition-delay: 0.2s; }
.delay-400 { transition-delay: 0.4s; }
.delay-800 { transition-delay: 0.8s; }
.delay-1000 { transition-delay: 1s; }
.delay-1200 { transition-delay: 1.2s; }

/* RESPONSIVE DESIGNS */
@media (max-width: 1024px) {
  .split-layout { grid-template-columns: 1fr; gap: 4rem; }
  .huge-title { br { display: none; } }
  .magnetic-btn { width: 120px; height: 120px; margin-top: 2rem !important; }
  .stats-grid { grid-template-columns: repeat(2, 1fr); gap: 2rem; }
}
@media (max-width: 768px) {
  .hero-actions .flex-gap { flex-direction: column; align-items: flex-start; }
  .premium-grid { grid-template-columns: 1fr; }
  .img-zoom-wrapper { height: 400px; }
  .team-grid { grid-template-columns: 1fr; gap: 4rem; }
  .member-avatar { max-width: 250px; margin: 0 auto 2rem; }
  .hero-bottom { display: none; } /* simplify mobile */
  .feat-row { flex-direction: column; gap: 1rem; }
  .custom-cursor { display: none !important; } /* No custom cursor on mobile */
  .premium-card, .massive-cta { cursor: auto; }
  .stats-grid { grid-template-columns: 1fr; gap: 1.5rem; }
  .stat-card { padding: 1.5rem; }
  .stat-number { font-size: 2rem; }
  .card-details { flex-direction: column; gap: 1rem; }
}
</style>
