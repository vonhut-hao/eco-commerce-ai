import { useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { authService } from '@/services/auth.service';
import { useConversation } from '@/composables/userConversation';
import { ChatSidebar } from '@/components/chat/ChatSidebar';
import ChatBox from '@/components/chat/ChatBox';

export default function ChatPage() {
    const navigate = useNavigate();
    const { conversationId } = useParams<{ conversationId?: string }>();

    // Lấy userId hiện tại
    const currentUserId = authService.getUserId();
    const isAdmin = authService.isAdmin();
    const { conversations, loading, startChatWithUser } = useConversation(currentUserId);

    const activeConversationId = conversationId ? parseInt(conversationId, 10) : undefined;
    const initiatingChatRef = useRef(false);

    // Tự động khởi tạo chat với Admin nếu người dùng là USER và chưa ở trong phòng chat nào
    useEffect(() => {
        if (currentUserId && !isAdmin && !activeConversationId && !initiatingChatRef.current) {
            initiatingChatRef.current = true;
            startChatWithUser(1).then((roomId) => {
                if (roomId) {
                    navigate(`/chat-page/${roomId}`, { replace: true });
                }
            }).finally(() => {
                initiatingChatRef.current = false;
            });
        }
    }, [currentUserId, isAdmin, activeConversationId, startChatWithUser, navigate]);

    return (
        <main className="fixed top-14 bottom-14 md:top-20 md:bottom-0 left-0 right-0 bg-[#f9f9f7] overflow-hidden z-10">
            <div className="max-w-[1280px] h-full mx-auto px-4 md:px-16 py-6">

                {/* Main Chat Layout Container */}
                <div className="flex h-full bg-white rounded-2xl shadow-sm border border-[#e5e7eb] overflow-hidden">

                    {isAdmin && (
                        <ChatSidebar
                            conversations={conversations}
                            activeConversationId={activeConversationId}
                            currentUserId={currentUserId || 0}
                            loading={loading}
                            onSelect={(id) => navigate(`/chat-page/${id}`)}
                            onNewChat={async () => {
                                const targetId = 2; // Admin bắt đầu chat với customer (ID = 2)
                                const roomId = await startChatWithUser(targetId);
                                if (roomId) navigate(`/chat-page/${roomId}`);
                            }}
                        />
                    )}

                    {activeConversationId ? (
                        /* Đã truyền cả userId và key vào ChatBox */
                        <ChatBox
                            key={activeConversationId}
                            conversationId={activeConversationId}
                            userId={currentUserId}
                        />
                    ) : (
                        <div className="flex-1 flex flex-col items-center justify-center p-8 bg-[#fafaf5] text-gray-400 text-sm italic">
                            Đang kết nối với Admin...
                        </div>
                    )}

                </div>
            </div>
        </main>
    );
}