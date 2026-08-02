package com.flix.statistics.common.enums;

import java.util.Objects;

public enum RevenuePeriodType {
    DAILY,
    MONTHLY,
    YEARLY;

    public static RevenuePeriodType getDAILYByDefault(RevenuePeriodType revenuePeriodType) {
        return Objects.requireNonNullElse(revenuePeriodType, DAILY);
    }
}
