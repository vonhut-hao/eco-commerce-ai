package com.flix.identity.auth.handler;

import com.flix.identity.auth.config.AuthConfig;
import com.flix.identity.auth.service.AuthService;
import com.flix.identity.auth.dto.AuthResponse;
import com.flix.identity.dao.entity.User;
import com.flix.identity.dao.repository.UserRepository;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.security.core.Authentication;
import org.springframework.security.oauth2.core.user.OAuth2User;
import org.springframework.security.web.authentication.AuthenticationSuccessHandler;
import org.springframework.stereotype.Component;

import java.io.IOException;
import java.net.URLEncoder;
import java.nio.charset.StandardCharsets;

@Component
@RequiredArgsConstructor
@FieldDefaults(level = lombok.AccessLevel.PRIVATE, makeFinal = true)
@Slf4j
public class OAuth2AuthenticationSuccessHandler implements AuthenticationSuccessHandler {

    AuthConfig authConfig;
    UserRepository userRepository;
    AuthService authService;

    @Override
    public void onAuthenticationSuccess(HttpServletRequest request,
                                        HttpServletResponse response,
                                        Authentication authentication) throws IOException {
        OAuth2User oAuth2User = (OAuth2User) authentication.getPrincipal();
        String email = oAuth2User.getAttribute("email");

        if (email == null || email.isBlank()) {
            response.sendError(HttpStatus.UNAUTHORIZED.value(), "Email not found from OAuth2 provider");
            return;
        }

        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new IllegalStateException("OAuth2 user not found after login"));

        AuthResponse authResponse = authService.generateTokenForUser(user);
        String redirectUrl = authConfig.getOauth2RedirectUrl();

        String token = URLEncoder.encode(authResponse.accessToken(), StandardCharsets.UTF_8);
        String fragment = "token=" + token + "&expiresIn=" + authResponse.expiresIn();
        response.setStatus(HttpStatus.FOUND.value());
        response.setHeader("Location", redirectUrl + "#" + fragment);
        log.debug("OAuth2 login success for email {}, redirecting to FE", email);
    }
}

