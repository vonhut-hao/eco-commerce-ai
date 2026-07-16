import { ConversationRequest, ConversationResponse } from '../types/conversation';
import { api } from "@/services/api.ts";

const API_URL = '/v1/conversation';

export const conversationService = {
    createOrGetConversation: async (senderId: number, receiverId: number): Promise<ConversationResponse> => {
        const payload: ConversationRequest = {
            user1Id: senderId,
            user2Id: receiverId,
            type: 'USER',
            isDeleted: false
        };

        const response = await api.post<ConversationResponse>(API_URL, payload);
        return response.data;
    },

    getConversationsByUserId: async (userId: number): Promise<ConversationResponse[]> => {
        const response = await api.get<ConversationResponse[]>(`${API_URL}/user/${userId}`);
        return response.data;
    },

    getConversationById: async (id: number): Promise<ConversationResponse> => {
        const response = await api.get<ConversationResponse>(`${API_URL}/${id}`);
        return response.data;
    },

    hideConversation: async (id: number): Promise<ConversationResponse> => {
        const response = await api.put<ConversationResponse>(`${API_URL}/${id}/hidden`);
        return response.data;
    },

    showConversation: async (id: number): Promise<ConversationResponse> => {
        const response = await api.put<ConversationResponse>(`${API_URL}/${id}/show`);
        return response.data;
    },
};