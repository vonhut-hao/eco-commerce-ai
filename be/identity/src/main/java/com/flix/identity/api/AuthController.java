package com.flix.identity.api;

import com.flix.common.dto.ApiResponse;
import com.flix.identity.auth.dto.AuthResponse;
import com.flix.identity.auth.dto.LoginRequest;
import com.flix.identity.auth.dto.RegisterRequest;
import com.flix.identity.auth.service.AuthService;
import jakarta.validation.Valid;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import org.springframework.http.HttpStatus;
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

    @PostMapping("/register/vip")
    @ResponseStatus(HttpStatus.CREATED)
    public ApiResponse<AuthResponse> registerForVipUser(@RequestBody @Valid RegisterRequest request) {
        var authResponse = authService.registerForVIPUser(request);
        return ApiResponse.success(authResponse, HttpStatus.CREATED, "VIP user registered successfully");
    }

    @PostMapping("/login")
    public ApiResponse<AuthResponse> login(@RequestBody @Valid LoginRequest request) {
        var authResponse = authService.login(request);
        return ApiResponse.success(authResponse);
    }
}
