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
  type: string;
  user1Id: number;
  user2Id: number;
  isDeleted: boolean;
}

export interface ChatMessage {
  id: number;
  conversationId: number;
  senderId: number;
  content: string;
  fileUrl?: string;
  createdAt: string;
}

export const getUserConversations = async (userId: number): Promise<Conversation[]> => {
  const response = await client.get(`/v1/conversation/user/${userId}`);
  return response.data.data;
};

export const createOrGetConversation = async (userId: number): Promise<Conversation> => {
  try {
    const list = await getUserConversations(userId);
    if (list && list.length > 0) {
      return list[0];
    }
  } catch (e) {
    console.error("Error fetching conversations", e);
  }

  const response = await client.post('/v1/conversation', {
    type: 'USER',
    user1Id: userId,
    user2Id: 1, 
    isDeleted: false
  });
  return response.data.data;
};

export const getMessagesByConversation = async (conversationId: number, userId: number): Promise<ChatMessage[]> => {
  const response = await client.get(`/v1/message/conversation/${conversationId}`, {
    headers: { userId }
  });
  return response.data.data;
};

export interface SendMessageRequest {
  conversationId: number;
  content: string;
  senderId: number;
  fileUrl?: string;
}

export const sendMessage = async (data: SendMessageRequest): Promise<ChatMessage> => {
  const response = await client.post('/v1/message', data);
  return response.data.data;
};
