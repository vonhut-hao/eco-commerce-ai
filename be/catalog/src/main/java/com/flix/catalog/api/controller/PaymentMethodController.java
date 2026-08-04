package com.flix.catalog.api.controller;

import com.flix.catalog.common.dto.PaymentMethodRequest;
import com.flix.catalog.common.dto.PaymentMethodResponse;
import com.flix.catalog.paymentmethod.service.PaymentMethodService;
import com.flix.common.dto.ApiResponse;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequiredArgsConstructor
@RequestMapping({"/v1/catalog/payment-methods", "/api/v1/catalog/payment-methods"})
public class PaymentMethodController {

    private final PaymentMethodService paymentMethodService;

    @GetMapping
    @ResponseStatus(HttpStatus.OK)
    public ApiResponse<List<PaymentMethodResponse>> getActivePaymentMethods() {
        return ApiResponse.success(paymentMethodService.getActivePaymentMethods());
    }

    @GetMapping("/admin")
    @ResponseStatus(HttpStatus.OK)
    @PreAuthorize("hasRole('ADMIN')")
    public ApiResponse<List<PaymentMethodResponse>> getAllPaymentMethods() {
        return ApiResponse.success(paymentMethodService.getAllPaymentMethods());
    }

    @GetMapping("/{id}")
    @ResponseStatus(HttpStatus.OK)
    public ApiResponse<PaymentMethodResponse> getPaymentMethodById(@PathVariable("id") Long id) {
        return ApiResponse.success(paymentMethodService.getPaymentMethodById(id));
    }

    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    @PreAuthorize("hasRole('ADMIN')")
    public ApiResponse<PaymentMethodResponse> createPaymentMethod(@Valid @RequestBody PaymentMethodRequest request) {
        return ApiResponse.success(paymentMethodService.createPaymentMethod(request));
    }

    @PutMapping("/{id}")
    @ResponseStatus(HttpStatus.OK)
    @PreAuthorize("hasRole('ADMIN')")
    public ApiResponse<PaymentMethodResponse> updatePaymentMethod(
            @PathVariable("id") Long id,
            @Valid @RequestBody PaymentMethodRequest request
    ) {
        return ApiResponse.success(paymentMethodService.updatePaymentMethod(id, request));
    }

    @PatchMapping("/{id}/status")
    @ResponseStatus(HttpStatus.OK)
    @PreAuthorize("hasRole('ADMIN')")
    public ApiResponse<PaymentMethodResponse> togglePaymentMethodStatus(
            @PathVariable("id") Long id,
            @RequestParam(value = "active", required = false) Boolean active
    ) {
        return ApiResponse.success(paymentMethodService.togglePaymentMethodStatus(id, active));
    }

    @DeleteMapping("/{id}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    @PreAuthorize("hasRole('ADMIN')")
    public void deletePaymentMethod(@PathVariable("id") Long id) {
        paymentMethodService.deletePaymentMethod(id);
    }
}
