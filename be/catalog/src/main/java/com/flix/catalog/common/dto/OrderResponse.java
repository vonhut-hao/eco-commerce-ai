package com.flix.catalog.common.dto;

import com.fasterxml.jackson.annotation.JsonInclude;
import com.flix.catalog.entity.OrderEntity;

import java.util.List;

@JsonInclude(JsonInclude.Include.NON_NULL)
public record OrderResponse(
        Long id,
        Long totalAmount,
        String status,
        String paymentStatus,
        Long userId,
        String username,
        Long paymentMethodId,
        String paymentMethodName,
        String createdAt,
        Long promotionId,
        Integer totalGreenPoints,
        List<OrderItemResponse> orderItems
) {
    public static OrderResponse from(OrderEntity entity) {
        if (entity == null) {
            return null;
        }

        int totalGreenPoints = 0;
        if (entity.getOrderItems() != null) {
            for (var item : entity.getOrderItems()) {
                if (item.getProductEntity() != null && item.getProductEntity().getGreenPoints() != null) {
                    totalGreenPoints += item.getProductEntity().getGreenPoints() * item.getQuantity();
                }
            }
        }

        return new OrderResponse(
                entity.getId(),
                entity.getTotalAmount(),
                entity.getStatus() != null ? entity.getStatus().name() : null,
                entity.getPaymentStatus() != null ? entity.getPaymentStatus().name() : null,
                entity.getUser() != null ? entity.getUser().getId() : null,
                entity.getUser() != null ? entity.getUser().getUsername() : null,
                entity.getPaymentMethodEntity() != null ? entity.getPaymentMethodEntity().getId() : null,
                entity.getPaymentMethodEntity() != null ? entity.getPaymentMethodEntity().getMethodName() : null,
                entity.getCreatedAt() != null ? entity.getCreatedAt().toString() : null,
                entity.getPromotion() != null ? entity.getPromotion().getId() : null,
                totalGreenPoints,
                entity.getOrderItems() != null ? entity.getOrderItems().stream()
                                                 .map(OrderItemResponse::from)
                                                 .toList() : List.of()
        );
    }
}