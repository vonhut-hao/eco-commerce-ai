package com.flix.statistics.service;

import com.flix.catalog.dao.OrderItemRepository;
import com.flix.catalog.entity.OrderStatus;
import com.flix.statistics.common.dto.StatisticResponse;
import com.flix.statistics.common.enums.StatisticPeriodType;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.time.LocalDateTime;

import static com.flix.statistics.common.enums.StatisticPeriodType.getDAILYByDefault;

@Service
@RequiredArgsConstructor
@Slf4j
public class CarbonStatisticService {

    private final OrderItemRepository orderItemRepository;

    @Transactional(readOnly = true)
    public StatisticResponse<Double> getProductCarbonIndex(StatisticPeriodType periodType, LocalDate date, Long userId) {
        StatisticPeriodType selectedPeriod = getDAILYByDefault(periodType);
        LocalDate targetDate = date != null ? date : LocalDate.now();

        LocalDateTime fromDate = selectedPeriod.calculateFromDate(targetDate);
        LocalDateTime toDate = selectedPeriod.calculateToDate(targetDate);

        log.info("Calculating carbon index for user {} and period {}: fromDate:{} toDate:{}", userId, selectedPeriod, fromDate, toDate);

        Double totalCarbonIndex = orderItemRepository.calculateTotalCarbonFootprint(
                userId,
                fromDate,
                toDate,
                OrderStatus.CANCELLED
        );

        log.info("Total carbon index for user {} in period {}: {}", userId, selectedPeriod, totalCarbonIndex);

        return new StatisticResponse<>(
                selectedPeriod,
                targetDate,
                fromDate,
                toDate,
                totalCarbonIndex
        );
    }
}
