package com.flix.app.config;

import com.flix.common.enums.Role;
import com.flix.identity.common.enums.AuthProvider;
import com.flix.identity.dao.UserRepository;
import com.flix.identity.entity.User;
import com.flix.identity.entity.UserProfile;
import lombok.RequiredArgsConstructor;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;
import org.springframework.transaction.annotation.Transactional;

import java.util.Set;

@Component
@RequiredArgsConstructor
public class AdminSeeder implements CommandLineRunner {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;

    @Override
    @Transactional
    public void run(String... args) {
        String adminEmail = "admin@greenlife.vn";
        if (userRepository.findByEmail(adminEmail).isEmpty()) {
            User admin = User.builder()
                    .email(adminEmail)
                    .username("admin")
                    .password(passwordEncoder.encode("admin123"))
                    .roles(Set.of(Role.ADMIN, Role.USER))
                    .authProviders(Set.of(AuthProvider.LOCAL))
                    .isEnabled(true)
                    .isVerified(true)
                    .build();

            UserProfile profile = UserProfile.builder()
                    .user(admin)
                    .fullName("Admin GreenLife")
                    .greenPoints(1000)
                    .build();

            admin.setUserProfile(profile);
            
            userRepository.save(admin);
            System.out.println("Seeded admin account: admin@greenlife.vn / admin123");
        }
    }
}
