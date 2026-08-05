import client from './client';
import { ApiResponse } from './products';

export interface PaymentMethodResponse {
  id: number;
  methodName: string;
  isActive: boolean;
}

export const paymentApi = {
  getActiveMethods: async () => {
    const res = await client.get<ApiResponse<PaymentMethodResponse[]>>('/v1/catalog/payment-methods');
    return res.data.data;
  },
};
