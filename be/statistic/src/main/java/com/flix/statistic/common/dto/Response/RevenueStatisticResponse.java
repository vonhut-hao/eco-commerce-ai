package com.flix.statistic.common.dto.Response;

import java.math.BigDecimal;

public record RevenueStatisticResponse(
        Integer day,
        Integer month,
        Integer year,
        BigDecimal totalRevenue
) {
    public static RevenueStatisticResponse of(Integer day, Integer month, Integer year, Long totalOrders, BigDecimal totalRevenue) {
        return new RevenueStatisticResponse(
                day,
                month,
                year,
                totalRevenue != null ? totalRevenue : BigDecimal.ZERO
        );
    }
}