package com.flix.catalog.product.service;

import com.flix.catalog.common.dto.ProductEntityRequest;
import com.flix.catalog.common.dto.ProductEntityResponse;
import com.flix.catalog.common.dto.ProductSimpleResponse;
import com.flix.catalog.dao.CategoryRepository;
import com.flix.catalog.dao.MaterialRepository;
import com.flix.catalog.dao.ProductRepository;
import com.flix.catalog.entity.CategoryEntity;
import com.flix.catalog.entity.MaterialEntity;
import com.flix.catalog.entity.ProductEntity;
import com.flix.common.enums.ErrorCode;
import com.flix.common.exception.BusinessException;
import com.flix.common.util.SecurityUtils;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.HashSet;
import java.util.List;
import java.util.Map;
import java.util.Set;
import java.util.function.Function;
import java.util.stream.Collectors;

import static com.flix.common.util.SecurityUtils.isAdminRole;
import static com.flix.common.util.SecurityUtils.isAdminRoleWithOutThrowException;

@Service
@RequiredArgsConstructor
@Slf4j
public class ProductService {
    private final ProductRepository productRepository;
    private final CategoryRepository categoryRepository;
    private final MaterialRepository materialRepository;

    public ProductEntityResponse createOrUpdateProduct(Long id, ProductEntityRequest request) {
        var categories = resolveCategories(request.categoryIds());
        var materials = resolveMaterials(request.materialIds());

        ProductEntity productEntity;
        if (id != null) {
            productEntity = productRepository.findById(id)
                    .orElseThrow(() -> new BusinessException(ErrorCode.PRODUCT_NOT_FOUND));
            log.info("Updated product with ID: {}", id);
        } else {
            productEntity = new ProductEntity();
            log.info("Created product with name: {}", request.name());
        }

        request.toEntity(productEntity, categories, materials);

        var savedProduct = productRepository.save(productEntity);
        return ProductEntityResponse.from(savedProduct);
    }

    public Page<ProductEntityResponse> listProducts(Pageable pageable) {
        if (isAdminRoleWithOutThrowException()) {
            log.info("Admin role has been granted");
            return productRepository.findByDeletedAtIsNull(pageable)
                    .map(ProductEntityResponse::from);
        }
        log.info("List paginated products: page={}, size={}", pageable.getPageNumber(), pageable.getPageSize());
        return productRepository.findByDeletedAtIsNullAndStockIsGreaterThan(pageable, 0)
                .map(ProductEntityResponse::from);
    }

    public ProductEntityResponse getProductDetail(Long id) {
        log.info("Get product details for ID: {}", id);
        return productRepository.findByIdAndDeletedAtIsNull(id)
                .map(ProductEntityResponse::from)
                .orElseThrow(() -> new BusinessException(ErrorCode.PRODUCT_NOT_FOUND));
    }

    public void deleteProduct(Long id) {
        if (id == null) {
            throw new BusinessException(ErrorCode.PRODUCT_NOT_FOUND);
        }
        var existingProduct = productRepository.findById(id)
                .orElseThrow(() -> new BusinessException(ErrorCode.PRODUCT_NOT_FOUND));
        existingProduct.setDeletedAt(LocalDateTime.now());
        productRepository.save(existingProduct);
        log.info("Deleted product with ID: {}", existingProduct.getId());
    }

    private Set<CategoryEntity> resolveCategories(List<Long> categoryIds) {
        if (categoryIds == null || categoryIds.isEmpty()) {
            return new HashSet<>();
        }
        var uniqueIds = categoryIds.stream().distinct().toList();
        var categories = categoryRepository.findByIdInAndDeletedAtIsNull(uniqueIds);
        if (categories.size() != uniqueIds.size()) {
            throw new BusinessException(ErrorCode.CATEGORY_NOT_FOUND);
        }
        return new HashSet<>(categories);
    }

    private List<MaterialEntity> resolveMaterials(List<Long> materialIds) {
        if (materialIds == null || materialIds.isEmpty()) {
            return List.of();
        }
        var uniqueIds = materialIds.stream().distinct().toList();
        var materials = materialRepository.findAllById(uniqueIds);
        if (materials.size() != uniqueIds.size()) {
            throw new BusinessException(ErrorCode.MATERIAL_NOT_FOUND);
        }

        Map<Long, MaterialEntity> materialMap = materials.stream()
                .collect(Collectors.toMap(MaterialEntity::getId, Function.identity()));
        return uniqueIds.stream()
                .map(materialMap::get)
                .toList();
    }
}
