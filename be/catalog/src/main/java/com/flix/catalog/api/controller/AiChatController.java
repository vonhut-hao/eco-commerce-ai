package com.flix.catalog.api.controller;

import com.flix.catalog.ai.service.AiChatService;
import com.flix.catalog.common.dto.AiChatRequest;
import com.flix.catalog.common.dto.AiChatResponse;
import com.flix.common.dto.ApiResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/v1/ai/chat")
@RequiredArgsConstructor
public class AiChatController {

    private final AiChatService aiChatService;

    @PostMapping("/carbon-advisor")
    public ResponseEntity<ApiResponse<AiChatResponse>> chatWithAI(@RequestBody AiChatRequest request) {
        AiChatResponse response = aiChatService.getChatResponse(request);
        return ResponseEntity.ok(ApiResponse.success(response));
    }
}
