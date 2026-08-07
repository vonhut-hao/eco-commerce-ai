package com.flix.catalog.common.dto;

import com.flix.catalog.entity.OrderEntity;
import com.flix.catalog.entity.OrderItemEntity;

import java.time.LocalDateTime;
import java.util.List;

public record InvoiceDataDto(
        Long orderId,
        LocalDateTime createdAt,
        String status,
        String customerUsername,
        String customerEmail,
        String paymentMethodName,
        Long totalAmount,
        Double totalCarbonFootprint,
        List<InvoiceItemDto> items
) {
    public record InvoiceItemDto(
            Long productId,
            String productName,
            int quantity,
            Long unitPrice,
            Long totalAmount,
            Double lineCarbonFootprint
    ) {
        public static InvoiceItemDto from(OrderItemEntity item) {
            String name = item.getProductEntity() != null ? item.getProductEntity().getName() : "Product #" + item.getId();
            Long totalAmountItem = item.getPrice() != null ? item.getPrice() : 0L;
            Long unitPriceItem = item.getQuantity() > 0 ? totalAmountItem / item.getQuantity() : 0L;
            Double carbon = item.getLineCarbonFootprint() != null ? item.getLineCarbonFootprint() : 0.0;

            return new InvoiceItemDto(
                    item.getProductEntity() != null ? item.getProductEntity().getId() : null,
                    name,
                    item.getQuantity(),
                    unitPriceItem,
                    totalAmountItem,
                    carbon
            );
        }
    }

    public static InvoiceDataDto from(OrderEntity order) {
        if (order == null) {
            return null;
        }

        String username = order.getUser() != null ? order.getUser().getUsername() : "N/A";
        String email = order.getUser() != null ? order.getUser().getEmail() : "N/A";
        String paymentMethod = order.getPaymentMethodEntity() != null ? order.getPaymentMethodEntity().getMethodName() : "Standard Payment";

        List<InvoiceItemDto> itemList = order.getOrderItems() != null
                ? order.getOrderItems().stream().map(InvoiceItemDto::from).toList()
                : List.of();

        double totalCarbon = itemList.stream()
                .mapToDouble(InvoiceItemDto::lineCarbonFootprint)
                .sum();

        return new InvoiceDataDto(
                order.getId(),
                order.getCreatedAt(),
                order.getStatus() != null ? order.getStatus().name() : "PENDING",
                username,
                email,
                paymentMethod,
                order.getTotalAmount() != null ? order.getTotalAmount() : 0L,
                totalCarbon,
                itemList
        );
    }
}
