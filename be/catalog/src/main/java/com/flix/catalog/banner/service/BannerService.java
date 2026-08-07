package com.flix.catalog.banner.service;

import com.flix.catalog.common.dto.BannerRequest;
import com.flix.catalog.common.dto.BannerResponse;
import com.flix.catalog.dao.BannerRepository;
import com.flix.catalog.entity.BannerEntity;
import com.flix.common.exception.BusinessException;
import com.flix.common.enums.ErrorCode;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Slf4j
public class BannerService {

    private final BannerRepository bannerRepository;

    @Transactional(readOnly = true)
    public List<BannerResponse> getActiveBanners() {
        return bannerRepository.findAllByIsActiveTrueOrderByDisplayOrderAsc()
                .stream()
                .map(BannerResponse::fromEntity)
                .collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public List<BannerResponse> getAllBanners() {
        return bannerRepository.findAllByOrderByDisplayOrderAsc()
                .stream()
                .map(BannerResponse::fromEntity)
                .collect(Collectors.toList());
    }

    @Transactional
    public BannerResponse createBanner(BannerRequest request) {
        BannerEntity banner = new BannerEntity();
        banner.setImageUrl(request.imageUrl());
        banner.setTitle(request.title());
        banner.setLinkUrl(request.linkUrl());
        banner.setDisplayOrder(request.displayOrder());
        banner.setIsActive(request.isActive());
        
        banner = bannerRepository.save(banner);
        return BannerResponse.fromEntity(banner);
    }

    @Transactional
    public BannerResponse updateBanner(Long id, BannerRequest request) {
        BannerEntity banner = bannerRepository.findById(id)
                .orElseThrow(() -> new BusinessException(ErrorCode.BANNER_NOT_FOUND));

        banner.setImageUrl(request.imageUrl());
        banner.setTitle(request.title());
        banner.setLinkUrl(request.linkUrl());
        banner.setDisplayOrder(request.displayOrder());
        banner.setIsActive(request.isActive());

        banner = bannerRepository.save(banner);
        return BannerResponse.fromEntity(banner);
    }

    @Transactional
    public void deleteBanner(Long id) {
        BannerEntity banner = bannerRepository.findById(id)
                .orElseThrow(() -> new BusinessException(ErrorCode.BANNER_NOT_FOUND));
        bannerRepository.delete(banner);
    }
}
