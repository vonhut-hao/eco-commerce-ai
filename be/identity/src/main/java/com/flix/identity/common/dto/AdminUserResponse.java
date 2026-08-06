package com.flix.identity.common.dto;

import com.fasterxml.jackson.annotation.JsonInclude;
import com.flix.common.enums.Role;
import com.flix.identity.entity.User;
import com.flix.identity.entity.UserProfile;

import java.time.LocalDateTime;
import java.util.Set;

@JsonInclude(JsonInclude.Include.NON_NULL)
public record AdminUserResponse(
        Long id,
        String username,
        String email,
        String fullName,
        String phone,
        Integer greenPoints,
        Double totalCarbon,
        Boolean isEnabled,
        Set<Role> roles,
        LocalDateTime createdAt
) {
    public static AdminUserResponse from(User user) {
        if (user == null) {
            return null;
        }

        UserProfile profile = user.getUserProfile();
        String fullName = profile != null ? profile.getFullName() : null;
        String phone = profile != null ? profile.getPhoneNumber() : null;
        Integer greenPoints = profile != null && profile.getGreenPoints() != null ? profile.getGreenPoints() : 0;
        Double totalCarbon = profile != null && profile.getTotalCarbonIndex() != null ? profile.getTotalCarbonIndex() : 0.0;

        return new AdminUserResponse(
                user.getId(),
                user.getUsername(),
                user.getEmail(),
                fullName,
                phone,
                greenPoints,
                totalCarbon,
                Boolean.TRUE.equals(user.getIsEnabled()),
                user.getRoles(),
                user.getCreatedAt()
        );
    }
}
