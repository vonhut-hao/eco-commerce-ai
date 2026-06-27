package com.flix.catalog.common.dto;

import com.fasterxml.jackson.annotation.JsonInclude;
import com.flix.catalog.entity.GreenCertificateEntity;

import java.time.LocalDate;

@JsonInclude(JsonInclude.Include.NON_NULL)
public record GreenCertificateEntityResponse(
        Long id,
        String name,
        String issuer,
        LocalDate issueDate,
        String imageUrl,
        Long productId,
        String productName
) {
    public static GreenCertificateEntityResponse from(GreenCertificateEntity entity) {
        if (entity == null) {
            return null;
        }

        Long productId = null;
        if (entity.getProductEntity() != null) {
            productId = entity.getProductEntity().getId();
        }

        String productName = null;
        if (entity.getProductEntity() != null) {
            productName = entity.getProductEntity().getName();
        }

        return new GreenCertificateEntityResponse(
                entity.getId(),
                entity.getName(),
                entity.getIssuer(),
                entity.getIssueDate(),
                entity.getImageUrl(),
                productId,
                productName
        );
    }
}
