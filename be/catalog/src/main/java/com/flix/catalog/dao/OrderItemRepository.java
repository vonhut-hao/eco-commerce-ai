package com.flix.catalog.dao;

import com.flix.catalog.entity.OrderItemEntity;
import com.flix.catalog.entity.OrderStatus;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.time.LocalDateTime;
import java.util.List;

public interface OrderItemRepository extends JpaRepository<OrderItemEntity, Long> {
    List<OrderItemEntity> findByOrderEntityId(Long orderId);

    @Query("""
            SELECT COALESCE(SUM(oi.lineCarbonFootprint), 0.0)
            FROM OrderItemEntity oi
            WHERE oi.orderEntity.user.id = :userId
              AND oi.orderEntity.status != :excludedStatus
              AND oi.orderEntity.createdAt >= :fromDate
              AND oi.orderEntity.createdAt <= :toDate
            """)
    Double calculateTotalCarbonFootprint(
            @Param("userId") Long userId,
            @Param("fromDate") LocalDateTime fromDate,
            @Param("toDate") LocalDateTime toDate,
            @Param("excludedStatus") OrderStatus excludedStatus
    );
}

