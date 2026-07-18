import { api } from "./api";

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
  greenPoints?: number;
  mainImage?: string | null;
}

export const cartService = {
  getCart: () => api.get<CartItemResponse[]>("/v1/catalog/cart"),

  addToCart: (productId: number, quantity: number, userId: number) =>
    api.post<CartItemResponse>("/v1/catalog/cart", { productId, quantity, userId }),

  updateQuantity: (cartItemId: number, productId: number, quantity: number, userId: number) =>
    api.post<CartItemResponse>(`/v1/catalog/cart/${cartItemId}`, { productId, quantity, userId }),

  removeFromCart: (cartItemId: number) =>
    api.delete<void>(`/v1/catalog/cart/${cartItemId}`),
};
