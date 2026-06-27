package com.flix.chat.common.dto;

import com.flix.chat.common.enums.ConversationType;
import com.flix.chat.entity.ConversationEntity;

import java.math.BigInteger;

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
                entity.getUser1_id(),
                entity.getUser2_id(),
                entity.getIs_deleted()
        );
    }
}
