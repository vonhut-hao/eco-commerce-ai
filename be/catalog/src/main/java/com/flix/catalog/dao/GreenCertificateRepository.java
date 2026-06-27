package com.flix.catalog.dao;

import com.flix.catalog.entity.GreenCertificateEntity;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface GreenCertificateRepository extends JpaRepository<GreenCertificateEntity, Long> {
    Optional<GreenCertificateEntity> findByName(String name);

    List<GreenCertificateEntity> findByDeletedAtIsNull();
}