package com.flix.identity.user_profile.service;

import com.flix.common.exception.UserNotFoundException;
import com.flix.identity.common.dto.CreateOrUpdateUserProfile;
import com.flix.identity.common.dto.ResponseUserProfile;
import com.flix.identity.dao.UserProfileRepository;
import com.flix.identity.dao.UserRepository;
import com.flix.identity.entity.User;
import com.flix.identity.entity.UserProfile;
import lombok.AccessLevel;
import lombok.Getter;
import lombok.RequiredArgsConstructor;
import lombok.Setter;
import lombok.experimental.FieldDefaults;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

import org.springframework.transaction.annotation.Transactional;

@Setter
@Getter
@RequiredArgsConstructor
@Service
@Transactional
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
@Slf4j
public class UserProfileService {

    UserProfileRepository userProfileRepository;
    UserRepository userRepository;

    public ResponseUserProfile createOrUpdateUserProfile(CreateOrUpdateUserProfile request, Long userId) {
        var userProfile = userProfileRepository.findByUserId(userId);
        var user = getUser(userId);

        if (userProfile.isPresent()) {
            log.debug("Update existing user profile for user id {} ", userId);
            return updateUserProfile(request, userProfile.get());
        } else {
            log.debug("Create user profile for user id{}", userId);
            return createUserProfile(request, user);
        }
    }

    public ResponseUserProfile getUserProfile(Long userId) {
        log.info("Get user profile requested");
        log.debug("Get user profile for user id {}", userId);
        User user = getUser(userId);
        UserProfile profile = user.getUserProfile();
        if (profile != null) {
            return ResponseUserProfile.from(profile);
        }
        return new ResponseUserProfile(
                null, null, null, null,
                user.getId(), user.getUsername(), user.getEmail()
        );
    }

    public void deleteUserProfile(Long userId) {
        log.debug("Delete user profile for user id {}", userId);
        userProfileRepository.deleteById(userId);
    }

    private ResponseUserProfile createUserProfile(CreateOrUpdateUserProfile request, User user) {
        log.debug("Creating user profile for userId: {}", user.getId());
        UserProfile userProfile;

        if (request.avatarUrl() != null && request.phoneNumber() != null) {
            userProfile = UserProfile.builder()
                    .avatarUrl(request.avatarUrl())
                    .fullName(request.fullName())
                    .phoneNumber(request.phoneNumber())
                    .user(user)
                    .build();
        } else if (request.avatarUrl() != null) {
            userProfile = UserProfile.builder()
                    .avatarUrl(request.avatarUrl())
                    .fullName(request.fullName())
                    .user(user)
                    .build();
        } else if (request.phoneNumber() != null) {
            userProfile = UserProfile.builder()
                    .fullName(request.fullName())
                    .phoneNumber(request.phoneNumber())
                    .user(user)
                    .build();
        } else {
            userProfile = UserProfile.builder()
                    .fullName(request.fullName())
                    .user(user)
                    .build();
        }

        UserProfile savedUserProfile = userProfileRepository.save(userProfile);
        log.debug("Created user profile for userId: {}", user.getId());

        return ResponseUserProfile.from(savedUserProfile);
    }

    private ResponseUserProfile updateUserProfile(CreateOrUpdateUserProfile request, UserProfile userProfile) {
        log.debug("Updating user profile {}", userProfile.getId());
        userProfile.setFullName(request.fullName());
        userProfile.setAvatarUrl(request.avatarUrl());
        userProfile.setPhoneNumber(request.phoneNumber());
        var updatedUserProfile = userProfileRepository.save(userProfile);
        log.debug("Updated user profile  {}", userProfile.getId());

        return ResponseUserProfile.from(updatedUserProfile);
    }


    private User getUser(Long userId) {
        return userRepository.findById(userId).orElseThrow(UserNotFoundException::new);
    }
}