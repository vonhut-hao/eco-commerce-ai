package com.flix.catalog.dao;

import com.flix.catalog.entity.OrderEntity;
import com.flix.catalog.entity.OrderStatus;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@Repository
public interface OrderRepository extends JpaRepository<OrderEntity, Long> {
    List<OrderEntity> findByUserIdOrderByIdDesc(Long userId);

    Optional<OrderEntity> findByIdAndUserId(Long id, Long userId);

    List<OrderEntity> findAllByOrderByIdDesc();

    @Query("""
            SELECT COALESCE(SUM(o.totalAmount), 0)
            FROM OrderEntity o
            WHERE o.status = :status
              AND o.createdAt >= :fromDate
              AND o.createdAt <= :toDate
            """)
    BigDecimal calculateTotalRevenue(
            @Param("fromDate") LocalDateTime fromDate,
            @Param("toDate") LocalDateTime toDate,
            @Param("status") OrderStatus status
    );
}
