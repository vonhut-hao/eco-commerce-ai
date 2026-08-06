import client from './client';

export interface OrderItemBE {
  id: number;
  quantity: number;
  price: number;
  lineCarbonFootprint: number;
  productId: number;
  productName: string;
  mainImage: string;
}

export interface OrderBE {
  id: number;
  totalAmount: number;
  status: 'PENDING' | 'DELIVERY' | 'COMPLETED' | 'CANCELLED';
  paymentStatus: 'UNPAID' | 'PAID' | 'REFUNDED' | 'FAILED';
  userId: number;
  username: string;
  paymentMethodId: number;
  paymentMethodName: string;
  createdAt: string;
  promotionId: number;
  totalGreenPoints: number;
  orderItems: OrderItemBE[];
}

export const ordersApi = {
  getOrdersAdmin: async () => {
    const res = await client.get<{ data: OrderBE[] }>('/v1/catalog/orders/admin');
    return res.data.data;
  },
  updateOrderStatus: async (id: number, status: string, paymentStatus?: string) => {
    const res = await client.post<{ data: OrderBE }>('/v1/catalog/orders/' + id, { status, paymentStatus });
    return res.data.data;
  }
};
