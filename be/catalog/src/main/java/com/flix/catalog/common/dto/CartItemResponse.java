package com.flix.catalog.common.dto;

import com.fasterxml.jackson.annotation.JsonInclude;
import com.flix.catalog.entity.CartItemEntity;

@JsonInclude(JsonInclude.Include.NON_NULL)
public record CartItemResponse(
        Long id,
        int quantity,
        Long productId,
        String productName,
        Long price,
        Integer greenPoints,
        Double carbonIndex,
        String category,
        String mainImage
) {
    public static CartItemResponse from(CartItemEntity entity) {
        if (entity == null) {
            return null;
        }

        return new CartItemResponse(
                entity.getId(),
                entity.getQuantity(),
                entity.getProduct().getId(),
                entity.getProduct().getName(),
                entity.getProduct().getPrice(),
                entity.getProduct().getGreenPoints(),
                entity.getProduct().getCarbonIndex(),
                (entity.getProduct().getCategories() != null && !entity.getProduct().getCategories().isEmpty()) ? 
                        entity.getProduct().getCategories().iterator().next().getName() : "N/A",
                entity.getProduct().getMainImage()
        );
    }
}
