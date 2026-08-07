import client from './client';
import { ApiResponse } from './auth';

export interface Banner {
  id: number;
  imageUrl: string;
  title?: string;
  linkUrl?: string;
  displayOrder: number;
  isActive: boolean;
}

export interface BannerRequest {
  imageUrl: string;
  title?: string;
  linkUrl?: string;
  displayOrder: number;
  isActive: boolean;
}

export const bannersApi = {
  // Public API
  getActiveBanners: async () => {
    const res = await client.get<ApiResponse<Banner[]>>('/v1/banners');
    return res.data.data;
  },

  // Admin APIs
  getAllBanners: async () => {
    const res = await client.get<ApiResponse<Banner[]>>('/v1/admin/banners');
    return res.data.data;
  },

  createBanner: async (data: BannerRequest) => {
    const res = await client.post<ApiResponse<Banner>>('/v1/admin/banners', data);
    return res.data.data;
  },

  updateBanner: async (id: number, data: BannerRequest) => {
    const res = await client.put<ApiResponse<Banner>>(`/v1/admin/banners/${id}`, data);
    return res.data.data;
  },

  deleteBanner: async (id: number) => {
    const res = await client.delete<ApiResponse<void>>(`/v1/admin/banners/${id}`);
    return res.data.data;
  }
};
