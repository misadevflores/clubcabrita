<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue'
import { RouterLink } from 'vue-router'

const scrollY = ref(0)
const heroVisible = ref(false)
const handleScroll = () => { scrollY.value = window.scrollY }

let observer: IntersectionObserver

onMounted(() => {
  heroVisible.value = true
  window.addEventListener('scroll', handleScroll, { passive: true })
  observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('revealed')
        observer.unobserve(entry.target)
      }
    })
  }, { threshold: 0.12 })
  document.querySelectorAll('.reveal').forEach(el => observer.observe(el))
})

onUnmounted(() => {
  window.removeEventListener('scroll', handleScroll)
  observer?.disconnect()
})

const stats = [
  { number: '500+',   label: 'Viajeros',       icon: '👥' },
  { number: '25+',    label: 'Rutas',           icon: '🗺️' },
  { number: '6,088m', label: 'Cumbre más alta', icon: '⛰️' },
  { number: '100%',   label: 'Seguridad',       icon: '🛡️' },
]

const features = [
  { num: '01', title: 'Conexión Auténtica', icon: '🌿',
    text: 'Lejos del turismo masivo. Forjamos vínculos reales con la naturaleza y las comunidades en cada paso y cumbre.' },
  { num: '02', title: 'Guías UIAGM', icon: '🧗',
    text: 'Desafiamos las alturas más imponentes de los Andes bolivianos siempre respaldados por guías certificados internacionalmente.' },
  { num: '03', title: 'Turismo Circular', icon: '♻️',
    text: 'Integramos y favorecemos el crecimiento económico de las familias que custodian las faldas de nuestras montañas.' },
]

const routes = [
  { id: 1, title: 'Nevado Condoriri',    subtitle: 'Cordillera Real', date: '15 May 2026',
    image: '/images/route_snow.png',     type: 'Alta Montaña', difficulty: 'Difícil',
    elevation: '5,550 m', duration: '3 días', color: '#0f3460' },
  { id: 2, title: 'Valle de las Ánimas', subtitle: 'La Paz',         date: '22 May 2026',
    image: '/images/route_green.png',    type: 'Senderismo',   difficulty: 'Moderado',
    elevation: '3,800 m', duration: '1 día',  color: '#123524' },
  { id: 3, title: 'Huayna Potosí',       subtitle: 'Cordillera Real', date: '02 Jun 2026',
    image: '/images/vertical-img3.jpeg', type: 'Alta Montaña', difficulty: 'Difícil',
    elevation: '6,088 m', duration: '2 días', color: '#1a3a2a' },
]

const gallery = [
  { id: 1, src: '/images/vertical-img1.jpeg', label: 'Cumbre'  },
  { id: 2, src: '/images/cafetal-img1.jpeg',  label: 'Cafetal' },
  { id: 3, src: '/images/vertical-img4.jpeg', label: 'Valle'   },
  { id: 4, src: '/images/vertical-img5.jpeg', label: 'Nevada'  },
]

const ctaPhotos = [
  '/images/vertical-img1.jpeg',
  '/images/vertical-img2.jpeg',
  '/images/vertical-img3.jpeg',
  '/images/vertical-img4.jpeg',
  '/images/vertical-img5.jpeg',
]
</script>

