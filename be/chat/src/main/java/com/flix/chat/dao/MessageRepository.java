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

    @Query("SELECT m FROM MessageEntity m WHERE m.id = :id AND m.isDeleted = false")
    Optional<MessageEntity> findMessageById(@Param("id") Long id);

    List<MessageEntity> findTop100ByConversation_IdAndIsDeletedFalseOrderByCreatedAtAsc(Long conversationId);

    @Query(value = "SELECT * FROM messages WHERE id = :id", nativeQuery = true)
    Optional<MessageEntity> findByIdForce(@Param("id") Long id);
}