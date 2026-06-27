package com.flix.chat.dao;

import com.flix.chat.entity.ConversationEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.math.BigInteger;
import java.util.List;
import java.util.Optional;

@Repository
public interface ConversationRepository extends JpaRepository<ConversationEntity, Long> {
    @Query("SELECT CASE WHEN COUNT(c) > 0 THEN true ELSE false END " +
            "FROM conversationEntity c " +
            "WHERE (c.user1_id = :userA " +
            "AND c.user2_id = :userB AND c.is_deleted = false) " +
            "OR (c.user1_id = :userB " +
            "AND c.user2_id = :userA AND c.is_deleted = false)")
    boolean existsChatBetweenUsers(@Param("userA") Long userA, @Param("userB") Long userB);

    @Query("SELECT c " +
            "FROM conversationEntity c " +
            "WHERE (c.user1_id = :userA " +
            "AND c.user2_id = :userB AND c.is_deleted = false) " +
            "OR (c.user1_id = :userB " +
            "AND c.user2_id = :userA AND c.is_deleted = false)")
    Optional<ConversationEntity> findChatBetweenUsers(@Param("userA") Long userA, @Param("userB") Long userB);

    @Query("""
        SELECT c FROM conversationEntity c WHERE c.id = :id AND c.is_deleted = false
    """)
    Optional<ConversationEntity> findConversationById(@Param("id") Long id);

    @Query("""
        SELECT c FROM conversationEntity WHERE (c.user1_id = :userId OR c.user2_id = :userId) AND c.is_deleted = false
    """)
    List<ConversationEntity> findAllConversationsByUserId(@Param("userId") Long userId);
}


