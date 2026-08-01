package com.flix.statistic.common.dto;

import java.math.BigDecimal;

public interface RevenueStatisticDto {
    Integer getYear();         // Hứng cột YEAR
    Integer getMonth();        // Hứng cột MONTH
    Integer getDay();          // Hứng cột DAY
    BigDecimal getTotalRevenue(); // Hứng cột tổng doanh thu
}
