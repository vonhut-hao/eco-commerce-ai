package com.flix.catalog.common.dto;

import com.flix.catalog.entity.OrderStatus;
import com.flix.catalog.enums.PaymentStatus;

public record OrderRequest(
        Long paymentMethodId,
        Long promotionId,
        OrderStatus status,
        PaymentStatus paymentStatus
) {
}
