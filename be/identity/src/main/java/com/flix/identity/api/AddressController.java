package com.flix.identity.api;

import com.flix.common.dto.ApiResponse;
import com.flix.common.util.SecurityUtils;
import com.flix.identity.address.service.AddressService;
import com.flix.identity.common.dto.AddressRequest;
import com.flix.identity.common.dto.AddressResponse;
import jakarta.validation.Valid;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import org.springframework.http.HttpStatus;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.oauth2.jwt.Jwt;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/v1/identity/addresses")
@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
public class AddressController {

    AddressService addressService;

    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    @PreAuthorize("hasRole('USER')")
    public ApiResponse<AddressResponse> createAddress(
            @AuthenticationPrincipal Jwt jwt,
            @Valid @RequestBody AddressRequest request
    ) {
        Long userId = SecurityUtils.getCurrentUserId(jwt);
        return ApiResponse.success(addressService.createAddress(userId, request));
    }

    @GetMapping
    @ResponseStatus(HttpStatus.OK)
    @PreAuthorize("hasRole('USER')")
    public ApiResponse<List<AddressResponse>> getUserAddresses(
            @AuthenticationPrincipal Jwt jwt
    ) {
        Long userId = SecurityUtils.getCurrentUserId(jwt);
        return ApiResponse.success(addressService.getUserAddresses(userId));
    }

    @GetMapping("/{id}")
    @ResponseStatus(HttpStatus.OK)
    @PreAuthorize("hasRole('USER')")
    public ApiResponse<AddressResponse> getAddressDetails(
            @AuthenticationPrincipal Jwt jwt,
            @PathVariable("id") Long id
    ) {
        Long userId = SecurityUtils.getCurrentUserId(jwt);
        return ApiResponse.success(addressService.getAddressDetails(id, userId));
    }

    @PutMapping("/{id}")
    @ResponseStatus(HttpStatus.OK)
    @PreAuthorize("hasRole('USER')")
    public ApiResponse<AddressResponse> updateAddress(
            @AuthenticationPrincipal Jwt jwt,
            @PathVariable("id") Long id,
            @Valid @RequestBody AddressRequest request
    ) {
        Long userId = SecurityUtils.getCurrentUserId(jwt);
        return ApiResponse.success(addressService.updateAddress(id, userId, request));
    }

    @DeleteMapping("/{id}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    @PreAuthorize("hasRole('USER')")
    public void deleteAddress(
            @AuthenticationPrincipal Jwt jwt,
            @PathVariable("id") Long id
    ) {
        Long userId = SecurityUtils.getCurrentUserId(jwt);
        addressService.deleteAddress(id, userId);
    }

    @PatchMapping("/{id}/default")
    @ResponseStatus(HttpStatus.OK)
    @PreAuthorize("hasRole('USER')")
    public ApiResponse<AddressResponse> setDefaultAddress(
            @AuthenticationPrincipal Jwt jwt,
            @PathVariable("id") Long id
    ) {
        Long userId = SecurityUtils.getCurrentUserId(jwt);
        return ApiResponse.success(addressService.setDefaultAddress(id, userId));
    }
}
