package com.flix.identity.common.dto;

public record AuthResponse(
        String accessToken,
        long expiresIn
) {
}
