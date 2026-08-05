import client from './client';

export interface AiChatRequest {
  message: string;
  productId?: number;
}

export interface AiChatResponse {
  reply: string;
}

export const chatWithAi = async (data: AiChatRequest): Promise<AiChatResponse> => {
  const response = await client.post('/v1/ai/chat/carbon-advisor', data);
  return response.data.data; // ApiResponse.data
};

// Types for Live Chat (Team has already done BE, this is just calling the API)
export interface Conversation {
  id: number;
  userId: number;
  adminId?: number;
  status: string;
}

export interface ChatMessage {
  id: number;
  conversationId: number;
  senderId: number;
  content: string;
  fileUrl?: string;
  createdAt: string;
}

export const createOrGetConversation = async (): Promise<Conversation> => {
  const response = await client.post('/v1/conversation');
  return response.data.data;
};

export const getMessagesByConversation = async (conversationId: number): Promise<ChatMessage[]> => {
  const response = await client.get(`/v1/message/conversation/${conversationId}`);
  return response.data.data;
};

export interface SendMessageRequest {
  conversationId: number;
  content: string;
}

export const sendMessage = async (data: SendMessageRequest): Promise<ChatMessage> => {
  const response = await client.post('/v1/message', data);
  return response.data.data;
};
