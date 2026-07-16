import { api } from "./api";
import { CommentEntityResponse } from "./product.service";

export interface CommentEntityRequest {
  content: string;
  rating: number;
  mediaUrls: string[];
  userId: number;
  productId: number;
  parentId?: number | null;
}

export const commentService = {
  listComments: () => api.get<CommentEntityResponse[]>("/v1/catalog/comments"),

  createOrUpdateComment: (id: number | null, request: CommentEntityRequest) =>
    api.post<CommentEntityResponse>(id ? `/v1/catalog/comments/${id}` : "/v1/catalog/comments", request),

  deleteComment: (id: number) => api.delete<void>(`/v1/catalog/comments/${id}`),
};
