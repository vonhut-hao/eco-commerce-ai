package com.flix.statistics.common.enums;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.LocalTime;
import java.time.temporal.TemporalAdjusters;
import java.util.Objects;

public enum StatisticPeriodType {
    DAILY,
    MONTHLY,
    YEARLY;

    public static StatisticPeriodType getDAILYByDefault(StatisticPeriodType periodType) {
        return Objects.requireNonNullElse(periodType, DAILY);
    }

    public LocalDateTime calculateFromDate(LocalDate date) {
        return switch (this) {
            case MONTHLY -> date.with(TemporalAdjusters.firstDayOfMonth()).atStartOfDay();
            case YEARLY -> date.with(TemporalAdjusters.firstDayOfYear()).atStartOfDay();
            case DAILY -> date.atStartOfDay();
        };
    }

    public LocalDateTime calculateToDate(LocalDate date) {
        return switch (this) {
            case MONTHLY -> date.with(TemporalAdjusters.lastDayOfMonth()).atTime(LocalTime.MAX);
            case YEARLY -> date.with(TemporalAdjusters.lastDayOfYear()).atTime(LocalTime.MAX);
            case DAILY -> date.atTime(LocalTime.MAX);
        };
    }
}
