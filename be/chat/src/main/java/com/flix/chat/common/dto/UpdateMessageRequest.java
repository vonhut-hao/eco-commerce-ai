package com.flix.chat.common.dto;

import jakarta.validation.constraints.NotBlank;

public record UpdateMessageRequest(
        @NotBlank(message = "Content cannot be blank")
        String content
) {}
