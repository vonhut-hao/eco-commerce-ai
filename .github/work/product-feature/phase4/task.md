# Task: Phase 4 - Paginated Products List & Product Detail

## 1. Feature Requirements
Update the product catalog retrieval API to support pagination, limit returned fields in list view to simple information, and add an endpoint to get full details of a specific product.
* **ProductSimpleResponse**: Create a lightweight DTO containing only summary fields:
  - `id`, `name`, `price`, `avgRating`, `mainImage`, `greenPoints`.
* **Paginated listProducts**: Update `GET /v1/catalog/products` to accept:
  - `page` (Integer, optional, default = 0)
  - `size` (Integer, optional, default = 10)
  - Return paginated data wrapped in Spring Data `Page` containing `ProductSimpleResponse`.
* **Product Detail Endpoint**: Expose `GET /v1/catalog/products/{id}` to return the full product detailed info (`ProductEntityResponse`), including related categories, materials, and certificates.

---

## 2. Implementation Steps (Numbered, Sequential)

1. **Create ProductSimpleResponse**:
   - Create `ProductSimpleResponse.java` in [com.flix.catalog.common.dto](file:///E:/intelljProject/flix-plaftform/be/catalog/src/main/java/com/flix/catalog/common/dto):
     ```java
     package com.flix.catalog.common.dto;

     import com.fasterxml.jackson.annotation.JsonInclude;
     import com.flix.catalog.entity.ProductEntity;

     @JsonInclude(JsonInclude.Include.NON_NULL)
     public record ProductSimpleResponse(
             Long id,
             String name,
             Long price,
             Double avgRating,
             String mainImage,
             Integer greenPoints
     ) {
         public static ProductSimpleResponse from(ProductEntity entity) {
             if (entity == null) return null;
             return new ProductSimpleResponse(
                     entity.getId(),
                     entity.getName(),
                     entity.getPrice(),
                     entity.getAvgRating(),
                     entity.getMainImage(),
                     entity.getGreenPoints()
             );
         }
     }
     ```

2. **Update ProductRepository**:
   - In [ProductRepository.java](file:///E:/intelljProject/flix-plaftform/be/catalog/src/main/java/com/flix/catalog/dao/ProductRepository.java), add pagination support:
     ```java
     Page<ProductEntity> findByDeletedAtIsNull(Pageable pageable);
     ```

3. **Update ProductService**:
   - Modify `listProducts` in [ProductService.java](file:///E:/intelljProject/flix-plaftform/be/catalog/src/main/java/com/flix/catalog/product/service/ProductService.java) to accept a `Pageable` object and return a `Page<ProductSimpleResponse>`:
     ```java
     public Page<ProductSimpleResponse> listProducts(Pageable pageable) {
         log.info("List paginated products: page={}, size={}", pageable.getPageNumber(), pageable.getPageSize());
         return productRepository.findByDeletedAtIsNull(pageable)
                 .map(ProductSimpleResponse::from);
     }
     ```
   - Implement a new method `getProductDetail`:
     ```java
     public ProductEntityResponse getProductDetail(Long id) {
         log.info("Get product details for ID: {}", id);
         return productRepository.findByIdAndDeletedAtIsNull(id)
                 .map(ProductEntityResponse::from)
                 .orElseThrow(() -> new BusinessException(ErrorCode.PRODUCT_NOT_FOUND));
     }
     ```
     *(Note: Add `Optional<ProductEntity> findByIdAndDeletedAtIsNull(Long id)` to `ProductRepository` if it doesn't already exist).*

4. **Update ProductController**:
   - Refactor `listProducts` in [ProductController.java](file:///E:/intelljProject/flix-plaftform/be/catalog/src/main/java/com/flix/catalog/api/controller/ProductController.java) to accept `Pageable` parameters:
     ```java
     @GetMapping
     @ResponseStatus(HttpStatus.OK)
     public ApiResponse<Page<ProductSimpleResponse>> listProducts(
             @RequestParam(value = "page", defaultValue = "0") int page,
             @RequestParam(value = "size", defaultValue = "10") int size) {
         return ApiResponse.success(productService.listProducts(PageRequest.of(page, size)));
     }
     ```
   - Expose the new product detail endpoint:
     ```java
     @GetMapping("/{id}")
     @ResponseStatus(HttpStatus.OK)
     public ApiResponse<ProductEntityResponse> getProductDetail(@PathVariable("id") Long id) {
         return ApiResponse.success(productService.getProductDetail(id));
     }
     ```

---

## 3. Technical Considerations
* **Pagination Metadata**: The Spring Data `Page` object serializes into JSON containing fields like `content`, `pageable`, `totalElements`, `totalPages`, etc., which are highly useful for frontend client paging controls.
* **Entity Graphs / Join Fetches**: When querying product details, ensure categories and materials are loaded efficiently to avoid N+1 queries.
* **Deleted Filter**: Ensure both the page query and getDetail lookup filter out soft-deleted products (`deletedAt IS NULL`).

---

## 4. Validation Checkpoints
* **Compilation**: Build the `be/catalog` module successfully.
* **List Endpoint Validation**:
  - Request `GET /v1/catalog/products?page=0&size=5`.
  - Assert that the response JSON contains `content` array representing products.
  - Assert that each item in `content` contains only the simple response fields (no `materials`, `categories`, `subImages`, or `stock` properties present).
* **Detail Endpoint Validation**:
  - Request `GET /v1/catalog/products/{id}`.
  - Assert that response returns complete data including `materials` and `categories`.
  - Assert that requesting a soft-deleted or non-existent ID throws a `404 Product Not Found` error.
