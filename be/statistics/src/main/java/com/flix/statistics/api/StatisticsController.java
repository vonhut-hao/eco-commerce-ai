package com.flix.statistics.api;

import com.flix.common.dto.ApiResponse;
import com.flix.common.util.SecurityUtils;
import com.flix.statistics.common.dto.StatisticResponse;
import com.flix.statistics.common.enums.StatisticPeriodType;
import com.flix.statistics.service.CarbonStatisticService;
import com.flix.statistics.service.RevenueStatisticsService;
import lombok.RequiredArgsConstructor;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.oauth2.jwt.Jwt;
import org.springframework.security.oauth2.server.resource.authentication.JwtAuthenticationConverter;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import java.math.BigDecimal;
import java.time.LocalDate;

import static com.flix.common.util.SecurityUtils.getCurrentUserId;
import static com.flix.common.util.SecurityUtils.validateOwnership;

/**
 * Controller for managing product revenue statistics and analytics endpoints.
 */
@RestController
@RequestMapping({"/api/v1/statistics", "/v1/statistics"})
@RequiredArgsConstructor
public class StatisticsController {

    private final RevenueStatisticsService revenueStatisticsService;
    private final CarbonStatisticService carbonStatisticService;
    private final JwtAuthenticationConverter getJwtAuthenticationConverter;

    /**
     * Retrieves total product revenue filtered flexibly by Daily, Monthly, or Yearly periods.
     *
     * <p><b>Frontend Integration Guide:</b></p>
     * <ul>
     *   <li><b>Endpoint:</b> {@code GET /api/v1/statistics/product/revenue}</li>
     *   <li><b>Query Parameters:</b>
     *     <ul>
     *       <li>{@code periodType} (optional, default = {@code DAILY}): Filter period. Allowed values: {@code DAILY}, {@code MONTHLY}, {@code YEARLY}.</li>
     *       <li>{@code date} (optional, ISO format {@code YYYY-MM-DD}): Target reference date. Defaults to current date if omitted.</li>
     *     </ul>
     *   </li>
     *   <li><b>Date Range Calculations (Backend Behavior):</b>
     *     <ul>
     *       <li>{@code DAILY}: Calculates revenue for {@code [date 00:00:00, date 23:59:59.999999999]}.</li>
     *       <li>{@code MONTHLY}: Calculates revenue for {@code [1st day of month 00:00:00, last day of month 23:59:59.999999999]}.</li>
     *       <li>{@code YEARLY}: Calculates revenue for {@code [Jan 1st 00:00:00, Dec 31st 23:59:59.999999999]}.</li>
     *     </ul>
     *   </li>
     *   <li><b>Example Request URLs:</b>
     *     <ul>
     *       <li>{@code GET /api/v1/statistics/product/revenue} (Defaults: DAILY for today)</li>
     *       <li>{@code GET /api/v1/statistics/product/revenue?periodType=DAILY&date=2026-08-02}</li>
     *       <li>{@code GET /api/v1/statistics/product/revenue?periodType=MONTHLY&date=2026-08-01}</li>
     *       <li>{@code GET /api/v1/statistics/product/revenue?periodType=YEARLY&date=2026-01-01}</li>
     *     </ul>
     *   </li>
     * </ul>
     *
     * @param periodType the timeframe resolution (DAILY, MONTHLY, YEARLY). Defaults to DAILY.
     * @param date       the reference date in ISO format (YYYY-MM-DD). Defaults to current date.
     * @return {@link ApiResponse} wrapping {@link StatisticResponse} containing period metadata, exact datetime bounds, and total revenue.
     */
    @GetMapping("/product/revenue")
    @PreAuthorize("hasRole('ADMIN')")
    public ApiResponse<StatisticResponse<BigDecimal>> getProductRevenue(
            @RequestParam(value = "periodType", defaultValue = "DAILY") StatisticPeriodType periodType,
            @RequestParam(value = "date", required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate date
    ) {

        var response = revenueStatisticsService.getProductRevenue(periodType, date);
        return ApiResponse.success(response);
    }

    /**
     * Ref to {@link StatisticsController#getProductRevenue(StatisticPeriodType, LocalDate)}
     */
    @GetMapping({"/product/carbon-index", "/carbon-index"})
    @PreAuthorize("hasRole('USER')")
    public ApiResponse<StatisticResponse<Double>> getProductCarbonIndex(
            @RequestParam(value = "periodType", defaultValue = "DAILY") StatisticPeriodType periodType,
            @RequestParam(value = "date", required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate date,
            @AuthenticationPrincipal Jwt jwt
    ) {
        Long userId = getCurrentUserId();
        validateOwnership(userId, jwt);

        StatisticResponse<Double> response = carbonStatisticService.getProductCarbonIndex(periodType, date, userId);
        return ApiResponse.success(response);
    }

}