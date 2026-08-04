package com.flix.catalog.common.dto;

import com.flix.catalog.entity.PaymentMethodEntity;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

public record PaymentMethodRequest(
        @NotBlank(message = "Method name must not be blank")
        @Size(max = 50, message = "Method name must not exceed 50 characters")
        String methodName,
        Boolean isActive
) {
    public void toEntity(PaymentMethodEntity entity) {
        if (methodName != null) {
            entity.setMethodName(methodName);
        }
        if (isActive != null) {
            entity.setIsActive(isActive);
        }
    }
}
