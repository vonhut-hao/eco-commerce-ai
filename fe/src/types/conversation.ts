export enum ConversationType {
    USER = 'USER',
    BOT = 'BOT',
}

// types/conversation.ts
export interface ConversationRequest {
    user1Id: number;
    user2Id: number;
    type: 'USER' | 'BOT';
    isDeleted: boolean;
}

export interface ConversationResponse {
    id: number;
    type?: ConversationType | string;
    user1Id: number;
    user2Id: number;
    user1Username?: string;
    user2Username?: string;
    user1AvatarUrl?: string;
    user2AvatarUrl?: string;
    isDeleted: boolean;
    createdAt?: string;
    updatedAt?: string;
}

export interface ApiResponse<T> {
    status: string;
    message: string;
    data: T;
}