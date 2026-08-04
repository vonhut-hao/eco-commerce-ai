package com.flix.statistics.common.dto;

import com.flix.statistics.common.enums.StatisticPeriodType;

import java.time.LocalDate;
import java.time.LocalDateTime;

public record StatisticResponse<T>(
        StatisticPeriodType periodType,
        LocalDate date,
        LocalDateTime fromDate,
        LocalDateTime toDate,
        T total
) {
}