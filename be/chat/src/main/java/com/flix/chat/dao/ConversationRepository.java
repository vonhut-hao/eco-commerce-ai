package com.flix.chat.dao;

import com.flix.chat.entity.ConversationEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface ConversationRepository extends JpaRepository<ConversationEntity, Long> {

    @Query("SELECT CASE WHEN COUNT(c) > 0 THEN true ELSE false END " +
            "FROM ConversationEntity c " +
            "WHERE (c.user1Id = :userA " +
            "AND c.user2Id = :userB AND c.isDeleted = false) " +
            "OR (c.user1Id = :userB " +
            "AND c.user2Id = :userA AND c.isDeleted = false)")
    boolean existsChatBetweenUsers(@Param("userA") Long userA, @Param("userB") Long userB);

    @Query("SELECT c " +
            "FROM ConversationEntity c " +
            "WHERE (c.user1Id = :userA " +
            "AND c.user2Id = :userB AND c.isDeleted = false) " +
            "OR (c.user1Id = :userB " +
            "AND c.user2Id = :userA AND c.isDeleted = false)")
    Optional<ConversationEntity> findChatBetweenUsers(@Param("userA") Long userA, @Param("userB") Long userB);

    @Query("""
        SELECT c FROM ConversationEntity c WHERE c.id = :id AND c.isDeleted = false
    """)
    Optional<ConversationEntity> findConversationById(@Param("id") Long id);

    @Query("""
        SELECT c FROM ConversationEntity c WHERE (c.user1Id = :userId OR c.user2Id = :userId) AND c.isDeleted = false
    """)
    List<ConversationEntity> findAllConversationsByUserId(@Param("userId") Long userId);
}