import { useState, useEffect, useCallback, useRef } from 'react';
import { Client } from '@stomp/stompjs';
import SockJS from 'sockjs-client';
import { messageService } from '../services/message.service';
import { MessageResponse } from '../types/message';
import { API_BASE } from '../services/api';

export const useChat = (conversationId: number | undefined, userId: number | null) => {
    const [messages, setMessages] = useState<MessageResponse[]>([]);
    const [isConnected, setIsConnected] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [isForbidden, setIsForbidden] = useState(false);

    const stompClientRef = useRef<Client | null>(null);

    // 1. Tải danh sách tin nhắn từ REST API
    const fetchMessages = useCallback(async () => {
        if (!userId || !conversationId) return;

        setIsLoading(true);
        setIsForbidden(false);

        try {
            console.log(`📥 Đang tải tin nhắn phòng ${conversationId}...`);
            const data = await messageService.getMessages(conversationId, userId);
            console.log(`✅ Lấy thành công ${data?.length || 0} tin nhắn:`, data);

            setMessages(Array.isArray(data) ? data : []);
        } catch (error: any) {
            console.error('❌ Lỗi khi tải tin nhắn:', error);
            if (error.response && (error.response.status === 403 || error.response.status === 401)) {
                setIsForbidden(true);
            }
        } finally {
            setIsLoading(false);
        }
    }, [conversationId, userId]);

    // 2. Setup WebSocket Realtime
    useEffect(() => {
        if (!userId || !conversationId) return;

        setMessages([]);
        setIsForbidden(false);

        fetchMessages();

        const client = new Client({
            webSocketFactory: () => new SockJS(`${API_BASE}/ws`),
            reconnectDelay: 5000,
            onConnect: () => {
                setIsConnected(true);
                console.log(`🟢 STOMP Connected: /topic/conversation/${conversationId}`);

                client.subscribe(`/topic/conversation/${conversationId}`, (message) => {
                    if (message.body) {
                        const parsed = JSON.parse(message.body);
                        // Xử lý cả 2 trường hợp WebSocket trả về Object bọc hoặc Object thẳng
                        const newMsg: MessageResponse = parsed?.data ? parsed.data : parsed;
                        console.log('📩 Nhận tin nhắn mới realtime:', newMsg);

                        if (newMsg && newMsg.id) {
                            setMessages((prev) => {
                                if (prev.some((m) => m.id === newMsg.id)) return prev;
                                return [...prev, newMsg];
                            });
                        }
                    }
                });
            },
            onDisconnect: () => {
                setIsConnected(false);
            },
            onStompError: (frame) => {
                setIsConnected(false);
                console.error('Lỗi STOMP Broker:', frame.headers['message']);
            },
        });

        client.activate();
        stompClientRef.current = client;

        return () => {
            if (client.active) {
                client.deactivate();
            }
        };
    }, [conversationId, userId, fetchMessages]);

    // 3. Hàm gửi tin nhắn
    const sendMessage = async (content: string) => {
        if (!content.trim() || !userId || !conversationId || isForbidden) return;

        try {
            await messageService.sendMessage(
                {
                    conversationId,
                    content,
                    senderId: userId,
                },
                userId
            );
        } catch (error) {
            console.error('Lỗi khi gửi tin nhắn:', error);
        }
    };

    const retryAccess = () => {
        setIsForbidden(false);
        fetchMessages();
    };

    return {
        messages,
        sendMessage,
        retryAccess,
        isConnected,
        isLoading,
        isForbidden,
        refetchMessages: fetchMessages,
    };
};