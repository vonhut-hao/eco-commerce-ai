package com.flix.catalog.common.dto;

import com.flix.catalog.entity.OrderStatus;

public record OrderRequest(
        Long paymentMethodId,
        OrderStatus status
) {
}
