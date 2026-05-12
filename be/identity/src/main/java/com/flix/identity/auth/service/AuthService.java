package com.flix.identity.auth.service;

import com.flix.common.enums.ErrorCode;
import com.flix.common.enums.Role;
import com.flix.identity.auth.config.AuthConfig;
import com.flix.identity.auth.dto.AuthResponse;
import com.flix.identity.auth.dto.LoginRequest;
import com.flix.identity.auth.dto.RegisterRequest;
import com.flix.identity.dao.entity.User;
import com.flix.identity.auth.enums.AuthProvider;
import com.flix.identity.auth.exception.InvalidCredentailsException;
import com.flix.identity.dao.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import lombok.extern.slf4j.Slf4j;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.oauth2.jose.jws.MacAlgorithm;
import org.springframework.security.oauth2.jwt.JwsHeader;
import org.springframework.security.oauth2.jwt.JwtClaimsSet;
import org.springframework.security.oauth2.jwt.JwtEncoder;
import org.springframework.security.oauth2.jwt.JwtEncoderParameters;
import org.springframework.stereotype.Service;

import java.time.Instant;
import java.util.Set;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@FieldDefaults(level = lombok.AccessLevel.PRIVATE, makeFinal = true)
@Slf4j
public class AuthService {

    UserRepository userRepository;
    AuthConfig authConfig;
    PasswordEncoder passwordEncoder;
    JwtEncoder jwtEncoder;

    public AuthResponse registerForNormalUser(RegisterRequest registerRequest) {
        log.info("Register for normal user");

        User user = basicRegister(registerRequest);
        user.setRoles(Set.of(Role.USER));
        user = userRepository.save(user);

        log.debug("Normal User registered with id: {}", user.getId());
        log.info("Normal User registered successfully");

        return generateToken(user.getId(), user.getUsername(), user.getRoles());
    }

    public AuthResponse registerForVIPUser(RegisterRequest registerRequest) {
        log.info("Register for VIP user");
        User user = basicRegister(registerRequest);
        user.setRoles(Set.of(Role.USER, Role.VIP));
        user = userRepository.save(user);

        log.debug("VIP User registered with id: {}", user.getId());
        log.info("VIP User registered successfully");

        return generateToken(user.getId(), user.getUsername(), user.getRoles());
    }

    public AuthResponse login(LoginRequest loginRequest) {
        log.info("Login request received");
        log.debug("Login request for username: {}", loginRequest.username());

        String emailAsUsername = loginRequest.username();
        User user = userRepository.findByUsernameOrEmail(loginRequest.username(), emailAsUsername)
                .orElseThrow(InvalidCredentailsException::new);

        if (!passwordEncoder.matches(loginRequest.password(), user.getPassword())) {
            throw new InvalidCredentailsException();
        }

        return generateToken(user.getId(), user.getUsername(), user.getRoles());

    }

    private User basicRegister(RegisterRequest registerRequest) {
        if (userRepository.existsByEmail(registerRequest.email())) {
            throw new InvalidCredentailsException(ErrorCode.EMAIL_ALREADY_EXISTS);
        } else if (userRepository.existsByUsername(registerRequest.username())) {
            throw new InvalidCredentailsException(ErrorCode.USERNAME_ALREADY_EXISTS);
        }

        return User.builder()
                .username(registerRequest.username())
                .email(registerRequest.email())
                .authProviders(Set.of(AuthProvider.LOCAL))
                .password(passwordEncoder.encode(registerRequest.password()))
                .isVerified(true)
                .isEnabled(true)
                .build();
    }

    private AuthResponse generateToken(Long userId, String userName, Set<Role> roles) {
        log.debug("Generate token for user with id: {}", userId);

        Instant now = Instant.now();
        String rolesForClaims = roles.stream()
                .map(Role::name)
                .collect(Collectors.joining(" "));

        JwtClaimsSet claims = JwtClaimsSet.builder()
                .issuer("flix-plaftform-identity")
                .claim("userId", userId)
                .claim("userName", userName)
                .claim("scope", rolesForClaims)
                .issuedAt(now)
                .expiresAt(now.plusSeconds(authConfig.getJwtExpirationSeconds()))
                .build();

        var params = JwtEncoderParameters.from(
                JwsHeader.with(MacAlgorithm.HS256).build(), claims
        );

        var tokenValue = jwtEncoder.encode(params).getTokenValue();

        log.debug("Generated token for user with id {} and token value : {}", userId, tokenValue);

        return new AuthResponse(tokenValue, authConfig.getJwtExpirationSeconds());
    }

    public AuthResponse generateTokenForUser(User user) {
        Set<Role> roles = user.getRoles();
        if (roles == null || roles.isEmpty()) {
            roles = Set.of(Role.USER);
        }
        return generateToken(user.getId(), user.getUsername(), roles);
    }

}
