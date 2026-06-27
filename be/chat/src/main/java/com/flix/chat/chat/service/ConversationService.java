package com.flix.chat.chat.service;

import com.flix.chat.common.dto.ConversationRequest;
import com.flix.chat.common.dto.ConversationResponse;
import com.flix.chat.dao.ConversationRepository;
import com.flix.chat.entity.ConversationEntity;
import com.flix.common.enums.ErrorCode;
import com.flix.common.exception.BusinessException;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Optional;

@Slf4j
@Service
@RequiredArgsConstructor
public class ConversationService {
    private final ConversationRepository conversationRepository;

    private ConversationEntity getConversationEntityOrThrow(Long id) {
        return conversationRepository.findConversationById(id)
                .orElseThrow(() -> new BusinessException(ErrorCode.CONVERSATION_NOT_FOUND));
    }

    public ConversationResponse createConversation(ConversationRequest request) {
        log.info("Create room chat");
        Optional<ConversationEntity> existingChat = conversationRepository
                .findChatBetweenUsers(request.user1_id(), request.user2_id());

        if (existingChat.isPresent()) {
            log.info("Room chat already exists, fetching the existing one");
            return ConversationResponse.from(existingChat.get());
        }
        ConversationEntity conversation = ConversationEntity.builder()
                .type(request.type())
                .user1_id(request.user1_id())
                .user2_id(request.user2_id())
                .is_deleted(false)
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
        conversation.setIs_deleted(true);

        ConversationEntity hidden = conversationRepository.save(conversation);
        log.debug("Hidden room chat with id: {} successfully", conversation.getId());
        return ConversationResponse.from(hidden);
    }

    @Transactional
    public ConversationResponse showConversation(Long id){
        log.info("Show room chat");
        ConversationEntity conversation = getConversationEntityOrThrow(id);
        conversation.setIs_deleted(false);
        ConversationEntity hidden = conversationRepository.save(conversation);
        log.debug("Show room chat with id: {} successfully", conversation.getId());
        return ConversationResponse.from(hidden);
    }
}
