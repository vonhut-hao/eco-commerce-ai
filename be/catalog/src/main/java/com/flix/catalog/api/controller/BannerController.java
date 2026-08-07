package com.flix.catalog.api.controller;

import com.flix.catalog.banner.service.BannerService;
import com.flix.catalog.common.dto.BannerResponse;
import com.flix.common.dto.ApiResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/v1/banners")
@RequiredArgsConstructor
public class BannerController {

    private final BannerService bannerService;

    @GetMapping
    public ApiResponse<List<BannerResponse>> getActiveBanners() {
        return ApiResponse.success(bannerService.getActiveBanners());
    }
}
