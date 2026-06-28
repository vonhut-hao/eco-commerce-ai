package com.flix.chat.chat.service;

import com.flix.chat.common.dto.ConversationRequest;
import com.flix.chat.common.dto.ConversationResponse;
import com.flix.chat.dao.ConversationRepository;
import com.flix.chat.entity.ConversationEntity;
import com.flix.common.enums.ErrorCode;
import com.flix.common.exception.BusinessException;
import com.flix.identity.dao.UserRepository;
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
        log.info("Create room chat");

        if(!userRepository.existsById(request.user1Id()) || !userRepository.existsById(request.user2Id())){
            throw new BusinessException(ErrorCode.USER_NOT_FOUND);
        }

        Optional<ConversationEntity> existingChat = conversationRepository
                .findChatBetweenUsers(request.user1Id(), request.user2Id());

        if (existingChat.isPresent()) {
            log.info("Room chat already exists, fetching the existing one");
            return ConversationResponse.from(existingChat.get());
        }
        ConversationEntity conversation = ConversationEntity.builder()
                .type(request.type())
                .user1Id(request.user1Id())
                .user2Id(request.user2Id())
                .isDeleted(false)
                .build();

        ConversationEntity savedConversation = conversationRepository.save(conversation);
        log.debug("Create room chat id: {}", savedConversation.getId());
        log.info("Create room chat successfully");

        return ConversationResponse.from(savedConversation);
    }

    public ConversationResponse getConversation(Long id){
        log.info("Get room chat");
        ConversationEntity conversation = getConversationEntityOrThrow(id);

        log.debug("Get room chat with id: {} successfully", conversation.getId());
        return ConversationResponse.from(conversation);
    }

    public List<ConversationEntity> listConversation(Long userId){
        log.info("Get list room chat");
        List<ConversationEntity> conversations = conversationRepository.findAllConversationsByUserId(userId);
        log.info("Get list room chat successfully");
        return conversations;
    }

    @Transactional
    public ConversationResponse hiddenConversation(Long id){
        log.info("Hidden room chat (Soft delete");
        ConversationEntity conversation = getConversationEntityOrThrow(id);
        conversation.setIsDeleted(true);

        ConversationEntity hidden = conversationRepository.save(conversation);
        log.debug("Hidden room chat with id: {} successfully", conversation.getId());
        return ConversationResponse.from(hidden);
    }

    @Transactional
    public ConversationResponse showConversation(Long id){
        log.info("Show room chat");
        ConversationEntity conversation = getConversationEntityOrThrow(id);
        conversation.setIsDeleted(false);
        ConversationEntity hidden = conversationRepository.save(conversation);
        log.debug("Show room chat with id: {} successfully", conversation.getId());
        return ConversationResponse.from(hidden);
    }

    public void validateUserInConversation(Long conversationId, Long userId) {
        log.info("Validate if user {} belongs to conversation {}", userId, conversationId);

        ConversationEntity conversation = getConversationEntityOrThrow(conversationId);

        boolean isParticipant = userId.equals(conversation.getUser1Id())
                || userId.equals(conversation.getUser2Id());

        if (!isParticipant) {
            log.warn("Security Alert: User {} tried to access conversation {}", userId, conversationId);
            throw new BusinessException(ErrorCode.CONVERSATION_ACCESS_DENIED);
        }
    }
}
