package com.flix.catalog.api.controller;

import com.flix.catalog.common.dto.OrderResponse;
import com.flix.catalog.order.service.OrderService;
import com.flix.common.dto.ApiResponse;
import com.flix.common.util.SecurityUtils;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.oauth2.jwt.Jwt;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api/users")
public class UserOrdersController {
    private final OrderService orderService;

    @GetMapping("/{userId}/orders")
    @ResponseStatus(HttpStatus.OK)
    @PreAuthorize("isAuthenticated()")
    public ApiResponse<List<OrderResponse>> getUserOrders(
            @PathVariable("userId") Long userId,
            @AuthenticationPrincipal Jwt jwt) {
        if (!SecurityUtils.isAdminRole(jwt)) {
            SecurityUtils.validateOwnership(userId, jwt);
        }
        return ApiResponse.success(orderService.listOrders(userId));
    }
}
