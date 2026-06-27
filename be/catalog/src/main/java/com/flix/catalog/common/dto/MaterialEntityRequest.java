package com.flix.catalog.common.dto;

import com.flix.catalog.entity.MaterialEntity;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.PositiveOrZero;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;

public record MaterialEntityRequest(
        Long id,
        @NotBlank @Size(max = 100) String name,
        @Size(max = 50) String type,
        @NotNull @PositiveOrZero Double ecoRating
) {
    public void toEntity(MaterialEntity entity) {
        entity.setName(name);
        entity.setType(type);
        entity.setEcoRating(ecoRating);
    }
}