<template>
  <div class="home">

    <!-- HERO ─────────────────────────────────── -->
    <section class="hero">
      <div class="hero__bg" :style="{ transform: `translateY(${scrollY * 0.35}px)` }"></div>
      <div class="hero__gradient"></div>

      <div class="hero__content container" :class="{ 'hero__content--visible': heroVisible }">
        <span class="hero__tag">Ecoturismo · Bolivia</span>
        <h1 class="hero__title">
          No somos<br/><em>agencia.</em><br/>Somos viajeros.
        </h1>
        <p class="hero__desc">
          Expediciones auténticas por las cumbres y valles más salvajes de Bolivia.
          Sin masificación. Solo naturaleza, comunidad y adrenalina.
        </p>
        <div class="hero__cta">
          <RouterLink to="/rutas" class="btn-hero-primary">
            Ver expediciones
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M5 12h14M12 5l7 7-7 7"/></svg>
          </RouterLink>
          <RouterLink to="/galeria" class="btn-hero-ghost">Galería</RouterLink>
        </div>
        <div class="hero__scroll">
          <div class="hero__scroll-line"></div>
          <span>scroll</span>
        </div>
      </div>

      <div class="hero__badge">
        <span class="hero__badge-num">EST.</span>
        <span class="hero__badge-year">2023</span>
      </div>

      <div class="hero__social">
        <a href="https://instagram.com/club.cabritas" target="_blank" rel="noopener">IG</a>
        <div class="hero__social-line"></div>
        <a href="https://tiktok.com/@club.cabritas" target="_blank" rel="noopener">TK</a>
      </div>
    </section>

    <!-- MARQUEE ──────────────────────────────── -->
    <div class="marquee" aria-hidden="true">
      <div class="marquee__track">
        <span v-for="i in 8" :key="i" class="marquee__item">
          Ecoturismo&nbsp;·&nbsp;Bolivia&nbsp;·&nbsp;Aventura&nbsp;·&nbsp;Naturaleza&nbsp;&nbsp;
        </span>
      </div>
    </div>

    <!-- STATS ────────────────────────────────── -->
    <section class="stats">
      <div class="container">
        <div class="stats__grid">
          <div v-for="(s, i) in stats" :key="i" class="stats__item reveal"
               :style="{ transitionDelay: `${i * 80}ms` }">
            <span class="stats__icon">{{ s.icon }}</span>
            <strong class="stats__num">{{ s.number }}</strong>
            <span class="stats__label">{{ s.label }}</span>
          </div>
        </div>
      </div>
    </section>

    <!-- FILOSOFÍA ────────────────────────────── -->
    <section class="philosophy">
      <div class="container">
        <div class="philosophy__layout">
          <div class="philosophy__left reveal">
            <span class="section-tag">Nuestra filosofía</span>
            <h2 class="philosophy__title">El camino<br/>del viajero.</h2>
            <p class="philosophy__sub">
              Club Cabritas nació de la pasión, no del negocio.
              Cada expedición es una historia nueva.
            </p>
            <RouterLink to="/galeria" class="btn-circle">Ver<br/>galería</RouterLink>
          </div>
          <div class="philosophy__right">
            <div v-for="(f, i) in features" :key="i" class="feat reveal"
                 :style="{ transitionDelay: `${i * 120}ms` }">
              <div class="feat__header">
                <span class="feat__icon">{{ f.icon }}</span>
                <span class="feat__num">{{ f.num }}</span>
              </div>
              <h3 class="feat__title">{{ f.title }}</h3>
              <p class="feat__text">{{ f.text }}</p>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- RUTAS DESTACADAS ─────────────────────── -->
    <section class="routes-section">
      <div class="container">
        <div class="section-header reveal">
          <div>
            <span class="section-tag">Próximas salidas</span>
            <h2 class="section-title">Expediciones<br/>destacadas</h2>
          </div>
          <RouterLink to="/rutas" class="btn-link">
            Ver todas
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M5 12h14M12 5l7 7-7 7"/></svg>
          </RouterLink>
        </div>
        <div class="routes-grid">
          <article v-for="(r, i) in routes" :key="r.id" class="route-card reveal"
                   :style="{ transitionDelay: `${i * 100}ms` }">
            <div class="route-card__img-wrap">
              <img :src="r.image" :alt="r.title" loading="lazy" />
              <div class="route-card__overlay"
                   :style="{ background: `linear-gradient(to top, ${r.color}ee 0%, transparent 55%)` }"></div>
              <span class="route-card__type">{{ r.type }}</span>
            </div>
            <div class="route-card__body">
              <div class="route-card__meta">
                <span class="route-card__date">
                  <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="3" y="4" width="18" height="18" rx="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg>
                  {{ r.date }}
                </span>
                <span class="route-card__diff" :class="`diff--${r.difficulty.toLowerCase()}`">{{ r.difficulty }}</span>
              </div>
              <h3 class="route-card__title">{{ r.title }}</h3>
              <p class="route-card__sub">{{ r.subtitle }}</p>
              <div class="route-card__details">
                <span>
                  <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/></svg>
                  {{ r.elevation }}
                </span>
                <span>
                  <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>
                  {{ r.duration }}
                </span>
              </div>
              <RouterLink to="/rutas" class="route-card__cta">Reservar cupo</RouterLink>
            </div>
          </article>
        </div>
      </div>
    </section>

    <!-- GALERÍA BENTO ────────────────────────── -->
    <section class="gallery-preview">
      <div class="container">
        <div class="section-header reveal">
          <div>
            <span class="section-tag">Nuestras memorias</span>
            <h2 class="section-title">En cada<br/>cumbre.</h2>
          </div>
          <RouterLink to="/galeria" class="btn-link">
            Ver galería completa
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M5 12h14M12 5l7 7-7 7"/></svg>
          </RouterLink>
        </div>
        <div class="bento reveal">
          <RouterLink v-for="(img, i) in gallery" :key="img.id" to="/galeria"
                      class="bento__item" :class="`bento__item--${i}`">
            <img :src="img.src" :alt="img.label" loading="lazy" />
            <span class="bento__label">{{ img.label }}</span>
          </RouterLink>
        </div>
      </div>
    </section>

    <!-- CTA FINAL ────────────────────────────── -->
    <section class="cta-section">
      <div class="cta-collage" aria-hidden="true">
        <div v-for="(img, i) in ctaPhotos" :key="i" class="cta-collage__strip"
             :style="{
               backgroundImage: `url(${img})`,
               transform: `translateY(${scrollY * (i % 2 === 0 ? -0.07 : 0.05)}px)`
             }"></div>
      </div>
      <div class="cta-section__overlay"></div>
      <div class="container cta-section__inner reveal">
        <div class="cta-section__left">
          <span class="cta-section__tag-pill">Únete a la comunidad</span>
          <h2 class="cta-section__title">
            No hay Wi‑Fi<br/>en la montaña,<br/>pero encontrarás<br/><em>una mejor<br/>conexión.</em>
          </h2>
          <div class="cta-section__stats">
            <div class="cta-stat"><strong>500+</strong><span>viajeros activos</span></div>
            <div class="cta-stat-divider"></div>
            <div class="cta-stat"><strong>25+</strong><span>expediciones al año</span></div>
            <div class="cta-stat-divider"></div>
            <div class="cta-stat"><strong>100%</strong><span>aventura real</span></div>
          </div>
        </div>
        <div class="cta-section__right">
          <div class="cta-card">
            <div class="cta-card__icon">⛰️</div>
            <h3 class="cta-card__title">¿Listo para la aventura?</h3>
            <p class="cta-card__desc">
              Escríbenos por WhatsApp. Te contamos fechas, cupos disponibles y todo lo que necesitas saber antes de tu primera expedición.
            </p>
            <a href="https://wa.me/59170000000?text=Hola%20Club%20Cabritas%2C%20me%20interesa%20unirme%20a%20una%20expedici%C3%B3n%20%F0%9F%8F%94%EF%B8%8F"
               target="_blank" rel="noopener noreferrer" class="cta-card__whatsapp">
              <svg width="22" height="22" viewBox="0 0 24 24" fill="currentColor">
                <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
              </svg>
              Escribir por WhatsApp
            </a>
            <p class="cta-card__hint">Respuesta rápida · Sin compromiso</p>
            <div class="cta-card__social">
              <span>Síguenos:</span>
              <a href="https://instagram.com/club.cabritas" target="_blank" rel="noopener" class="cta-card__social-link">
                <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="2" y="2" width="20" height="20" rx="5"/><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/><line x1="17.5" y1="6.5" x2="17.51" y2="6.5"/></svg>
                Instagram
              </a>
              <a href="https://tiktok.com/@club.cabritas" target="_blank" rel="noopener" class="cta-card__social-link">
                <svg width="15" height="15" viewBox="0 0 24 24" fill="currentColor"><path d="M19.59 6.69a4.83 4.83 0 01-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 01-2.88 2.5 2.89 2.89 0 01-2.89-2.89 2.89 2.89 0 012.89-2.89c.28 0 .54.04.79.1V9.01a6.33 6.33 0 00-.79-.05 6.34 6.34 0 00-6.34 6.34 6.34 6.34 0 006.34 6.34 6.34 6.34 0 006.33-6.34V8.69a8.2 8.2 0 004.79 1.52V6.74a4.85 4.85 0 01-1.02-.05z"/></svg>
                TikTok
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>

  </div>
