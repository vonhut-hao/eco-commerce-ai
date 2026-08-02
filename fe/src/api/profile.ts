import client from './client';
import { ApiResponse } from './products';

export interface UserProfileResponse {
  id: number;
  avatarUrl: string;
  fullName: string;
  phoneNumber: string;
  userId: number;
  userName: string;
  email: string;
  greenPoints: number;
  totalCarbonIndex: number;
}

export interface CreateOrUpdateProfileRequest {
  avatarUrl?: string;
  fullName: string;
  phoneNumber?: string;
}

export const profileApi = {
  getProfile: async (id: number) => {
    const res = await client.get<ApiResponse<UserProfileResponse>>(`/v1/profile/${id}`);
    return res.data.data;
  },
  
  updateProfile: async (request: CreateOrUpdateProfileRequest) => {
    const res = await client.post<ApiResponse<UserProfileResponse>>('/v1/profile', request);
    return res.data.data;
  },
  
  uploadFile: async (file: File) => {
    const formData = new FormData();
    formData.append('file', file);
    const res = await client.post<ApiResponse<{ url: string }>>('/upload', formData, {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    });
    return res.data.data.url;
  }
};
