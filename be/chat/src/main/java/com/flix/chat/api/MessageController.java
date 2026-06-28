package com.flix.chat.api;

import com.flix.chat.common.dto.MessagesRequest;
import com.flix.chat.common.dto.MessagesResponse;
import com.flix.chat.chat.service.MessageService;
import com.flix.chat.common.dto.UpdateMessageRequest;
import com.flix.common.dto.ApiResponse;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@Slf4j
@RestController
@RequestMapping("/v1/message")
@RequiredArgsConstructor
public class MessageController {

    private final MessageService messageService;
    private final SimpMessagingTemplate messagingTemplate;

    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    public ApiResponse<MessagesResponse> saveMessage(@RequestBody @Valid MessagesRequest request) {
        MessagesResponse response = messageService.saveMessage(request);
        // Đẩy realtime: request.conversationId() đã hoạt động bình thường
        String destination = "/topic/conversation/" + request.conversationId();
        log.info("Pushing realtime message to: {}", destination);
        messagingTemplate.convertAndSend(destination, response);
        log.info("Realtime message pushed successfully to destination: {}", destination);
        return ApiResponse.success(response, HttpStatus.CREATED, "Message sent successfully");
    }

    @GetMapping("/conversation/{conversationId}")
    @ResponseStatus(HttpStatus.OK)
    public ApiResponse<List<MessagesResponse>> getAllMessage(
            @PathVariable("conversationId") Long conversationId,
            @RequestHeader("X-User-Id") Long userId) { // Sửa lại từ @PathVariable thành @RequestHeader để đúng thiết kế hệ thống

        List<MessagesResponse> response = messageService.getAllMessage(conversationId, userId);
        return ApiResponse.success(response, HttpStatus.OK, "All messages fetched successfully");
    }

    @PutMapping("/{messageId}/update")
    @ResponseStatus(HttpStatus.OK)
    public ApiResponse<MessagesResponse> updateMessage(
            @PathVariable("messageId") Long messageId,
            @RequestHeader("X-User-Id") Long userId,
            @RequestBody @Valid UpdateMessageRequest request) {

        MessagesResponse response = messageService.updateMessage(messageId, userId, request);
        return ApiResponse.success(response, HttpStatus.OK, "Message updated successfully");
    }

    @PutMapping("/{messageId}/hidden")
    @ResponseStatus(HttpStatus.OK)
    public ApiResponse<MessagesResponse> hiddenMessage(
            @PathVariable("messageId") Long messageId,
            @RequestHeader("X-User-Id") Long userId) {

        MessagesResponse response = messageService.hiddenMessage(messageId, userId);
        return ApiResponse.success(response, HttpStatus.OK, "Message hidden successfully");
    }

    @PutMapping("/{messageId}/show")
    @ResponseStatus(HttpStatus.OK)
    public ApiResponse<MessagesResponse> showMessage(
            @PathVariable("messageId") Long messageId,
            @RequestHeader("X-User-Id") Long userId) {

        MessagesResponse response = messageService.showMessage(messageId, userId);
        return ApiResponse.success(response, HttpStatus.OK, "Message shown successfully");
    }
}