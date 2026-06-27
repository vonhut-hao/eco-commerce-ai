package com.flix.catalog.common.dto;

import com.fasterxml.jackson.annotation.JsonInclude;
import com.flix.catalog.entity.CategoryEntity;
import org.springframework.util.StringUtils;

@JsonInclude(JsonInclude.Include.NON_NULL)
public record CategoryEntityResponse(
        Long id,
        String name,
        String description
) {
    public static CategoryEntityResponse from(CategoryEntity entity) {
        if (entity == null) {
            return null;
        }

        return new CategoryEntityResponse(
                entity.getId(),
                entity.getName(),
                StringUtils.hasText(entity.getDescription()) ? entity.getDescription() : null
        );
    }
}
