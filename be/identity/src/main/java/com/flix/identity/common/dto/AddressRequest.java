package com.flix.identity.common.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

public record AddressRequest(
        @NotBlank(message = "Recipient name is required")
        @Size(max = 100, message = "Recipient name must not exceed 100 characters")
        String recipientName,

        @NotBlank(message = "Phone number is required")
        @Size(max = 20, message = "Phone number must not exceed 20 characters")
        String phoneNumber,

        @NotBlank(message = "Full address is required")
        @Size(max = 255, message = "Full address must not exceed 255 characters")
        String fullAddress,

        Boolean isDefault
) {
}
