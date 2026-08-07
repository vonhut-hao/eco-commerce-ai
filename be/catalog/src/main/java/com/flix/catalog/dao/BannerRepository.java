package com.flix.catalog.dao;

import com.flix.catalog.entity.BannerEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface BannerRepository extends JpaRepository<BannerEntity, Long> {
    List<BannerEntity> findAllByIsActiveTrueOrderByDisplayOrderAsc();
    List<BannerEntity> findAllByOrderByDisplayOrderAsc();
}
