package com.flix.catalog.common.dto;

import com.fasterxml.jackson.annotation.JsonInclude;
import com.flix.catalog.entity.ProductEntity;

@JsonInclude(JsonInclude.Include.NON_NULL)
public record ProductSimpleResponse(
        Long id,
        String name,
        Long price,
        Double avgRating,
        String mainImage,
        Integer greenPoints
) {
    public static ProductSimpleResponse from(ProductEntity entity) {
        if (entity == null) {
            return null;
        }
        return new ProductSimpleResponse(
                entity.getId(),
                entity.getName(),
                entity.getPrice(),
                entity.getAvgRating(),
                entity.getMainImage(),
                entity.getGreenPoints()
        );
    }
}
