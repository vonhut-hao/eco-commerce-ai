package com.flix.catalog.greencert.service;

import com.flix.catalog.common.dto.GreenCertificateEntityRequest;
import com.flix.catalog.common.dto.GreenCertificateEntityResponse;
import com.flix.catalog.dao.GreenCertificateRepository;
import com.flix.catalog.dao.ProductRepository;
import com.flix.catalog.entity.GreenCertificateEntity;
import com.flix.common.enums.ErrorCode;
import com.flix.common.exception.BusinessException;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
@Slf4j
public class GreenCertificateService {
    private final GreenCertificateRepository greenCertificateRepository;
    private final ProductRepository productRepository;

    public GreenCertificateEntityResponse createOrUpdateGreenCertificate(GreenCertificateEntityRequest request) {
        var productEntity = productRepository.findById(request.productId())
                .orElseThrow(() -> new BusinessException(ErrorCode.PRODUCT_NOT_FOUND));

        GreenCertificateEntity greenCertificateEntity;
        if (request.id() != null) {
            greenCertificateEntity = greenCertificateRepository.findById(request.id())
                    .orElseThrow(() -> new BusinessException(ErrorCode.CERTIFICATE_NOT_FOUND));
            log.info("Updated green certificate with ID: {}", request.id());
        } else {
            greenCertificateEntity = new GreenCertificateEntity();
            log.info("Created green certificate with name: {}", request.name());
        }

        request.toEntity(greenCertificateEntity, productEntity);

        var savedCertificate = greenCertificateRepository.save(greenCertificateEntity);

        return GreenCertificateEntityResponse.from(savedCertificate);
    }

    public List<GreenCertificateEntityResponse> listGreenCertificates() {
        log.info("List all green certificates");
        var certificateEntities = greenCertificateRepository.findByDeletedAtIsNull();
        return certificateEntities.stream()
                .map(GreenCertificateEntityResponse::from)
                .toList();
    }

    public void deleteGreenCertificate(Long id) {
        if (id == null) {
            throw new BusinessException(ErrorCode.CERTIFICATE_NOT_FOUND);
        }

        var entityToDelete = greenCertificateRepository.findById(id)
                .orElseThrow(() -> new BusinessException(ErrorCode.CERTIFICATE_NOT_FOUND));
        entityToDelete.setDeletedAt(java.time.LocalDateTime.now());
        greenCertificateRepository.save(entityToDelete);
        log.info("Deleted green certificate with ID: {}", entityToDelete.getId());
    }
}
