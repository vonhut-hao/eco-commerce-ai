package com.flix.catalog.common.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;

public record BannerRequest(
        @NotBlank String imageUrl,
        String title,
        String linkUrl,
        @NotNull Integer displayOrder,
        @NotNull Boolean isActive
) {
}
