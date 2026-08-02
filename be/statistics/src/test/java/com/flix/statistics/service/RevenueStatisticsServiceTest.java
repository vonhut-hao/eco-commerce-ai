package com.flix.statistics.service;

import com.flix.catalog.dao.OrderRepository;
import com.flix.catalog.entity.OrderStatus;
import com.flix.statistics.common.dto.RevenueStatisticResponse;
import com.flix.statistics.common.enums.RevenuePeriodType;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertNotNull;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.eq;
import static org.mockito.Mockito.when;

@ExtendWith(MockitoExtension.class)
class RevenueStatisticsServiceTest {

    @Mock
    private OrderRepository orderRepository;

    private RevenueStatisticsService revenueStatisticsService;

    @BeforeEach
    void setUp() {
        revenueStatisticsService = new RevenueStatisticsService(orderRepository);
    }

    @Test
    @DisplayName("Should compute correct date range for DAILY period")
    void testGetProductRevenue_Daily() {
        LocalDate date = LocalDate.of(2026, 8, 2);
        when(orderRepository.calculateTotalRevenue(any(), any(), eq(OrderStatus.COMPLETED)))
                .thenReturn(BigDecimal.valueOf(150000));

        RevenueStatisticResponse response = revenueStatisticsService.getProductRevenue(RevenuePeriodType.DAILY, date);

        assertNotNull(response);
        assertEquals(RevenuePeriodType.DAILY, response.periodType());
        assertEquals(date, response.date());
        assertEquals(LocalDateTime.of(2026, 8, 2, 0, 0, 0, 0), response.fromDate());
        assertEquals(LocalDateTime.of(2026, 8, 2, 23, 59, 59, 999999999), response.toDate());
        assertEquals(BigDecimal.valueOf(150000), response.totalRevenue());
    }

    @Test
    @DisplayName("Should compute correct date range for MONTHLY period")
    void testGetProductRevenue_Monthly() {
        LocalDate date = LocalDate.of(2026, 8, 15);
        when(orderRepository.calculateTotalRevenue(any(), any(), eq(OrderStatus.COMPLETED)))
                .thenReturn(BigDecimal.valueOf(5000000));

        RevenueStatisticResponse response = revenueStatisticsService.getProductRevenue(RevenuePeriodType.MONTHLY, date);

        assertNotNull(response);
        assertEquals(RevenuePeriodType.MONTHLY, response.periodType());
        assertEquals(date, response.date());
        assertEquals(LocalDateTime.of(2026, 8, 1, 0, 0, 0, 0), response.fromDate());
        assertEquals(LocalDateTime.of(2026, 8, 31, 23, 59, 59, 999999999), response.toDate());
        assertEquals(BigDecimal.valueOf(5000000), response.totalRevenue());
    }

    @Test
    @DisplayName("Should compute correct date range for YEARLY period")
    void testGetProductRevenue_Yearly() {
        LocalDate date = LocalDate.of(2026, 5, 20);
        when(orderRepository.calculateTotalRevenue(any(), any(), eq(OrderStatus.COMPLETED)))
                .thenReturn(BigDecimal.valueOf(60000000));

        RevenueStatisticResponse response = revenueStatisticsService.getProductRevenue(RevenuePeriodType.YEARLY, date);

        assertNotNull(response);
        assertEquals(RevenuePeriodType.YEARLY, response.periodType());
        assertEquals(date, response.date());
        assertEquals(LocalDateTime.of(2026, 1, 1, 0, 0, 0, 0), response.fromDate());
        assertEquals(LocalDateTime.of(2026, 12, 31, 23, 59, 59, 999999999), response.toDate());
        assertEquals(BigDecimal.valueOf(60000000), response.totalRevenue());
    }
}
