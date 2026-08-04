# Payment Method Feature Task Breakdown Checklist

- [x] **Phase 1: Repository Layer Enhancements**
  - [x] Inspect existing `PaymentMethodRepository` (`be/catalog/src/main/java/com/flix/catalog/dao/PaymentMethodRepository.java`).
  - [x] Add query method `List<PaymentMethodEntity> findByIsActiveTrue()` for customer checkout queries.
  - [x] Add `boolean existsByMethodName(String methodName)` for uniqueness validation.

- [x] **Phase 2: DTOs & Validation**
  - [x] Create `PaymentMethodRequest` record in `be/catalog/src/main/java/com/flix/catalog/common/dto/PaymentMethodRequest.java` with `@NotBlank` for `methodName` and optional `Boolean isActive`.
  - [x] Create `PaymentMethodResponse` record in `be/catalog/src/main/java/com/flix/catalog/common/dto/PaymentMethodResponse.java` with static factory method `from(PaymentMethodEntity entity)`.

- [x] **Phase 3: Service Layer Implementation**
  - [x] Create `PaymentMethodService` in `be/catalog/src/main/java/com/flix/catalog/paymentmethod/service/PaymentMethodService.java`.
  - [x] Implement `getActivePaymentMethods()` to list all active methods for customer checkout.
  - [x] Implement `getAllPaymentMethods()` for admin management.
  - [x] Implement `getPaymentMethodById(Long id)`.
  - [x] Implement `createPaymentMethod(PaymentMethodRequest request)`.
  - [x] Implement `updatePaymentMethod(Long id, PaymentMethodRequest request)`.
  - [x] Implement `togglePaymentMethodStatus(Long id, Boolean isActive)`.
  - [x] Implement `deletePaymentMethod(Long id)`.

- [x] **Phase 4: REST Controller & Security Integration**
  - [x] Create `PaymentMethodController` in `be/catalog/src/main/java/com/flix/catalog/api/controller/PaymentMethodController.java` with `@RequestMapping({"/v1/catalog/payment-methods", "/api/v1/catalog/payment-methods"})`.
  - [x] Map endpoints: `GET` (active), `GET /admin` (all), `GET /{id}`, `POST`, `PUT /{id}`, `PATCH /{id}/status`, `DELETE /{id}`.
  - [x] Configure `@PreAuthorize("hasRole('ADMIN')")` for mutation and admin list endpoints.

- [x] **Phase 5: Integration Testing (E2E Flow in `be/flix-integration-test`)**
  - [x] Create `PaymentMethodIT` in `be/flix-integration-test/src/test/groovy/com/flix/flixintegrationtest/catalog/api/paymentmethod/PaymentMethodIT.groovy`.
  - [x] Test public/customer endpoint `GET /v1/catalog/payment-methods` returns active payment methods.
  - [x] Test admin creation (`POST`), update (`PUT`), status toggle (`PATCH`), and deletion (`DELETE`).
  - [x] Test access control (verify non-admin receives `403 Forbidden` for admin endpoints).
