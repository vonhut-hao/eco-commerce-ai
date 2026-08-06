import client from './client';

export interface CategoryBE {
  id: number;
  name: string;
  description: string;
  parentId?: number | null;
}

export interface MaterialBE {
  id: number;
  name: string;
  sustainabilityScore: number;
}

export interface GreenCertificateBE {
  id: number;
  name: string;
  issuer: string;
  issueDate: string;
  imageUrl: string;
  productId: number;
  productName: string;
}

export interface GreenCertificateRequest {
  name: string;
  issuer: string;
  issueDate: string;
  imageUrl?: string;
  productId: number;
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
  subImages: string[];
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

export interface ProductRequest {
  name: string;
  price: number;
  stock: number;
  greenPoints?: number;
  ecoFriendliness?: string;
  carbonIndex?: number;
  mainImage?: string;
  subImages?: string[];
  categoryIds?: number[];
  materialIds?: number[];
  description?: string;
}

export function mapProductBeToFe(be: ProductBE): any {
  return {
    id: be.id,
    name: be.name,
    category: be.categories?.[0]?.name || "N/A",
    categoryId: be.categories?.[0]?.id || null,
    categoryIds: be.categories?.map(c => c.id) || [],
    price: Number(be.price),
    priceLabel: `${Number(be.price).toLocaleString("vi-VN")} VND`,
    carbonIndex: Number(be.carbonIndex),
    carbonLabel: `${Number(be.carbonIndex)} kg`,
    rating: Number(be.avgRating) || 0,
    reviews: be.comments?.length || 0,
    stock: Number(be.stock),
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
  },
  
  createProduct: async (req: ProductRequest) => {
    const res = await client.post<ApiResponse<ProductBE>>('/v1/catalog/products', req);
    return res.data.data;
  },
  
  updateProduct: async (id: number, req: ProductRequest) => {
    const res = await client.post<ApiResponse<ProductBE>>(`/v1/catalog/products/${id}`, req);
    return res.data.data;
  },
  
  deleteProduct: async (id: number) => {
    await client.delete(`/v1/catalog/products/${id}`);
  },
  
  // --- Green Certificates ---
  getGreenCertificates: async () => {
    const res = await client.get<ApiResponse<GreenCertificateBE[]>>('/v1/catalog/green-certificates');
    return res.data.data;
  },
  
  createGreenCertificate: async (req: GreenCertificateRequest) => {
    const res = await client.post<ApiResponse<GreenCertificateBE>>('/v1/catalog/green-certificates', req);
    return res.data.data;
  },
  
  updateGreenCertificate: async (id: number, req: GreenCertificateRequest) => {
    const res = await client.post<ApiResponse<GreenCertificateBE>>(`/v1/catalog/green-certificates/${id}`, req);
    return res.data.data;
  },
  
  deleteGreenCertificate: async (id: number) => {
    await client.delete(`/v1/catalog/green-certificates/${id}`);
  }
};
