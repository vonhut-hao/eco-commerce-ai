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

export type OrderResponse = OrderBE;
export type OrderItemResponse = OrderItemBE;

export interface OrderRequest {
  paymentMethodId?: number;
  status?: string;
  promotionId?: number;
}

export const ordersApi = {
  createOrder: async (request: OrderRequest) => {
    const res = await client.post<{ data: OrderBE }>('/v1/catalog/orders', request);
    return res.data.data;
  },
  getOrders: async () => {
    const res = await client.get<{ data: OrderBE[] }>('/v1/catalog/orders');
    return res.data.data;
  },
  getOrderDetails: async (id: number) => {
    const res = await client.get<{ data: OrderBE }>(`/v1/catalog/orders/${id}`);
    return res.data.data;
  },
  viewInvoice: async (id: number) => {
    const res = await client.get(`/v1/catalog/orders/${id}/invoice/pdf`, {
      responseType: 'blob'
    });
    const blob = new Blob([res.data], { type: 'application/pdf' });
    const url = window.URL.createObjectURL(blob);
    window.open(url, '_blank');
  },
  getOrdersAdmin: async () => {
    const res = await client.get<{ data: OrderBE[] }>('/v1/catalog/orders/admin');
    return res.data.data;
  },
  updateOrderStatus: async (id: number, status: string, paymentStatus?: string) => {
    const res = await client.post<{ data: OrderBE }>('/v1/catalog/orders/' + id, { status, paymentStatus });
    return res.data.data;
  }
};
