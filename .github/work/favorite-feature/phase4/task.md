# Task: Phase 4 - Frontend API Integration & Service

## 1. Requirements
Implement the frontend service layer to interact with backend favorite endpoints.

## 2. Steps
1. Create [`fe/src/services/favorite.service.ts`](file:///E:/intelljProject/flix-plaftform/fe/src/services/favorite.service.ts):
   - Define interfaces: `FavoriteToggleResponse`, `FavoriteCheckResponse`
   - Implement `favoriteService.toggleFavorite(productId: number)`
   - Implement `favoriteService.getFavorites(page?: number, limit?: number)`
   - Implement `favoriteService.checkIsFavorite(productId: number)`
   - Implement `favoriteService.checkBatchFavorites(productIds: number[])`
