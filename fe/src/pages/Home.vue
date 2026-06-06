<template>
  <div class="home-container">
    <header class="home-header">
      <div class="header-content">
        <div class="brand">
          <span class="brand-icon">🌱</span>
          <h1 class="brand-name">GreenLife</h1>
        </div>
        <button @click="handleLogout" class="btn-logout">Sign Out</button>
      </div>
    </header>

    <main class="home-main">
      <div class="welcome-section">
        <h2 class="welcome-title">Welcome to GreenLife</h2>
        <p class="welcome-text">You're now authenticated and connected to our eco-commerce platform.</p>
      </div>

      <div class="features-grid">
        <div class="feature-card">
          <div class="feature-icon">🛍️</div>
          <h3 class="feature-title">Shop Sustainably</h3>
          <p class="feature-text">Browse verified eco-friendly products from sustainable suppliers worldwide.</p>
        </div>

        <div class="feature-card">
          <div class="feature-icon">📊</div>
          <h3 class="feature-title">Track Impact</h3>
          <p class="feature-text">Monitor your environmental impact and see how your choices matter.</p>
        </div>

        <div class="feature-card">
          <div class="feature-icon">🏆</div>
          <h3 class="feature-title">Earn Rewards</h3>
          <p class="feature-text">Get rewarded for making sustainable purchasing decisions.</p>
        </div>

        <div class="feature-card">
          <div class="feature-icon">🌍</div>
          <h3 class="feature-title">Community</h3>
          <p class="feature-text">Connect with like-minded eco-conscious shoppers and make a difference.</p>
        </div>
      </div>

      <div class="token-info">
        <h3 class="info-title">Auth Status</h3>
        <div class="info-item">
          <span class="info-label">Status:</span>
          <span class="info-value">✓ Authenticated</span>
        </div>
        <div class="info-item">
          <span class="info-label">Token expires in:</span>
          <span class="info-value">{{ expiresInFormatted }}</span>
        </div>
      </div>
    </main>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useRouter } from 'vue-router'
import { useAuth } from '../composables/useAuth'

const router = useRouter()
const { logout } = useAuth()

const expiresInFormatted = computed(() => {
  // Calculate remaining time from localStorage expiry time
  const expiresAt = localStorage.getItem('auth_expires_at')
  if (!expiresAt) return 'Unknown'
  
  const remainingMs = parseInt(expiresAt, 10) - Date.now()
  if (remainingMs <= 0) return 'Expired'
  
  const hours = Math.floor(remainingMs / (1000 * 3600))
  const minutes = Math.floor((remainingMs % (1000 * 3600)) / (1000 * 60))
  return `${hours}h ${minutes}m`
})

const handleLogout = () => {
  logout()
  router.push('/sign-in')
}
</script>

<style scoped>
.home-container {
  min-height: 100vh;
  background: var(--color-bg);
}

.home-header {
  background: white;
  border-bottom: 1px solid var(--color-border);
  sticky: top 0;
  z-index: 100;
}

.header-content {
  max-width: 1200px;
  margin: 0 auto;
  padding: 1rem 2rem;
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.brand {
  display: flex;
  align-items: center;
  gap: 0.75rem;
}

.brand-icon {
  font-size: 1.75rem;
}

.brand-name {
  font-size: 1.5rem;
  font-weight: 700;
  color: var(--color-primary);
  margin: 0;
}

.btn-logout {
  padding: 0.5rem 1.25rem;
  background: var(--color-primary);
  color: white;
  border: none;
  border-radius: 0.5rem;
  font-size: 0.95rem;
  font-weight: 600;
  cursor: pointer;
  transition: background 0.2s;
}

.btn-logout:hover {
  background: var(--color-primary-dark);
}

.home-main {
  max-width: 1200px;
  margin: 0 auto;
  padding: 3rem 2rem;
}

.welcome-section {
  text-align: center;
  margin-bottom: 3rem;
}

.welcome-title {
  font-size: 2.5rem;
  font-weight: 700;
  color: var(--color-text);
  margin: 0 0 0.5rem;
}

.welcome-text {
  font-size: 1.1rem;
  color: var(--color-text-secondary);
  margin: 0;
}

.features-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
  gap: 2rem;
  margin-bottom: 3rem;
}

.feature-card {
  background: white;
  padding: 2rem;
  border-radius: 1rem;
  border: 1px solid var(--color-border);
  text-align: center;
  transition: all 0.3s;
}

.feature-card:hover {
  border-color: var(--color-primary);
  box-shadow: 0 4px 12px rgba(61, 107, 53, 0.1);
}

.feature-icon {
  font-size: 3rem;
  margin-bottom: 1rem;
}

.feature-title {
  font-size: 1.25rem;
  font-weight: 700;
  color: var(--color-text);
  margin: 0 0 0.75rem;
}

.feature-text {
  font-size: 0.95rem;
  color: var(--color-text-secondary);
  line-height: 1.6;
  margin: 0;
}

.token-info {
  background: white;
  padding: 2rem;
  border-radius: 1rem;
  border: 1px solid var(--color-border);
  max-width: 400px;
  margin: 0 auto;
}

.info-title {
  font-size: 1.1rem;
  font-weight: 700;
  color: var(--color-text);
  margin: 0 0 1rem;
}

.info-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0.75rem 0;
  border-bottom: 1px solid var(--color-border);
}

.info-item:last-child {
  border-bottom: none;
}

.info-label {
  color: var(--color-text-secondary);
  font-weight: 500;
}

.info-value {
  color: var(--color-primary);
  font-weight: 600;
}
</style>
