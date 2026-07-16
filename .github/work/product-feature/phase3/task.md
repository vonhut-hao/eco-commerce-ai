# Task: Phase 3 - Implement PaymentMethod & Order Features

## 1. Feature Requirements
Implement the ordering flow, order history retrieval, and payment method persistence in the `be/catalog` module.
* **OrderStatus**: Enum representing statuses: `PENDING`, `COMPLETED`, `CANCELLED`.
* **Entities**:
  - `PaymentMethodEntity` mapped to `payment_methods` table.
  - `OrderEntity` mapped to `orders` table.
  - `OrderItemEntity` mapped to `order_items` table.
* **Placing Orders**: A transactional process where:
  - Stock availability is verified.
  - Total price and line carbon footprints are calculated.
  - Stock is depleted.
  - User's green points are credited.
  - Cart is cleared.
* **Endpoints**:
  - `POST /v1/catalog/orders` (place order from cart, user authenticated)
  - `POST /v1/catalog/orders/{id}` (update order status, admin authenticated)
  - `GET /v1/catalog/orders` (list current user's orders)
  - `GET /v1/catalog/orders/{id}` (retrieve order details)

---

## 2. Implementation Steps (Numbered, Sequential)

1. **Implement Entities**:
   - Create `PaymentMethodEntity.java` mapping fields: `id`, `methodName`, `isActive`.
   - Create `OrderStatus.java` enum.
   - Create `OrderEntity.java` with properties: `id`, `totalAmount`, `status`, `User`, `PaymentMethodEntity`, and `orderItems`.
   - Create `OrderItemEntity.java` with properties: `id`, `quantity`, `price`, `lineCarbonFootprint`, `OrderEntity`, and `ProductEntity`.

2. **Implement Repositories**:
   - Create `PaymentMethodRepository` and `OrderRepository` in `com.flix.catalog.dao`.

3. **Define DTOs**:
   - Create `OrderRequest` (fields: `Long paymentMethodId` - no `id`) and `OrderResponse`.
   - Create `OrderItemResponse`.

4. **Implement OrderService**:
   - Implement `createOrUpdateOrder(Long id, OrderRequest request)`:
     - For creation (`id == null`), fetch the user's cart, validate product stock, calculate carbon footprints, update user profile (`greenPoints` and `totalCarbonIndex`), deduct stocks, save order, and clear user's cart.
     - For updates (`id != null`), update the order status.
   - Implement `listOrders(Long userId)` and `getOrderDetails(Long orderId)`.

5. **Implement OrderController**:
   - Expose `@PostMapping(value = {"", "/{id}"})` for `createOrUpdateOrder`.
   - Expose `@GetMapping` for `listOrders`.
   - Expose `@GetMapping("/{id}")` for `getOrderDetails`.

---

## 3. Technical Considerations
* **Transactional Scope**: Use `@Transactional` on `createOrUpdateOrder` to guarantee atomic order placement.
* **Carbon Index Logic**: Compute carbon footprint on each item by summing product carbon values and user profile ratings.
* **Error Handling**: Throw `INSUFFICIENT_STOCK` if user requests more than available, and `CART_EMPTY` if cart is empty.

---

## 4. Validation Checkpoints
* **Compilation**: Build successfully.
* **Integration Tests**: Create `OrderIT.groovy` inside `be/flix-integration-test` to test:
  - Placing order from non-empty cart correctly depletes stock and creates order/items.
  - Insufficient stock rejects order creation.
  - Placed orders correctly update user's green points.
