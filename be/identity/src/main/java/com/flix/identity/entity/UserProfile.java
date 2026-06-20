package com.flix.identity.entity;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "user_profiles")
@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class UserProfile {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id")
    private Long id;

    private String avatarUrl;

    @Column(length = 100, nullable = false)
    private String fullName;

    @Column(length = 15)
    private String phoneNumber;

    @OneToOne
    @JoinColumn(name = "user_id", unique = true)
    private User user;


}
