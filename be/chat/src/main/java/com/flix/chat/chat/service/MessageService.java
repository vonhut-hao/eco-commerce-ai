package com.flix.chat.chat.service;

import com.flix.chat.common.dto.MessagesRequest;
import com.flix.chat.common.dto.MessagesResponse;
import com.flix.chat.dao.MessageRepository;
import com.flix.chat.entity.MessageEntity;
import com.flix.common.enums.ErrorCode;
import com.flix.common.exception.BusinessException;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j; // Thêm mã Slf4j để ghi log
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Slf4j
@Service
@RequiredArgsConstructor
public class MessageService {
    private final MessageRepository messageRepository;
    private final ConversationService conversationService;

    private MessageEntity getMessageEntityOrThrow(Long messageId) {
        return messageRepository.findMessageById(messageId)
                .orElseThrow(() -> new BusinessException(ErrorCode.MESSAGE_NOT_FOUND));
    }

    public MessagesResponse saveMessage(MessagesRequest request) {
        log.info("Save new message");
        conversationService.getConversation(request.conversation_id());

        MessageEntity message = MessageEntity.builder()
                .content(request.content())
                .conversation_id(request.conversation_id())
                .sender_id(request.sender_id())
                .file_url(request.file_url())
                .is_deleted(false)
                .build();

        MessageEntity savedMessage = messageRepository.save(message);
        log.debug("Save message with id: {} successfully", savedMessage.getId());
        return MessagesResponse.from(savedMessage);
    }

    @Transactional
    public MessagesResponse updateMessage(Long messageId, Long userId, MessagesRequest request) {
        log.info("Update message content");
        MessageEntity existingMessage = getMessageEntityOrThrow(messageId);

        if (!existingMessage.getSender_id().equals(userId)) {
            log.warn("User {} tried to update message {} owned by {}", userId, messageId, existingMessage.getSender_id());
            throw new BusinessException(ErrorCode.MESSAGE_UPDATE_DENIED);
        }

        if (request.content() != null && !request.content().isBlank()) {
            existingMessage.setContent(request.content());
        }

        MessageEntity updated = messageRepository.save(existingMessage);
        log.debug("Update message with id: {} successfully", updated.getId());
        return MessagesResponse.from(updated);
    }

    public MessagesResponse getMessage(Long messageId) {
        log.info("Get detail message");
        MessageEntity existingMessage = getMessageEntityOrThrow(messageId);

        log.debug("Get detail message with id: {} successfully", existingMessage.getId());
        return MessagesResponse.from(existingMessage);
    }

    public List<MessagesResponse> getAllMessage(Long conversationId) {
        log.info("Get all messages for conversation");
        conversationService.getConversation(conversationId);

        List<MessageEntity> messages = messageRepository.findAllByConversationIdOrderByCreatedAtAsc(conversationId);
        log.info("Get all messages successfully, total records: {}", messages.size());
        return messages.stream()
                .map(MessagesResponse::from)
                .toList();
    }

    @Transactional
    public MessagesResponse hiddenMessage(Long messageId, Long userId) {
        log.info("Hidden message (Soft delete)");
        MessageEntity existingMessage = getMessageEntityOrThrow(messageId);

        if (!existingMessage.getSender_id().equals(userId)) {
            log.warn("User {} unauthorized to hide message {}", userId, messageId);
            throw new BusinessException(ErrorCode.MESSAGE_DELETE_DENIED);
        }

        existingMessage.setIs_deleted(true);
        MessageEntity hidden = messageRepository.save(existingMessage);

        log.debug("Hidden message with id: {} successfully", hidden.getId());
        return MessagesResponse.from(hidden);
    }

    @Transactional
    public MessagesResponse showMessage(Long messageId, Long userId) {
        log.info("Show message");
        MessageEntity existingMessage = getMessageEntityOrThrow(messageId);

        if (!existingMessage.getSender_id().equals(userId)) {
            log.warn("User {} unauthorized to show message {}", userId, messageId);
            throw new BusinessException(ErrorCode.MESSAGE_UPDATE_DENIED);
        }

        existingMessage.setIs_deleted(false);
        MessageEntity shown = messageRepository.save(existingMessage);

        log.debug("Show message with id: {} successfully", shown.getId());
        return MessagesResponse.from(shown);
    }
}