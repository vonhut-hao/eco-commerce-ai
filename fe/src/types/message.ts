import { ConversationResponse } from './conversation';

export interface MessagesRequest {
    conversationId: number;
    content: string;
    senderId?: number;
    fileUrl?: string;
}


export interface MessageResponse {
    id: number;
    content: string;
    senderId: number;
    fileUrl?: string | null;
    isDeleted: boolean;
    createdAt?: string;
    updatedAt?: string;
    conversation?: ConversationResponse;
}

export interface ApiResponse<T> {
    status: string;
    message: string;
    data: T;
}