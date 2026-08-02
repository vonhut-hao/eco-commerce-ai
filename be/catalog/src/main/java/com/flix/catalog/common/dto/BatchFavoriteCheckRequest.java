package com.flix.catalog.common.dto;

import java.util.List;

public record BatchFavoriteCheckRequest(
        List<Long> productIds
) {}
