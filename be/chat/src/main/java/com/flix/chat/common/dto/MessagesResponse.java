package com.flix.chat.common.dto;

import com.fasterxml.jackson.annotation.JsonInclude;
import com.flix.chat.entity.MessageEntity;

@JsonInclude(JsonInclude.Include.NON_NULL)
public record MessagesResponse(
        Long id,
        String content,
        Long conversationId, // Đã mở comment và sửa đúng camelCase chuẩn Java
        Long senderId,
        String fileUrl,
        Boolean isDeleted
) {
    public static MessagesResponse from(MessageEntity entity){
        if(entity == null){
            return null;
        }

        return new MessagesResponse(
                entity.getId(),
                entity.getContent(),
                entity.getConversation() != null ? entity.getConversation().getId() : null,
                entity.getSenderId(),
                entity.getFileUrl(),
                entity.getIsDeleted()
        );
    }
}