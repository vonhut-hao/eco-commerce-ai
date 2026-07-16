package com.flix.catalog.dao;

import com.flix.catalog.entity.CartItemEntity;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface CartItemRepository extends JpaRepository<CartItemEntity, Long> {
    List<CartItemEntity> findByUserId(Long userId);

    Optional<CartItemEntity> findByUserIdAndProductId(Long userId, Long productId);

    Optional<CartItemEntity> findByIdAndUserId(Long id, Long userId);

    void deleteByUserId(Long userId);
}
