package com.flix.chat.common.dto;

import com.flix.chat.common.enums.ConversationType;
import com.flix.chat.entity.ConversationEntity;

import java.math.BigInteger;
import java.time.LocalDateTime;

public record ConversationResponse(
        Long id,
        ConversationType type,
        Long user1_id,
        Long user2_id,
        Boolean is_deleted
) {
    public static ConversationResponse from(ConversationEntity entity) {
        if(entity == null){
            return null;
        }

        return new ConversationResponse(
                entity.getId(),
                entity.getType(),
                entity.getUser1Id(),
                entity.getUser2Id(),
                entity.getIsDeleted()
        );
    }
}
