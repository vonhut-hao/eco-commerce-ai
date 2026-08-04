package com.flix.catalog.common.dto;

import com.fasterxml.jackson.annotation.JsonInclude;
import com.flix.catalog.entity.PaymentMethodEntity;

@JsonInclude(JsonInclude.Include.NON_NULL)
public record PaymentMethodResponse(
        Long id,
        String methodName,
        Boolean isActive
) {
    public static PaymentMethodResponse from(PaymentMethodEntity entity) {
        if (entity == null) {
            return null;
        }
        return new PaymentMethodResponse(
                entity.getId(),
                entity.getMethodName(),
                entity.getIsActive()
        );
    }
}
