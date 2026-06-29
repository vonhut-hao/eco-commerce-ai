package com.flix.catalog.entity;

import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.HashSet;
import java.util.List;
import java.util.Set;

@Getter
@Setter
@Entity
@Table(name = "products")
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class ProductEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String name;

    @Column(nullable = false)
    private Long price;

    @Column(nullable = false)
    @Builder.Default
    private int stock = 0;

    @Builder.Default
    private Integer greenPoints = 0;

    @Column(length = 50)
    private String ecoFriendliness;

    private Double carbonIndex;

    @Builder.Default
    private Double avgRating = 0.0;

    @Column(length = 255)
    private String mainImage;

    @Column(columnDefinition = "TEXT")
    private String subImages;

    @Column(length = 100)
    private LocalDateTime deletedAt;

    // --- Relationships ---

    @ManyToMany
    @JoinTable(
            name = "category_product",
            joinColumns = @JoinColumn(name = "product_id"),
            inverseJoinColumns = @JoinColumn(name = "category_id")
    )
    @Builder.Default
    private Set<CategoryEntity> categories = new HashSet<>();

    @ManyToMany
    @JoinTable(
            name = "product_material",
            joinColumns = @JoinColumn(name = "product_id"),
            inverseJoinColumns = @JoinColumn(name = "material_id")
    )
    @Builder.Default
    private List<MaterialEntity> materials = new ArrayList<>();

    @OneToMany(mappedBy = "productEntity", cascade = {CascadeType.PERSIST, CascadeType.MERGE,  CascadeType.REFRESH, CascadeType.DETACH})
    @Builder.Default
    private Set<GreenCertificateEntity> greenCertificates = new HashSet<>();

    @OneToMany(mappedBy = "productEntity", cascade = CascadeType.ALL, orphanRemoval = true)
    @Builder.Default
    private List<CommentEntity> comments = new ArrayList<>();
}
