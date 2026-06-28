package com.flix.chat.common.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;

public record MessagesRequest(
        @NotBlank String content,
        @NotNull Long conversationId, // Đã mở comment
        @NotNull Long senderId,
        String fileUrl,
        @NotNull Boolean isDeleted
) { }