package com.flix.chat.entity;

import com.flix.common.entity.BaseEntity;
import jakarta.persistence.*;
import lombok.*;
import lombok.experimental.FieldDefaults;

import java.time.LocalDateTime;

@Entity
@Table(name = "messages")
@Getter
@Setter
@Builder
@AllArgsConstructor
@NoArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE)
public class MessageEntity extends BaseEntity{
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    Long id;

    @Column(name = "content")
    String content;

    @Column(name = "sender_id")
    Long senderId;

    @Column(name = "file_url", length = 255)
    String fileUrl;

    @Column(name = "is_deleted")
    Boolean isDeleted = false;

    @ManyToOne
    @JoinColumn(name = "conversation_id")
    private ConversationEntity conversation;
}
