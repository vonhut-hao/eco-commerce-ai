import client from './client';

export interface Category {
  id: number;
  name: string;
  description: string;
  parentId?: number | null;
}

export interface CategoryRequest {
  name: string;
  description: string;
  parentId?: number | null;
}

export const categoriesApi = {
  getAll: async (): Promise<Category[]> => {
    const res = await client.get('/v1/catalog/categories');
    return res.data.data;
  },
  create: async (data: CategoryRequest): Promise<Category> => {
    const res = await client.post('/v1/catalog/categories', data);
    return res.data.data;
  },
  update: async (id: number, data: CategoryRequest): Promise<Category> => {
    const res = await client.post(`/v1/catalog/categories/${id}`, data);
    return res.data.data;
  },
  delete: async (id: number): Promise<void> => {
    await client.delete(`/v1/catalog/categories/${id}`);
  }
};
