package com.flix.catalog.common.dto;

import com.flix.catalog.entity.BannerEntity;

public record BannerResponse(
        Long id,
        String imageUrl,
        String title,
        String linkUrl,
        Integer displayOrder,
        Boolean isActive
) {
    public static BannerResponse fromEntity(BannerEntity entity) {
        return new BannerResponse(
                entity.getId(),
                entity.getImageUrl(),
                entity.getTitle(),
                entity.getLinkUrl(),
                entity.getDisplayOrder(),
                entity.getIsActive()
        );
    }
}
