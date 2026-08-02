package com.flix.identity.common.dto;

import com.flix.identity.entity.AddressesEntity;

public record AddressResponse(
        Long id,
        String recipientName,
        String phoneNumber,
        String fullAddress,
        Boolean isDefault
) {
    public static AddressResponse from(AddressesEntity entity) {
        return new AddressResponse(
                entity.getId(),
                entity.getRecipientName(),
                entity.getPhoneNumber(),
                entity.getFullAddress(),
                Boolean.TRUE.equals(entity.getIsDefault())
        );
    }
}
