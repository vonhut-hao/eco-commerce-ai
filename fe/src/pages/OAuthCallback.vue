<template>
  <div class="callback-container">
    <div class="spinner"></div>
    <p class="loading-text">{{ message }}</p>
    <p v-if="error" class="error-text">{{ error }}</p>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useAuth } from '../composables/useAuth'

const router = useRouter()
const { setTokenFromCallback } = useAuth()

const message = ref('Completing sign in...')
const error = ref('')

onMounted(async () => {
  try {
    // Parse token from URL fragment
    const fragment = window.location.hash.substring(1)
    const params = new URLSearchParams(fragment)

    const token = params.get('token')
    const expiresIn = params.get('expiresIn')

    if (!token || !expiresIn) {
      error.value = 'Invalid OAuth callback: missing token or expiresIn'
      setTimeout(() => router.push('/sign-in'), 2000)
      return
    }

    // Set token and redirect to home
    setTokenFromCallback(token, parseInt(expiresIn, 10))

    message.value = 'Redirecting...'
    // Clear URL fragment
    window.history.replaceState({}, document.title, window.location.pathname)

    // Redirect to home or intended destination
    await router.push('/')
  } catch (err: any) {
    error.value = err.message || 'OAuth callback processing failed'
    setTimeout(() => router.push('/sign-in'), 2000)
  }
})
</script>

<style scoped>
.callback-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  min-height: 100vh;
  background: linear-gradient(135deg, var(--color-primary-light) 0%, var(--color-bg) 100%);
  gap: 2rem;
}

.spinner {
  width: 3rem;
  height: 3rem;
  border: 4px solid rgba(61, 107, 53, 0.2);
  border-top-color: var(--color-primary);
  border-radius: 50%;
  animation: spin 0.8s linear infinite;
}

@keyframes spin {
  to {
    transform: rotate(360deg);
  }
}

.loading-text {
  font-size: 1.1rem;
  color: var(--color-text);
  margin: 0;
  font-weight: 500;
}

.error-text {
  color: #e74c3c;
  font-size: 1rem;
  margin: 0;
}
</style>
