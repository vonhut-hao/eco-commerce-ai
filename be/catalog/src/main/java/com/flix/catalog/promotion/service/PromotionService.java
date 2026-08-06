package com.flix.catalog.promotion.service;

import com.flix.catalog.common.dto.BulkUpdateStatusRequest;
import com.flix.catalog.common.dto.PromotionRequest;
import com.flix.catalog.dao.PromotionRepository;
import com.flix.catalog.entity.PromotionEntity;
import com.flix.catalog.enums.PromotionEnum;
import com.flix.common.enums.ErrorCode;
import com.flix.common.exception.BusinessException;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.time.DateTimeException; // <-- Import thêm class này
import java.time.LocalDateTime;
import java.util.List;

@Slf4j
@Service
@RequiredArgsConstructor
public class PromotionService {
    private final PromotionRepository promotionRepository;

    public PromotionEntity getPromotionById(Long id){
        log.debug("Fetching promotion by ID: {}", id);
        return promotionRepository.findByPromotionById(id).orElseThrow(() -> {
            log.warn("Promotion not found with ID: {}", id);
            return new BusinessException(ErrorCode.PROMOTION_NOT_FOUND);
        });
    }

    public PromotionEntity getPromotionByCode(String code){
        log.debug("Fetching promotion by code: {}", code);
        return promotionRepository.findByCode(code).orElseThrow(() -> {
            log.warn("Promotion not found with code: {}", code);
            return new BusinessException(ErrorCode.PROMOTION_NOT_FOUND);
        });
    }

    public List<PromotionEntity> getAllPromotions(){
        log.info("Fetching all promotions");
        List<PromotionEntity> promotions = promotionRepository.findAll();
        log.info("Found {} promotions", promotions.size());
        return promotions;
    }

    public PromotionEntity createPromotion(PromotionRequest request) {
        log.info("Start creating promotion with code: {}", request.code());
        LocalDateTime dateNow = LocalDateTime.now();

        if (request.code() != null && !request.code().isBlank()) {
            if (promotionRepository.existsByCode(request.code())) {
                log.warn("Promotion creation failed: Code '{}' already exists", request.code());
                throw new BusinessException(ErrorCode.PROMOTION_CODE_ALREADY_EXISTS);
            }
        }

        // Bắt lỗi ngày tháng -> Bắn DateTimeException để GlobalExceptionHandler bắt
        if (request.startDate() == null || request.endDate() == null
                || !request.startDate().isBefore(request.endDate())) {
            log.warn("Promotion creation failed: Invalid date range (start: {}, end: {})", request.startDate(), request.endDate());
            throw new DateTimeException("Start date must be before end date and both must not be null.");
        }

        if (request.endDate().isBefore(dateNow)) {
            log.warn("Promotion creation failed: End date {} is in the past", request.endDate());
            throw new BusinessException(ErrorCode.PROMOTION_EXPIRED);
        }

        BigDecimal discountValue = request.discountValue();
        if (discountValue == null) {
            log.warn("Promotion creation failed: Discount value is null");
            throw new BusinessException(ErrorCode.INVALID_PROMOTION_DISCOUNT_VALUE);
        }

        if (request.discountType() == PromotionEnum.PERCENTAGE) {
            if (discountValue.compareTo(BigDecimal.ZERO) <= 0 || discountValue.compareTo(new BigDecimal("100")) > 0) {
                log.warn("Promotion creation failed: Invalid percentage discount value {}", discountValue);
                throw new BusinessException(ErrorCode.INVALID_PROMOTION_DISCOUNT_VALUE);
            }
        } else if (request.discountType() == PromotionEnum.FIXED_AMOUNT) {
            if (discountValue.compareTo(BigDecimal.ZERO) <= 0) {
                log.warn("Promotion creation failed: Invalid fixed amount discount value {}", discountValue);
                throw new BusinessException(ErrorCode.INVALID_PROMOTION_DISCOUNT_VALUE);
            }
            if (request.minOrderValue() != null && discountValue.compareTo(request.minOrderValue()) > 0) {
                log.warn("Promotion creation failed: Discount {} exceeds min order value {}", discountValue, request.minOrderValue());
                throw new BusinessException(ErrorCode.INVALID_PROMOTION_DISCOUNT_VALUE);
            }
        }

        BigDecimal minOrderValue = (request.minOrderValue() != null && request.minOrderValue().compareTo(BigDecimal.ZERO) >= 0)
                ? request.minOrderValue() : BigDecimal.ZERO;

        BigDecimal maxDiscountAmount = request.discountType() == PromotionEnum.PERCENTAGE
                ? request.maxDiscountAmount() : null;

        if (request.usageLimit() != null && request.usageLimit() <= 0) {
            log.warn("Promotion creation failed: Invalid usage limit {}", request.usageLimit());
            throw new BusinessException(ErrorCode.INVALID_REQUEST);
        }

        PromotionEntity entity = PromotionEntity.builder()
                .code(request.code() != null ? request.code().trim().toUpperCase() : null)
                .name(request.name())
                .description(request.description())
                .discountType(request.discountType())
                .discountValue(discountValue)
                .maxDiscountAmount(maxDiscountAmount)
                .minOrderValue(minOrderValue)
                .usageLimit(request.usageLimit())
                .usedCount(0)
                .startDate(request.startDate())
                .endDate(request.endDate())
                .isActive(request.isActive() != null ? request.isActive() : true)
                .build();

        PromotionEntity savedEntity = promotionRepository.save(entity);
        log.info("Successfully created promotion with ID: {}, Code: {}", savedEntity.getId(), savedEntity.getCode());
        return savedEntity;
    }

