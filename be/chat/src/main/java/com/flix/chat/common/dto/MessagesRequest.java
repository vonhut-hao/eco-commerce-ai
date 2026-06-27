package com.flix.chat.common.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
public record MessagesRequest(
        @NotBlank String content,
        @NotNull Long conversation_id,
        @NotNull Long sender_id,
        String file_url,
        @NotNull Boolean is_deleted
) { }
