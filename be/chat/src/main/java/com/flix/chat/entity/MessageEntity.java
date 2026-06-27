package com.flix.chat.entity;

import com.flix.common.entity.BaseEntity;
import jakarta.persistence.*;
import lombok.*;
import lombok.experimental.FieldDefaults;

@Entity
@Table(name = "messsages")
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

    @Column(name = "conversation_id")
    Long conversation_id;

    @Column(name = "sender_id")
    Long sender_id;

    @Column(name = "file_url", length = 255)
    String file_url;

    @Column(name = "is_delete")
    Boolean is_deleted;

    @ManyToOne
    @JoinColumn(name = "conversation_id", unique = true)
    private ConversationEntity conversation;
}
