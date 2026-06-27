package com.flix.catalog.category.service;

import com.flix.catalog.common.dto.CategoryEntityRequest;
import com.flix.catalog.common.dto.CategoryEntityResponse;
import com.flix.catalog.dao.CategoryRepository;
import com.flix.catalog.entity.CategoryEntity;
import com.flix.common.enums.ErrorCode;
import com.flix.common.exception.BusinessException;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;

@Service
@RequiredArgsConstructor
@Slf4j
public class CategoryService {
    private final CategoryRepository categoryRepository;

    public CategoryEntityResponse createOrUpdateCategory(CategoryEntityRequest request) {
        CategoryEntity categoryEntity;
        if (request.id() != null) {
            categoryEntity = categoryRepository.findById(request.id())
                    .orElseThrow(() -> new BusinessException(ErrorCode.CATEGORY_NOT_FOUND));
            log.info("Updated category with ID: {}", request.id());
        } else {
            categoryEntity = new CategoryEntity();
            log.info("Created category with name: {}", request.name());
        }

        request.toEntity(categoryEntity);

        CategoryEntity savedCategory = categoryRepository.save(categoryEntity);
        return CategoryEntityResponse.from(savedCategory);
    }

    public List<CategoryEntityResponse> listCategories() {
        log.info("List all categories");
        var categoryEntities = categoryRepository.findByDeletedAtIsNull();
        return categoryEntities.stream()
                .map(CategoryEntityResponse::from)
                .toList();
    }

    public void deleteCategory(Long id) {
        if (id == null) {
            throw new BusinessException(ErrorCode.CATEGORY_NOT_FOUND);
        }

        CategoryEntity entityToDelete = categoryRepository.findById(id)
                .orElseThrow(() -> new BusinessException(ErrorCode.CATEGORY_NOT_FOUND));
        entityToDelete.setDeletedAt(LocalDateTime.now());
        categoryRepository.save(entityToDelete);
        log.info("Deleted category with ID: {}", entityToDelete.getId());
    }

}
