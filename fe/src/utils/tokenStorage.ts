// Token storage and management utilities

const TOKEN_KEY = 'auth_token'
const EXPIRES_IN_KEY = 'auth_expires_in'
const EXPIRES_AT_KEY = 'auth_expires_at'

export const tokenStorage = {
  setToken(token: string, expiresIn: number): void {
    localStorage.setItem(TOKEN_KEY, token)
    localStorage.setItem(EXPIRES_IN_KEY, expiresIn.toString())
    const expiresAt = Date.now() + expiresIn * 1000
    localStorage.setItem(EXPIRES_AT_KEY, expiresAt.toString())
  },

  getToken(): string | null {
    return localStorage.getItem(TOKEN_KEY)
  },

  getExpiresIn(): number | null {
    const expiresIn = localStorage.getItem(EXPIRES_IN_KEY)
    return expiresIn ? parseInt(expiresIn, 10) : null
  },

  getExpiresAt(): number | null {
    const expiresAt = localStorage.getItem(EXPIRES_AT_KEY)
    return expiresAt ? parseInt(expiresAt, 10) : null
  },

  isTokenExpired(): boolean {
    const expiresAt = this.getExpiresAt()
    if (!expiresAt) return true
    return Date.now() > expiresAt
  },

  clear(): void {
    localStorage.removeItem(TOKEN_KEY)
    localStorage.removeItem(EXPIRES_IN_KEY)
    localStorage.removeItem(EXPIRES_AT_KEY)
  },
}
