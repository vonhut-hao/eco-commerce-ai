package com.flix.catalog.api.controller;

import com.flix.catalog.common.dto.GreenCertificateEntityRequest;
import com.flix.catalog.common.dto.GreenCertificateEntityResponse;
import com.flix.catalog.greencert.service.GreenCertificateService;
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
@RequestMapping("/v1/catalog/green-certificates")
public class GreenCertificateController {
    GreenCertificateService greenCertificateService;

    @PostMapping
    @ResponseStatus(HttpStatus.OK)
    @PreAuthorize("hasRole('ADMIN')")
    public ApiResponse<GreenCertificateEntityResponse> createOrUpdateGreenCertificate(
            @Valid @RequestBody GreenCertificateEntityRequest request
    ) {
        return ApiResponse.success(greenCertificateService.createOrUpdateGreenCertificate(request));
    }

    @GetMapping
    @ResponseStatus(HttpStatus.OK)
    public ApiResponse<List<GreenCertificateEntityResponse>> listGreenCertificates() {
        return ApiResponse.success(greenCertificateService.listGreenCertificates());
    }

    @DeleteMapping("/{id}")
    @ResponseStatus(HttpStatus.OK)
    @PreAuthorize("hasRole('ADMIN')")
    public void deleteGreenCertificate(@PathVariable("id") Long id) {
        greenCertificateService.deleteGreenCertificate(id);
    }
}
