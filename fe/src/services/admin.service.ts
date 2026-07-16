import { api } from "./api";
import { ProductEntityResponse, CategoryEntityResponse, MaterialEntityResponse } from "./product.service";
import { OrderResponse } from "./order.service";

export interface CategoryEntityRequest {
  name: string;
  description: string;
}

export interface MaterialEntityRequest {
  name: string;
  type: string;
  ecoRating: number;
}

export interface GreenCertificateEntityRequest {
  name: string;
  issuer: string;
  issueDate: string; // YYYY-MM-DD
  imageUrl: string;
  productId: number;
}

export interface GreenCertificateEntityResponse {
  id: number;
  name: string;
  issuer: string;
  issueDate: string;
  imageUrl: string;
  productId: number;
}

export interface ProductEntityRequest {
  name: string;
  price: number;
  stock: number;
  greenPoints: number;
  ecoFriendliness?: string;
  carbonIndex?: number;
  mainImage?: string;
  subImages: string[];
  categoryIds: number[];
  materialIds: number[];
  description: string;
}

export const adminService = {
  // Categories
  listCategories: () => api.get<CategoryEntityResponse[]>("/v1/catalog/categories"),
  createOrUpdateCategory: (id: number | null, request: CategoryEntityRequest) =>
    api.post<CategoryEntityResponse>(id ? `/v1/catalog/categories/${id}` : "/v1/catalog/categories", request),
  deleteCategory: (id: number) => api.delete<void>(`/v1/catalog/categories/${id}`),

  // Materials
  listMaterials: () => api.get<MaterialEntityResponse[]>("/v1/catalog/materials"),
  createOrUpdateMaterial: (id: number | null, request: MaterialEntityRequest) =>
    api.post<MaterialEntityResponse>(id ? `/v1/catalog/materials/${id}` : "/v1/catalog/materials", request),
  deleteMaterial: (id: number) => api.delete<void>(`/v1/catalog/materials/${id}`),

  // Green Certificates
  listGreenCerts: () => api.get<GreenCertificateEntityResponse[]>("/v1/catalog/green-certificates"),
  createOrUpdateGreenCert: (id: number | null, request: GreenCertificateEntityRequest) =>
    api.post<GreenCertificateEntityResponse>(id ? `/v1/catalog/green-certificates/${id}` : "/v1/catalog/green-certificates", request),
  deleteGreenCert: (id: number) => api.delete<void>(`/v1/catalog/green-certificates/${id}`),

  // Products
  createOrUpdateProduct: (id: number | null, request: ProductEntityRequest) =>
    api.post<ProductEntityResponse>(id ? `/v1/catalog/products/${id}` : "/v1/catalog/products", request),
  deleteProduct: (id: number) => api.delete<void>(`/v1/catalog/products/${id}`),

  // Orders
  listAllOrders: () => api.get<OrderResponse[]>("/v1/catalog/orders/admin"),
  updateOrderStatus: (id: number, status: string) =>
    api.post<OrderResponse>(`/v1/catalog/orders/${id}`, { status }),
};
