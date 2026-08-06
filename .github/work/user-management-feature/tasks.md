# User Management Feature Task Breakdown Checklist

- [x] **Phase 1: Backend Data & Repository Layer (`be/identity`)**
  - [x] Enhance `UserRepository` in `be/identity/src/main/java/com/flix/identity/dao/UserRepository.java` with JPQL queries for admin user management:
    - `Page<User> searchUsers(@Param("query") String query, Pageable pageable)`
    - `long countByIsEnabledTrue()`

- [x] **Phase 2: DTOs & Validation (`be/identity`)**
  - [x] Create `AdminUserResponse` record in `be/identity/src/main/java/com/flix/identity/common/dto/AdminUserResponse.java` (`id`, `username`, `email`, `fullName`, `phone`, `greenPoints`, `totalCarbon`, `isEnabled`, `roles`, `createdAt`).
  - [x] Create `UserStatusUpdateRequest` record in `be/identity/src/main/java/com/flix/identity/common/dto/UserStatusUpdateRequest.java` with `@NotNull Boolean isEnabled`.
  - [x] Create `UserStatsSummaryResponse` record in `be/identity/src/main/java/com/flix/identity/common/dto/UserStatsSummaryResponse.java` (`totalUsers`, `activeUsers`, `disabledUsers`).

- [x] **Phase 3: Service Layer Implementation (`be/identity`)**
  - [x] Create `AdminUserService` in `be/identity/src/main/java/com/flix/identity/user/service/AdminUserService.java`.
  - [x] Implement `getUsers(String query, Pageable pageable)` returning paginated user response list.
  - [x] Implement `getUserDetails(Long id)` returning comprehensive user account and profile data.
  - [x] Implement `updateUserStatus(Long targetUserId, UserStatusUpdateRequest request, Long currentAdminId)`:
    - Prevent admin from disabling their own account (`targetUserId == currentAdminId`).
    - Prevent disabling accounts with `ROLE_ADMIN`.
    - Update `is_enabled` flag on target `User` entity.
  - [x] Implement `getUserStats()` computing total and active user counts.

- [x] **Phase 4: REST Controller & Security (`be/identity`)**
  - [x] Create `AdminUserController` in `be/identity/src/main/java/com/flix/identity/api/AdminUserController.java` with `@RequestMapping("/v1/admin/users")`.
  - [x] Annotate endpoints with `@PreAuthorize("hasRole('ADMIN')")`.
  - [x] Map endpoints:
    - `GET /v1/admin/users` — search & pagination.
    - `GET /v1/admin/users/stats` — summary stats.
    - `GET /v1/admin/users/{id}` — user detail.
    - `PATCH /v1/admin/users/{id}/status` — lock/unlock account status.

- [ ] **Phase 5: Backend E2E Integration Testing (`be/flix-integration-test`)** *(Skipped per user request)*
  - [ ] Create `AdminUserIT.groovy` in `be/flix-integration-test/src/test/groovy/com/flix/flixintegrationtest/identity/api/user/AdminUserIT.groovy`.

- [x] **Phase 6: Frontend API Integration Layer (`fe`)**
  - [x] Create `fe/src/api/users.ts` with Axios API functions calling `/v1/admin/users`:
    - `adminUserApi.getUsers(query, page, size)`
    - `adminUserApi.getUserStats()`
    - `adminUserApi.getUserById(id)`
    - `adminUserApi.updateUserStatus(id, isEnabled)`

- [x] **Phase 7: Frontend Component Refactoring (`fe`)**
  - [x] Refactor `fe/src/app/components/admin/Users.tsx`:
    - Connect state to dynamic `adminUserApi.getUsers` with debounce search.
    - Connect search bar input to backend search query.
    - Connect status toggle switch button to `adminUserApi.updateUserStatus`.
    - Connect user count badges to `adminUserApi.getUserStats()`.
    - Gracefully handle offline / fallback mode.
