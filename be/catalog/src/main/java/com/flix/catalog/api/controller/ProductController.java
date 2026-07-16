package com.flix.catalog.api.controller;

import com.flix.catalog.common.dto.ProductEntityRequest;
import com.flix.catalog.common.dto.ProductEntityResponse;
import com.flix.catalog.common.dto.ProductSimpleResponse;
import com.flix.catalog.product.service.ProductService;
import com.flix.common.dto.ApiResponse;
import jakarta.validation.Valid;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.http.HttpStatus;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

@RestController
@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
@RequestMapping("/v1/catalog/products")
public class ProductController {
    ProductService productService;

    @PostMapping(value = {"", "/{id}"})
    @ResponseStatus(HttpStatus.OK)
    @PreAuthorize("hasRole('ADMIN')")
    public ApiResponse<ProductEntityResponse> createOrUpdateProduct(
            @PathVariable(value = "id", required = false) Long id,
            @Valid @RequestBody ProductEntityRequest request) {
        return ApiResponse.success(productService.createOrUpdateProduct(id, request));
    }

    @GetMapping
    @ResponseStatus(HttpStatus.OK)
    public ApiResponse<Page<ProductSimpleResponse>> listProducts(
            @RequestParam(value = "page", defaultValue = "0") int page,
            @RequestParam(value = "size", defaultValue = "10") int size) {
        return ApiResponse.success(productService.listProducts(PageRequest.of(page, size)));
    }

    @GetMapping("/{id}")
    @ResponseStatus(HttpStatus.OK)
    public ApiResponse<ProductEntityResponse> getProductDetail(@PathVariable("id") Long id) {
        return ApiResponse.success(productService.getProductDetail(id));
    }

    @DeleteMapping("/{id}")
    @ResponseStatus(HttpStatus.OK)
    @PreAuthorize("hasRole('ADMIN')")
    public void deleteProduct(@PathVariable("id") Long id) {
        productService.deleteProduct(id);
    }
}
