import { api } from './api';

interface UserProfile {
  id: number;
  avatarUrl: string | null;
  fullName: string;
  phoneNumber: string | null;
  userId: number;
  userName: string;
  email: string;
}

interface CreateOrUpdateProfile {
  avatarUrl?: string;
  fullName: string;
  phoneNumber?: string;
}

export const profileService = {
  async getProfile(id: number): Promise<UserProfile> {
    const res = await api.get<UserProfile>(`/v1/profile/${id}`);
    return res.data;
  },

  async updateProfile(data: CreateOrUpdateProfile): Promise<UserProfile> {
    const res = await api.post<UserProfile>('/v1/profile', data);
    return res.data;
  },

  async deleteProfile(id: number): Promise<void> {
    await api.delete(`/v1/profile/${id}`);
  },
};

export type { UserProfile, CreateOrUpdateProfile };
