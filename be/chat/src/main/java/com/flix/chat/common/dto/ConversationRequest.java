package com.flix.chat.common.dto;

import com.flix.chat.common.enums.ConversationType;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;

public record ConversationRequest(
    @NotNull ConversationType type,
    @NotNull Long user1_id,
    @NotNull Long user2_id,
    @NotNull Boolean is_deleted
) { }
