package com.flix.catalog.common.dto;

import com.fasterxml.jackson.annotation.JsonInclude;

@JsonInclude(JsonInclude.Include.NON_NULL)
public record FavoriteCheckResponse(
        Long productId,
        boolean isFavorite
) {}
