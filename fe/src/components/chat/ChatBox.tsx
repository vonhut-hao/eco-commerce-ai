import React, { useState, useEffect, useRef } from 'react';
import { useChat } from '@/composables/userChat.ts';
import { uploadService } from '@/services/upload.service';
import { formatImageUrl } from '@/utils/image';
import { Upload, X, Loader2 } from 'lucide-react';

interface ChatBoxProps {
    conversationId: number;
    userId: number | null;
}

export default function ChatBox({ conversationId, userId }: ChatBoxProps) {
    const [inputText, setInputText] = useState('');
    const [fileUrl, setFileUrl] = useState('');
    const [uploadingFile, setUploadingFile] = useState(false);
    const chatContainerRef = useRef<HTMLDivElement | null>(null);

    const { messages, sendMessage, isConnected, isLoading, isForbidden, retryAccess } = useChat(
        conversationId,
        userId
    );

    // 🚀 Tự động cuộn xuống tin nhắn mới nhất mỗi khi `messages` thay đổi (chỉ cuộn khung chat, không cuộn toàn trang)
    const scrollToBottom = () => {
        setTimeout(() => {
            if (chatContainerRef.current) {
                chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
            }
        }, 50);
    };

    useEffect(() => {
        scrollToBottom();
    }, [messages]);

    const handleSend = (e: React.FormEvent) => {
        e.preventDefault();
        if (!inputText.trim() && !fileUrl) return;
        sendMessage(inputText, fileUrl);
        setInputText('');
        setFileUrl('');
    };

    const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;
        setUploadingFile(true);
        try {
            const res = await uploadService.uploadFile(file);
            setFileUrl(res.data.url);
        } catch (err: any) {
            alert('Lỗi upload file: ' + err.message);
        } finally {
            setUploadingFile(false);
        }
    };

    if (isForbidden) {
        return (
            <div className="flex-1 flex flex-col items-center justify-center p-8 bg-red-50/50">
                <div className="w-16 h-16 bg-red-100 text-red-500 rounded-full flex items-center justify-center text-2xl font-bold mb-4">
                    🚫
                </div>
                <h3 className="text-xl font-bold text-red-600 mb-2">Truy cập bị từ chối</h3>
                <p className="text-gray-600 text-center mb-6 max-w-md">
                    Bạn không có quyền xem cuộc trò chuyện này.
                </p>
                <button
                    onClick={retryAccess}
                    className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white font-medium rounded-lg transition-colors"
                >
                    Thử lại
                </button>
            </div>
        );
    }

    return (
        <div className="flex-1 flex flex-col h-full bg-white">
            {/* Header Phòng Chat */}
            <div className="p-5 border-b border-[#c2c9bb]/40 flex justify-between items-center bg-[#eff2eb]">
                <div>
                    <h2 className="font-bold text-[#1a1c19] text-sm uppercase tracking-wider">Phòng chat #{conversationId}</h2>
                    <span className="text-[10px] uppercase font-bold tracking-wider text-gray-400 flex items-center gap-1.5 mt-1">
                        <span className={`w-1.5 h-1.5 rounded-full ${isConnected ? 'bg-green-600' : 'bg-red-500'}`}></span>
                        {isConnected ? 'Realtime Connected' : 'Disconnected'}
                    </span>
                </div>
            </div>

            {/* Danh Sách Tin Nhắn */}
            <div ref={chatContainerRef} className="flex-1 p-5 overflow-y-auto space-y-4 bg-[#fafaf5]">
                {isLoading ? (
                    <div className="flex justify-center items-center h-full text-gray-400 text-sm">
                        Đang tải tin nhắn...
                    </div>
                ) : messages && messages.length > 0 ? (
                    messages.map((msg) => {
                        const isMe = msg.senderId === userId;
                        return (
                            <div
                                key={msg.id || Math.random()}
                                className={`flex flex-col ${isMe ? 'items-end' : 'items-start'}`}
                            >
                                <div className="flex items-end gap-2.5 max-w-[75%]">
                                    {!isMe && (
                                        <div className="w-8 h-8 rounded-full bg-gradient-to-br from-[#8fbf8a] to-[#3d7035] text-white flex items-center justify-center font-bold text-xs flex-shrink-0 shadow-xs select-none">
                                            U{msg.senderId}
                                        </div>
                                    )}
                                    <div
                                        className={`px-4 py-2 rounded-md text-xs leading-relaxed font-semibold shadow-xs ${
                                            isMe
                                                ? 'bg-[#25521f] text-white rounded-br-none'
                                                : 'bg-white text-gray-800 border border-[#c2c9bb]/60 rounded-bl-none'
                                        }`}
                                    >
                                        {msg.fileUrl && (
                                            <div className="mb-2 max-w-[200px] rounded overflow-hidden">
                                                <a href={formatImageUrl(msg.fileUrl)} target="_blank" rel="noopener noreferrer">
                                                    <img
                                                        src={formatImageUrl(msg.fileUrl)}
                                                        alt="chat attachment"
                                                        className="max-h-40 max-w-full object-cover rounded hover:opacity-95 transition-opacity"
                                                    />
                                                </a>
                                            </div>
                                        )}
                                        {msg.content}
                                    </div>
                                </div>
                                <span className="text-[9px] font-bold text-gray-400 mt-1 px-1 uppercase tracking-wider">
                                    {msg.createdAt
                                        ? new Date(msg.createdAt).toLocaleTimeString([], {
                                            hour: '2-digit',
                                            minute: '2-digit',
                                        })
                                        : ''}
                                </span>
                            </div>
                        );
                    })
                ) : (
                    <div className="flex flex-col justify-center items-center h-full text-gray-400 text-sm">
                        <p>Chưa có tin nhắn nào trong phòng này.</p>
                        <p className="text-xs mt-1 text-gray-300">Hãy gửi tin nhắn đầu tiên để bắt đầu trò chuyện!</p>
                    </div>
                )}
            </div>

            {/* Ô Nhập Tin Nhắn */}
            <form onSubmit={handleSend} className="p-4 border-t border-[#c2c9bb]/60 flex flex-col gap-2 bg-[#eff2eb]">
                {fileUrl && (
                    <div className="relative w-16 h-16 border border-[#c2c9bb] rounded bg-white flex items-center justify-center overflow-hidden self-start">
                        <img
                            src={formatImageUrl(fileUrl)}
                            alt="preview"
                            className="object-cover w-full h-full"
                        />
                        <button
                            type="button"
                            onClick={() => setFileUrl('')}
                            className="absolute top-0.5 right-0.5 bg-black/60 rounded-full p-0.5 text-white hover:bg-black"
                        >
                            <X size={10} />
                        </button>
                    </div>
                )}
                <div className="flex gap-3 items-center">
                    <label className="flex items-center justify-center p-2 border border-[#c2c9bb] rounded-sm cursor-pointer bg-white hover:bg-gray-100 transition-colors h-8">
                        {uploadingFile ? (
                            <Loader2 className="w-4 h-4 animate-spin text-[#25521f]" />
                        ) : (
                            <Upload className="w-4 h-4 text-gray-500" />
                        )}
                        <input
                            type="file"
                            accept="image/*"
                            disabled={uploadingFile}
                            onChange={handleFileUpload}
                            className="hidden"
                        />
                    </label>
                    <input
                        type="text"
                        value={inputText}
                        onChange={(e) => setInputText(e.target.value)}
                        placeholder="Nhập tin nhắn..."
                        className="flex-1 border border-[#c2c9bb] bg-white rounded-sm px-4 py-2 text-xs font-semibold focus:outline-none focus:border-[#25521f] placeholder-gray-400 h-8 transition-colors"
                    />
                    <button
                        type="submit"
                        disabled={!inputText.trim() && !fileUrl}
                        className="bg-[#25521f] hover:bg-[#1a1c19] disabled:opacity-50 text-white px-5 rounded-sm font-bold text-xs uppercase tracking-wider h-8 flex items-center justify-center transition-colors cursor-pointer"
                    >
                        Gửi
                    </button>
                </div>
            </form>
        </div>
    );
}