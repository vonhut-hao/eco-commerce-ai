package com.flix.catalog.common.dto;

import com.fasterxml.jackson.annotation.JsonInclude;
import com.flix.catalog.entity.OrderEntity;

import java.util.List;

@JsonInclude(JsonInclude.Include.NON_NULL)
public record OrderResponse(
        Long id,
        Long totalAmount,
        String status,
        Long userId,
        String username,
        Long paymentMethodId,
        String paymentMethodName,
        String createdAt,
        List<OrderItemResponse> orderItems
) {
    public static OrderResponse from(OrderEntity entity) {
        if (entity == null) {
            return null;
        }

        return new OrderResponse(
                entity.getId(),
                entity.getTotalAmount(),
                entity.getStatus().name(),
                entity.getUser().getId(),
                entity.getUser().getUsername(),
                entity.getPaymentMethodEntity().getId(),
                entity.getPaymentMethodEntity().getMethodName(),
                entity.getCreatedAt() != null ? entity.getCreatedAt().toString() : null,
                entity.getOrderItems().stream()
                        .map(OrderItemResponse::from)
                        .toList()
        );
    }
}
