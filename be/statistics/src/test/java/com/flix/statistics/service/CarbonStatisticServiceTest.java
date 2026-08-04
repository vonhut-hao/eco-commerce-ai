package com.flix.statistics.service;

import com.flix.catalog.dao.OrderItemRepository;
import com.flix.catalog.entity.OrderStatus;
import com.flix.statistics.common.dto.StatisticResponse;
import com.flix.statistics.common.enums.StatisticPeriodType;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.time.LocalDate;
import java.time.LocalDateTime;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertNotNull;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.eq;
import static org.mockito.Mockito.when;

@ExtendWith(MockitoExtension.class)
class CarbonStatisticServiceTest {

    @Mock
    private OrderItemRepository orderItemRepository;

    private CarbonStatisticService carbonStatisticService;

    private static final Long TEST_USER_ID = 100L;

    @BeforeEach
    void setUp() {
        carbonStatisticService = new CarbonStatisticService(orderItemRepository);
    }

    @Test
    @DisplayName("Should compute correct date range and pass userId for DAILY period")
    void testGetProductCarbonIndex_Daily() {
        LocalDate date = LocalDate.of(2026, 8, 2);
        when(orderItemRepository.calculateTotalCarbonFootprint(eq(TEST_USER_ID), any(), any(), eq(OrderStatus.COMPLETED)))
                .thenReturn(12.5);

        StatisticResponse<Double> response = carbonStatisticService.getProductCarbonIndex(StatisticPeriodType.DAILY, date, TEST_USER_ID);

        assertNotNull(response);
        assertEquals(StatisticPeriodType.DAILY, response.periodType());
        assertEquals(date, response.date());
        assertEquals(LocalDateTime.of(2026, 8, 2, 0, 0, 0, 0), response.fromDate());
        assertEquals(LocalDateTime.of(2026, 8, 2, 23, 59, 59, 999999999), response.toDate());
        assertEquals(12.5, response.total());
    }

    @Test
    @DisplayName("Should compute correct date range and pass userId for MONTHLY period")
    void testGetProductCarbonIndex_Monthly() {
        LocalDate date = LocalDate.of(2026, 8, 15);
        when(orderItemRepository.calculateTotalCarbonFootprint(eq(TEST_USER_ID), any(), any(), eq(OrderStatus.COMPLETED)))
                .thenReturn(350.0);

        StatisticResponse<Double> response = carbonStatisticService.getProductCarbonIndex(StatisticPeriodType.MONTHLY, date, TEST_USER_ID);

        assertNotNull(response);
        assertEquals(StatisticPeriodType.MONTHLY, response.periodType());
        assertEquals(date, response.date());
        assertEquals(LocalDateTime.of(2026, 8, 1, 0, 0, 0, 0), response.fromDate());
        assertEquals(LocalDateTime.of(2026, 8, 31, 23, 59, 59, 999999999), response.toDate());
        assertEquals(350.0, response.total());
    }

    @Test
    @DisplayName("Should compute correct date range and pass userId for YEARLY period")
    void testGetProductCarbonIndex_Yearly() {
        LocalDate date = LocalDate.of(2026, 5, 20);
        when(orderItemRepository.calculateTotalCarbonFootprint(eq(TEST_USER_ID), any(), any(), eq(OrderStatus.COMPLETED)))
                .thenReturn(4200.0);

        StatisticResponse<Double> response = carbonStatisticService.getProductCarbonIndex(StatisticPeriodType.YEARLY, date, TEST_USER_ID);

        assertNotNull(response);
        assertEquals(StatisticPeriodType.YEARLY, response.periodType());
        assertEquals(date, response.date());
        assertEquals(LocalDateTime.of(2026, 1, 1, 0, 0, 0, 0), response.fromDate());
        assertEquals(LocalDateTime.of(2026, 12, 31, 23, 59, 59, 999999999), response.toDate());
        assertEquals(4200.0, response.total());
    }
}
