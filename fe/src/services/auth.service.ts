import { api, API_BASE } from './api';

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
    localStorage.setItem('accessToken', res.data.accessToken);
    localStorage.setItem('expiresIn', String(res.data.expiresIn));
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
    localStorage.removeItem('accessToken');
    localStorage.removeItem('expiresIn');
    localStorage.removeItem('userId');
  },

  isAuthenticated(): boolean {
    return !!localStorage.getItem('accessToken');
  },

  getToken(): string | null {
    return localStorage.getItem('accessToken');
  },

  getUserId(): number | null {
    const token = this.getToken();
    if (!token) return null;
    const payload = parseJwt(token);
    return payload ? payload.userId : null;
  },
};
