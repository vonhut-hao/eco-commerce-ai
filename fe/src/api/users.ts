import client from './client';
import { ApiResponse, PageResponse } from './products';

export interface AdminUserBE {
  id: number;
  username: string;
  email: string;
  fullName?: string | null;
  phone?: string | null;
  greenPoints?: number;
  totalCarbon?: number;
  isEnabled: boolean;
  roles: string[];
  createdAt?: string;
}

export interface UserStatsBE {
  totalUsers: number;
  activeUsers: number;
  disabledUsers: number;
}

export interface UserFE {
  id: number;
  username: string;
  email: string;
  fullName: string;
  phone: string;
  greenPoints: number;
  totalCarbon: number;
  orders: number;
  isEnabled: boolean;
  role: 'USER' | 'ADMIN';
  joined: string;
}

export function mapAdminUserBeToFe(be: AdminUserBE): UserFE {
  const isAdmin = be.roles ? be.roles.indexOf('ADMIN') !== -1 : false;
  const joinedDate = be.createdAt ? new Date(be.createdAt).toLocaleDateString('vi-VN') : 'N/A';
  return {
    id: be.id,
    username: be.username,
    email: be.email,
    fullName: be.fullName || be.username,
    phone: be.phone || 'N/A',
    greenPoints: be.greenPoints || 0,
    totalCarbon: be.totalCarbon || 0,
    orders: 0,
    isEnabled: be.isEnabled,
    role: isAdmin ? 'ADMIN' : 'USER',
    joined: joinedDate
  };
}

export const adminUserApi = {
  getUsers: async (query = '', page = 0, size = 50) => {
    const params = new URLSearchParams();
    if (query) params.append('query', query);
    params.append('page', page.toString());
    params.append('size', size.toString());

    const res = await client.get<ApiResponse<PageResponse<AdminUserBE>>>(`/v1/admin/users?${params.toString()}`);
    return res.data.data;
  },

  getUserStats: async () => {
    const res = await client.get<ApiResponse<UserStatsBE>>('/v1/admin/users/stats');
    return res.data.data;
  },

  getUserById: async (id: number) => {
    const res = await client.get<ApiResponse<AdminUserBE>>(`/v1/admin/users/${id}`);
    return res.data.data;
  },

  updateUserStatus: async (id: number, isEnabled: boolean) => {
    const res = await client.patch<ApiResponse<AdminUserBE>>(`/v1/admin/users/${id}/status`, { isEnabled });
    return res.data.data;
  }
};
