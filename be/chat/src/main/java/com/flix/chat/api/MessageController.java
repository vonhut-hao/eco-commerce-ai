package com.flix.chat.api;

import com.flix.chat.chat.service.MessageService;
import com.flix.chat.common.dto.MessagesRequest;
import com.flix.chat.common.dto.MessagesResponse;
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
        // 1. Lưu tin nhắn vào CSDL
        MessagesResponse response = messageService.saveMessage(request);

        // 2. 🚀 Bắn tin nhắn trực tiếp qua WebSocket Topic
        String destination = "/topic/conversation/" + request.conversationId();
        log.info("Pushing realtime message to destination: {}", destination);

        // Gửi thẳng object response xuống WebSocket Topic
        messagingTemplate.convertAndSend(destination, response);

        return ApiResponse.success(response, HttpStatus.CREATED, "Message sent successfully");
    }

    @GetMapping("/conversation/{conversationId}")
    @ResponseStatus(HttpStatus.OK)
    public ApiResponse<List<MessagesResponse>> getAllMessage(
            @PathVariable("conversationId") Long conversationId,
            @RequestHeader(value = "userId", required = false) Long userIdHeader,
            @RequestHeader(value = "Userid", required = false) Long userIdHeaderAlt) {

        // Lấy userId dù FE truyền 'userId' hay 'Userid'
        Long userId = (userIdHeader != null) ? userIdHeader : userIdHeaderAlt;

        List<MessagesResponse> response = messageService.getAllMessage(conversationId, userId);
        return ApiResponse.success(response, HttpStatus.OK, "All messages fetched successfully");
    }

    @PutMapping("/{messageId}/hidden")
    @ResponseStatus(HttpStatus.OK)
    public ApiResponse<MessagesResponse> hiddenMessage(
            @PathVariable("messageId") Long messageId,
            @RequestHeader(value = "userId", required = false) Long userIdHeader,
            @RequestHeader(value = "Userid", required = false) Long userIdHeaderAlt) {

        Long userId = (userIdHeader != null) ? userIdHeader : userIdHeaderAlt;
        MessagesResponse response = messageService.hiddenMessage(messageId, userId);
        return ApiResponse.success(response, HttpStatus.OK, "Message hidden successfully");
    }

    @PutMapping("/{messageId}/show")
    @ResponseStatus(HttpStatus.OK)
    public ApiResponse<MessagesResponse> showMessage(
            @PathVariable("messageId") Long messageId,
            @RequestHeader(value = "userId", required = false) Long userIdHeader,
            @RequestHeader(value = "Userid", required = false) Long userIdHeaderAlt) {

        Long userId = (userIdHeader != null) ? userIdHeader : userIdHeaderAlt;
        MessagesResponse response = messageService.showMessage(messageId, userId);
        return ApiResponse.success(response, HttpStatus.OK, "Message shown successfully");
    }
}