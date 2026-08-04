package com.flix.catalog.common.dto;

import com.flix.catalog.entity.PromotionEntity;
import com.flix.catalog.enums.PromotionEnum;

import java.math.BigDecimal;
import java.time.LocalDateTime;

public record PromotionResponse(
        Long id,
        String code,
        String name,
        String description,
        PromotionEnum discountType,
        BigDecimal discountValue,
        BigDecimal maxDiscountAmount,
        BigDecimal minOrderValue,
        Integer usageLimit,
        Integer usedCount,
        LocalDateTime startDate,
        LocalDateTime endDate,
        Boolean isActive
) {
    public static PromotionResponse from(PromotionEntity entity) {
        if (entity == null) return null;

        return new PromotionResponse(
                entity.getId(),
                entity.getCode(),
                entity.getName(),
                entity.getDescription(),
                entity.getDiscountType(),
                entity.getDiscountValue(),
                entity.getMaxDiscountAmount(),
                entity.getMinOrderValue(),
                entity.getUsageLimit(),
                entity.getUsedCount(),
                entity.getStartDate(),
                entity.getEndDate(),
                entity.getIsActive()
        );
    }
}