import { tokenStorage } from '@/utils/tokenStorage'; // <-- Thêm dòng này

const API_BASE = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8080';

export interface ApiResponse<T> {
  code?: number;
  status?: string;
  message?: string;
  data: T;
}

async function request<T>(
    endpoint: string,
    options: RequestInit = {}
): Promise<ApiResponse<T>> {
  // Thay đổi ở đây: Dùng tokenStorage để lấy token
  const token = tokenStorage.getToken();

  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
  };

  const res = await fetch(`${API_BASE}${endpoint}`, {
    ...options,
    headers: { ...headers, ...(options.headers as Record<string, string>) },
  });

  if (!res.ok) {
    const errorBody = await res.json().catch(() => ({}));
    let errorMessage = errorBody.detail || errorBody.message || `HTTP ${res.status}`;

    if (errorBody.errors) {
      const firstErrorKey = Object.keys(errorBody.errors)[0];
      if (firstErrorKey) {
        const rawMessage = errorBody.errors[firstErrorKey];
        if (firstErrorKey === 'password' && rawMessage.includes('size must be between 6')) {
          errorMessage = 'Password must be at least 6 characters long';
        } else if (rawMessage.includes('well-formed email address')) {
          errorMessage = 'Please enter a valid email address';
        } else {
          errorMessage = rawMessage;
        }
      }
    }
    throw new Error(errorMessage);
  }

  return res.json();
}

export const api = {
  get: <T>(endpoint: string) => request<T>(endpoint, { method: 'GET' }),

  post: <T>(endpoint: string, body: unknown) =>
      request<T>(endpoint, {
        method: 'POST',
        body: JSON.stringify(body),
      }),

  put: <T>(endpoint: string, body?: unknown, customHeaders?: Record<string, string>) =>
      request<T>(endpoint, { method: 'PUT', ...(body ? { body: JSON.stringify(body) } : {}), headers: customHeaders }),

  delete: <T>(endpoint: string) => request<T>(endpoint, { method: 'DELETE' }),
};

export { API_BASE };