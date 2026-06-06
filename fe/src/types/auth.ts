// Auth type definitions

export interface AuthResponse {
  accessToken: string
  expiresIn: number
}

export interface LoginRequest {
  username: string
  password: string
}

export interface RegisterRequest {
  username: string
  email: string
  password: string
}

export interface ProblemDetail {
  status?: number
  title?: string
  detail?: string
  instance?: string
  errors?: Record<string, string>
  timestamp?: string
  [key: string]: any
}

export interface AuthState {
  token: string | null
  expiresIn: number | null
  isAuthenticated: boolean
  isLoading: boolean
  error: string | null
}
