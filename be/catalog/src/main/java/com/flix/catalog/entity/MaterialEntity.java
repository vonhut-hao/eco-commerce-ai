package com.flix.catalog.entity;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@Getter
@Setter
@Entity
@Table(name = "materials")
public class MaterialEntity{

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, length = 100)
    private String name;

    @Column(length = 50)
    private String type;

    @Column(nullable = false)
    private double ecoRating = 0.0;

    @Column(name = "deleted_at")
    private LocalDateTime deleteAt;

    @ManyToMany(mappedBy = "materials")
    private List<ProductEntity> productEntities = new ArrayList<>();
}