    public PromotionEntity updatePromotion(Long id, PromotionRequest request) {
        log.info("Start updating promotion with ID: {}", id);
        PromotionEntity entity = getPromotionById(id);

        // Bắt lỗi ngày tháng -> Bắn DateTimeException để GlobalExceptionHandler bắt
        if (request.startDate() == null || request.endDate() == null
                || !request.startDate().isBefore(request.endDate())) {
            log.warn("Promotion update failed for ID {}: Invalid date range", id);
            throw new DateTimeException("Start date must be before end date and both must not be null.");
        }

        BigDecimal discountValue = request.discountValue();
        if (discountValue == null) {
            log.warn("Promotion update failed for ID {}: Discount value is null", id);
            throw new BusinessException(ErrorCode.INVALID_PROMOTION_DISCOUNT_VALUE);
        }

        if (request.discountType() == PromotionEnum.PERCENTAGE) {
            if (discountValue.compareTo(BigDecimal.ZERO) <= 0 || discountValue.compareTo(new BigDecimal("100")) > 0) {
                log.warn("Promotion update failed for ID {}: Invalid percentage discount {}", id, discountValue);
                throw new BusinessException(ErrorCode.INVALID_PROMOTION_DISCOUNT_VALUE);
            }
        } else if (request.discountType() == PromotionEnum.FIXED_AMOUNT) {
            if (discountValue.compareTo(BigDecimal.ZERO) <= 0) {
                log.warn("Promotion update failed for ID {}: Invalid fixed amount discount {}", id, discountValue);
                throw new BusinessException(ErrorCode.INVALID_PROMOTION_DISCOUNT_VALUE);
            }
            if (request.minOrderValue() != null && discountValue.compareTo(request.minOrderValue()) > 0) {
                log.warn("Promotion update failed for ID {}: Discount {} exceeds min order value {}", id, discountValue, request.minOrderValue());
                throw new BusinessException(ErrorCode.INVALID_PROMOTION_DISCOUNT_VALUE);
            }
        }

        BigDecimal minOrderValue = (request.minOrderValue() != null && request.minOrderValue().compareTo(BigDecimal.ZERO) >= 0)
                ? request.minOrderValue() : BigDecimal.ZERO;
        BigDecimal maxDiscountAmount = request.discountType() == PromotionEnum.PERCENTAGE
                ? request.maxDiscountAmount() : null;

        if (request.usageLimit() != null && request.usageLimit() <= 0) {
            log.warn("Promotion update failed for ID {}: Invalid usage limit {}", id, request.usageLimit());
            throw new BusinessException(ErrorCode.INVALID_REQUEST);
        }

        entity.setName(request.name());
        entity.setDescription(request.description());
        entity.setDiscountType(request.discountType());
        entity.setDiscountValue(discountValue);
        entity.setMaxDiscountAmount(maxDiscountAmount);
        entity.setMinOrderValue(minOrderValue);
        entity.setUsageLimit(request.usageLimit());
        entity.setStartDate(request.startDate());
        entity.setEndDate(request.endDate());

        if (request.isActive() != null) {
            entity.setIsActive(request.isActive());
        }

        PromotionEntity updatedEntity = promotionRepository.save(entity);
        log.info("Successfully updated promotion with ID: {}", updatedEntity.getId());
        return updatedEntity;
    }

    public void bulkUpdatePromotionStatus(BulkUpdateStatusRequest request) {
        log.info("Start bulk updating status to {} for promotion IDs: {}", request.isActive(), request.promotionIds());

        List<PromotionEntity> promotions = promotionRepository.findAllById(request.promotionIds());
        if (promotions.isEmpty()) {
            log.warn("Bulk update failed: No promotions found for provided IDs: {}", request.promotionIds());
            throw new BusinessException(ErrorCode.PROMOTION_NOT_FOUND);
        }

        for (PromotionEntity promotion : promotions) {
            promotion.setIsActive(request.isActive());
        }
        promotionRepository.saveAll(promotions);

        log.info("Successfully bulk updated {} promotions to status: {}", promotions.size(), request.isActive());
    }
}