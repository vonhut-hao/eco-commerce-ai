import client from './client';
import { ApiResponse } from './products';

export interface CartItemRequest {
  productId: number;
  quantity: number;
  userId: number;
}

export interface CartItemResponse {
  id: number;
  quantity: number;
  productId: number;
  productName: string;
  price: number;
  greenPoints: number;
  mainImage: string;
}

export const cartApi = {
  getCartItems: async () => {
    const res = await client.get<ApiResponse<CartItemResponse[]>>('/v1/catalog/cart');
    return res.data.data;
  },
  
  createOrUpdateCartItem: async (request: CartItemRequest, id?: number) => {
    const url = id ? `/v1/catalog/cart/${id}` : '/v1/catalog/cart';
    const res = await client.post<ApiResponse<CartItemResponse>>(url, request);
    return res.data.data;
  },
  
  deleteCartItem: async (id: number) => {
    const res = await client.delete<ApiResponse<void>>(`/v1/catalog/cart/${id}`);
    return res.data; // Just return response since data is void
  }
};
