import { useState, useEffect, useCallback } from 'react';
import { conversationService } from '../services/conversation.service'; // Bỏ đuôi .ts ở import
import { ConversationResponse } from '../types/conversation';

export const useConversation = (currentUserId: number | null) => {
    console.log("🟢 currentUserId truyền vào hook đang là:", currentUserId);

    const [conversations, setConversations] = useState<ConversationResponse[]>([]);
    const [loading, setLoading] = useState<boolean>(false);

    const fetchConversations = useCallback(async () => {
        if (!currentUserId) {
            console.warn("🔴 Bị chặn lại vì currentUserId đang null/undefined!");
            return;
        }

        setLoading(true);
        try {
            console.log("🔵 Đang gọi API với ID:", currentUserId);
            const data = await conversationService.getConversationsByUserId(currentUserId);
            console.log("✅ Dữ liệu nhận được từ API:", data);
            setConversations(data || []);
        } catch (error) {
            console.error('Lỗi khi tải danh sách cuộc trò chuyện:', error);
        } finally {
            setLoading(false);
        }
    }, [currentUserId]);

    useEffect(() => {
        fetchConversations();
    }, [fetchConversations]);

    // Tìm/Tạo phòng chat giữa 2 User
    const startChatWithUser = async (targetUserId: number): Promise<number | null> => {
        if (!currentUserId) return null;
        try {
            // Đã đổi lại tên hàm cho khớp với service: createOrGetConversation
            const conversation = await conversationService.createOrGetConversation(currentUserId, targetUserId);

            // Reload danh sách nếu phòng mới chưa có trong State
            setConversations((prev) => {
                const exists = prev.some((c) => c.id === conversation.id);
                return exists ? prev : [conversation, ...prev];
            });

            return conversation.id;
        } catch (error) {
            console.error('Lỗi khi khởi tạo phòng chat:', error);
            return null;
        }
    };

    return {
        conversations,
        loading,
        fetchConversations,
        startChatWithUser,
    };
};