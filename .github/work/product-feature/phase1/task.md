# Task: Phase 1 - Complete & Refactor Existing Features

## 1. Feature Requirements
Refactor existing endpoints and DTOs in the `be/catalog` module to implement a unified `createOrUpdate` endpoint with optional path variable IDs and ID-free DTOs.
* **DTO Refactoring**: Strip `Long id` from all requested request records:
  - `CategoryEntityRequest`
  - `ProductEntityRequest`
  - `MaterialEntityRequest`
  - `GreenCertificateEntityRequest`
  - `CommentEntityRequest`
* **Service Refactoring**: Update services to accept ID as an explicit method parameter, performing `id != null` checks to handle updates.
* **Controller Refactoring**: Refactor Category, Product, Material, and GreenCertificate controllers to map to a single endpoint (`POST /v1/catalog/{resource}` and `POST /v1/catalog/{resource}/{id}`) with optional path variable `@PathVariable(value = "id", required = false) Long id`.
* **CommentController**: Create the missing controller using this same pattern.

---

## 2. Implementation Steps (Numbered, Sequential)

1. **Refactor Request DTOs**:
   - In [CategoryEntityRequest.java](file:///E:/intelljProject/flix-plaftform/be/catalog/src/main/java/com/flix/catalog/common/dto/CategoryEntityRequest.java), remove the `id` field.
   - In [ProductEntityRequest.java](file:///E:/intelljProject/flix-plaftform/be/catalog/src/main/java/com/flix/catalog/common/dto/ProductEntityRequest.java), remove the `id` field.
   - In [MaterialEntityRequest.java](file:///E:/intelljProject/flix-plaftform/be/catalog/src/main/java/com/flix/catalog/common/dto/MaterialEntityRequest.java), remove the `id` field.
   - In [GreenCertificateEntityRequest.java](file:///E:/intelljProject/flix-plaftform/be/catalog/src/main/java/com/flix/catalog/common/dto/GreenCertificateEntityRequest.java), remove the `id` field.
   - In [CommentEntityRequest.java](file:///E:/intelljProject/flix-plaftform/be/catalog/src/main/java/com/flix/catalog/common/dto/CommentEntityRequest.java), remove the `id` field.

2. **Refactor Service Layer Signatures & Logic**:
   - Update `CategoryService` `createOrUpdateCategory` to accept `Long id, CategoryEntityRequest request` and update logic to use `id` instead of `request.id()`.
   - Update `ProductService` `createOrUpdateProduct` to accept `Long id, ProductEntityRequest request` and use `id` for update detection.
   - Update `MaterialService` `createOrUpdateMaterial` to accept `Long id, MaterialEntityRequest request` and use `id` for update detection.
   - Update `GreenCertificateService` `createOrUpdateGreenCertificate` to accept `Long id, GreenCertificateEntityRequest request` and use `id` for update detection.
   - In `CommentService`, make the class `public` (currently package-private), and refactor `createOrUpdateComment` to accept `Long id, CommentEntityRequest request`.

3. **Refactor Existing Controller Endpoints**:
   - In [CategoryController.java](file:///E:/intelljProject/flix-plaftform/be/catalog/src/main/java/com/flix/catalog/api/controller/CategoryController.java), change the `@PostMapping` mapping:
     ```java
     @PostMapping(value = {"", "/{id}"})
     public ApiResponse<CategoryEntityResponse> createOrUpdateCategory(
             @PathVariable(value = "id", required = false) Long id,
             @Valid @RequestBody CategoryEntityRequest request) {
         return ApiResponse.success(categoryService.createOrUpdateCategory(id, request));
     }
     ```
   - Apply the same mapping pattern in [ProductController.java](file:///E:/intelljProject/flix-plaftform/be/catalog/src/main/java/com/flix/catalog/api/controller/ProductController.java), `MaterialController.java`, and `GreenCertificateController.java`.

4. **Create CommentController**:
   - Create `CommentController.java` in [com.flix.catalog.api.controller](file:///E:/intelljProject/flix-plaftform/be/catalog/src/main/java/com/flix/catalog/api/controller) implementing:
     - `@PostMapping(value = {"", "/{id}"})` for `createOrUpdateComment`
     - `@GetMapping` for `listComments`
     - `@DeleteMapping` for deleting comments

---

## 3. Technical Considerations
* **Spring MVC Path Variable Optionality**: Use `@PathVariable(value = "id", required = false)` combined with `value = {"", "/{id}"}` to prevent mapping issues.
* **Service Layer Entity Lookup**: If `id` is present but the resource does not exist, throw a `BusinessException` with `ErrorCode.XXXX_NOT_FOUND`.
* **Access Control**: Category, Product, Material, and GreenCertificate operations require `@PreAuthorize("hasRole('ADMIN')")`, while commenting requires user authentication.

---

## 4. Validation Checkpoints
* **Compilation**: Build project using `./mvnw clean compile` without errors.
* **Creation Verification**: Sending `POST /v1/catalog/categories` creates a new category.
* **Update Verification**: Sending `POST /v1/catalog/categories/{id}` updates the existing category and respects the ID passed in the path.
