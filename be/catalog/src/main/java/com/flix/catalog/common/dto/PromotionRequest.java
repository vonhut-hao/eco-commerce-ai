package com.flix.catalog.common.dto;

import com.flix.catalog.entity.PromotionEntity;
import com.flix.catalog.enums.PromotionEnum;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.PositiveOrZero;

import java.math.BigDecimal;
import java.time.LocalDateTime;

public record PromotionRequest(
        String code,
        @NotBlank String name,
        String description,
        @NotNull PromotionEnum discountType,
        @NotNull @PositiveOrZero BigDecimal discountValue,
        BigDecimal maxDiscountAmount,
        BigDecimal minOrderValue,
        Integer usageLimit,
        Integer usedCount,
        @NotNull LocalDateTime startDate,
        @NotNull LocalDateTime endDate,
        Boolean isActive
) {
    public static PromotionRequest from(PromotionEntity entity) {
        if (entity == null) return null;

        return new PromotionRequest(
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