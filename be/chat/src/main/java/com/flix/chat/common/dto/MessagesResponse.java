package com.flix.chat.common.dto;

import com.fasterxml.jackson.annotation.JsonInclude;
import com.flix.chat.entity.MessageEntity;

import java.math.BigInteger;

@JsonInclude(JsonInclude.Include.NON_NULL)
public record MessagesResponse(
        Long id,
        String content,
        Long conversation_id,
        Long sender_id,
        String file_url,
        Boolean is_deleted
) {
    public static MessagesResponse from(MessageEntity entity){
        if(entity == null){ //check null entity
            return null;
        }

        return new MessagesResponse(
                entity.getId(),
                entity.getContent(),
                entity.getConversation_id(),
                entity.getSender_id(),
                entity.getFile_url(),
                entity.getIs_deleted()
        );
    }
}


