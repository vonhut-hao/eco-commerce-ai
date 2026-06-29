package com.flix.catalog.api.controller;

import com.flix.catalog.category.service.CategoryService;
import com.flix.catalog.common.dto.CategoryEntityRequest;
import com.flix.catalog.common.dto.CategoryEntityResponse;
import com.flix.common.dto.ApiResponse;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequiredArgsConstructor
@RequestMapping("/v1/catalog/categories")
public class CategoryController {
    private final CategoryService categoryService;

    @PostMapping
    @ResponseStatus(HttpStatus.OK)
    @PreAuthorize("hasRole('ADMIN')")
    public ApiResponse<CategoryEntityResponse> createOrUpdateCategory(@Valid @RequestBody CategoryEntityRequest request) {
        return ApiResponse.success(categoryService.createOrUpdateCategory(request));
    }

    @GetMapping
    @ResponseStatus(HttpStatus.OK)
    public ApiResponse<List<CategoryEntityResponse>> listCategories() {
        return ApiResponse.success(categoryService.listCategories());
    }

    @DeleteMapping("/{id}")
    @ResponseStatus(HttpStatus.OK)
    @PreAuthorize("hasRole('ADMIN')")
    public void deleteCategory(@PathVariable("id") Long id) {
        categoryService.deleteCategory(id);
    }
}
