package com.flix.identity.api;

import com.flix.common.dto.ApiResponse;
import com.flix.identity.auth.service.AuthService;
import com.flix.identity.common.dto.AuthResponse;
import com.flix.identity.common.dto.RegisterRequest;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;

@RestController
@RequiredArgsConstructor
@Slf4j
@RequestMapping("/v1/internal/auth")
public class AuthControllerInternal {
    private final AuthService authService;

    @PostMapping("/register/admin")
    @ResponseStatus(HttpStatus.CREATED)
    public ApiResponse<AuthResponse> registerForAdmin(@RequestBody @Valid RegisterRequest request) {
        var authResponse = authService.registerForAdmin(request);
        return ApiResponse.success(authResponse, HttpStatus.CREATED, "Admin user registered successfully");
    }
}
