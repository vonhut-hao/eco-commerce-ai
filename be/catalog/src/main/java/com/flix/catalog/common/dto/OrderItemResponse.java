package com.flix.catalog.common.dto;

import com.fasterxml.jackson.annotation.JsonInclude;
import com.flix.catalog.entity.OrderItemEntity;

@JsonInclude(JsonInclude.Include.NON_NULL)
public record OrderItemResponse(
        Long id,
        int quantity,
        Long price,
        Double lineCarbonFootprint,
        Long productId,
        String productName,
        String mainImage
) {
    public static OrderItemResponse from(OrderItemEntity entity) {
        if (entity == null) {
            return null;
        }

        return new OrderItemResponse(
                entity.getId(),
                entity.getQuantity(),
                entity.getPrice(),
                entity.getLineCarbonFootprint(),
                entity.getProductEntity().getId(),
                entity.getProductEntity().getName(),
                entity.getProductEntity().getMainImage()
        );
    }
}
