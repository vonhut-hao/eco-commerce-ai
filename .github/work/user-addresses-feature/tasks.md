# User Address Feature Task Breakdown Checklist

- [x] **Phase 1: JPA Entity & Repository Layer**
  - [x] Create `AddressesEntity` in `be/identity/src/main/java/com/flix/identity/entity/AddressesEntity.java` mapping table `addresses` (`id`, `recipientName`, `phoneNumber`, `fullAddress`, `isDefault`, `user`).
  - [x] Create `AddressesRepository` in `be/identity/src/main/java/com/flix/identity/dao/AddressesRepository.java` extending `JpaRepository<AddressesEntity, Long>`.
  - [x] Add query methods to `AddressesRepository`:
    - `List<AddressesEntity> findByUserIdOrderByIdDesc(Long userId)`
    - `Optional<AddressesEntity> findByIdAndUserId(Long id, Long userId)`
    - `@Modifying @Query` to reset `isDefault = false` for all user addresses when a new default is assigned.

- [x] **Phase 2: DTOs & Validation**
  - [x] Create `AddressRequest` record in `be/identity/src/main/java/com/flix/identity/common/dto/AddressRequest.java` with `@NotBlank` annotations for `recipientName`, `phoneNumber`, `fullAddress`, and optional `Boolean isDefault`.
  - [x] Create `AddressResponse` record in `be/identity/src/main/java/com/flix/identity/common/dto/AddressResponse.java` with static factory method `from(AddressesEntity entity)`.

- [x] **Phase 3: Service Layer Implementation**
  - [x] Create `AddressService` in `be/identity/src/main/java/com/flix/identity/address/service/AddressService.java`.
  - [x] Implement `createAddress(Long userId, AddressRequest request)` (handle auto-default on first address).
  - [x] Implement `updateAddress(Long id, Long userId, AddressRequest request)`.
  - [x] Implement `deleteAddress(Long id, Long userId)`.
  - [x] Implement `getUserAddresses(Long userId)` and `getAddressDetails(Long id, Long userId)`.
  - [x] Implement `setDefaultAddress(Long id, Long userId)`.

- [x] **Phase 4: REST Controller & Security Integration**
  - [x] Create `AddressController` in `be/identity/src/main/java/com/flix/identity/api/AddressController.java` with `@RequestMapping("/v1/identity/addresses")`.
  - [x] Map endpoints: `POST`, `GET`, `GET /{id}`, `PUT /{id}`, `DELETE /{id}`, `PATCH /{id}/default`.
  - [x] Inject `@AuthenticationPrincipal Jwt jwt` to securely retrieve current `userId`.

- [x] **Phase 5: Integration Testing (E2E Flow in `be/flix-integration-test`)**
  - [x] Create `AddressIT` in `be/flix-integration-test/src/test/groovy/com/flix/flixintegrationtest/identity/api/address/AddressIT.groovy` extending `BaseITSpec`.
  - [x] Implement single test method `should execute complete address E2E lifecycle successfully` covering:
    1. `POST /v1/identity/addresses` — Create address 1 (auto default) and address 2.
    2. `GET /v1/identity/addresses` — Retrieve list of addresses.
    3. `GET /v1/identity/addresses/{id}` — Fetch single address details.
    4. `PUT /v1/identity/addresses/{id}` — Update address 1 recipient & phone.
    5. `PATCH /v1/identity/addresses/{id}/default` — Set address 2 as default (verify address 1 is set to false).
    6. `DELETE /v1/identity/addresses/{id}` — Delete address.
