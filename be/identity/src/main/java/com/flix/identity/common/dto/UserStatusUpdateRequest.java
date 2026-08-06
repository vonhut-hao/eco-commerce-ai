package com.flix.identity.common.dto;

import jakarta.validation.constraints.NotNull;

public record UserStatusUpdateRequest(
        @NotNull(message = "isEnabled status must not be null")
        Boolean isEnabled
) {
}
