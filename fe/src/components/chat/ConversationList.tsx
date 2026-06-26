import React from 'react';
import { ConversationResponse } from '@/types/conversation';

interface ConversationListProps {
    conversations: ConversationResponse[];
    activeConversationId?: number;
    currentUserId: number;
    onSelectConversation: (conversationId: number) => void;
    loading?: boolean;
}

const ConversationList: React.FC<ConversationListProps> = ({
                                                               conversations,
                                                               activeConversationId,
                                                               currentUserId,
                                                               onSelectConversation,
                                                               loading,
                                                           }) => {
    if (loading) {
        return <div className="p-4 text-center text-gray-400 text-sm">Đang tải cuộc trò chuyện...</div>;
    }

    const handleSelect = (id: number) => {
        console.log(`👉 Select room ${id} for userId: ${currentUserId}`);
        onSelectConversation(id);
    };

    return (
        <div className="w-full overflow-y-auto bg-white">
            <div className="divide-y divide-gray-100">
                {conversations && conversations.length > 0 ? (
                    conversations.map((item) => {
                        const isActive = item.id === activeConversationId;
                        // Xác định ID đối phương
                        const partnerId = item.user1Id === currentUserId ? item.user2Id : item.user1Id;
                        const partnerAvatarUrl = item.user1Id === currentUserId ? item.user2AvatarUrl : item.user1AvatarUrl;
                        const partnerUsername = item.user1Id === currentUserId ? item.user2Username : item.user1Username;
                        const displayName = partnerUsername || `User #${partnerId}`;

                        return (
                            <div
                                key={item.id}
                                onClick={() => handleSelect(item.id)}
                                className={`p-4 flex items-center gap-3 cursor-pointer transition-all border-l-4 ${
                                    isActive 
                                        ? 'bg-[#bcf1ad]/15 border-[#25521f] font-semibold text-[#25521f]' 
                                        : 'border-transparent hover:bg-[#fafaf5] text-gray-700'
                                }`}
                            >
                                {partnerAvatarUrl ? (
                                    <img
                                        src={partnerAvatarUrl}
                                        alt="Avatar"
                                        className="w-9 h-9 rounded-full object-cover border border-[#c2c9bb]/60 shrink-0"
                                        referrerPolicy="no-referrer"
                                    />
                                ) : (
                                    <div className="w-9 h-9 rounded-full bg-gradient-to-br from-[#8fbf8a] to-[#3d7035] text-white flex items-center justify-center font-bold text-xs shadow-xs shrink-0 select-none">
                                        U{partnerId}
                                    </div>
                                )}
                                <div className="flex-1 min-w-0">
                                    <p className={`text-sm truncate ${isActive ? 'text-[#25521f]' : 'text-gray-800'}`}>
                                        {displayName}
                                    </p>
                                    <p className="text-[11px] text-gray-400 mt-0.5 truncate">
                                        Room #{item.id}
                                    </p>
                                </div>
                            </div>
                        );
                    })
                ) : (
                    <div className="p-8 text-center text-gray-400 text-xs italic">
                        No conversations yet.
                    </div>
                )}
            </div>
        </div>
    );
};

export default ConversationList;