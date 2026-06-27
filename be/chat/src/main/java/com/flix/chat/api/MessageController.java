package com.flix.chat.api;

import com.flix.chat.common.dto.MessagesRequest;
import com.flix.chat.common.dto.MessagesResponse;
import com.flix.chat.chat.service.MessageService;
import com.flix.common.dto.ApiResponse;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.messaging.simp.SimpMessagingTemplate; // Import để dùng WebSocket
import org.springframework.web.bind.annotation.*;

import java.util.List;

@Slf4j
@RestController
@RequestMapping("/v1/message")
@RequiredArgsConstructor
public class MessageController {

    private final MessageService messageService;
    private final SimpMessagingTemplate messagingTemplate; // Khai báo đối tượng đẩy realtime

    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    public ApiResponse<MessagesResponse> saveMessage(@RequestBody @Valid MessagesRequest request) {
        // 1. Lưu tin nhắn vào Database
        MessagesResponse response = messageService.saveMessage(request);

        // 2. Đẩy tin nhắn realtime qua WebSocket cho tất cả người dùng trong phòng chat đó nhận
        // Đường dẫn lắng nghe của Frontend: /topic/conversation/{conversation_id}
        String destination = "/topic/conversation/" + request.conversation_id();
        log.info("Pushing realtime message to: {}", destination);
        messagingTemplate.convertAndSend(destination, response);

        return ApiResponse.success(response, HttpStatus.CREATED, "Message sent successfully");
    }

    @GetMapping("/conversation/{conversationId}")
    @ResponseStatus(HttpStatus.OK)
    public ApiResponse<List<MessagesResponse>> getAllMessage(@PathVariable Long conversationId) {
        List<MessagesResponse> response = messageService.getAllMessage(conversationId);
        return ApiResponse.success(response, HttpStatus.OK, "All messages fetched successfully");
    }

    @GetMapping("/{messageId}")
    @ResponseStatus(HttpStatus.OK)
    public ApiResponse<MessagesResponse> getMessage(@PathVariable Long messageId) {
        MessagesResponse response = messageService.getMessage(messageId);
        return ApiResponse.success(response, HttpStatus.OK, "Message details fetched successfully");
    }

    @PutMapping("/{messageId}/update")
    @ResponseStatus(HttpStatus.OK)
    public ApiResponse<MessagesResponse> updateMessage(
            @PathVariable Long messageId,
            @RequestHeader("X-User-Id") Long userId, // Giả định bạn lấy UserId từ Gateway/Header
            @RequestBody @Valid MessagesRequest request) {

        MessagesResponse response = messageService.updateMessage(messageId, userId, request);
        return ApiResponse.success(response, HttpStatus.OK, "Message updated successfully");
    }

    @PutMapping("/{messageId}/hidden")
    @ResponseStatus(HttpStatus.OK)
    public ApiResponse<MessagesResponse> hiddenMessage(
            @PathVariable Long messageId,
            @RequestHeader("X-User-Id") Long userId) {

        MessagesResponse response = messageService.hiddenMessage(messageId, userId);
        return ApiResponse.success(response, HttpStatus.OK, "Message hidden successfully");
    }

    @PutMapping("/{messageId}/show")
    @ResponseStatus(HttpStatus.OK)
    public ApiResponse<MessagesResponse> showMessage(
            @PathVariable Long messageId,
            @RequestHeader("X-User-Id") Long userId) {

        MessagesResponse response = messageService.showMessage(messageId, userId);
        return ApiResponse.success(response, HttpStatus.OK, "Message shown successfully");
    }
}