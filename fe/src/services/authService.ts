// Auth service - API calls for authentication

import { apiClient } from './api'
import type { ApiResponse } from './api'
import type { AuthResponse, LoginRequest, RegisterRequest } from '../types/auth'

export const authService = {
  async login(request: LoginRequest): Promise<AuthResponse> {
    const response = await apiClient.post<ApiResponse<AuthResponse>>(
      '/v1/auth/login',
      request,
    )
    return response.data!
  },

  async register(request: RegisterRequest): Promise<AuthResponse> {
    const response = await apiClient.post<ApiResponse<AuthResponse>>(
      '/v1/auth/register/normal',
      request,
    )
    return response.data!
  },

  getOAuth2AuthorizationUrl(): string {
    const baseUrl = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8080'
    return `${baseUrl}/oauth2/authorization/google`
  },
}
