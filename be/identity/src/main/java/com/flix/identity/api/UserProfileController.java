package com.flix.identity.api;

import com.flix.common.dto.ApiResponse;
import com.flix.common.util.SecurityUtils;
import com.flix.identity.common.dto.CreateOrUpdateUserProfile;
import com.flix.identity.common.dto.ResponseUserProfile;
import com.flix.identity.user_profile.service.UserProfileService;
import jakarta.validation.Valid;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import org.springframework.http.HttpStatus;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.oauth2.jwt.Jwt;
import org.springframework.web.bind.annotation.*;

@RestController
@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
@RequestMapping("/v1/profile")
public class UserProfileController {
    UserProfileService userProfileService;

    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    @PreAuthorize("hasRole('USER')")
    public ApiResponse<ResponseUserProfile> createOrUpdateUserProfile(
            @Valid @RequestBody CreateOrUpdateUserProfile request,
            @AuthenticationPrincipal Jwt jwt) {
        Long userId = SecurityUtils.getCurrentUserId(jwt);

        return ApiResponse.success(userProfileService.createOrUpdateUserProfile(request, userId));
    }

    @GetMapping("/{id}")
    @ResponseStatus(HttpStatus.OK)
    @PreAuthorize("hasRole('USER')")
    public ApiResponse<ResponseUserProfile> getUserProfile(
            @PathVariable("id") Long id,
            @AuthenticationPrincipal Jwt jwt
    ) {
        SecurityUtils.validateOwnership(id, jwt);
        return ApiResponse.success(userProfileService.getUserProfile(id));
    }

    @DeleteMapping("/{id}")
    @ResponseStatus(HttpStatus.OK)
    @PreAuthorize("hasRole('USER')")
    public void deleteUserProfile(
            @PathVariable("id") Long id,
            @AuthenticationPrincipal Jwt jwt
    ) {
        SecurityUtils.validateOwnership(id, jwt);
        userProfileService.deleteUserProfile(id);
    }

}
