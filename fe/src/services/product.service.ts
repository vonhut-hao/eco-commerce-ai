import { api } from "./api";

export interface ProductSimpleResponse {
  id: number;
  name: string;
  price: number;
  avgRating: number;
  mainImage: string;
  greenPoints: number;
  stock: number;
  description?: string;
}

export interface PageResponse<T> {
  content: T[];
  pageable: {
    pageNumber: number;
    pageSize: number;
  };
  totalElements: number;
  totalPages: number;
  last: boolean;
  size: number;
  number: number;
  numberOfElements: number;
  first: boolean;
  empty: boolean;
}

export interface CategoryEntityResponse {
  id: number;
  name: string;
  description: string;
}

export interface MaterialEntityResponse {
  id: number;
  name: string;
  type: string;
  ecoRating: number;
}

export interface CommentEntityResponse {
  id: number;
  content: string;
  rating: number;
  mediaUrls: string[];
  userId: number;
  productId: number;
  parentId?: number;
  userName?: string;
}

export interface GreenCertificateEntityResponse {
  id: number;
  name: string;
  issuer: string;
  issueDate: string;
  imageUrl: string;
  productId: number;
}

export interface ProductEntityResponse {
  id: number;
  name: string;
  price: number;
  stock: number;
  greenPoints: number;
  ecoFriendliness?: string;
  carbonIndex?: number;
  avgRating: number;
  mainImage?: string;
  subImages?: string[];
  categories?: CategoryEntityResponse[];
  materials?: MaterialEntityResponse[];
  description?: string;
  greenCertificates?: GreenCertificateEntityResponse[];
}

export const productService = {
  listProducts: (page: number = 0, size: number = 10) =>
    api.get<PageResponse<ProductSimpleResponse>>(`/v1/catalog/products?page=${page}&size=${size}`),

  getProductDetail: (id: number | string) =>
    api.get<ProductEntityResponse>(`/v1/catalog/products/${id}`),
};
