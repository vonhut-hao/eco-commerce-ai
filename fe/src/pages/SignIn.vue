<template>
  <div class="auth-container">
    <div class="auth-panel auth-left">
      <div class="panel-content">
        <div class="brand-header">
          <div class="brand-icon">🌱</div>
          <h1 class="brand-name">GreenLife</h1>
        </div>
        <div class="trust-indicators">
          <div class="indicator">
            <span class="indicator-icon">✓</span>
            <span class="indicator-text">Eco-Certified Supply Chain</span>
          </div>
          <div class="indicator">
            <span class="indicator-icon">✓</span>
            <span class="indicator-text">Carbon-Tracked Shipping</span>
          </div>
          <div class="indicator">
            <span class="indicator-icon">✓</span>
            <span class="indicator-text">Verified Sustainable Practices</span>
          </div>
        </div>
      </div>
    </div>

    <div class="auth-panel auth-right">
      <div class="form-container">
        <h2 class="form-title">Sign In</h2>

        <div v-if="error" class="error-message">
          {{ error }}
        </div>

        <form @submit.prevent="handleSubmit" class="auth-form">
          <div class="form-group">
            <label for="username" class="form-label">Username or Email</label>
            <div class="input-wrapper">
              <svg class="input-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
                <circle cx="12" cy="7" r="4"></circle>
              </svg>
              <input
                id="username"
                v-model="formData.username"
                type="text"
                class="form-input"
                placeholder="Enter username or email"
                required
                :disabled="isLoading"
              />
            </div>
          </div>

          <div class="form-group">
            <label for="password" class="form-label">Password</label>
            <div class="input-wrapper">
              <svg class="input-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                <rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect>
                <path d="M7 11V7a5 5 0 0 1 10 0v4"></path>
              </svg>
              <input
                id="password"
                v-model="formData.password"
                type="password"
                class="form-input"
                placeholder="Enter password"
                required
                :disabled="isLoading"
              />
            </div>
          </div>

          <button type="submit" class="btn btn-primary" :disabled="isLoading">
            {{ isLoading ? 'Signing in...' : 'Sign In' }}
          </button>
        </form>

        <div class="divider">
          <span class="divider-text">or</span>
        </div>

        <button
          type="button"
          @click="handleGoogleLogin"
          class="btn btn-social"
          :disabled="isLoading"
        >
          <svg class="social-icon" viewBox="0 0 24 24">
            <path
              fill="currentColor"
              d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
            />
            <path
              fill="currentColor"
              d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
            />
            <path
              fill="currentColor"
              d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
            />
            <path
              fill="currentColor"
              d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
            />
          </svg>
          <span>Sign in with Google</span>
        </button>

        <p class="auth-footer">
          Don't have an account?
          <router-link to="/sign-up" class="link">Sign up here</router-link>
        </p>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { useAuth } from '../composables/useAuth'
import { authService } from '../services/authService'

const router = useRouter()
const route = useRoute()
const { login, isLoading, clearError } = useAuth()

const formData = ref({
  username: '',
  password: '',
})

const error = ref('')

const handleSubmit = async () => {
  error.value = ''
  clearError()

  try {
    await login(formData.value.username, formData.value.password)
    const redirectTo = (route.query.redirect as string) || '/'
    await router.push(redirectTo)
  } catch (err: any) {
    error.value = err.errors?.username || err.detail || 'Sign in failed'
  }
}

const handleGoogleLogin = () => {
  window.location.href = authService.getOAuth2AuthorizationUrl()
}
</script>

<style scoped>
.auth-container {
  display: grid;
  grid-template-columns: 1fr 1fr;
  min-height: 100vh;
  background: linear-gradient(135deg, var(--color-primary-light) 0%, var(--color-bg) 100%);
}

.auth-panel {
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 2rem;
}

.auth-left {
  background: linear-gradient(135deg, var(--color-primary) 0%, var(--color-primary-dark) 100%);
}