</template>

<style scoped>
.home { overflow-x: hidden; }

/* ── Utilities ──────────────────────────────── */
.section-tag {
  display: inline-block; font-size: 0.75rem; font-weight: 700;
  letter-spacing: 0.15em; text-transform: uppercase;
  color: var(--color-accent); background: rgba(249,115,22,0.1);
  padding: 0.35rem 0.9rem; border-radius: 100px; margin-bottom: 1rem;
}
.section-title {
  font-size: clamp(2.2rem, 4.5vw, 3.5rem); font-weight: 800;
  line-height: 1.1; color: var(--color-primary); letter-spacing: -1px;
}
.section-header {
  display: flex; justify-content: space-between; align-items: flex-end;
  margin-bottom: 3rem; gap: 1rem; flex-wrap: wrap;
}
.btn-link {
  display: inline-flex; align-items: center; gap: 0.4rem;
  font-weight: 700; font-size: 0.95rem; color: var(--color-primary);
  border-bottom: 2px solid var(--color-accent); padding-bottom: 2px;
  transition: gap 0.3s; white-space: nowrap;
}
.btn-link:hover { gap: 0.7rem; color: var(--color-accent); }

/* ── Reveal ─────────────────────────────────── */
.reveal {
  opacity: 0; transform: translateY(32px);
  transition: opacity 0.7s ease, transform 0.7s cubic-bezier(0.2,0.8,0.2,1);
}
.reveal.revealed { opacity: 1; transform: translateY(0); }

