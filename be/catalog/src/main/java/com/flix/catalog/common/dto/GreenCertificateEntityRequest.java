package com.flix.catalog.common.dto;

import com.flix.catalog.entity.GreenCertificateEntity;
import com.flix.catalog.entity.ProductEntity;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;

import java.time.LocalDate;

public record GreenCertificateEntityRequest(
        Long id,
        @NotBlank String name,
        @NotBlank String issuer,
        @NotNull LocalDate issueDate,
        @Size(max = 255) String imageUrl,
        @NotNull Long productId
) {

    public void toEntity(GreenCertificateEntity entity, ProductEntity productEntity) {
        entity.setName(name);
        entity.setIssuer(issuer);
        entity.setIssueDate(issueDate);
        entity.setImageUrl(imageUrl);
        entity.setProductEntity(productEntity);
    }
}
