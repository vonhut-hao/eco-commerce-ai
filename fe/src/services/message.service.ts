import axios from 'axios';
import { MessageResponse, MessagesRequest } from '../types/message';
import { ApiResponse } from '../types/conversation'; // ✨ Import thêm ở đây

import { API_BASE } from './api';

const API_URL = `${API_BASE}/v1/message`;

export const messageService = {
    getMessages: async (conversationId: number, userId: number): Promise<MessageResponse[]> => {
        const response = await axios.get<ApiResponse<MessageResponse[]>>(
            `${API_URL}/conversation/${conversationId}`,
            { headers: { userId: userId.toString() } }
        );
        return response.data.data;
    },

    sendMessage: async (data: MessagesRequest, userId: number): Promise<MessageResponse> => {
        const response = await axios.post<ApiResponse<MessageResponse>>(
            API_URL,
            data,
            { headers: { userId: userId.toString() } }
        );
        return response.data.data;
    },

    hideMessage: async (messageId: number, userId: number): Promise<MessageResponse> => {
        const response = await axios.put<ApiResponse<MessageResponse>>(
            `${API_URL}/${messageId}/hidden`,
            {},
            { headers: { userId: userId.toString() } }
        );
        return response.data.data;
    },

    showMessage: async (messageId: number, userId: number): Promise<MessageResponse> => {
        const response = await axios.put<ApiResponse<MessageResponse>>(
            `${API_URL}/${messageId}/show`,
            {},
            { headers: { userId: userId.toString() } }
        );
        return response.data.data;
    }
};