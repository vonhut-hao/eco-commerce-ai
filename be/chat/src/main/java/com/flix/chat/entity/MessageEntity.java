package com.flix.chat.entity;

import com.flix.common.entity.BaseEntity;
import jakarta.persistence.*;
import lombok.*;
import lombok.experimental.FieldDefaults;

@Entity
@Table(name = "messages")
@Getter
@Setter
@Builder
@AllArgsConstructor
@NoArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE)
public class MessageEntity extends BaseEntity {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    Long id;

    @Column(name = "content", columnDefinition = "TEXT")
    String content;

    @Column(name = "sender_id")
    Long senderId;

    @Column(name = "file_url", length = 255)
    String fileUrl;

    @Builder.Default
    @Column(name = "is_deleted")
    Boolean isDeleted = false;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "conversation_id")
    ConversationEntity conversation;
}