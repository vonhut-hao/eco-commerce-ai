import client from './client';

export interface CategoryBE {
  id: number;
  name: string;
  description: string;
}

export interface MaterialBE {
  id: number;
  name: string;
  sustainabilityScore: number;
}

export interface GreenCertificateBE {
  id: number;
  name: string;
  organization: string;
}

export interface CommentBE {
  id: number;
  content: string;
  rating: number;
  user: {
    id: number;
    email: string;
  };
}

export interface ProductBE {
  id: number;
  name: string;
  price: number;
  stock: number;
  greenPoints: number;
  ecoFriendliness: string;
  carbonIndex: number;
  avgRating: number;
  mainImage: string;
  subImages: string;
  description: string;
  categories: CategoryBE[];
  materials: MaterialBE[];
  greenCertificates: GreenCertificateBE[];
  comments: CommentBE[];
}

export interface PageResponse<T> {
  content: T[];
  pageable: any;
  totalElements: number;
  totalPages: number;
  last: boolean;
  size: number;
  number: number;
  sort: any;
  numberOfElements: number;
  first: boolean;
  empty: boolean;
}

export interface ApiResponse<T> {
  status: string;
  message: string;
  data: T;
  timestamp: string;
}

export function mapProductBeToFe(be: ProductBE): any {
  return {
    id: be.id,
    name: be.name,
    category: be.categories?.[0]?.name || "N/A",
    price: be.price,
    priceLabel: `${be.price.toLocaleString("vi-VN")} VND`,
    carbonIndex: be.carbonIndex,
    carbonLabel: `${be.carbonIndex} kg`,
    rating: be.avgRating || 0,
    reviews: be.comments?.length || 0,
    stock: be.stock,
    img: be.mainImage || "https://via.placeholder.com/150",
    badge: be.ecoFriendliness || "ECO",
    certifications: be.greenCertificates?.map(c => c.name) || [],
    material: be.materials?.map(m => m.name).join(", ") || "N/A",
    decomposition: "~6 months", // missing from BE
    greenPoints: be.greenPoints,
    description: be.description,
  };
}

export const productsApi = {
  getProducts: async (page = 0, size = 20) => {
    const res = await client.get<ApiResponse<PageResponse<ProductBE>>>(`/v1/catalog/products?page=${page}&size=${size}`);
    return res.data.data;
  },
  
  getProductById: async (id: number) => {
    const res = await client.get<ApiResponse<ProductBE>>(`/v1/catalog/products/${id}`);
    return res.data.data;
  },
  
  getCategories: async () => {
    const res = await client.get<ApiResponse<CategoryBE[]>>('/v1/catalog/categories');
    return res.data.data;
  }
};
