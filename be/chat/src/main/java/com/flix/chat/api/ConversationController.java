package com.flix.chat.api;

import com.flix.chat.common.dto.ConversationRequest;
import com.flix.chat.common.dto.ConversationResponse;
import com.flix.chat.entity.ConversationEntity;
import com.flix.chat.chat.service.ConversationService;
import com.flix.common.dto.ApiResponse;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/v1/conversation")
@RequiredArgsConstructor
public class ConversationController {
    private final ConversationService conversationService;

    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    public ApiResponse<ConversationResponse> createConversation(@RequestBody @Valid ConversationRequest request) {
        ConversationResponse response = conversationService.createConversation(request);
        return ApiResponse.success(response, HttpStatus.CREATED, "Room chat created or fetched successfully");
    }

    @GetMapping("/{id}")
    @ResponseStatus(HttpStatus.OK)
    public ApiResponse<ConversationResponse> getConversation(@PathVariable Long id) {
        ConversationResponse response = conversationService.getConversation(id);
        return ApiResponse.success(response, HttpStatus.OK, "Room chat fetched successfully");
    }

    @GetMapping("/user/{userId}")
    @ResponseStatus(HttpStatus.OK)
    public ApiResponse<List<ConversationEntity>> listConversation(@PathVariable Long userId) {
        List<ConversationEntity> response = conversationService.listConversation(userId);
        return ApiResponse.success(response, HttpStatus.OK, "List room chat fetched successfully");
    }

    @PutMapping("/{id}/hidden")
    @ResponseStatus(HttpStatus.OK)
    public ApiResponse<ConversationResponse> hiddenConversation(@PathVariable Long id) {
        ConversationResponse response = conversationService.hiddenConversation(id);
        return ApiResponse.success(response, HttpStatus.OK, "Room chat hidden successfully");
    }

    @PutMapping("/{id}/show")
    @ResponseStatus(HttpStatus.OK)
    public ApiResponse<ConversationResponse> showConversation(@PathVariable Long id) {
        ConversationResponse response = conversationService.showConversation(id);
        return ApiResponse.success(response, HttpStatus.OK, "Room chat shown successfully");
    }
}
