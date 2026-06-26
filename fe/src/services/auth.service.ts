import { api, API_BASE } from './api';
import { tokenStorage } from '@/utils/tokenStorage';

interface AuthResponse {
  accessToken: string;
  expiresIn: number;
}

interface LoginRequest {
  username: string;
  password: string;
}

interface RegisterRequest {
  username: string;
  email: string;
  password: string;
}

function parseJwt(token: string) {
  try {
    return JSON.parse(atob(token.split('.')[1]));
  } catch (e) {
    return null;
  }
}

export const authService = {
  async login(data: LoginRequest): Promise<AuthResponse> {
    const res = await api.post<AuthResponse>('/v1/auth/login', data);
    tokenStorage.setToken(res.data.accessToken, res.data.expiresIn);
    return res.data;
  },

  async register(data: RegisterRequest): Promise<AuthResponse> {
    const res = await api.post<AuthResponse>('/v1/auth/register/normal', data);
    return res.data;
  },

  googleLogin(): void {
    window.location.href = `${API_BASE}/oauth2/authorization/google`;
  },

  logout(): void {
    tokenStorage.clear();
    localStorage.removeItem('userId');
  },

  isAuthenticated(): boolean {
    return !!tokenStorage.getToken();
  },

  getToken(): string | null {
    return tokenStorage.getToken();
  },

  getUserId(): number | null {
    const token = this.getToken();
    if (!token) return null;
    const payload = parseJwt(token);
    return payload ? payload.userId : null;
  },

  getUserRoles(): string[] {
    const token = this.getToken();
    if (!token) return [];
    const payload = parseJwt(token);
    if (!payload) return [];
    const scope = payload.scope;
    if (typeof scope === "string") {
      return scope.split(" ");
    }
    return payload.roles || [];
  },

  getUsername(): string | null {
    const token = this.getToken();
    if (!token) return null;
    const payload = parseJwt(token);
    return payload ? payload.sub : null;
  },

  isAdmin(): boolean {
    const roles = this.getUserRoles();
    return roles.includes("ADMIN") || roles.includes("ROLE_ADMIN");
  },
};
