package com.flix.chat.entity;

import com.flix.chat.common.enums.ConversationType;
import com.flix.common.entity.BaseEntity;
import jakarta.persistence.*;
import lombok.*;
import lombok.experimental.FieldDefaults;

@Entity
@Table(name = "conversations")
@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE)
public class ConversationEntity extends BaseEntity {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    Long id;

    @Column(name = "type", length = 50)
    ConversationType type; //chat with user / bot chat

    @Column(name = "user1_id")
    Long user1_id;

    @Column(name = "user2_id")
    Long user2_id;

    @Column(name = "is_delete")
    Boolean is_deleted;
}
