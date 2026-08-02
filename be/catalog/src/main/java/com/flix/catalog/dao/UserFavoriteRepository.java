package com.flix.catalog.dao;

import com.flix.catalog.entity.UserFavoriteEntity;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;
import java.util.Optional;

public interface UserFavoriteRepository extends JpaRepository<UserFavoriteEntity, Long> {
    Optional<UserFavoriteEntity> findByUserIdAndProductId(Long userId, Long productId);

    boolean existsByUserIdAndProductId(Long userId, Long productId);

    Page<UserFavoriteEntity> findByUserId(Long userId, Pageable pageable);

    void deleteByUserIdAndProductId(Long userId, Long productId);

    @Query("""
             SELECT f.product.id 
             FROM UserFavoriteEntity f 
             WHERE f.user.id = :userId 
                AND f.product.id IN :productIds
           """)
    List<Long> findFavoritedProductIdsByUserIdAndProductIdIn(@Param("userId") Long userId, @Param("productIds") List<Long> productIds);
}
