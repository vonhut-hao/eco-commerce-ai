package com.flix.catalog.common.dto;

import com.fasterxml.jackson.annotation.JsonInclude;

@JsonInclude(JsonInclude.Include.NON_NULL)
public record FavoriteToggleResponse(
        Long productId,
        boolean isFavorite,
        String message
) {}
