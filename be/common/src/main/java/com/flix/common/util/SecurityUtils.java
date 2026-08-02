package com.flix.common.util;

import com.flix.common.enums.ErrorCode;
import com.flix.common.exception.BusinessException;
import com.flix.common.exception.UserNotFoundException;
import lombok.extern.slf4j.Slf4j;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.oauth2.jwt.Jwt;

import java.util.Arrays;

@Slf4j
public class SecurityUtils {
    private static final String USER_ID = "userId";
    private static final String ROLES = "scope";

    private SecurityUtils() {
        /* This utility class should not be instantiated */
    }

    public static Long getCurrentUserId(Jwt jwt) {
        log.debug("Extracting user ID from JWT: {}", jwt);
        return jwt.getClaim(USER_ID);
    }

    public static Long getCurrentUserId() {
        Jwt jwt = currentJwt();
        return getCurrentUserId(jwt);
    }

    public static boolean isAdminRole(Jwt jwt) {
        log.debug("Checking admin role for JWT: {}", jwt);
        String roles = jwt.getClaim(ROLES);
        return roles != null && Arrays.asList(roles.split(" ")).contains("ADMIN");
    }

    public static boolean isAdminRole() {
        Jwt jwt = currentJwt();
        return isAdminRole(jwt);
    }

    public static boolean isAdminRoleWithOutThrowException() {
        Jwt jwt = currentJwtWithOutThrowException();
        if (jwt == null) {
            return false;
        }
        return isAdminRole(jwt);
    }

    public static void validateOwnership(Long userId, Jwt jwt) {
        if (isAdminRole(jwt)) {
            log.debug("User {} is admin, accept to get resource", userId);
            return;
        }
        if (!getCurrentUserId(jwt).equals(userId)) {
            log.warn("User {} not found", userId);
            log.debug("User {} isn't owner, reject to get resource", userId);
            throw new UserNotFoundException();
        }
    }

    public static Jwt currentJwt() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        if (authentication == null || !(authentication.getPrincipal() instanceof Jwt jwt)) {
            throw new BusinessException(ErrorCode.UNAUTHENTICATED);
        }
        return jwt;
    }

    public static Jwt currentJwtWithOutThrowException() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        if (authentication == null || !(authentication.getPrincipal() instanceof Jwt jwt)) {
            return null;
        }
        return jwt;
    }

}
