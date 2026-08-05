import client from "./client";
import { ApiResponse } from "./auth";

export const favoritesApi = {
  getUserFavorites: async () => {
    const res = await client.get<ApiResponse<any>>("/v1/catalog/favorites?size=1000");
    return res.data.data.content; // Returns array of products
  },
  toggleFavorite: async (productId: number) => {
    const res = await client.post<ApiResponse<{ isFavorite: boolean }>>(`/v1/catalog/favorites/${productId}/toggle`);
    return res.data.data;
  },
  batchCheck: async (productIds: number[]) => {
    const res = await client.post<ApiResponse<{ productId: number; isFavorite: boolean }[]>>("/v1/catalog/favorites/check-batch", { productIds });
    return res.data.data;
  }
};
