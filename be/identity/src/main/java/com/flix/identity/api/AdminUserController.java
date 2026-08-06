package com.flix.identity.api;

import com.flix.common.dto.ApiResponse;
import com.flix.common.util.SecurityUtils;
import com.flix.identity.common.dto.AdminUserResponse;
import com.flix.identity.common.dto.UserStatsSummaryResponse;
import com.flix.identity.common.dto.UserStatusUpdateRequest;
import com.flix.identity.user.service.AdminUserService;
import jakarta.validation.Valid;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.http.HttpStatus;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.oauth2.jwt.Jwt;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/v1/admin/users")
@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
public class AdminUserController {

    AdminUserService adminUserService;

    @GetMapping
    @ResponseStatus(HttpStatus.OK)
    @PreAuthorize("hasRole('ADMIN')")
    public ApiResponse<Page<AdminUserResponse>> getUsers(
            @RequestParam(name = "query", required = false) String query,
            @RequestParam(name = "page", defaultValue = "0") int page,
            @RequestParam(name = "size", defaultValue = "20") int size
    ) {
        Pageable pageable = PageRequest.of(page, size, Sort.by("id").descending());
        return ApiResponse.success(adminUserService.getUsers(query, pageable));
    }

    @GetMapping("/stats")
    @ResponseStatus(HttpStatus.OK)
    @PreAuthorize("hasRole('ADMIN')")
    public ApiResponse<UserStatsSummaryResponse> getUserStats() {
        return ApiResponse.success(adminUserService.getUserStats());
    }

    @GetMapping("/{id}")
    @ResponseStatus(HttpStatus.OK)
    @PreAuthorize("hasRole('ADMIN')")
    public ApiResponse<AdminUserResponse> getUserDetails(
            @PathVariable("id") Long id
    ) {
        return ApiResponse.success(adminUserService.getUserDetails(id));
    }

    @PatchMapping("/{id}/status")
    @ResponseStatus(HttpStatus.OK)
    @PreAuthorize("hasRole('ADMIN')")
    public ApiResponse<AdminUserResponse> updateUserStatus(
            @AuthenticationPrincipal Jwt jwt,
            @PathVariable("id") Long id,
            @Valid @RequestBody UserStatusUpdateRequest request
    ) {
        Long currentAdminId = SecurityUtils.getCurrentUserId(jwt);
        return ApiResponse.success(adminUserService.updateUserStatus(id, request, currentAdminId));
    }
}
