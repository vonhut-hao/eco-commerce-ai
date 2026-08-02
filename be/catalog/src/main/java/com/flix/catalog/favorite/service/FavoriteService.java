package com.flix.catalog.favorite.service;

import com.flix.catalog.common.dto.FavoriteCheckResponse;
import com.flix.catalog.common.dto.FavoriteToggleResponse;
import com.flix.catalog.common.dto.ProductEntityResponse;
import com.flix.catalog.dao.ProductRepository;
import com.flix.catalog.dao.UserFavoriteRepository;
import com.flix.catalog.entity.UserFavoriteEntity;
import com.flix.common.enums.ErrorCode;
import com.flix.common.exception.BusinessException;
import com.flix.identity.dao.UserRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Set;

@Service
@RequiredArgsConstructor
@Slf4j
@Transactional
public class FavoriteService {

    private final UserFavoriteRepository userFavoriteRepository;
    private final ProductRepository productRepository;
    private final UserRepository userRepository;

    public FavoriteToggleResponse toggleFavorite(Long userId, Long productId) {
        var existingFav = userFavoriteRepository.findByUserIdAndProductId(userId, productId);

        if (existingFav.isPresent()) {
            userFavoriteRepository.delete(existingFav.get());
            log.info("User {} removed product {} from favorites", userId, productId);
            return new FavoriteToggleResponse(productId, false, "Product removed from favorites");
        } else {
            var user = userRepository.findById(userId)
                    .orElseThrow(() -> new BusinessException(ErrorCode.USER_NOT_FOUND));
            var product = productRepository.findById(productId)
                    .orElseThrow(() -> new BusinessException(ErrorCode.PRODUCT_NOT_FOUND));

            UserFavoriteEntity favorite = new UserFavoriteEntity(user, product);
            userFavoriteRepository.save(favorite);
            log.info("User {} added product {} to favorites", userId, productId);
            return new FavoriteToggleResponse(productId, true, "Product added to favorites");
        }
    }

    @Transactional(readOnly = true)
    public Page<ProductEntityResponse> getUserFavorites(Long userId, Pageable pageable) {
        log.info("Fetch favorites for user {}", userId);
        return userFavoriteRepository.findByUserId(userId, pageable)
                .map(fav -> ProductEntityResponse.from(fav.getProduct()));
    }

    @Transactional(readOnly = true)
    public FavoriteCheckResponse isFavorite(Long userId, Long productId) {
        boolean isFav = userFavoriteRepository.existsByUserIdAndProductId(userId, productId);
        return new FavoriteCheckResponse(productId, isFav);
    }

    @Transactional(readOnly = true)
    public List<FavoriteCheckResponse> batchCheckFavorites(Long userId, List<Long> productIds) {
        if (productIds == null || productIds.isEmpty()) {
            return List.of();
        }
        List<Long> favoritedIds = userFavoriteRepository.findFavoritedProductIdsByUserIdAndProductIdIn(userId, productIds);
        Set<Long> favoritedSet = Set.copyOf(favoritedIds);

        return productIds.stream()
                .map(id -> new FavoriteCheckResponse(id, favoritedSet.contains(id)))
                .toList();
    }
}
