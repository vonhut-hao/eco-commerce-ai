package com.flix.catalog.common.dto;

import jakarta.validation.constraints.NotEmpty;
import jakarta.validation.constraints.NotNull;

import java.util.List;

public record BulkUpdateStatusRequest(
        @NotEmpty
        List<Long> promotionIds,

        @NotNull
        Boolean isActive
) {
}
