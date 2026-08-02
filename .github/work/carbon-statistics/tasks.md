# Carbon Index Statistics Implementation Tasks

- [x] **Phase 1: Repository Query Setup**
  - [x] Add JPQL query method `calculateTotalCarbonFootprint` filtered by `userId` in `OrderItemRepository` (`be/catalog/src/main/java/com/flix/catalog/dao/OrderItemRepository.java`).

- [x] **Phase 2: Controller & Shared DTO Refactoring**
  - [x] Consolidated endpoints into `StatisticsController` (`be/statistics/src/main/java/com/flix/statistics/api/StatisticsController.java`).
  - [x] Created generic DTO `StatisticResponse<T>` (`be/statistics/src/main/java/com/flix/statistics/common/dto/StatisticResponse.java`).
  - [x] Configured `@PreAuthorize("hasRole('ADMIN')")` for revenue endpoint.
  - [x] Configured `@PreAuthorize("hasRole('USER')")` and `SecurityUtils.validateOwnership(userId, jwt)` for carbon index endpoint.

- [x] **Phase 3: Integration Testing (Security & Ownership Verification)**
  - [x] Create `StatisticsIT` in `be/flix-integration-test/src/test/groovy/com/flix/flixintegrationtest/statistics/api/StatisticsIT.groovy`.
  - [x] Verify `validateOwnership` and `ROLE_USER` for `GET /v1/statistics/product/carbon-index`.
  - [x] Verify `ROLE_ADMIN` access for `GET /v1/statistics/product/revenue`.
  - [x] Verify `403 Forbidden` response when non-admin user attempts access to revenue statistics.
  - [x] Verify `401 Unauthorized` / `403 Forbidden` response for unauthenticated requests.
