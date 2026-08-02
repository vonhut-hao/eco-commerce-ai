# Task: Phase 3 - REST API Controller & Security Wiring

## 1. Requirements
Expose REST API endpoints for user product favorites under `/v1/catalog/favorites` and configure Spring Security.

## 2. Steps
1. Create Controller [`FavoriteController.java`](file:///E:/intelljProject/flix-plaftform/be/catalog/src/main/java/com/flix/catalog/api/controller/FavoriteController.java):
   - `@PostMapping("/{productId}/toggle")`: Toggle favorite status for authenticated user.
   - `@GET`: Paginated list of favorited products for current user.
   - `@GET("/check/{productId}")`: Check single product favorite status.
   - `@POST("/check-batch")`: Batch check favorite status for array of product IDs.

2. Security Verification:
   - Extract `userId` from current authenticated user context (`SecurityContextHolder`).
