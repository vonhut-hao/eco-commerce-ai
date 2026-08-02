package com.flix.catalog.api.controller;

import com.flix.catalog.common.dto.BatchFavoriteCheckRequest;
import com.flix.catalog.common.dto.FavoriteCheckResponse;
import com.flix.catalog.common.dto.FavoriteToggleResponse;
import com.flix.catalog.common.dto.ProductEntityResponse;
import com.flix.catalog.favorite.service.FavoriteService;
import com.flix.common.dto.ApiResponse;
import com.flix.common.util.SecurityUtils;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.http.HttpStatus;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.oauth2.jwt.Jwt;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequiredArgsConstructor
@RequestMapping("/v1/catalog/favorites")
public class FavoriteController {

    private final FavoriteService favoriteService;

    @PostMapping("/{productId}/toggle")
    @ResponseStatus(HttpStatus.OK)
    @PreAuthorize("isAuthenticated()")
    public ApiResponse<FavoriteToggleResponse> toggleFavorite(
            @PathVariable("productId") Long productId,
            @AuthenticationPrincipal Jwt jwt) {
        Long currentUserId = SecurityUtils.getCurrentUserId(jwt);
        return ApiResponse.success(favoriteService.toggleFavorite(currentUserId, productId));
    }

    @GetMapping
    @ResponseStatus(HttpStatus.OK)
    @PreAuthorize("isAuthenticated()")
    public ApiResponse<Page<ProductEntityResponse>> getUserFavorites(
            @RequestParam(name = "page", defaultValue = "0") int page,
            @RequestParam(name = "size", defaultValue = "20") int size,
            @AuthenticationPrincipal Jwt jwt) {
        Long currentUserId = SecurityUtils.getCurrentUserId(jwt);
        Pageable pageable = PageRequest.of(page, size, Sort.by("createdAt").descending());
        return ApiResponse.success(favoriteService.getUserFavorites(currentUserId, pageable));
    }

    @GetMapping("/check/{productId}")
    @ResponseStatus(HttpStatus.OK)
    @PreAuthorize("isAuthenticated()")
    public ApiResponse<FavoriteCheckResponse> checkFavorite(
            @PathVariable("productId") Long productId,
            @AuthenticationPrincipal Jwt jwt) {
        Long currentUserId = SecurityUtils.getCurrentUserId(jwt);
        return ApiResponse.success(favoriteService.isFavorite(currentUserId, productId));
    }

    /**
     * Batch checks the favorite status of multiple products for the authenticated user.
     *
     * <p><b>Frontend Integration Guide :</b></p>
     * <ul>
     *   <li><b>Purpose:</b> Used to dynamically overlay favorite statuses (❤️ / 🤍) onto a product list
     *       after fetching the main product catalog.</li>
     *   <li><b>Usage Flow:</b>
     *     <ol>
     *       <li>Fetch the product list from the public product endpoint (e.g., {@code GET /v1/catalog/products}).</li>
     *       <li>Extract all {@code productId}s displayed on the current page.</li>
     *       <li>Call this endpoint with the extracted {@code productIds} payload.</li>
     *       <li>Match the response items by {@code productId} to render the favorite state for each item.</li>
     *     </ol>
     *   </li>
     * </ul>
     *
     * @param request The request body containing the list of product IDs to check ({@link BatchFavoriteCheckRequest}).
     * @param jwt     The JWT authentication token injected by Spring Security to identify the current user.
     * @return An {@link ApiResponse} wrapping a list of {@link FavoriteCheckResponse} objects
     *         containing each product ID and its favorite state ({@code true}/{@code false}).
     *
     * @see BatchFavoriteCheckRequest
     * @see FavoriteCheckResponse
     * @see ApiResponse
     */
    @PostMapping("/check-batch")
    @ResponseStatus(HttpStatus.OK)
    @PreAuthorize("isAuthenticated()")
    public ApiResponse<List<FavoriteCheckResponse>> batchCheckFavorites(
            @RequestBody BatchFavoriteCheckRequest request,
            @AuthenticationPrincipal Jwt jwt) {
        Long currentUserId = SecurityUtils.getCurrentUserId(jwt);
        return ApiResponse.success(favoriteService.batchCheckFavorites(currentUserId, request.productIds()));
    }
}
