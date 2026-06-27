package com.flix.catalog.material.service;

import com.flix.catalog.common.dto.MaterialEntityRequest;
import com.flix.catalog.common.dto.MaterialEntityResponse;
import com.flix.catalog.dao.MaterialRepository;
import com.flix.catalog.entity.MaterialEntity;
import com.flix.common.enums.ErrorCode;
import com.flix.common.exception.BusinessException;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
@Slf4j
public class MaterialService {
    private final MaterialRepository materialRepository;

    public MaterialEntityResponse createOrUpdateMaterial(MaterialEntityRequest request) {
        MaterialEntity materialEntity;
        if (request.id() != null) {
            materialEntity = materialRepository.findById(request.id())
                    .orElseThrow(() -> new BusinessException(ErrorCode.MATERIAL_NOT_FOUND));
            log.info("Updated material with ID: {}", request.id());
        } else {
            materialEntity = new MaterialEntity();
            log.info("Created material with name: {}", request.name());
        }

        request.toEntity(materialEntity);

        var savedMaterial = materialRepository.save(materialEntity);
        return MaterialEntityResponse.from(savedMaterial);
    }

    public List<MaterialEntityResponse> listMaterials() {
        log.info("List all materials");
        return materialRepository.findAll().stream()
                .map(MaterialEntityResponse::from)
                .toList();
    }

    public void deleteMaterial(Long id) {
        if (id == null) {
            throw new BusinessException(ErrorCode.MATERIAL_NOT_FOUND);
        }
        var materialEntity = materialRepository.findById(id)
                .orElseThrow(() -> new BusinessException(ErrorCode.MATERIAL_NOT_FOUND));
        materialRepository.delete(materialEntity);
        log.info("Deleted material with ID: {}", id);
    }
}
