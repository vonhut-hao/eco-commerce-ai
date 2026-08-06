package com.flix.identity.common.dto;

public record UserStatsSummaryResponse(
        long totalUsers,
        long activeUsers,
        long disabledUsers
) {
}
