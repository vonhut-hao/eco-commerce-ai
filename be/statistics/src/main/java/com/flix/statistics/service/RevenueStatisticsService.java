package com.flix.statistics.service;

import com.flix.catalog.dao.OrderRepository;
import com.flix.catalog.entity.OrderStatus;
import com.flix.common.enums.ErrorCode;
import com.flix.common.exception.BusinessException;
import com.flix.statistics.common.dto.RevenueStatisticResponse;
import com.flix.statistics.common.enums.RevenuePeriodType;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.LocalTime;
import java.time.temporal.TemporalAdjusters;

import static com.flix.statistics.common.enums.RevenuePeriodType.getDAILYByDefault;

@Service
@RequiredArgsConstructor
@Slf4j
public class RevenueStatisticsService {

    private final OrderRepository orderRepository;

    @Transactional(readOnly = true)
    public RevenueStatisticResponse getProductRevenue(RevenuePeriodType periodType, LocalDate date) {
        RevenuePeriodType selectedPeriod = getDAILYByDefault(periodType);

        LocalDateTime fromDate = null;
        LocalDateTime toDate = null;

        switch (selectedPeriod) {
            case MONTHLY -> {
                fromDate = date.with(TemporalAdjusters.firstDayOfMonth()).atStartOfDay();
                toDate = date.with(TemporalAdjusters.lastDayOfMonth()).atTime(LocalTime.MAX);
            }
            case YEARLY -> {
                fromDate = date.with(TemporalAdjusters.firstDayOfYear()).atStartOfDay();
                toDate = date.with(TemporalAdjusters.lastDayOfYear()).atTime(LocalTime.MAX);
            }
            case DAILY -> {
                fromDate = date.atStartOfDay();
                toDate = date.atTime(LocalTime.MAX);
            }
        }

        BigDecimal totalRevenue = orderRepository.calculateTotalRevenue(
                fromDate,
                toDate,
                OrderStatus.COMPLETED
        );

        return RevenueStatisticResponse.of(
                selectedPeriod,
                date,
                fromDate,
                toDate,
                totalRevenue
        );
    }
}