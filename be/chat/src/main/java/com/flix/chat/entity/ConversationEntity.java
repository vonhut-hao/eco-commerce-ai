package com.flix.chat.entity;

import com.flix.chat.common.enums.ConversationType;
import com.flix.common.entity.BaseEntity;
import jakarta.persistence.*;
import lombok.*;
import lombok.experimental.FieldDefaults;

import java.time.LocalDateTime;

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
    @Enumerated(EnumType.STRING)
    ConversationType type;

    @Column(name = "user1_id")
    Long user1Id;

    @Column(name = "user2_id")
    Long user2Id;

    @Column(name = "is_deleted")
    Boolean isDeleted = false;
}
