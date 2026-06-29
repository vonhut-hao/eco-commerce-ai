package com.flix.catalog.common.dto;

import com.flix.catalog.entity.CategoryEntity;
import com.flix.catalog.entity.MaterialEntity;
import com.flix.catalog.entity.ProductEntity;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.PositiveOrZero;
import jakarta.validation.constraints.Size;

import java.util.List;
import java.util.Set;

import static com.flix.common.util.FileConvert.serializeFile;

public record ProductEntityRequest(
        Long id,
        @NotBlank String name,
        @NotNull @PositiveOrZero Long price,
        @NotNull @Min(0) Integer stock,
        @Min(0) Integer greenPoints,
        @Size(max = 50) String ecoFriendliness,
        @PositiveOrZero Double carbonIndex,
        @Size(max = 255) String mainImage,
        List<String> subImages,
        List<Long> categoryIds,
        List<Long> materialIds
) {

    public void toEntity(ProductEntity entity, Set<CategoryEntity> categories, List<MaterialEntity> materials) {
        entity.setName(name);
        entity.setPrice(price);
        entity.setStock(stock);
        entity.setGreenPoints(greenPoints == null ? 0 : greenPoints);
        entity.setEcoFriendliness(ecoFriendliness);
        entity.setCarbonIndex(carbonIndex);
        entity.setMainImage(mainImage);
        entity.setSubImages(serializeFile(subImages));

        if (entity.getCategories() != null) {
            entity.getCategories().clear();
            entity.getCategories().addAll(categories);
        }

        if (entity.getMaterials() != null) {
            entity.getMaterials().clear();
            entity.getMaterials().addAll(materials);
        }
    }
}
