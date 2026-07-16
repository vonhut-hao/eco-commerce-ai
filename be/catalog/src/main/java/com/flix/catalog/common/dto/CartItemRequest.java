package com.flix.catalog.common.dto;

import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Positive;

public record CartItemRequest(
        @NotNull Long productId,
        @Positive Integer quantity,
        @NotNull Long userId
) {
}
