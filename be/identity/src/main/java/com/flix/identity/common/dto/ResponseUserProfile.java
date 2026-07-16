package com.flix.identity.common.dto;

import com.fasterxml.jackson.annotation.JsonInclude;
import com.flix.identity.entity.UserProfile;

@JsonInclude(JsonInclude.Include.NON_NULL)
public record ResponseUserProfile(
        Long id,
        String avatarUrl,
        String fullName,
        String phoneNumber,
        Long userId,
        String userName,
        String email,
        Integer greenPoints,
        Double totalCarbonIndex
) {
    public static ResponseUserProfile from(UserProfile entity) {
        if (entity == null) {
            return null;
        }

        Long userId = null;
        String userName = null;
        String email = null;

        if (entity.getUser() != null) {
            userId = entity.getUser().getId();
            userName = entity.getUser().getUsername();
            email = entity.getUser().getEmail();
        }

        return new ResponseUserProfile(
                entity.getId(),
                entity.getAvatarUrl(),
                entity.getFullName(),
                entity.getPhoneNumber(),
                userId,
                userName,
                email,
                entity.getGreenPoints(),
                entity.getTotalCarbonIndex()
        );
    }
}
