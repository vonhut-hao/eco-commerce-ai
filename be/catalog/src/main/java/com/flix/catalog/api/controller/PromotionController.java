package com.flix.catalog.api.controller;

import com.flix.catalog.common.dto.BulkUpdateStatusRequest;
import com.flix.catalog.common.dto.PromotionRequest;
import com.flix.catalog.common.dto.PromotionResponse;
import com.flix.catalog.entity.PromotionEntity;
import com.flix.catalog.promotion.service.PromotionService;
import com.flix.common.dto.ApiResponse;
import jakarta.validation.Valid;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import lombok.extern.slf4j.Slf4j;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@Slf4j
@RestController
@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
@RequestMapping("/v1/promotions")
public class PromotionController {
    private final PromotionService promotionService;

    @GetMapping
    public ApiResponse<List<PromotionResponse>> getAllPromotions() {
        log.info("REST request to get all promotions");
        List<PromotionEntity> promotions = promotionService.getAllPromotions();

        List<PromotionResponse> response = promotions.stream()
                .map(PromotionResponse::from)
                .toList();

        return ApiResponse.success(response);
    }

    @GetMapping("/{id}")
    public ApiResponse<PromotionResponse> getPromotionById(@PathVariable("id") Long id) {
        log.info("REST request to get promotion by ID: {}", id);
        PromotionEntity promotion = promotionService.getPromotionById(id);
        return ApiResponse.success(PromotionResponse.from(promotion));
    }

    @PostMapping
    public ApiResponse<PromotionResponse> createPromotion(@Valid @RequestBody PromotionRequest request) {
        log.info("REST request to create promotion");
        PromotionEntity createdPromotion = promotionService.createPromotion(request);
        return ApiResponse.success(PromotionResponse.from(createdPromotion));
    }

    @PutMapping("/{id}")
    public ApiResponse<PromotionResponse> updatePromotion(
            @PathVariable("id") Long id,
            @Valid @RequestBody PromotionRequest request) {
        log.info("REST request to update promotion with ID: {}", id);
        PromotionEntity updatedPromotion = promotionService.updatePromotion(id, request);
        return ApiResponse.success(PromotionResponse.from(updatedPromotion));
    }

    @PatchMapping("/bulk-status")
    public ApiResponse<Void> bulkUpdateStatus(@Valid @RequestBody BulkUpdateStatusRequest request) {
        log.info("REST request to bulk update promotion status");
        promotionService.bulkUpdatePromotionStatus(request);
        return ApiResponse.success(null);
    }
}