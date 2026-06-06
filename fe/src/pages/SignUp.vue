<template>
  <div class="auth-container">
    <div class="auth-panel auth-left">
      <div class="panel-content">
        <div class="brand-header">
          <div class="brand-icon">🌱</div>
          <h1 class="brand-name">GreenLife</h1>
        </div>
        <div class="benefits">
          <h3 class="benefits-title">Join Our Community</h3>
          <ul class="benefits-list">
            <li>
              <span class="benefit-icon">🌍</span>
              <span>Access eco-friendly products from verified suppliers</span>
            </li>
            <li>
              <span class="benefit-icon">📊</span>
              <span>Track your environmental impact</span>
            </li>
            <li>
              <span class="benefit-icon">🏆</span>
              <span>Earn rewards for sustainable choices</span>
            </li>
            <li>
              <span class="benefit-icon">🤝</span>
              <span>Connect with like-minded eco-conscious shoppers</span>
            </li>
          </ul>
        </div>
      </div>
    </div>

    <div class="auth-panel auth-right">
      <div class="form-container">
        <h2 class="form-title">Create Account</h2>

        <div v-if="error" class="error-message">
          {{ error }}
        </div>

        <form @submit.prevent="handleSubmit" class="auth-form">
          <div class="form-group">
            <label for="username" class="form-label">Username</label>
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
                placeholder="Choose a username"
                required
                :disabled="isLoading"
              />
            </div>
          </div>

          <div class="form-group">
            <label for="email" class="form-label">Email Address</label>
            <div class="input-wrapper">
              <svg class="input-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                <rect x="2" y="4" width="20" height="16" rx="2"></rect>
                <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7"></path>
              </svg>
              <input
                id="email"
                v-model="formData.email"
                type="email"
                class="form-input"
                placeholder="Enter your email"
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
                placeholder="Create a strong password"
                required
                @input="updatePasswordStrength"
                :disabled="isLoading"
              />
            </div>
            <div v-if="formData.password" class="password-strength">
              <div class="strength-bar">
                <div class="strength-fill" :class="strengthClass" :style="{ width: strengthPercent }"></div>
              </div>
              <span class="strength-text">{{ strengthText }}</span>
            </div>
          </div>

          <div class="form-group">
            <label for="confirmPassword" class="form-label">Confirm Password</label>
            <div class="input-wrapper">
              <svg class="input-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                <rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect>
                <path d="M7 11V7a5 5 0 0 1 10 0v4"></path>
              </svg>
              <input
                id="confirmPassword"
                v-model="formData.confirmPassword"
                type="password"
                class="form-input"
                :class="{ 'input-error': passwordMismatch }"
                placeholder="Confirm your password"
                required
                :disabled="isLoading"
              />
            </div>
            <span v-if="passwordMismatch" class="input-error-text">Passwords do not match</span>
          </div>

          <div class="form-group form-checkbox">
            <input
              id="terms"
              v-model="formData.agreeToTerms"
              type="checkbox"
              class="checkbox"
              required
              :disabled="isLoading"
            />
            <label for="terms" class="checkbox-label">
              I agree to the <a href="#" class="link">Terms of Service</a> and
              <a href="#" class="link">Privacy Policy</a>
            </label>
          </div>

          <button type="submit" class="btn btn-primary" :disabled="isLoading || passwordMismatch || !formData.agreeToTerms">
            {{ isLoading ? 'Creating Account...' : 'Create Account' }}
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
          <span>Sign up with Google</span>
        </button>

        <p class="auth-footer">
          Already have an account?
          <router-link to="/sign-in" class="link">Sign in here</router-link>
        </p>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'
import { useAuth } from '../composables/useAuth'
import { authService } from '../services/authService'

const router = useRouter()
const { register, isLoading, clearError } = useAuth()

const formData = ref({
  username: '',
  email: '',
  password: '',
  confirmPassword: '',
  agreeToTerms: false,
})

const error = ref('')
const passwordStrength = ref(0)

const passwordMismatch = computed(() => {
  if (!formData.value.password || !formData.value.confirmPassword) return false
  return formData.value.password !== formData.value.confirmPassword
})

const strengthPercent = computed(() => {
  return Math.min(passwordStrength.value * 25, 100) + '%'
})

const strengthClass = computed(() => {
  const strength = passwordStrength.value
  if (strength <= 1) return 'strength-weak'
  if (strength <= 2) return 'strength-fair'
  if (strength <= 3) return 'strength-good'
  return 'strength-strong'
})

const strengthText = computed(() => {
  const strength = passwordStrength.value
  if (strength <= 1) return 'Weak'
  if (strength <= 2) return 'Fair'
  if (strength <= 3) return 'Good'
  return 'Strong'
})

const updatePasswordStrength = () => {
  const pwd = formData.value.password
  let score = 0

  if (pwd.length >= 8) score++
  if (pwd.length >= 12) score++
  if (/[A-Z]/.test(pwd) && /[a-z]/.test(pwd)) score++
  if (/\d/.test(pwd)) score++
  if (/[!@#$%^&*]/.test(pwd)) score++

  passwordStrength.value = Math.min(score, 4)
}

const handleSubmit = async () => {
  error.value = ''
  clearError()

  if (passwordMismatch.value) {
    error.value = 'Passwords do not match'
    return
  }

  if (!formData.value.agreeToTerms) {
    error.value = 'Please agree to the Terms of Service'
    return
  }

  try {
    await register(
      formData.value.username,
      formData.value.email,
      formData.value.password,
    )
    await router.push('/')
  } catch (err: any) {
    error.value = err.errors?.username || err.errors?.email || err.detail || 'Sign up failed'
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
  overflow-y: auto;
  max-height: 100vh;
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

.benefits {
  color: rgba(255, 255, 255, 0.95);
}

.benefits-title {
  font-size: 1.25rem;
  font-weight: 600;
  margin: 0 0 1.5rem;
}

.benefits-list {
  list-style: none;
  padding: 0;
  margin: 0;
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.benefits-list li {
  display: flex;
  align-items: flex-start;
  gap: 1rem;
  line-height: 1.5;
  font-size: 0.95rem;
}

.benefit-icon {
  flex-shrink: 0;
  font-size: 1.5rem;
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
  gap: 1rem;
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

.form-input.input-error {
  border-color: #e74c3c;
}

.input-error-text {
  font-size: 0.8rem;
  color: #e74c3c;
}

.password-strength {
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
  margin-top: 0.5rem;
}

.strength-bar {
  height: 4px;
  background: #e0e0e0;
  border-radius: 2px;
  overflow: hidden;
}

.strength-fill {
  height: 100%;
  transition: all 0.3s;
}

.strength-weak {
  background: #e74c3c;
}

.strength-fair {
  background: #f39c12;
}

.strength-good {
  background: #3498db;
}

.strength-strong {
  background: #27ae60;
}

.strength-text {
  font-size: 0.8rem;
  color: var(--color-text-secondary);
}

.form-checkbox {
  flex-direction: row;
  align-items: flex-start;
  gap: 0.75rem;
}

.checkbox {
  width: 1.25rem;
  height: 1.25rem;
  margin-top: 0.25rem;
  cursor: pointer;
  accent-color: var(--color-primary);
}

.checkbox-label {
  font-size: 0.9rem;
  color: var(--color-text);
  line-height: 1.5;
  cursor: pointer;
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
