package com.flix.catalog.dao;

import com.flix.catalog.entity.OrderEntity;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface OrderRepository extends JpaRepository<OrderEntity, Long> {
    List<OrderEntity> findByUserIdOrderByIdDesc(Long userId);

    Optional<OrderEntity> findByIdAndUserId(Long id, Long userId);

    List<OrderEntity> findAllByOrderByIdDesc();
}
