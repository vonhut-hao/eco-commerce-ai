package com.flix.chat.common.dto;

import com.flix.chat.common.enums.ConversationType;
import com.flix.chat.entity.ConversationEntity;

public record ConversationResponse(
        Long id,
        ConversationType type,
        Long user1_id,
        Long user2_id,
        String user1Username,
        String user2Username,
        String user1AvatarUrl,
        String user2AvatarUrl,
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
                null,
                null,
                null,
                null,
                entity.getIsDeleted()
        );
    }
}
