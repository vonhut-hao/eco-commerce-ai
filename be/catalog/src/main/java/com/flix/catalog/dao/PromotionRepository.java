package com.flix.catalog.dao;

import com.flix.catalog.entity.PromotionEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param; // Import thêm thư viện này

import java.util.Optional;

public interface PromotionRepository extends JpaRepository<PromotionEntity, Long> {

    @Query("SELECT p FROM PromotionEntity p WHERE p.id = :id")
    Optional<PromotionEntity> findByPromotionById(@Param("id") Long id);

    boolean existsByCode(String code);
}