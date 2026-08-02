# Revenue Statistics Implementation Tasks

- [ ] **Phase 1: Flyway Migration & Entity Updates**
  - [ ] Create Flyway migration `V11__Add_Created_At_To_Orders.sql` in `be/app/src/main/resources/db/migration` to ensure `created_at` column exists on `orders` table.
  - [ ] Update `OrderEntity` in `be/catalog/src/main/java/com/flix/catalog/entity/OrderEntity.java` to map `createdAt` timestamp.

- [ ] **Phase 2: Core Domain Enums & DTOs**
  - [ ] Create `RevenuePeriodType` enum (`DAILY`, `MONTHLY`, `YEARLY`) in `be/statistics/src/main/java/com/flix/statistics/common/enums/RevenuePeriodType.java`.
  - [ ] Refactor `RevenueStatisticResponse` DTO in `be/statistics/src/main/java/com/flix/statistics/common/dto/RevenueStatisticResponse.java` to include `periodType`, `date`, `fromDate`, `toDate`, and `totalRevenue`.

- [ ] **Phase 3: Repository & Service Layer Refactoring**
  - [ ] Update `OrderRepository` in `be/catalog/src/main/java/com/flix/catalog/dao/OrderRepository.java` (or `RevenueStatisticsDao` in `be/statistics`) with indexed JPQL range query: `SELECT COALESCE(SUM(o.totalAmount), 0) FROM OrderEntity o WHERE o.status = :status AND o.createdAt >= :fromDate AND o.createdAt <= :toDate`.
  - [ ] Implement range calculation logic in `RevenueStatisticsService` in `be/statistics/src/main/java/com/flix/statistics/service/RevenueStatisticsService.java` using `LocalDate` and `TemporalAdjusters`.

- [ ] **Phase 4: REST Controller & Endpoint Configuration**
  - [ ] Refactor `RevenueStatisticsController` in `be/statistics/src/main/java/com/flix/statistics/api/RevenueStatisticsController.java` to handle `GET /api/v1/statistics/product/revenue` with `@RequestParam` defaults for `periodType` and `date`.

- [ ] **Phase 5: Unit Testing & Verification**
  - [ ] Create unit test `RevenueStatisticsServiceTest` in `be/statistics/src/test/java/com/flix/statistics/service/RevenueStatisticsServiceTest.java` verifying range calculations for DAILY, MONTHLY, and YEARLY periods.
  - [ ] Verify Maven build of `be/statistics` module.
