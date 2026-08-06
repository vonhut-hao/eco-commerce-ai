import client from './client';

export type PromotionType = 'PERCENTAGE' | 'FIXED_AMOUNT';

export interface Promotion {
  id: number;
  code: string;
  name: string;
  description: string;
  discountType: PromotionType;
  discountValue: number;
  maxDiscountAmount?: number;
  minOrderValue: number;
  usageLimit: number;
  usedCount: number;
  startDate: string;
  endDate: string;
  isActive: boolean;
}

export interface PromotionRequest {
  code: string;
  name: string;
  description?: string;
  discountType: PromotionType;
  discountValue: number;
  maxDiscountAmount?: number;
  minOrderValue: number;
  usageLimit: number;
  usedCount?: number;
  startDate: string;
  endDate: string;
  isActive: boolean;
}

export const promotionsApi = {
  getAll: async (): Promise<Promotion[]> => {
    const res = await client.get('/v1/promotions');
    return res.data.data;
  },
  getById: async (id: number): Promise<Promotion> => {
    const res = await client.get(`/v1/promotions/${id}`);
    return res.data.data;
  },
  create: async (data: PromotionRequest): Promise<Promotion> => {
    const res = await client.post('/v1/promotions', data);
    return res.data.data;
  },
  update: async (id: number, data: PromotionRequest): Promise<Promotion> => {
    const res = await client.put(`/v1/promotions/${id}`, data);
    return res.data.data;
  },
  bulkUpdateStatus: async (promotionIds: number[], isActive: boolean): Promise<void> => {
    await client.patch('/v1/promotions/bulk-status', { promotionIds, isActive });
  }
};
