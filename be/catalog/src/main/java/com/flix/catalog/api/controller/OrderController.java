package com.flix.catalog.api.controller;

import com.flix.catalog.common.dto.OrderRequest;
import com.flix.catalog.common.dto.OrderResponse;
import com.flix.catalog.order.service.OrderService;
import com.flix.common.dto.ApiResponse;
import com.flix.common.util.SecurityUtils;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.oauth2.jwt.Jwt;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseStatus;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequiredArgsConstructor
@RequestMapping("/v1/catalog/orders")
public class OrderController {
    private final OrderService orderService;

    @PostMapping(value = {"", "/{id}"})
    @ResponseStatus(HttpStatus.OK)
    @PreAuthorize("isAuthenticated()")
    public ApiResponse<OrderResponse> createOrUpdateOrder(
            @PathVariable(value = "id", required = false) Long id,
            @Valid @RequestBody OrderRequest request) {
        return ApiResponse.success(orderService.createOrUpdateOrder(id, request));
    }

    @GetMapping
    @ResponseStatus(HttpStatus.OK)
    @PreAuthorize("isAuthenticated()")
    public ApiResponse<List<OrderResponse>> listOrders(@AuthenticationPrincipal Jwt jwt) {
        Long userId = SecurityUtils.getCurrentUserId(jwt);
        return ApiResponse.success(orderService.listOrders(userId));
    }

    @GetMapping("/admin")
    @ResponseStatus(HttpStatus.OK)
    @PreAuthorize("hasRole('ADMIN')")
    public ApiResponse<List<OrderResponse>> listAllOrders() {
        return ApiResponse.success(orderService.listAllOrders());
    }

    @GetMapping("/{id}")
    @ResponseStatus(HttpStatus.OK)
    @PreAuthorize("isAuthenticated()")
    public ApiResponse<OrderResponse> getOrderDetails(@PathVariable("id") Long id) {
        return ApiResponse.success(orderService.getOrderDetails(id));
    }
}
