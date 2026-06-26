package com.flix.catalog.dao;

import com.flix.catalog.entity.ProductEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

import java.util.List;
import java.util.Optional;

public interface ProductRepository extends JpaRepository<ProductEntity, Long> {
    Page<ProductEntity> findByDeletedAtIsNull(Pageable pageable);

    Page<ProductEntity> findByDeletedAtIsNullAndStockIsGreaterThan(Pageable pageable, int stockThreshold);

    Optional<ProductEntity> findByIdAndDeletedAtIsNull(Long id);
}