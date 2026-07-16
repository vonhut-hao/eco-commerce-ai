package com.flix.identity.common.enums;

import lombok.Getter;
import lombok.RequiredArgsConstructor;

import java.util.Arrays;

@RequiredArgsConstructor
@Getter
public enum PublicEndpoint {
    AUTHENTICATION("/v1/auth/**"),
    ERROR("/error"),
    ADMIN("/v1/internal/auth/**"),
    GET_PRODUCTS("/v1/catalog/products"),
    GET_PRODUCTS_DETAIL("/v1/catalog/products/**");

    private final String value;

    public static String[] getAllValues() {
        return Arrays.stream(PublicEndpoint.values())
                .map(PublicEndpoint::getValue)
                .toArray(String[]::new);
    }
}
