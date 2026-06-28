package com.flix.chat.common.dto;

import com.flix.chat.common.enums.ConversationType;
import jakarta.validation.constraints.NotNull;

import java.time.LocalDateTime;

public record ConversationRequest(
    @NotNull ConversationType type,
    @NotNull Long user1Id,
    @NotNull Long user2Id,
    @NotNull Boolean isDeleted
) { }
