package com.flix.catalog.api.controller;

import com.flix.catalog.cart.service.CartItemService;
import com.flix.catalog.common.dto.CartItemRequest;
import com.flix.catalog.common.dto.CartItemResponse;
import com.flix.catalog.dao.CartItemRepository;
import com.flix.common.dto.ApiResponse;
import com.flix.common.enums.ErrorCode;
import com.flix.common.exception.BusinessException;
import com.flix.common.util.SecurityUtils;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.oauth2.jwt.Jwt;
import org.springframework.web.bind.annotation.DeleteMapping;
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
@RequestMapping("/v1/catalog/cart")
public class CartItemController {
    private final CartItemService cartItemService;
    private final CartItemRepository cartItemRepository;

    @PostMapping(value = {"", "/{id}"})
    @ResponseStatus(HttpStatus.OK)
    @PreAuthorize("isAuthenticated()")
    public ApiResponse<CartItemResponse> createOrUpdateCartItem(
            @PathVariable(value = "id", required = false) Long id,
            @Valid @RequestBody CartItemRequest request,
            @AuthenticationPrincipal Jwt jwt) {
        Long currentUserId = SecurityUtils.getCurrentUserId(jwt);
        SecurityUtils.validateOwnership(request.userId(), jwt);
        if (id != null) {
            if (!SecurityUtils.isAdminRole(jwt)) {
                cartItemRepository.findByIdAndUserId(id, currentUserId)
                        .orElseThrow(() -> new BusinessException(ErrorCode.CART_ITEM_NOT_FOUND));
            } else {
                cartItemRepository.findById(id)
                        .orElseThrow(() -> new BusinessException(ErrorCode.CART_ITEM_NOT_FOUND));
            }
        }
        return ApiResponse.success(cartItemService.createOrUpdateCartItem(id, request));
    }

    @GetMapping
    @ResponseStatus(HttpStatus.OK)
    @PreAuthorize("isAuthenticated()")
    public ApiResponse<List<CartItemResponse>> listCartItems(@AuthenticationPrincipal Jwt jwt) {
        Long currentUserId = SecurityUtils.getCurrentUserId(jwt);
        SecurityUtils.validateOwnership(currentUserId, jwt);
        return ApiResponse.success(cartItemService.listCartItems(currentUserId));
    }

    @DeleteMapping("/{id}")
    @ResponseStatus(HttpStatus.OK)
    @PreAuthorize("isAuthenticated()")
    public void deleteCartItem(@PathVariable("id") Long id, @AuthenticationPrincipal Jwt jwt) {
        Long currentUserId = SecurityUtils.getCurrentUserId(jwt);
        SecurityUtils.validateOwnership(currentUserId, jwt);
        if (!SecurityUtils.isAdminRole(jwt)) {
            cartItemRepository.findByIdAndUserId(id, currentUserId)
                    .orElseThrow(() -> new BusinessException(ErrorCode.CART_ITEM_NOT_FOUND));
        } else {
            cartItemRepository.findById(id)
                    .orElseThrow(() -> new BusinessException(ErrorCode.CART_ITEM_NOT_FOUND));
        }
        cartItemService.deleteCartItem(id);
    }
}
