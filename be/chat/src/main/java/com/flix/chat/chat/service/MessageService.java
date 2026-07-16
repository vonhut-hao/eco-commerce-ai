package com.flix.chat.chat.service;

import com.flix.chat.common.dto.MessagesRequest;
import com.flix.chat.common.dto.MessagesResponse;
import com.flix.chat.dao.ConversationRepository;
import com.flix.chat.dao.MessageRepository;
import com.flix.chat.entity.ConversationEntity;
import com.flix.chat.entity.MessageEntity;
import com.flix.common.enums.ErrorCode;
import com.flix.common.exception.BusinessException;
import com.flix.identity.dao.UserRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Slf4j
@Service
@RequiredArgsConstructor
public class MessageService {
    private final MessageRepository messageRepository;
    private final ConversationService conversationService;
    private final ConversationRepository conversationRepository;
    private final UserRepository userRepository;

    private MessageEntity getMessageEntityOrThrow(Long messageId) {
        return messageRepository.findByIdForce(messageId)
                .orElseThrow(() -> new BusinessException(ErrorCode.MESSAGE_NOT_FOUND));
    }

    private void checkUserById(Long idUser) {
        if (!userRepository.existsById(idUser)) {
            throw new BusinessException(ErrorCode.USER_NOT_FOUND);
        }
    }

    @Transactional
    public MessagesResponse saveMessage(MessagesRequest request) {
        log.info("Save new message for conversationId: {}", request.conversationId());

        conversationService.validateUserInConversation(request.conversationId(), request.senderId());
        checkUserById(request.senderId());

        ConversationEntity conversation = conversationRepository.findById(request.conversationId())
                .orElseThrow(() -> new BusinessException(ErrorCode.CONVERSATION_NOT_FOUND));

        MessageEntity message = MessageEntity.builder()
                .content(request.content())
                .conversation(conversation)
                .senderId(request.senderId())
                .fileUrl(request.fileUrl())
                .isDeleted(false)
                .build();

        MessageEntity savedMessage = messageRepository.save(message);
        log.debug("Saved message successfully with id: {}", savedMessage.getId());
        return MessagesResponse.from(savedMessage);
    }

    @Transactional(readOnly = true)
    public List<MessagesResponse> getAllMessage(Long conversationId, Long userId) {
        log.info("Fetching messages for conversationId: {} and userId: {}", conversationId, userId);

        conversationService.validateUserInConversation(conversationId, userId);

        List<MessageEntity> messages = messageRepository.findTop100ByConversation_IdAndIsDeletedFalseOrderByCreatedAtAsc(conversationId);
        log.info("Found {} messages in DB for conversationId: {}", messages.size(), conversationId);

        return messages.stream()
                .map(MessagesResponse::from)
                .toList();
    }

    @Transactional
    public MessagesResponse hiddenMessage(Long messageId, Long userId) {
        log.info("Hide message ID: {} by userId: {}", messageId, userId);
        MessageEntity existingMessage = getMessageEntityOrThrow(messageId);
        checkUserById(userId);

        if (!existingMessage.getSenderId().equals(userId)) {
            log.warn("User {} unauthorized to hide message {}", userId, messageId);
            throw new BusinessException(ErrorCode.MESSAGE_DELETE_DENIED);
        }

        existingMessage.setIsDeleted(true);
        MessageEntity hidden = messageRepository.save(existingMessage);

        return MessagesResponse.from(hidden);
    }

    @Transactional
    public MessagesResponse showMessage(Long messageId, Long userId) {
        log.info("Show message ID: {} by userId: {}", messageId, userId);
        MessageEntity existingMessage = getMessageEntityOrThrow(messageId);
        checkUserById(userId);

        if (!existingMessage.getSenderId().equals(userId)) {
            log.warn("User {} unauthorized to show message {}", userId, messageId);
            throw new BusinessException(ErrorCode.MESSAGE_UPDATE_DENIED);
        }

        existingMessage.setIsDeleted(false);
        MessageEntity shown = messageRepository.save(existingMessage);

        return MessagesResponse.from(shown);
    }
}