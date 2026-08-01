import client from './client';

export interface LoginRequest {
  email: string;
  password?: string;
  provider?: string;
}

export interface RegisterRequest {
  email: string;
  password?: string;
  provider?: string;
}

export interface AuthResponse {
  accessToken: string;
  userId: number;
}

export const authApi = {
  login: async (data: LoginRequest) => {
    const res = await client.post<any>('/v1/auth/login', data);
    return res.data;
  },
  
  registerNormal: async (data: RegisterRequest) => {
    const res = await client.post<any>('/v1/auth/register/normal', data);
    return res.data;
  },
  
  checkProvider: async (email: string) => {
    const res = await client.get<any>(`/v1/auth/is-local-provider?email=${email}`);
    return res.data;
  }
};
