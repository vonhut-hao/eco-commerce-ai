package com.flix.statistic.service;

import com.flix.common.enums.ErrorCode;
import com.flix.common.exception.BusinessException;
import com.flix.statistic.dao.RevenueStatisticsDao;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.time.LocalDate;

@Service
@RequiredArgsConstructor
public class RevenueStatisticsService {

    private final RevenueStatisticsDao revenueStatisticsDao;

    public BigDecimal getRevenue(Integer day, Integer month, Integer year) {
        if (day != null && (day < 1 || day > 31)) {
            throw new BusinessException(ErrorCode.INVALID_DAY);
        }
        if (month != null && (month < 1 || month > 12)) {
            throw new BusinessException(ErrorCode.INVALID_MONTH);
        }
        if (year != null && year < 1900) {
            throw new BusinessException(ErrorCode.INVALID_YEAR);
        }
            if (day != null && month != null && year != null) {
                try {
                    LocalDate queryDate = LocalDate.of(year, month, day);
                    if (queryDate.isAfter(LocalDate.now())) {
                        throw new BusinessException(ErrorCode.FUTURE_DATE_NOT_ALLOWED);
                    }
                } catch (Exception e) {
                    throw new BusinessException(ErrorCode.INVALID_CALENDAR_DATE);
                }
            }

        BigDecimal totalRevenue = revenueStatisticsDao.getRevenueByFlexibleDate(day, month, year);

        return (totalRevenue != null) ? totalRevenue : BigDecimal.ZERO;
    }
}