.auth-right {
  background: var(--color-bg);
}

.panel-content {
  max-width: 400px;
}

.brand-header {
  display: flex;
  align-items: center;
  gap: 1rem;
  margin-bottom: 3rem;
}

.brand-icon {
  font-size: 2.5rem;
}

.brand-name {
  font-size: 2rem;
  font-weight: 700;
  color: white;
  margin: 0;
}

.trust-indicators {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}

.indicator {
  display: flex;
  align-items: flex-start;
  gap: 1rem;
  color: rgba(255, 255, 255, 0.9);
  font-size: 0.95rem;
  line-height: 1.5;
}

.indicator-icon {
  flex-shrink: 0;
  width: 1.5rem;
  height: 1.5rem;
  display: flex;
  align-items: center;
  justify-content: center;
  background: rgba(255, 255, 255, 0.2);
  border-radius: 50%;
  font-weight: bold;
  font-size: 1rem;
}

.form-container {
  max-width: 400px;
  width: 100%;
}

.form-title {
  font-size: 1.75rem;
  font-weight: 700;
  color: var(--color-text);
  margin: 0 0 2rem;
}

.error-message {
  padding: 0.75rem;
  margin-bottom: 1.5rem;
  background: #fee;
  color: #c33;
  border: 1px solid #fcc;
  border-radius: 0.5rem;
  font-size: 0.9rem;
}

.auth-form {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
  margin-bottom: 2rem;
}

.form-group {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.form-label {
  font-size: 0.9rem;
  font-weight: 600;
  color: var(--color-text);
}

.input-wrapper {
  position: relative;
  display: flex;
  align-items: center;
}

.input-icon {
  position: absolute;
  left: 1rem;
  width: 1.25rem;
  height: 1.25rem;
  color: var(--color-border);
  pointer-events: none;
}

.form-input {
  width: 100%;
  padding: 0.75rem 0.75rem 0.75rem 2.75rem;
  border: 1px solid var(--color-border);
  border-radius: 0.5rem;
  font-size: 1rem;
  color: var(--color-text);
  background: white;
  transition: border-color 0.2s, box-shadow 0.2s;
}

.form-input:focus {
  outline: none;
  border-color: var(--color-primary);
  box-shadow: 0 0 0 3px rgba(61, 107, 53, 0.1);
}

.form-input:disabled {
  background: #f5f5f5;
  cursor: not-allowed;
}

.btn {
  padding: 0.75rem 1rem;
  border: none;
  border-radius: 0.5rem;
  font-size: 1rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s;
}

.btn:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

.btn-primary {
  background: var(--color-primary);
  color: white;
}

.btn-primary:hover:not(:disabled) {
  background: var(--color-primary-dark);
}

.btn-social {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.75rem;
  background: white;
  color: #1f2937;
  border: 1px solid var(--color-border);
}

.btn-social:hover:not(:disabled) {
  background: #fafafa;
  border-color: var(--color-primary);
}

.social-icon {
  width: 1.25rem;
  height: 1.25rem;
}

.divider {
  display: flex;
  align-items: center;
  margin: 2rem 0;
  color: var(--color-border);
}

.divider::before,
.divider::after {
  content: '';
  flex: 1;
  height: 1px;
  background: var(--color-border);
}

.divider-text {
  padding: 0 1rem;
  font-size: 0.9rem;
  color: var(--color-text-secondary);
}

.auth-footer {
  text-align: center;
  font-size: 0.9rem;
  color: var(--color-text-secondary);
}

.link {
  color: var(--color-primary);
  text-decoration: none;
  font-weight: 600;
}

.link:hover {
  text-decoration: underline;
}

@media (max-width: 768px) {
  .auth-container {
    grid-template-columns: 1fr;
  }

  .auth-left {
    display: none;
  }

  .form-container {
    margin: 0 auto;
  }
}
</style>
