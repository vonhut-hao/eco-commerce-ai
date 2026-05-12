package com.flix.identity.auth.service;

import com.flix.common.enums.Role;
import com.flix.identity.dao.entity.User;
import com.flix.identity.dao.entity.UserProfile;
import com.flix.identity.auth.enums.AuthProvider;
import com.flix.identity.dao.repository.UserProfileRepository;
import com.flix.identity.dao.repository.UserRepository;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import lombok.extern.slf4j.Slf4j;
import org.springframework.security.oauth2.client.oidc.userinfo.OidcUserRequest;
import org.springframework.security.oauth2.client.oidc.userinfo.OidcUserService;
import org.springframework.security.oauth2.core.OAuth2AuthenticationException;
import org.springframework.security.oauth2.core.oidc.user.OidcUser;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.Optional;
import java.util.Set;

@Service
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
@RequiredArgsConstructor
@Slf4j
public class CustomOidcUserService extends OidcUserService {

    UserRepository userRepository;
    UserProfileRepository userProfileRepository;

    @Override
    @Transactional
    public OidcUser loadUser(OidcUserRequest userRequest) throws OAuth2AuthenticationException {
        OidcUser oidcUser = loadOidcUser(userRequest);
        log.info("OIDC login requested");
        log.debug("OIDC user info: {}", oidcUser.getClaims());

        String provider = userRequest.getClientRegistration().getRegistrationId();
        AuthProvider authProvider = AuthProvider.from(provider);

        String email = oidcUser.getEmail();
        String fullName = oidcUser.getFullName();
        String avatarUrl = oidcUser.getPicture();

        if (email == null || email.isBlank()) {
            throw new OAuth2AuthenticationException("Email not found from OIDC provider");
        }

        Optional<User> user = userRepository.findByEmail(email);
        if (user.isEmpty()) {
            String username = buildUniqueUsername(email);
            User savedUser = userRepository.save(User.builder()
                    .email(email)
                    .username(username)
                    .roles(Set.of(Role.USER))
                    .isVerified(true)
                    .authProviders(Set.of(authProvider))
                    .build());

            userProfileRepository.save(UserProfile.builder()
                    .user(savedUser)
                    .fullName(fullName)
                    .avatarUrl(avatarUrl)
                    .build());
        } else if (!user.get().getAuthProviders().contains(authProvider)) {
            log.info("Existing user logged in with OIDC: {}", email);
            log.debug("Merge provider {} into existing user", authProvider);
            User existsUser = user.get();
            existsUser.getAuthProviders().add(authProvider);
            userRepository.save(existsUser);
        }

        return oidcUser;
    }



    public OidcUser loadOidcUser(OidcUserRequest userRequest) {
        return super.loadUser(userRequest);
    }

    private String buildUniqueUsername(String email) {
        String base = email.split("@", 2)[0]
                .replaceAll("[^a-zA-Z0-9._-]", "")
                .toLowerCase();
        if (base.isBlank()) {
            base = "user";
        }

        String candidate = truncate(base, 50);
        int suffix = 0;
        while (userRepository.existsByUsername(candidate)) {
            suffix++;
            String suffixText = String.valueOf(suffix);
            String trimmedBase = truncate(base, 50 - suffixText.length());
            candidate = trimmedBase + suffixText;
        }

        return candidate;
    }

    private String truncate(String value, int maxLength) {
        return value.length() <= maxLength ? value : value.substring(0, maxLength);
    }
}