export function ChatEmptyState() {
    return (
        <div className="flex-1 flex flex-col items-center justify-center text-gray-400 bg-white">
            <div className="w-20 h-20 bg-gray-50 rounded-full flex items-center justify-center mb-4 text-3xl">
                💬
            </div>
            <p className="font-medium text-gray-500">Chọn một cuộc trò chuyện</p>
            <p className="text-sm mt-1">Bắt đầu kết nối với cộng đồng của bạn</p>
        </div>
    );
}