package com.flix.catalog.api.controller;

import com.flix.catalog.common.dto.MaterialEntityRequest;
import com.flix.catalog.common.dto.MaterialEntityResponse;
import com.flix.catalog.material.service.MaterialService;
import com.flix.common.dto.ApiResponse;
import jakarta.validation.Valid;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import org.springframework.http.HttpStatus;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
@RequestMapping("/v1/catalog/materials")
public class MaterialController {
    MaterialService materialService;

    @PostMapping
    @ResponseStatus(HttpStatus.OK)
    @PreAuthorize("hasRole('ADMIN')")
    public ApiResponse<MaterialEntityResponse> createOrUpdateMaterial(@Valid @RequestBody MaterialEntityRequest request) {
        return ApiResponse.success(materialService.createOrUpdateMaterial(request));
    }

    @GetMapping
    @ResponseStatus(HttpStatus.OK)
    public ApiResponse<List<MaterialEntityResponse>> listMaterials() {
        return ApiResponse.success(materialService.listMaterials());
    }

    @DeleteMapping("/{id}")
    @ResponseStatus(HttpStatus.OK)
    @PreAuthorize("hasRole('ADMIN')")
    public void deleteMaterial(@PathVariable("id") Long id) {
        materialService.deleteMaterial(id);
    }
}
