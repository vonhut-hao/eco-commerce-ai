import ConversationList from './ConversationList';

interface ChatSidebarProps {
    conversations: any[];
    activeConversationId?: number;
    currentUserId: number;
    loading: boolean;
    onSelect: (id: number) => void;
    onNewChat: () => void;
}

export function ChatSidebar({conversations, activeConversationId, currentUserId, loading, onSelect, onNewChat}: ChatSidebarProps) {
    return (
        <div className="w-80 border-r border-[#c2c9bb]/60 flex flex-col bg-white">
            <div className="p-5 border-b border-[#c2c9bb]/40 flex justify-between items-center">
                <h2 className="font-bold text-base text-[#1a1c19] tracking-wide uppercase">Tin nhắn</h2>
                <button
                    onClick={onNewChat}
                    className="flex items-center gap-1.5 px-3 py-1.5 border border-[#c2c9bb] hover:border-[#25521f] hover:bg-[#bcf1ad]/15 text-[#25521f] text-[11px] font-bold uppercase tracking-wider rounded-sm transition-colors cursor-pointer"
                >
                    + New Chat
                </button>
            </div>

            <div className="flex-1 overflow-y-auto">
                <ConversationList
                    conversations={conversations}
                    activeConversationId={activeConversationId}
                    currentUserId={currentUserId}
                    onSelectConversation={onSelect}
                    loading={loading}
                />
            </div>
        </div>
    );
}