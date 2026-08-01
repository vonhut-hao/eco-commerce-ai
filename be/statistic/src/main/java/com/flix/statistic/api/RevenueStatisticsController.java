package com.flix.statistic.api;

import com.flix.common.dto.ApiResponse;
import com.flix.statistic.common.dto.Response.RevenueStatisticResponse;
import com.flix.statistic.service.RevenueStatisticsService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import java.math.BigDecimal;

@RestController
@RequestMapping("/v1/static")
@RequiredArgsConstructor
public class RevenueStatisticsController {

    private final RevenueStatisticsService revenueStatisticsService;

    @GetMapping("/product/revenue")
    public ApiResponse<RevenueStatisticResponse> getRevenue(
            @RequestParam(value = "day", required = false) Integer day,
            @RequestParam(value = "month", required = false) Integer month,
            @RequestParam(value = "year", required = false) Integer year
    ) {
        BigDecimal totalRevenue = revenueStatisticsService.getRevenue(day, month, year);
        RevenueStatisticResponse data = RevenueStatisticResponse.of(day, month, year, null, totalRevenue);

        return ApiResponse.success(data);
    }
}