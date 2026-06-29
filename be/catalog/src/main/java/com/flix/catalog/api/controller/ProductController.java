package com.flix.catalog.api.controller;

import com.flix.catalog.common.dto.ProductEntityRequest;
import com.flix.catalog.common.dto.ProductEntityResponse;
import com.flix.catalog.product.service.ProductService;
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
@RequestMapping("/v1/catalog/products")
public class ProductController {
    ProductService productService;

    @PostMapping
    @ResponseStatus(HttpStatus.OK)
    @PreAuthorize("hasRole('ADMIN')")
    public ApiResponse<ProductEntityResponse> createOrUpdateProduct(@Valid @RequestBody ProductEntityRequest request) {
        return ApiResponse.success(productService.createOrUpdateProduct(request));
    }

    @GetMapping
    @ResponseStatus(HttpStatus.OK)
    public ApiResponse<List<ProductEntityResponse>> listProducts() {
        return ApiResponse.success(productService.listProducts());
    }

    @DeleteMapping("/{id}")
    @ResponseStatus(HttpStatus.OK)
    @PreAuthorize("hasRole('ADMIN')")
    public void deleteProduct(@PathVariable("id") Long id) {
        productService.deleteProduct(id);
    }
}
