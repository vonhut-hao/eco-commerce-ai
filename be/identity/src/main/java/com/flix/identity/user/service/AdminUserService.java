package com.flix.identity.user.service;

import com.flix.common.enums.ErrorCode;
import com.flix.common.enums.Role;
import com.flix.common.exception.BusinessException;
import com.flix.common.exception.UserNotFoundException;
import com.flix.identity.common.dto.AdminUserResponse;
import com.flix.identity.common.dto.UserStatsSummaryResponse;
import com.flix.identity.common.dto.UserStatusUpdateRequest;
import com.flix.identity.dao.UserRepository;
import com.flix.identity.entity.User;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
public class AdminUserService {

    UserRepository userRepository;

    @Transactional(readOnly = true)
    public Page<AdminUserResponse> getUsers(String query, Pageable pageable) {
        Page<User> users = userRepository.searchUsers(query, pageable);
        return users.map(AdminUserResponse::from);
    }

    @Transactional(readOnly = true)
    public AdminUserResponse getUserDetails(Long id) {
        User user = userRepository.findById(id)
                .orElseThrow(UserNotFoundException::new);
        return AdminUserResponse.from(user);
    }

    @Transactional(readOnly = true)
    public UserStatsSummaryResponse getUserStats() {
        long total = userRepository.count();
        long active = userRepository.countByIsEnabledTrue();
        long disabled = Math.max(0, total - active);
        return new UserStatsSummaryResponse(total, active, disabled);
    }

    @Transactional
    public AdminUserResponse updateUserStatus(Long targetUserId, UserStatusUpdateRequest request, Long currentAdminId) {
        if (targetUserId.equals(currentAdminId)) {
            throw new BusinessException(ErrorCode.ADMIN_SELF_DISABLE_NOT_ALLOWED);
        }

        User user = userRepository.findById(targetUserId)
                .orElseThrow(UserNotFoundException::new);

        if (user.getRoles() != null && user.getRoles().contains(Role.ADMIN)) {
            throw new BusinessException(ErrorCode.ADMIN_STATUS_CHANGE_NOT_ALLOWED);
        }

        user.setIsEnabled(request.isEnabled());
        User savedUser = userRepository.save(user);
        return AdminUserResponse.from(savedUser);
    }
}
