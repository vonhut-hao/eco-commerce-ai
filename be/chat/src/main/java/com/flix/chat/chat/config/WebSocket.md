1. registry.addEndpoint("/ws-comment")
   Giải thích: đây chính là "địa chỉ cổng nhà" (tương tự tên API) để phía Frontend gọi tới khi muốn bắt đầu kết nối Socket với Server.

Ví dụ: Frontend sẽ kết nối bằng đường dẫn: ws://localhost:8080/ws-comment.

2. .setAllowedOriginPatterns("*")
   Giải thích: Đây là tính năng "mở cửa tự do" (Bỏ chặn CORS). Nó cho phép Frontend chạy từ bất kỳ nguồn nào (ví dụ: máy tính của bạn localhost:3000, điện thoại, hoặc khi đã chạy online trên internet) đều được phép kết nối vào cổng Socket này mà không bị Server từ chối.

3. .withSockJS()
   Giải thích: Đây là "phương án dự phòng" (Back-up). WebSocket là công nghệ mới, nếu chẳng may người dùng dùng trình duyệt quá cũ (hoặc mạng công ty bị chặn không cho dùng Socket), SockJS sẽ tự động kích hoạt và chuyển sang dùng các kỹ thuật HTTP cũ hơn (như AJAX Long-Polling) để giả lập Socket, đảm bảo ứng dụng không bao giờ bị mất kết nối.