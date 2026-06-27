package com.flix.catalog.common.dto;

import com.fasterxml.jackson.annotation.JsonInclude;
import com.flix.catalog.entity.ProductEntity;

import java.util.List;

import static com.flix.common.util.FileConvert.deserializeFile;

@JsonInclude(JsonInclude.Include.NON_NULL)
public record ProductEntityResponse(
        Long id,
        String name,
        Long price,
        int stock,
        Integer greenPoints,
        String ecoFriendliness,
        Double carbonIndex,
        Double avgRating,
        String mainImage,
        List<String> subImages,
        List<CategoryEntityResponse> categories,
        List<MaterialEntityResponse> materials
) {
    public static ProductEntityResponse from(ProductEntity entity) {
        if (entity == null) {
            return null;
        }
        return new ProductEntityResponse(
                entity.getId(),
                entity.getName(),
                entity.getPrice(),
                entity.getStock(),
                entity.getGreenPoints(),
                entity.getEcoFriendliness(),
                entity.getCarbonIndex(),
                entity.getAvgRating(),
                entity.getMainImage(),
                deserializeFile(entity.getSubImages()),
                entity.getCategories().stream()
                        .filter(categoryEntity -> categoryEntity.getDeletedAt() == null)
                        .map(CategoryEntityResponse::from)
                        .toList(),
                entity.getMaterials().stream()
                        .filter(materialEntity -> materialEntity.getDeleteAt() == null)
                        .map(MaterialEntityResponse::from)
                        .toList()
        );
    }
}
