package com.flix.statistic.dao;

import com.flix.catalog.entity.ProductEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.math.BigDecimal;

@Repository
public interface RevenueStatisticsDao extends JpaRepository<ProductEntity, Long> {

    @Query(value = """
            SELECT COALESCE(SUM(total_amount), 0) 
            FROM orders 
            WHERE status = 'COMPLETED' 
              AND (:day IS NULL OR DAY(created_at) = :day) 
              AND (:month IS NULL OR MONTH(created_at) = :month) 
              AND (:year IS NULL OR YEAR(created_at) = :year)
            """, nativeQuery = true)
    BigDecimal getRevenueByFlexibleDate(
            @Param("day") Integer day,
            @Param("month") Integer month,
            @Param("year") Integer year
    );
}