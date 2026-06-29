package com.flix.catalog.common.dto;

import com.flix.catalog.entity.CategoryEntity;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

public record CategoryEntityRequest(
        Long id,
        @NotBlank @Size(max = 100) String name,
        String description
) {

    public void toEntity(CategoryEntity entity) {
        entity.setName(name);
        entity.setDescription(description);
    }
}
