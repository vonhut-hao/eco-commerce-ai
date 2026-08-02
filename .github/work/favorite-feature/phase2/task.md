# Task: Phase 2 - Repository & Service Layer

## 1. Requirements
Implement data access repositories, request/response DTOs, and the core business service logic for toggling, adding, removing, and fetching user favorite products.

## 2. Steps
1. Create Repository [`UserFavoriteRepository.java`](file:///E:/intelljProject/flix-plaftform/be/catalog/src/main/java/com/flix/catalog/dao/UserFavoriteRepository.java):
   - `Optional<UserFavoriteEntity> findByUserIdAndProductId(Long userId, Long productId)`
   - `boolean existsByUserIdAndProductId(Long userId, Long productId)`
   - `Page<UserFavoriteEntity> findByUserId(Long userId, Pageable pageable)`
   - `void deleteByUserIdAndProductId(Long userId, Long productId)`
   - `List<UserFavoriteEntity> findByUserIdAndProductIdIn(Long userId, List<Long> productIds)`

2. Create DTOs:
   - [`FavoriteToggleResponse.java`](file:///E:/intelljProject/flix-plaftform/be/catalog/src/main/java/com/flix/catalog/common/dto/FavoriteToggleResponse.java): `(Long productId, boolean isFavorite, String message)`
   - [`FavoriteCheckResponse.java`](file:///E:/intelljProject/flix-plaftform/be/catalog/src/main/java/com/flix/catalog/common/dto/FavoriteCheckResponse.java): `(Long productId, boolean isFavorite)`

3. Create Service [`FavoriteService.java`](file:///E:/intelljProject/flix-plaftform/be/catalog/src/main/java/com/flix/catalog/favorite/FavoriteService.java) and implementation [`FavoriteServiceImpl.java`](file:///E:/intelljProject/flix-plaftform/be/catalog/src/main/java/com/flix/catalog/favorite/FavoriteServiceImpl.java):
   - `toggleFavorite(Long userId, Long productId)`
   - `getUserFavorites(Long userId, Pageable pageable)`
   - `isFavorite(Long userId, Long productId)`
   - `getFavoriteStatuses(Long userId, List<Long> productIds)`
