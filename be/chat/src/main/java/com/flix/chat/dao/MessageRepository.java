package com.flix.chat.dao;

import com.flix.chat.entity.MessageEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface MessageRepository extends JpaRepository<MessageEntity, Long> {
    @Query("""
        SELECT m FROM MessageEntity m WHERE m.id = :id AND c.is_deleted = false
    """)
    Optional<MessageEntity> findMessageById(@Param("id") Long id);

    @Query("""
        SELECT m FROM MessageEntity m WHERE m.conversation_id = :conversation_id AND c.is_deleted = false ORDER BY m.createdAt ASC
    """)
    List<MessageEntity> findAllByConversationIdOrderByCreatedAtAsc(@Param("conversation_id") Long conversation_id);
}