/* ── HERO ───────────────────────────────────── */
.hero {
  position: relative; min-height: 100vh;
  display: flex; align-items: center;
  overflow: hidden; color: white;
  margin-top: -80px; padding-top: 80px;
}
.hero__bg {
  position: absolute; inset: -15%; width: 130%; height: 130%;
  background: url('/images/fondo.jpeg') center / cover no-repeat;
  will-change: transform; z-index: 0;
}
.hero__gradient {
  position: absolute; inset: 0; z-index: 1;
  background: linear-gradient(105deg, rgba(6,17,10,0.92) 0%, rgba(6,17,10,0.5) 55%, rgba(6,17,10,0.2) 100%);
}
.hero__content {
  position: relative; z-index: 10; max-width: 760px;
  opacity: 0; transform: translateY(40px);
  transition: opacity 1s ease 0.2s, transform 1s cubic-bezier(0.2,0.8,0.2,1) 0.2s;
}
.hero__content--visible { opacity: 1; transform: translateY(0); }

.hero__tag {
  display: inline-block; font-size: 0.78rem; font-weight: 700;
  letter-spacing: 0.2em; text-transform: uppercase;
  border: 1px solid rgba(255,255,255,0.25); border-radius: 100px;
  padding: 0.4rem 1.2rem; margin-bottom: 1.8rem;
  backdrop-filter: blur(6px); color: rgba(255,255,255,0.85);
}
.hero__title {
  font-size: clamp(3.2rem, 7.5vw, 6.5rem); font-weight: 800;
  line-height: 1.0; letter-spacing: -2px;
  margin-bottom: 1.8rem; text-transform: uppercase;
}
.hero__title em { font-style: normal; color: var(--color-accent); }
.hero__desc {
  font-size: clamp(1rem, 1.8vw, 1.25rem); line-height: 1.7;
  color: rgba(255,255,255,0.8); max-width: 540px;
  margin-bottom: 2.8rem; font-weight: 400;
}
.hero__cta { display: flex; align-items: center; gap: 1.2rem; flex-wrap: wrap; }

