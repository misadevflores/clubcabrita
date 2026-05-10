<script setup lang="ts">
import { onMounted } from 'vue'
import { useRoutesStore } from '../store/routes'

const { routes, loadRoutes } = useRoutesStore()

onMounted(() => {
  loadRoutes()
})
</script>

<template>
  <div class="routes-view container">
    <section class="page-header mt-8 mb-8">
      <h1>Nuestras Rutas Disponibles</h1>
      <p>Aventúrate con el Club Cabritas. Explora nuestras próximas salidas y descubre espacios que te quitarán el aliento.</p>
    </section>

    <div v-if="routes.length === 0" class="empty-state">
      <p>Actualmente no hay rutas disponibles. ¡Revisa más tarde o añade una nueva desde el panel Admin!</p>
    </div>

    <div class="cards-grid">
      <article v-for="route in routes" :key="route.id" class="route-card fade-in">
        <div class="card-image-wrapper">
          <img :src="route.image" :alt="route.title" class="card-image" />
          <span class="badge">{{ route.type }}</span>
        </div>
        <div class="card-content">
          <p class="card-date">{{ route.date }}</p>
          <h3 class="card-title">{{ route.title }}</h3>
          <p class="card-desc">{{ route.description }}</p>
          <button class="btn btn-primary btn-full mt-4">Reservar Cupo</button>
        </div>
      </article>
    </div>
  </div>
</template>

<style scoped>
.page-header {
  max-width: 800px;
}

.page-header h1 {
  font-size: 3rem;
  color: var(--color-primary);
  margin-bottom: 1rem;
}

.page-header p {
  font-size: 1.2rem;
  color: var(--color-text-muted);
}

.empty-state {
  text-align: center;
  padding: 4rem;
  background: white;
  border-radius: var(--radius-lg);
  color: var(--color-text-muted);
  font-size: 1.1rem;
}

.cards-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(320px, 1fr));
  gap: 2.5rem;
  padding-bottom: 6rem;
}

.route-card {
  background: white;
  border-radius: var(--radius-lg);
  overflow: hidden;
  box-shadow: 0 4px 20px rgba(0,0,0,0.06);
  display: flex;
  flex-direction: column;
  transition: transform 0.3s ease, box-shadow 0.3s ease;
}

.route-card:hover {
  transform: translateY(-8px);
  box-shadow: 0 15px 35px rgba(0,0,0,0.1);
}

.card-image-wrapper {
  position: relative;
  height: 280px;
}

.card-image {
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: transform 0.5s ease;
}

.route-card:hover .card-image {
  transform: scale(1.05);
}

.badge {
  position: absolute;
  top: 1rem;
  left: 1rem;
  background-color: var(--color-accent);
  color: white;
  padding: 0.5rem 1rem;
  border-radius: var(--radius-md);
  font-size: 0.8rem;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 1px;
}

.card-content {
  padding: 2rem;
  flex: 1;
  display: flex;
  flex-direction: column;
}

.card-date {
  color: var(--color-primary);
  font-weight: 700;
  font-size: 0.9rem;
  margin-bottom: 0.5rem;
}

.card-title {
  font-size: 1.5rem;
  color: var(--color-text-dark);
  margin-bottom: 1rem;
  line-height: 1.3;
}

.card-desc {
  color: var(--color-text-muted);
  font-size: 0.95rem;
  flex: 1;
  margin-bottom: 1.5rem;
}

.btn-full {
  width: 100%;
}

.fade-in {
  animation: fadeUp 0.6s ease forwards;
  opacity: 0;
}

@keyframes fadeUp {
  from { opacity: 0; transform: translateY(20px); }
  to { opacity: 1; transform: translateY(0); }
}
</style>
