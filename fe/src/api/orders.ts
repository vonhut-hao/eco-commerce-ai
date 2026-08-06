import client from './client';
import { ApiResponse } from './products';

export interface OrderRequest {
  paymentMethodId?: number;
  status?: string;
}

export interface OrderItemResponse {
  id: number;
  quantity: number;
  price: number;
  lineCarbonFootprint: number;
  productId: number;
  productName: string;
  mainImage: string;
}

export interface OrderResponse {
  id: number;
  totalAmount: number;
  status: string;
  userId: number;
  username: string;
  paymentMethodId: number;
  paymentMethodName: string;
  createdAt?: string;
  orderItems: OrderItemResponse[];
}

export const ordersApi = {
  createOrder: async (request: OrderRequest) => {
    const res = await client.post<ApiResponse<OrderResponse>>('/v1/catalog/orders', request);
    return res.data.data;
  },
  
  getOrders: async () => {
    const res = await client.get<ApiResponse<OrderResponse[]>>('/v1/catalog/orders');
    return res.data.data;
  },
  
  getAllOrdersAdmin: async () => {
    const res = await client.get<ApiResponse<OrderResponse[]>>('/v1/catalog/orders/admin');
    return res.data.data;
  },
  
  getOrderDetails: async (id: number) => {
    const res = await client.get<ApiResponse<OrderResponse>>(`/v1/catalog/orders/${id}`);
    return res.data.data;
  },
  
  viewInvoice: async (id: number) => {
    const res = await client.get(`/v1/catalog/orders/${id}/invoice/pdf`, {
      responseType: 'blob'
    });
    const blob = new Blob([res.data], { type: 'application/pdf' });
    const url = window.URL.createObjectURL(blob);
    window.open(url, '_blank');
  }
};
