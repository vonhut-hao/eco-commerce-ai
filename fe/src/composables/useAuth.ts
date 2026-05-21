// Auth composable for state management and actions

import { computed, reactive, readonly, onMounted } from 'vue'
import type { AuthState } from '../types/auth'
import { tokenStorage } from '../utils/tokenStorage'
import { authService } from '../services/authService'

// Global auth state
const state = reactive<AuthState>({
  token: null,
  expiresIn: null,
  isAuthenticated: false,
  isLoading: false,
  error: null,
})

// Initialize auth from localStorage
function initAuth(): void {
  const token = tokenStorage.getToken()
  const expiresIn = tokenStorage.getExpiresIn()

  if (token && expiresIn && !tokenStorage.isTokenExpired()) {
    state.token = token
    state.expiresIn = expiresIn
    state.isAuthenticated = true
  } else {
    // Clear expired token
    if (token) {
      tokenStorage.clear()
    }
  }
}

export function useAuth() {
  // Computed properties
  const isAuthenticated = computed(() => state.isAuthenticated)
  const isLoading = computed(() => state.isLoading)
  const error = computed(() => state.error)
  const token = computed(() => state.token)

  // Check if token is expired
  const isTokenExpired = computed(() => {
    if (!state.token) return true
    return tokenStorage.isTokenExpired()
  })

  // Login action
  async function login(username: string, password: string): Promise<void> {
    state.isLoading = true
    state.error = null

    try {
      const response = await authService.login({ username, password })
      tokenStorage.setToken(response.accessToken, response.expiresIn)
      state.token = response.accessToken
      state.expiresIn = response.expiresIn
      state.isAuthenticated = true
    } catch (err: any) {
      state.error = err.detail || err.message || 'Login failed'
      throw err
    } finally {
      state.isLoading = false
    }
  }

  // Register action
  async function register(
    username: string,
    email: string,
    password: string,
  ): Promise<void> {
    state.isLoading = true
    state.error = null

    try {
      const response = await authService.register({
        username,
        email,
        password,
      })
      tokenStorage.setToken(response.accessToken, response.expiresIn)
      state.token = response.accessToken
      state.expiresIn = response.expiresIn
      state.isAuthenticated = true
    } catch (err: any) {
      state.error = err.detail || err.message || 'Registration failed'
      throw err
    } finally {
      state.isLoading = false
    }
  }

  // Set token from OAuth callback
  function setTokenFromCallback(token: string, expiresIn: number): void {
    tokenStorage.setToken(token, expiresIn)
    state.token = token
    state.expiresIn = expiresIn
    state.isAuthenticated = true
    state.error = null
  }

  // Logout action
  function logout(): void {
    tokenStorage.clear()
    state.token = null
    state.expiresIn = null
    state.isAuthenticated = false
    state.error = null
  }

  // Clear error
  function clearError(): void {
    state.error = null
  }

  // Initialize on first use
  onMounted(() => {
    initAuth()
  })

  return {
    // State (readonly)
    isAuthenticated: readonly(isAuthenticated),
    isLoading: readonly(isLoading),
    error: readonly(error),
    token: readonly(token),
    isTokenExpired: readonly(isTokenExpired),

    // Actions
    login,
    register,
    logout,
    setTokenFromCallback,
    clearError,
    initAuth,
  }
}

// Export initialization function for use in main.ts
export function initializeAuth(): void {
  initAuth()
}
