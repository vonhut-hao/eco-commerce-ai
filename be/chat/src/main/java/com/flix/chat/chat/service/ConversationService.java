package com.flix.chat.chat.service;

import com.flix.chat.common.dto.ConversationRequest;
import com.flix.chat.common.dto.ConversationResponse;
import com.flix.chat.common.enums.ConversationType;
import com.flix.chat.dao.ConversationRepository;
import com.flix.chat.entity.ConversationEntity;
import com.flix.common.enums.ErrorCode;
import com.flix.common.enums.Role;
import com.flix.common.exception.BusinessException;
import com.flix.identity.dao.UserRepository;
import com.flix.identity.entity.User;
import com.flix.identity.entity.UserProfile;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@Slf4j
@Service
@RequiredArgsConstructor
public class ConversationService {
    private final ConversationRepository conversationRepository;
    private final UserRepository userRepository;

    private ConversationEntity getConversationEntityOrThrow(Long id) {
        return conversationRepository.findConversationById(id)
                .orElseThrow(() -> new BusinessException(ErrorCode.CONVERSATION_NOT_FOUND));
    }

    public ConversationResponse createConversation(ConversationRequest request) {
        log.info("Create room chat between User {} and User {}", request.user1Id(), request.user2Id());

        Long user1Id = request.user1Id();
        Long user2Id = request.user2Id();

        // Resolve actual Admin ID if user2Id is the placeholder 1L and user1Id is not the admin
        Long actualAdminId = userRepository.findFirstAdmin()
                .map(User::getId)
                .orElse(1L);

        if (user2Id == 1L && !user1Id.equals(actualAdminId)) {
            user2Id = actualAdminId;
        }

        if (!userRepository.existsById(user1Id)) {
            log.warn("User with ID {} not found", user1Id);
            throw new BusinessException(ErrorCode.USER_NOT_FOUND);
        }

        if (!userRepository.existsById(user2Id)) {
            log.warn("User with ID {} not found", user2Id);
            throw new BusinessException(ErrorCode.USER_NOT_FOUND);
        }

        if (user1Id.equals(user2Id)) {
            log.warn("Users cannot create a chat room with themselves");
            throw new BusinessException(ErrorCode.INVALID_REQUEST);
        }

        Optional<ConversationEntity> existingChat = conversationRepository
                .findChatBetweenUsers(user1Id, user2Id);

        if (existingChat.isPresent()) {
            log.info("Room chat already exists (ID: {}), returning existing one", existingChat.get().getId());
            return toResponse(existingChat.get());
        }

        ConversationEntity conversation = ConversationEntity.builder()
                .type(ConversationType.USER)
                .user1Id(user1Id)
                .user2Id(user2Id)
                .isDeleted(false)
                .build();

        ConversationEntity savedConversation = conversationRepository.saveAndFlush(conversation);
        log.info("Create room chat successfully, room ID: {}", savedConversation.getId());

        return toResponse(savedConversation);
    }

    public ConversationResponse getConversation(Long id){
        log.info("Get room chat");
        ConversationEntity conversation = getConversationEntityOrThrow(id);

        log.debug("Get room chat with id: {} successfully", conversation.getId());
        return toResponse(conversation);
    }

    public List<ConversationResponse> getUserConversations(Long userId) {
        log.info("Get list conversation response for user: {}", userId);
        return listConversation(userId).stream()
                .map(this::toResponse)
                .toList();
    }

    public List<ConversationEntity> listConversation(Long userId){
        log.info("Get list room chat for user {}", userId);
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new BusinessException(ErrorCode.USER_NOT_FOUND));

        if (user.getRoles().contains(Role.ADMIN)) {
            log.info("User is admin, listing all active conversations in system");
            return conversationRepository.findAllActiveConversations();
        }

        log.info("Listing conversations where user {} is a participant", userId);
        return conversationRepository.findAllConversationsByUserId(userId);
    }

    @Transactional
    public ConversationResponse hiddenConversation(Long id){
        log.info("Hidden room chat (Soft delete");
        ConversationEntity conversation = getConversationEntityOrThrow(id);
        conversation.setIsDeleted(true);

        ConversationEntity hidden = conversationRepository.save(conversation);
        log.debug("Hidden room chat with id: {} successfully", conversation.getId());
        return toResponse(hidden);
    }

    @Transactional
    public ConversationResponse showConversation(Long id){
        log.info("Show room chat");
        ConversationEntity conversation = getConversationEntityOrThrow(id);
        conversation.setIsDeleted(false);
        ConversationEntity hidden = conversationRepository.save(conversation);
        log.debug("Show room chat with id: {} successfully", conversation.getId());
        return toResponse(hidden);
    }

    public void validateUserInConversation(Long conversationId, Long userId) {
        log.info("Validate if user {} belongs to conversation {}", userId, conversationId);

        ConversationEntity conversation = getConversationEntityOrThrow(conversationId);

        User user = userRepository.findById(userId)
                .orElseThrow(() -> new BusinessException(ErrorCode.USER_NOT_FOUND));

        boolean isParticipant = user.getRoles().contains(Role.ADMIN)
                || userId.equals(conversation.getUser1Id())
                || userId.equals(conversation.getUser2Id());

        if (!isParticipant) {
            log.warn("Security Alert: User {} tried to access conversation {}", userId, conversationId);
            throw new BusinessException(ErrorCode.CONVERSATION_ACCESS_DENIED);
        }
    }

    private ConversationResponse toResponse(ConversationEntity entity) {
        if (entity == null) {
            return null;
        }

        User user1 = userRepository.findById(entity.getUser1Id()).orElse(null);
        User user2 = userRepository.findById(entity.getUser2Id()).orElse(null);

        String user1Username = user1 != null ? user1.getUsername() : "User";
        String user2Username = user2 != null ? user2.getUsername() : "User";

        String user1AvatarUrl = (user1 != null && user1.getUserProfile() != null) 
                ? user1.getUserProfile().getAvatarUrl() 
                : null;
        String user2AvatarUrl = (user2 != null && user2.getUserProfile() != null) 
                ? user2.getUserProfile().getAvatarUrl() 
                : null;

        return new ConversationResponse(
                entity.getId(),
                entity.getType(),
                entity.getUser1Id(),
                entity.getUser2Id(),
                user1Username,
                user2Username,
                user1AvatarUrl,
                user2AvatarUrl,
                entity.getIsDeleted()
        );
    }
}
