import client from './client';

export interface LoginRequest {
  username: string;
  password?: string;
  provider?: string;
}

export interface RegisterRequest {
  username: string;
  email: string;
  password?: string;
  provider?: string;
}

export interface ChangePasswordRequest {
  oldPassword?: string;
  newPassword?: string;
}

export interface AuthResponse {
  accessToken: string;
  userId: number;
}

export const authApi = {
  login: async (data: LoginRequest) => {
    const res = await client.post<any>('/v1/auth/login', data);
    return res.data.data;
  },
  
  registerNormal: async (data: RegisterRequest) => {
    const res = await client.post<any>('/v1/auth/register/normal', data);
    return res.data.data;
  },
  
  checkProvider: async (email: string) => {
    const res = await client.get<any>(`/v1/auth/is-local-provider?email=${email}`);
    return res.data;
  },
  
  changePassword: async (data: ChangePasswordRequest) => {
    const res = await client.put<any>('/v1/auth/change-password', data);
    return res.data;
  }
};
