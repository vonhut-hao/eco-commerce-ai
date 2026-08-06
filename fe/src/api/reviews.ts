import client from './client';

export interface CommentBE {
  id: number;
  content: string;
  rating: number;
  mediaUrls: string[];
  userId: number;
  productId: number;
  parentId: number;
  userName: string;
  productName: string;
  status: string;
  createdAt: string;
}

export const reviewsApi = {
  getReviews: async () => {
    const res = await client.get<any>('/v1/catalog/comments');
    return res.data.data as CommentBE[];
  },
  
  createReview: async (productId: number, rating: number, content: string, userId: number) => {
    const res = await client.post('/v1/catalog/comments', {
      productId,
      rating,
      content,
      userId
    });
    return res.data;
  },
  
  deleteReview: async (id: number) => {
    await client.delete(`/v1/catalog/comments/${id}`);
  },

  changeReviewStatus: async (id: number, status: string) => {
    await client.post(`/v1/catalog/comments/${id}/status`, null, {
      params: { status }
    });
  }
};
