package com.flix.identity.auth.service;

import com.flix.identity.dao.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import org.springframework.security.core.userdetails.User;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;

@RequiredArgsConstructor
@Service
@FieldDefaults(level = lombok.AccessLevel.PRIVATE, makeFinal = true)
public class CustomUserDetailService implements UserDetailsService {

    UserRepository userRepository;

    @Override
    public UserDetails loadUserByUsername(String username) throws UsernameNotFoundException {
        var user = userRepository.findByUsername(username)
                .orElseThrow(() -> new UsernameNotFoundException("User not found with username: " + username));

        return User.builder()
                .username(user.getUsername())
                .password(user.getPassword())
                .roles(user.getRoles().stream().map(Enum::name).toArray(String[]::new))
                .disabled(!user.getIsEnabled())
                .build();
    }
}
