import { api } from "./api";

export interface OrderRequest {
  paymentMethodId: number | null;
}

export interface OrderItemResponse {
  id: number;
  quantity: number;
  price: number;
  lineCarbonFootprint: number;
  productId: number;
  productName: string;
}

export interface OrderResponse {
  id: number;
  totalAmount: number;
  status: string;
  userId?: number;
  username?: string;
  paymentMethodId?: number;
  paymentMethodName?: string;
  orderItems: OrderItemResponse[];
}

export const orderService = {
  listOrders: () => api.get<OrderResponse[]>("/v1/catalog/orders"),

  listUserOrders: (userId: number) => api.get<OrderResponse[]>(`/api/users/${userId}/orders`),

  getOrderDetails: (id: number | string) =>
    api.get<OrderResponse>(`/v1/catalog/orders/${id}`),

  placeOrder: (paymentMethodId: number | null) =>
    api.post<OrderResponse>("/v1/catalog/orders", { paymentMethodId }),

  updateOrderStatus: (id: number, paymentMethodId: number | null) =>
    api.post<OrderResponse>(`/v1/catalog/orders/${id}`, { paymentMethodId }),
};
