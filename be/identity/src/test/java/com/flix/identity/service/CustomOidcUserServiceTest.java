package com.flix.identity.service;

import com.flix.common.enums.Role;
import com.flix.identity.auth.service.CustomOidcUserService;
import com.flix.identity.dao.entity.User;
import com.flix.identity.auth.enums.AuthProvider;
import com.flix.identity.dao.repository.UserProfileRepository;
import com.flix.identity.dao.repository.UserRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.Mockito;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.security.oauth2.client.oidc.userinfo.OidcUserRequest;
import org.springframework.security.oauth2.client.registration.ClientRegistration;
import org.springframework.security.oauth2.core.OAuth2AuthenticationException;
import org.springframework.security.oauth2.core.oidc.user.OidcUser;

import java.util.HashSet;
import java.util.Optional;
import java.util.Set;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatThrownBy;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class CustomOidcUserServiceTest {

    @Mock
    UserRepository userRepository;
    @Mock
    UserProfileRepository userProfileRepository;
    @InjectMocks
    CustomOidcUserService customOidcUserService;

    @Mock
    OidcUserRequest userRequest;
    @Mock
    ClientRegistration clientRegistration;
    @Mock
    OidcUser oidcUser;

    private static final String EMAIL = "test@gmail.com";
    private static final String FULL_NAME = "Nguyen Van A";
    private static final String AVATAR = "https://avatar.url/pic.jpg";

    @BeforeEach
    void setUp() {
        when(userRequest.getClientRegistration()).thenReturn(clientRegistration);
        when(clientRegistration.getRegistrationId()).thenReturn("google");
    }

    private CustomOidcUserService spyService() {
        CustomOidcUserService spy = Mockito.spy(customOidcUserService);
        doReturn(oidcUser).when(spy).loadOidcUser(userRequest);
        return spy;
    }

    @Test
    @DisplayName("New user -> should create User and UserProfile")
    void loadUser_newUser_shouldCreateUserAndProfile() {
        CustomOidcUserService spy = spyService();
        when(userRepository.findByEmail(EMAIL)).thenReturn(Optional.empty());
        when(userRepository.existsByUsername(any())).thenReturn(false);
        when(oidcUser.getEmail()).thenReturn(EMAIL);
        when(oidcUser.getFullName()).thenReturn(FULL_NAME);
        when(oidcUser.getPicture()).thenReturn(AVATAR);

        User savedUser = User.builder().email(EMAIL).authProviders(Set.of(AuthProvider.GOOGLE)).build();
        when(userRepository.save(any(User.class))).thenReturn(savedUser);

        OidcUser result = spy.loadUser(userRequest);

        assertThat(result).isEqualTo(oidcUser);

        verify(userRepository).save(argThat(user ->
                EMAIL.equals(user.getEmail()) &&
                        user.getAuthProviders().contains(AuthProvider.GOOGLE) &&
                        user.getUsername() != null &&
                        user.getRoles().contains(Role.USER)
        ));
        verify(userProfileRepository).save(argThat(profile ->
                FULL_NAME.equals(profile.getFullName()) &&
                        AVATAR.equals(profile.getAvatarUrl()) &&
                        savedUser.equals(profile.getUser())
        ));
    }

    @Test
    @DisplayName("Existing user, has provider -> should skip create")
    void loadUser_existingUser_hasProvider_shouldSkipCreate() {
        CustomOidcUserService spy = spyService();

        User existingUser = User.builder()
                .email(EMAIL)
                .authProviders(Set.of(AuthProvider.GOOGLE))
                .build();
        when(oidcUser.getEmail()).thenReturn(EMAIL);
        when(userRepository.findByEmail(EMAIL)).thenReturn(Optional.of(existingUser));

        OidcUser result = spy.loadUser(userRequest);

        assertThat(result).isEqualTo(oidcUser);
        verify(userRepository, never()).save(any(User.class));
        verify(userProfileRepository, never()).save(any());
    }

    @Test
    @DisplayName("Existing user, missing provider -> should merge provider")
    void loadUser_existingUser_missingProvider_shouldMergeProvider() {
        CustomOidcUserService spy = spyService();

        User existingUser = User.builder()
                .email(EMAIL)
                .authProviders(new HashSet<>(Set.of(AuthProvider.LOCAL)))
                .build();
        when(oidcUser.getEmail()).thenReturn(EMAIL);
        when(userRepository.findByEmail(EMAIL)).thenReturn(Optional.of(existingUser));

        spy.loadUser(userRequest);

        verify(userRepository).save(argThat(user ->
                user.getAuthProviders().contains(AuthProvider.GOOGLE)
        ));
        verify(userProfileRepository, never()).save(any());
    }

    @Test
    @DisplayName("Missing email -> should throw OAuth2AuthenticationException")
    void loadUser_missingEmail_shouldThrow() {
        CustomOidcUserService spy = spyService();

        when(oidcUser.getEmail()).thenReturn(" ");

        assertThatThrownBy(() -> spy.loadUser(userRequest))
                .isInstanceOf(OAuth2AuthenticationException.class);
    }

    @Test
    @DisplayName("Unsupported provider -> should throw IllegalArgumentException")
    void loadUser_unsupportedProvider_shouldThrow() {
        CustomOidcUserService spy = spyService();

        when(clientRegistration.getRegistrationId()).thenReturn("twitter");

        assertThatThrownBy(() -> spy.loadUser(userRequest))
                .isInstanceOf(IllegalArgumentException.class)
                .hasMessageContaining("No enum constant");
    }
}