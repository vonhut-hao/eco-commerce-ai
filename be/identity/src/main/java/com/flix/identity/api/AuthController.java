package com.flix.identity.api;

import com.flix.common.dto.ApiResponse;
import com.flix.common.util.SecurityUtils;
import com.flix.identity.common.dto.AuthResponse;
import com.flix.identity.common.dto.LoginRequest;
import com.flix.identity.common.dto.RegisterRequest;
import com.flix.identity.auth.service.AuthService;
import jakarta.validation.Valid;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import org.springframework.http.HttpStatus;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.oauth2.jwt.Jwt;
import org.springframework.web.bind.annotation.*;

@RestController
@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
@RequestMapping("/v1/auth")
public class AuthController {

    AuthService authService;

    @PostMapping("/register/normal")
    @ResponseStatus(HttpStatus.CREATED)
    public ApiResponse<AuthResponse> registerForNormalUser(@RequestBody @Valid RegisterRequest request) {
        var authResponse = authService.registerForNormalUser(request);
        return ApiResponse.success(authResponse, HttpStatus.CREATED, "Normal user registered successfully");
    }

    @PostMapping("/login")
    public ApiResponse<AuthResponse> login(@RequestBody @Valid LoginRequest request) {
        var authResponse = authService.login(request);
        return ApiResponse.success(authResponse);
    }

    @GetMapping("/is-local-provider")
    @ResponseStatus(HttpStatus.OK)
    public ApiResponse<Boolean> checkProvider(
            @AuthenticationPrincipal Jwt jwt
    ) {
       Long userId = SecurityUtils.getCurrentUserId(jwt);
       return ApiResponse.success(authService.checkProvider(userId));
    }

}