.btn-hero-primary {
  display: inline-flex; align-items: center; gap: 0.6rem;
  background: var(--color-accent); color: white;
  font-weight: 700; font-size: 1rem; padding: 0.95rem 2.2rem; border-radius: 100px;
  transition: transform 0.3s, box-shadow 0.3s, background 0.3s;
}
.btn-hero-primary:hover { transform: translateY(-3px); background: #ea580c; box-shadow: 0 12px 28px rgba(249,115,22,0.35); }

.btn-hero-ghost {
  display: inline-flex; align-items: center; gap: 0.5rem; color: white;
  font-weight: 600; font-size: 1rem; padding: 0.95rem 2rem;
  border: 2px solid rgba(255,255,255,0.35); border-radius: 100px;
  transition: border-color 0.3s, background 0.3s;
}
.btn-hero-ghost:hover { border-color: white; background: rgba(255,255,255,0.08); }

.hero__scroll {
  margin-top: 3.5rem; display: flex; align-items: center; gap: 0.75rem;
  font-size: 0.7rem; letter-spacing: 0.2em; text-transform: uppercase;
  color: rgba(255,255,255,0.4);
}
.hero__scroll-line { width: 40px; height: 1px; background: rgba(255,255,255,0.3); position: relative; overflow: hidden; }
.hero__scroll-line::after {
  content: ''; position: absolute; left: -100%; top: 0;
  width: 100%; height: 100%; background: var(--color-accent);
  animation: scrollLine 2s ease-in-out infinite;
}
@keyframes scrollLine { 0% { left: -100%; } 50% { left: 0%; } 100% { left: 100%; } }

.hero__badge {
  position: absolute; bottom: 3rem; right: 3rem; z-index: 10;
  text-align: center; border: 1px solid rgba(255,255,255,0.15); border-radius: 1rem;
  padding: 0.8rem 1.2rem; backdrop-filter: blur(12px);
  background: rgba(255,255,255,0.05); display: flex; flex-direction: column; line-height: 1.2;
}
.hero__badge-num  { font-size: 0.65rem; letter-spacing: 0.2em; color: rgba(255,255,255,0.5); }
.hero__badge-year { font-size: 1.6rem; font-weight: 800; color: white; }

.hero__social {
  position: absolute; left: 2rem; top: 50%; transform: translateY(-50%);
  z-index: 10; display: flex; flex-direction: column; align-items: center;
  gap: 0.75rem; font-size: 0.7rem; font-weight: 700; letter-spacing: 0.12em;
}
.hero__social a { color: rgba(255,255,255,0.5); transition: color 0.3s; writing-mode: vertical-rl; }
.hero__social a:hover { color: white; }
.hero__social-line { width: 1px; height: 40px; background: rgba(255,255,255,0.2); }

/* ── MARQUEE ────────────────────────────────── */
.marquee { background: var(--color-primary); overflow: hidden; padding: 1rem 0; }
.marquee__track { display: flex; width: max-content; animation: marquee 22s linear infinite; }
.marquee__item { color: rgba(255,255,255,0.55); font-size: 0.8rem; font-weight: 700; letter-spacing: 0.2em; text-transform: uppercase; padding: 0 1rem; white-space: nowrap; }
@keyframes marquee { from { transform: translateX(0); } to { transform: translateX(-50%); } }

/* ── STATS ──────────────────────────────────── */
.stats { padding: 5rem 0; background: var(--color-bg-light); }
.stats__grid { display: grid; grid-template-columns: repeat(4,1fr); gap: 1.5rem; }
.stats__item {
  background: white; border: 1px solid rgba(0,0,0,0.06); border-radius: 1.2rem;
  padding: 2rem 1.5rem; text-align: center; transition: transform 0.3s, box-shadow 0.3s;
}
.stats__item:hover { transform: translateY(-5px); box-shadow: 0 16px 40px rgba(18,53,36,0.1); }
.stats__icon  { font-size: 2rem; display: block; margin-bottom: 0.8rem; }
.stats__num   { display: block; font-size: 2.4rem; font-weight: 800; color: var(--color-primary); letter-spacing: -1px; line-height: 1; margin-bottom: 0.4rem; }
.stats__label { font-size: 0.85rem; color: var(--color-text-muted); font-weight: 600; }

/* ── FILOSOFÍA ──────────────────────────────── */
.philosophy { padding: 7rem 0; background: white; }
.philosophy__layout { display: grid; grid-template-columns: 1fr 1.4fr; gap: 6rem; align-items: start; }
.philosophy__left { position: sticky; top: 7rem; }
.philosophy__title { font-size: clamp(2.5rem, 5vw, 4rem); font-weight: 800; line-height: 1.05; color: var(--color-primary); letter-spacing: -1.5px; margin-bottom: 1.2rem; }
.philosophy__sub { color: var(--color-text-muted); font-size: 1.05rem; line-height: 1.7; margin-bottom: 2.5rem; max-width: 300px; }
.btn-circle {
  display: inline-flex; align-items: center; justify-content: center;
  width: 120px; height: 120px; border-radius: 50%;
  background: var(--color-primary); color: white; font-weight: 700; font-size: 0.85rem;
  text-align: center; line-height: 1.3; letter-spacing: 0.05em; text-transform: uppercase;
  transition: transform 0.4s cubic-bezier(0.2,0.8,0.2,1), background 0.3s;
}
.btn-circle:hover { transform: scale(1.08) rotate(-8deg); background: var(--color-accent); }
.feat { padding: 2rem 0; border-top: 1px solid rgba(0,0,0,0.08); }
.feat:last-child { border-bottom: 1px solid rgba(0,0,0,0.08); }
.feat__header { display: flex; align-items: center; justify-content: space-between; margin-bottom: 0.8rem; }
.feat__icon { font-size: 1.8rem; }
.feat__num  { font-size: 0.75rem; font-weight: 700; letter-spacing: 0.15em; color: var(--color-text-muted); font-family: monospace; }
.feat__title { font-size: 1.4rem; font-weight: 700; color: var(--color-text-dark); margin-bottom: 0.6rem; }
.feat__text  { font-size: 1rem; color: var(--color-text-muted); line-height: 1.7; }

/* ── RUTAS ──────────────────────────────────── */
.routes-section { padding: 7rem 0; background: var(--color-bg-light); }
.routes-grid { display: grid; grid-template-columns: repeat(3,1fr); gap: 1.5rem; }
.route-card { background: white; border-radius: 1.2rem; overflow: hidden; box-shadow: 0 2px 12px rgba(0,0,0,0.06); transition: transform 0.35s ease, box-shadow 0.35s ease; display: flex; flex-direction: column; }
.route-card:hover { transform: translateY(-8px); box-shadow: 0 20px 50px rgba(0,0,0,0.12); }
.route-card__img-wrap { position: relative; height: 240px; overflow: hidden; }
.route-card__img-wrap img { width: 100%; height: 100%; object-fit: cover; transition: transform 0.7s ease; }
.route-card:hover .route-card__img-wrap img { transform: scale(1.07); }
.route-card__overlay { position: absolute; inset: 0; }
.route-card__type { position: absolute; top: 1rem; left: 1rem; background: rgba(255,255,255,0.15); backdrop-filter: blur(8px); border: 1px solid rgba(255,255,255,0.25); color: white; font-size: 0.72rem; font-weight: 700; letter-spacing: 0.1em; text-transform: uppercase; padding: 0.3rem 0.8rem; border-radius: 100px; }
.route-card__body { padding: 1.5rem; flex: 1; display: flex; flex-direction: column; }
.route-card__meta { display: flex; justify-content: space-between; align-items: center; margin-bottom: 0.6rem; }
.route-card__date { display: flex; align-items: center; gap: 0.3rem; font-size: 0.8rem; color: var(--color-text-muted); font-weight: 600; }
.route-card__diff { font-size: 0.72rem; font-weight: 700; padding: 0.25rem 0.7rem; border-radius: 100px; }
.diff--difícil  { background: #fee2e2; color: #dc2626; }
.diff--moderado { background: #fef3c7; color: #d97706; }
.diff--fácil    { background: #d1fae5; color: #059669; }
.route-card__title { font-size: 1.35rem; font-weight: 700; color: var(--color-text-dark); margin-bottom: 0.2rem; line-height: 1.2; }
.route-card__sub   { font-size: 0.85rem; color: var(--color-text-muted); margin-bottom: 1rem; }
.route-card__details { display: flex; gap: 1.2rem; margin-bottom: 1.4rem; font-size: 0.82rem; color: var(--color-text-muted); font-weight: 600; }
.route-card__details span { display: flex; align-items: center; gap: 0.3rem; }
.route-card__details svg { color: var(--color-accent); flex-shrink: 0; }
.route-card__cta { margin-top: auto; display: block; text-align: center; background: var(--color-primary); color: white; font-weight: 700; font-size: 0.9rem; padding: 0.8rem; border-radius: 0.8rem; transition: background 0.3s, transform 0.3s; }
.route-card__cta:hover { background: var(--color-accent); transform: translateY(-2px); }

/* ── GALERÍA BENTO ──────────────────────────── */
.gallery-preview { padding: 7rem 0; background: white; }
.bento { display: grid; grid-template-columns: repeat(4,1fr); grid-template-rows: 260px 200px; gap: 1rem; }
.bento__item { position: relative; overflow: hidden; border-radius: 1rem; cursor: pointer; display: block; }
.bento__item--0 { grid-column: span 2; grid-row: span 2; }
.bento__item--1 { grid-column: span 2; }
.bento__item--2 { grid-column: span 1; }
.bento__item--3 { grid-column: span 1; }
.bento__item img { width: 100%; height: 100%; object-fit: cover; transition: transform 0.6s ease; }
.bento__item:hover img { transform: scale(1.07); }
.bento__label { position: absolute; bottom: 0; left: 0; right: 0; padding: 2rem 1.2rem 1rem; background: linear-gradient(to top, rgba(6,17,10,0.8), transparent); color: white; font-size: 0.8rem; font-weight: 700; letter-spacing: 0.1em; text-transform: uppercase; opacity: 0; transform: translateY(8px); transition: opacity 0.3s, transform 0.3s; }
.bento__item:hover .bento__label { opacity: 1; transform: translateY(0); }

/* ── CTA FINAL ──────────────────────────────── */
.cta-section { position: relative; min-height: 100vh; display: flex; align-items: center; overflow: hidden; }
.cta-collage { position: absolute; inset: 0; display: flex; z-index: 0; gap: 3px; }
.cta-collage__strip { flex: 1; background-size: cover; background-position: center top; will-change: transform; transform-origin: center; scale: 1.15; }
.cta-section__overlay { position: absolute; inset: 0; z-index: 1; background: linear-gradient(105deg, rgba(6,17,10,0.97) 0%, rgba(6,17,10,0.90) 35%, rgba(6,17,10,0.60) 65%, rgba(6,17,10,0.75) 100%); }
.cta-section__inner { position: relative; z-index: 10; display: grid; grid-template-columns: 1fr 1fr; gap: 5rem; align-items: center; padding-top: 6rem; padding-bottom: 6rem; }
.cta-section__left { color: white; }
.cta-section__tag-pill { display: inline-block; font-size: 0.72rem; font-weight: 700; letter-spacing: 0.18em; text-transform: uppercase; color: var(--color-accent); background: rgba(249,115,22,0.15); border: 1px solid rgba(249,115,22,0.3); padding: 0.4rem 1rem; border-radius: 100px; margin-bottom: 1.8rem; }
.cta-section__title { font-size: clamp(2.4rem, 4.5vw, 4rem); font-weight: 800; line-height: 1.1; letter-spacing: -1.5px; margin-bottom: 3rem; }
.cta-section__title em { font-style: normal; color: var(--color-accent); }
.cta-section__stats { display: flex; align-items: center; gap: 1.5rem; }
.cta-stat { display: flex; flex-direction: column; gap: 0.2rem; }
.cta-stat strong { font-size: 1.8rem; font-weight: 800; letter-spacing: -1px; line-height: 1; }
.cta-stat span   { font-size: 0.78rem; color: rgba(255,255,255,0.5); font-weight: 500; }
.cta-stat-divider { width: 1px; height: 40px; background: rgba(255,255,255,0.15); flex-shrink: 0; }
.cta-card { background: rgba(255,255,255,0.07); border: 1px solid rgba(255,255,255,0.13); backdrop-filter: blur(24px); -webkit-backdrop-filter: blur(24px); border-radius: 1.5rem; padding: 2.5rem; color: white; }
.cta-card__icon  { font-size: 2.5rem; margin-bottom: 1rem; display: block; }
.cta-card__title { font-size: 1.4rem; font-weight: 700; margin-bottom: 0.75rem; }
.cta-card__desc  { font-size: 0.95rem; color: rgba(255,255,255,0.65); line-height: 1.65; margin-bottom: 2rem; }
.cta-card__whatsapp { display: flex; align-items: center; justify-content: center; gap: 0.7rem; width: 100%; background: #25D366; color: white; font-weight: 700; font-size: 1rem; padding: 1rem 1.5rem; border-radius: 0.9rem; margin-bottom: 0.75rem; transition: background 0.3s, transform 0.3s, box-shadow 0.3s; box-shadow: 0 8px 24px rgba(37,211,102,0.25); }
.cta-card__whatsapp:hover { background: #1ebe5d; transform: translateY(-3px); box-shadow: 0 14px 32px rgba(37,211,102,0.35); }
.cta-card__hint { font-size: 0.75rem; color: rgba(255,255,255,0.3); text-align: center; margin-bottom: 1.5rem; }
.cta-card__social { display: flex; align-items: center; gap: 0.75rem; padding-top: 1.2rem; border-top: 1px solid rgba(255,255,255,0.1); font-size: 0.82rem; color: rgba(255,255,255,0.35); }
.cta-card__social-link { display: inline-flex; align-items: center; gap: 0.35rem; color: rgba(255,255,255,0.65); font-weight: 600; font-size: 0.82rem; transition: color 0.3s; }
.cta-card__social-link:hover { color: var(--color-accent); }

/* ── RESPONSIVE ─────────────────────────────── */
@media (max-width: 1024px) {
  .stats__grid { grid-template-columns: repeat(2,1fr); }
  .routes-grid { grid-template-columns: repeat(2,1fr); }
  .philosophy__layout { grid-template-columns: 1fr; gap: 3rem; }
  .philosophy__left { position: static; }
  .bento { grid-template-columns: repeat(2,1fr); grid-template-rows: auto; }
  .bento__item--0 { grid-column: span 2; height: 280px; }
  .bento__item--1, .bento__item--2, .bento__item--3 { grid-column: span 1; height: 200px; }
  .cta-section__inner { grid-template-columns: 1fr; gap: 3rem; }
}

@media (max-width: 768px) {
  .hero__social { display: none; }
  .hero__badge  { display: none; }
  .hero__title  { letter-spacing: -1px; }
  .stats__grid  { grid-template-columns: repeat(2,1fr); gap: 1rem; }
  .routes-grid  { grid-template-columns: 1fr; }
  .bento { grid-template-columns: 1fr; grid-template-rows: auto; }
  .bento__item--0, .bento__item--1, .bento__item--2, .bento__item--3 { grid-column: span 1; height: 220px; }
  .section-header { flex-direction: column; align-items: flex-start; gap: 0.8rem; }
  .cta-section__stats { flex-wrap: wrap; gap: 1rem; }
  .cta-collage { gap: 2px; }
}

@media (max-width: 480px) {
  .hero__cta { flex-direction: column; align-items: flex-start; }
  .stats__grid { grid-template-columns: 1fr 1fr; gap: 0.8rem; }
  .stats__item { padding: 1.4rem 1rem; }
  .stats__num  { font-size: 1.8rem; }
  .cta-section__inner { padding-top: 4rem; padding-bottom: 4rem; }
}
</style>
