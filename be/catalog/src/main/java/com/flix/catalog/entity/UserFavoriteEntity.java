package com.flix.catalog.entity;

import com.flix.identity.entity.User;
import jakarta.persistence.*;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.time.LocalDateTime;

@Getter
@Setter
@NoArgsConstructor
@Entity
@Table(
    name = "user_product_favorites",
    uniqueConstraints = {
        @UniqueConstraint(name = "uk_user_product_favorite", columnNames = {"user_id", "product_id"})
    }
)
public class UserFavoriteEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "product_id", nullable = false)
    private ProductEntity product;

    @Column(name = "created_at", nullable = false, updatable = false)
    private LocalDateTime createdAt = LocalDateTime.now();

    public UserFavoriteEntity(User user, ProductEntity product) {
        this.user = user;
        this.product = product;
        this.createdAt = LocalDateTime.now();
    }
}
