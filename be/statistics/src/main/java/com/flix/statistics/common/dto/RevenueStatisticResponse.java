package com.flix.statistics.common.dto;

import com.flix.statistics.common.enums.RevenuePeriodType;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;

public record RevenueStatisticResponse(
        RevenuePeriodType periodType,
        LocalDate date,
        LocalDateTime fromDate,
        LocalDateTime toDate,
        BigDecimal totalRevenue
) {

    public static RevenueStatisticResponse of(
            RevenuePeriodType periodType,
            LocalDate date,
            LocalDateTime fromDate,
            LocalDateTime toDate,
            BigDecimal totalRevenue
    ) {
        return new RevenueStatisticResponse(
                periodType,
                date,
                fromDate,
                toDate,
                totalRevenue != null ? totalRevenue : BigDecimal.ZERO
        );
    }
}