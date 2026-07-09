# Task: Phase 5 - GreenLife Frontend Storefront Implementation

## 1. Feature Requirements
Implement the frontend e-commerce storefront for GreenLife in the `fe` module, based on the backend features implemented in Phases 1-4. The design must be styled to match the mockups in [uiuxdesign](file:///E:/intelljProject/flix-plaftform/uiuxdesign).

### 1.1 Page Scope & Routing
Configure routing in [App.tsx](file:///E:/intelljProject/flix-plaftform/fe/src/App.tsx) for the following views wrapped in the [MainLayout](file:///E:/intelljProject/flix-plaftform/fe/src/components/layout/MainLayout.tsx):
- `/` and `/shop`: **ShopPage** (Paginated list of products).
- `/products/:id`: **ProductDetailPage** (Product details, carbon metrics, tabs, and comments).
- `/cart`: **CartPage** (Review cart items, update quantities, remove items).
- `/checkout`: **CheckoutPage** (Select payment method, place order).
- `/orders`: **OrdersPage** (List placed orders and status).

### 1.2 Layout & Styling
Follow the design in [595588381-aabdbffc-1d03-402b-85ac-d59dce55b3f4.png](file:///E:/intelljProject/flix-plaftform/uiuxdesign/595588381-aabdbffc-1d03-402b-85ac-d59dce55b3f4.png):
- **Colors**: Primary Green `#25521f`, Accent Light Green `#bcf1ad`, Page Background `#fafaf5`, Borders `#c2c9bb`, Text `#42493e` / `#1a1c19`.
- **DesktopHeader Integration**: Show real Green Points count, connect search state to the product list filter, and wire the `CartIcon` count to the actual cart service length.

---

## 2. Implementation Steps (Numbered, Sequential)

1. **Create API Services**:
   - Create `product.service.ts` in `fe/src/services` to call `GET /v1/catalog/products` (paginated) and `GET /v1/catalog/products/{id}`.
   - Create `cart.service.ts` to call `GET /v1/catalog/cart`, `POST /v1/catalog/cart` (add/update), and `DELETE /v1/catalog/cart/{id}`.
   - Create `order.service.ts` to call `GET /v1/catalog/orders`, `GET /v1/catalog/orders/{id}`, and `POST /v1/catalog/orders`.

2. **Implement ShopPage (Product Grid)**:
   - Fetch products using page size of `10` or `12`.
   - Implement simple cards matching the curations grid layout (basic info, ratings, main image, green points badge).
   - Expose bottom pagination controls (Next/Previous).

3. **Implement ProductDetailPage**:
   - Build layout matching the mockup:
     - Left: Large main image with 4 horizontal thumbnails.
     - Right: Title, Price, rating star, paragraph description.
     - **Carbon Footprint Widget**: Progress bars showing the product's carbon footprint vs conventional alternatives.
     - **Tag Pills**: Pill components with custom colors representing materials/features (e.g. `100% Biodegradable`).
     - **Purchase Control**: `- 1 +` quantity selector, `ADD TO CART` button, and `ADD TO WISHLIST` outline button.
     - **Tabs**: Description, Sustainability Info, and Reviews.
     - **Comments & Replies**: List comments and nested replies; allow logged-in users to submit new reviews.
     - **"You might also like" (Curated Selections)**: Horizontal list of 4 product cards.

4. **Implement CartPage**:
   - Render lists of items. Call quantity update endpoint when users press `+` or `-` buttons.
   - Display subtotals, carbon points summary, and checkout button.

5. **Implement CheckoutPage**:
   - Select Payment Method.
   - Show carbon footprint comparison and total Green Points to be earned.
   - Place Order button triggers transaction, clears cart, and redirects to orders list.

6. **Implement OrdersPage**:
   - Display user's order history, statuses (`PENDING`, `COMPLETED`, `CANCELLED`), order contents, and points accumulated.

---

## 3. Technical Considerations
- **Tailwind CSS classes**: Use standard CSS/Tailwind values that closely match the layout spacing, fonts, and colors of the mockups.
- **Cart Count Syncing**: Use React Context, custom state, or direct updates to ensure adding to cart immediately reflects in `DesktopHeader`'s cart icon badge.
- **Access Control**: Redirect unauthorized visitors to `/signin` when accessing cart, checkout, or orders.

---

## 4. Validation Checkpoints
- **Routing**: Ensure all URLs map to the correct components.
- **Pixel-Perfect Review**: Verify detail page components (Carbon footprint widget, layout spacing, buttons) align visually with the design mockup.
- **Cart Sync**: Click `ADD TO CART` on a product, verify the header cart count increases.
- **Ordering**: Place order, verify stock updates on backend, points update in Header, and the order shows up in `/orders`.
