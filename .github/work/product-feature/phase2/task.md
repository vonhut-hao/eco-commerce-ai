# Task: Phase 2 - Implement CartItem Feature

## 1. Feature Requirements
Implement the shopping cart items management functionality in `be/catalog` module to allow users to add items to their cart, view items, update item quantities, and remove items.
* **JPA Mapping**: Map `CartItemEntity` to the `cart_items` database table.
* **API Endpoints**:
  - `POST /v1/catalog/cart` (create new cart item, user role authenticated)
  - `POST /v1/catalog/cart/{id}` (update cart item quantity by ID, user role authenticated)
  - `GET /v1/catalog/cart` (retrieve current user's cart items)
  - `DELETE /v1/catalog/cart/{id}` (remove cart item from user's cart)

---

## 2. Implementation Steps (Numbered, Sequential)

1. **Create CartItemEntity**:
   - Create `CartItemEntity.java` in [com.flix.catalog.entity](file:///E:/intelljProject/flix-plaftform/be/catalog/src/main/java/com/flix/catalog/entity) with properties:
     - `Long id` (PK, auto-increment)
     - `int quantity` (default 1)
     - `User user` (ManyToOne, `user_id`)
     - `ProductEntity product` (ManyToOne, `product_id`)

2. **Create CartItemRepository**:
   - Create `CartItemRepository.java` in [com.flix.catalog.dao](file:///E:/intelljProject/flix-plaftform/be/catalog/src/main/java/com/flix/catalog/dao) with helper query methods:
     - `List<CartItemEntity> findByUserId(Long userId)`
     - `Optional<CartItemEntity> findByUserIdAndProductId(Long userId, Long productId)`
     - `void deleteByUserId(Long userId)`

3. **Create Cart DTOs**:
   - Create `CartItemRequest` (fields: `Long productId`, `Integer quantity`, `Long userId` - no `id`) in `com.flix.catalog.common.dto`.
   - Create `CartItemResponse` (fields: `Long id`, `int quantity`, `Long productId`, `String productName`, `Long price`).

4. **Create CartItemService**:
   - Create `CartItemService.java` in package `com.flix.catalog.cart.service` to implement:
     - `createOrUpdateCartItem(Long id, CartItemRequest request)`: Adds item if `id == null`, otherwise retrieves the item and updates its quantity.
     - `listCartItems(Long userId)`: Returns cart items for the user.
     - `deleteCartItem(Long id)`: Removes item.

5. **Create CartItemController**:
   - Create `CartItemController.java` in [com.flix.catalog.api.controller](file:///E:/intelljProject/flix-plaftform/be/catalog/src/main/java/com/flix/catalog/api/controller):
     - `@PostMapping(value = {"", "/{id}"})` for `createOrUpdateCartItem`
     - `@GetMapping` for `listCartItems`
     - `@DeleteMapping("/{id}")` for `deleteCartItem`

---

## 3. Technical Considerations
* **Quantity Bounds**: Validate that quantity is greater than 0.
* **Product Stock Check**: Check `ProductEntity.stock` before adding/updating cart items to ensure stock is sufficient.
* **User Context Isolation**: Ensure that only the owner of the cart item can update or delete it.

---

## 4. Validation Checkpoints
* **Compiling**: Ensure successful build with Maven.
* **Flow Integration Test**: Create `CartIT.groovy` in `be/flix-integration-test` to assert:
  - Add new product to cart creates a cart item.
  - Add same product again updates the quantity.
  - Update quantity via `/v1/catalog/cart/{id}` changes the quantity successfully.
  - View cart returns list of items with product info.
  - Delete cart item successfully removes it.
