# Task: Phase 8 - Admin Order Management

## 1. Feature Requirements

### 1.1 Extended Admin Control Panel
- **Navigation**: Extend the sidebar in [AdminPage.tsx](file:///E:/intelljProject/flix-plaftform/fe/src/pages/admin/AdminPage.tsx) to include a new **Orders** tab (e.g., using a `ClipboardList` or `ShoppingBag` icon).
- **Consolidated Orders View**: Display a paginated list of all customer orders in the system.

### 1.2 Dashboard Operations for Orders
- **List View Table**: Columns must include:
  - `Order ID` (clickable or bold)
  - `Customer` (username of the user who placed the order)
  - `Total Amount` (properly formatted in VND)
  - `Payment Method`
  - `Order Status` (rendered as a color-coded badge: `PENDING` in amber, `COMPLETED` in green, and `CANCELLED` in red)
- **Status Transitions**:
  - Provide controls (e.g., action buttons or a dropdown selector) for an administrator to change a `PENDING` order's status to `COMPLETED` or `CANCELLED`.
  - Once an order is marked `COMPLETED` or `CANCELLED`, make the status read-only (no further transitions).
- **Order Details Modal**:
  - Implement a "View Items" action button that opens a modal displaying the details of the order.
  - Show a list/table of purchased items: product name, quantity, unit price, and carbon footprint index.
- **Search & Filtering**:
  - Add search bar support matching Order IDs, usernames, and order statuses.

### 1.3 Backend API Security & Endpoints
- **List All Orders**: Introduce `GET /v1/catalog/orders/admin` to retrieve all orders. Access must be restricted to users with the `ADMIN` role.
- **Update Order Status**: Modify the existing unified order endpoint `POST /v1/catalog/orders/{id}` to allow administrators to transition an order to `COMPLETED` or `CANCELLED` by specifying the status in the request body.

---

## 2. Implementation Steps (Numbered, Sequential)

### Step 1: Update Backend Order DTOs
1. **Modify `OrderRequest`**: Add `Enum status` to support updating the order's status.
   - File: [OrderRequest.java](file:///E:/intelljProject/flix-plaftform/be/catalog/src/main/java/com/flix/catalog/common/dto/OrderRequest.java)
2. **Modify `OrderResponse`**: Include `String username` in the record definition. Map this using `entity.getUser().getUsername()` in the static builder.
   - File: [OrderResponse.java](file:///E:/intelljProject/flix-plaftform/be/catalog/src/main/java/com/flix/catalog/common/dto/OrderResponse.java)

### Step 2: Implement Admin Order Services (Backend)
1. **Extend `OrderRepository`**: Add `List<OrderEntity> findAllByOrderByIdDesc()` to retrieve all orders sorted by ID descending.
   - File: [OrderRepository.java](file:///E:/intelljProject/flix-plaftform/be/catalog/src/main/java/com/flix/catalog/dao/OrderRepository.java)
2. **Update `OrderService`**:
   - Add a public method `List<OrderResponse> listAllOrders()` which fetches all orders via `findAllByOrderByIdDesc()` and maps them to `OrderResponse`.
   - Update `updateOrder(Long id, OrderRequest request)`:
     - Ensure the method checks if the current user is an admin; if not, throw a `BusinessException` with `ErrorCode.FORBIDDEN`.
     - Read `request.status()`. If it's provided, parse it to `OrderStatus` (e.g. `OrderStatus.valueOf(request.status().toUpperCase())`) and set it on the entity. If not, default to setting `OrderStatus.COMPLETED`.
   - File: [OrderService.java](file:///E:/intelljProject/flix-plaftform/be/catalog/src/main/java/com/flix/catalog/order/service/OrderService.java)

### Step 3: Implement Order Controller Endpoints (Backend)
1. **Update `OrderController`**:
   - Add a new endpoint `GET /v1/catalog/orders/admin` protected by `@PreAuthorize("hasRole('ADMIN')")`.
   - Delegate the processing to `orderService.listAllOrders()`.
   - File: [OrderController.java](file:///E:/intelljProject/flix-plaftform/be/catalog/src/main/java/com/flix/catalog/api/controller/OrderController.java)

### Step 4: Implement Frontend Admin Order Service
1. **Update `admin.service.ts`**:
   - Expose `listAllOrders()` to call `GET /v1/catalog/orders/admin`.
   - Expose `updateOrderStatus(id: number, status: string)` to call `POST /v1/catalog/orders/${id}` with `{ status }` in the payload body.
   - File: [admin.service.ts](file:///E:/intelljProject/flix-plaftform/fe/src/services/admin.service.ts)

### Step 5: Extend Admin Dashboard Interface (Frontend)
1. **Update Tab definition** in [AdminPage.tsx](file:///E:/intelljProject/flix-plaftform/fe/src/pages/admin/AdminPage.tsx):
   - Add `"orders"` to the `Tab` type union.
2. **Add Sidebar Option**:
   - Render a new navigation button under the sidebar list with a suitable icon and name "Orders".
3. **Implement Data Fetching**:
   - Add a new state variable `const [orders, setOrders] = useState<any[]>([]);`.
   - Inside `fetchData()`, if `activeTab === "orders"`, invoke `adminService.listAllOrders()` and update the `orders` state.
4. **Implement Orders Table**:
   - Show a table for `orders` showing ID, Customer (username), Total, Payment Method, and Status Badge.
   - Support sorting by ID and Customer name.
   - Support searching by username, order ID, or status via `getFilteredAndSorted()`.
5. **Implement Detail & Action Components**:
   - Clicking "View Items" on a row opens a modal detailing the purchased items (product name, quantity, unit price).
   - If the order status is `PENDING`, render a "Complete" button (green check/badge) and a "Cancel" button (red cross/badge) in the actions column. Clicking these triggers `adminService.updateOrderStatus` and refreshes the list.

---

## 3. Technical Considerations
- **CORS & Access Headers**: Since frontend calls backend on port `8080`, ensure the JWT token with `ADMIN` role is correctly included in the requests.
- **Null Safety**: When displaying order items, ensure proper fallback handles are in place if a product has been soft-deleted (e.g., render `"Product deleted"` or fallback to the historical order item price/name).
- **Tailwind Color Codes**:
  - `PENDING`: `bg-amber-100 text-amber-800`
  - `COMPLETED`: `bg-green-100 text-green-800`
  - `CANCELLED`: `bg-red-100 text-red-800`

---

## 4. Validation Checkpoints
- **RBAC Security check**: 
  - Standard user login: Make a direct request to `GET /v1/catalog/orders/admin` and confirm `403 Forbidden` response is returned.
- **Admin panel navigation**:
  - Admin login: Click "Admin Panel" and click the "Orders" tab. Confirm it displays all customer orders.
- **View Items detail**:
  - Click "View Items" for any order; verify the popup modal properly shows the correct item breakdown and total amount.
- **Status updates**:
  - Change status of a PENDING order to COMPLETED. Verify the badge updates to green, the action buttons disappear, and the database status updates to `COMPLETED`.
  - Change status of another PENDING order to CANCELLED. Verify the status updates to red CANCELLED and is persisted correctly.
