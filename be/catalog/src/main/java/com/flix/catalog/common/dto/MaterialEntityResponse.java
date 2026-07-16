package com.flix.catalog.common.dto;

import com.fasterxml.jackson.annotation.JsonInclude;
import com.flix.catalog.entity.MaterialEntity;

@JsonInclude(JsonInclude.Include.NON_NULL)
public record MaterialEntityResponse(
        Long id,
        String name,
        String type,
        double ecoRating
) {
    public static MaterialEntityResponse from(MaterialEntity entity) {
        if (entity == null) {
            return null;
        }

        return new MaterialEntityResponse(
                entity.getId(),
                entity.getName(),
                entity.getType(),
                entity.getEcoRating()
        );
    }
}
