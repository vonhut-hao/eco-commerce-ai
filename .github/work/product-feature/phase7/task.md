# Task: Phase 7 - Admin Dashboard Management

## 1. Feature Requirements

### 1.1 Consolidated Admin Interface
Configure [AdminPage.tsx](file:///E:/intelljProject/flix-plaftform/fe/src/pages/admin/AdminPage.tsx) to act as a consolidated admin panel with side navigation or horizontal tabs for managing the 5 core catalog entities:
- **Products**: Manage eco-friendly products, stock, prices, and green points.
- **Categories**: Manage product taxonomy.
- **Materials**: Manage product materials and eco ratings.
- **GreenCertifications**: Manage sustainability certificates.
- **Comments**: Moderate user reviews and nested replies.

### 1.2 Dashboard Operations per Entity
- **List View**: Paginated tables with sortable column headers (e.g., sort products by price/stock) and simple category/status filters.
- **Search Bar**: Real-time keyword filter matching names, descriptions, or comment text.
- **Create & Edit Dialogs**: Modal form panels containing client-side validation (e.g. required name, positive prices/eco-ratings).
- **Bulk Delete**: Checkbox columns in tables triggering a bulk delete endpoint execution or sequence of delete calls.
- **Soft Delete Toggle**: Toggle switches triggering soft deletion or restoration.

---

## 2. Implementation Steps (Numbered, Sequential)

### Step 1: Update API Services
Verify or implement missing admin API methods in frontend services (`fe/src/services/`):
- `product.service.ts`: Add `createOrUpdateProduct` and `deleteProduct` calls.
- `cart.service.ts` / `category.service.ts`: (Create if missing) Add Category CRUD services.
- `material.service.ts`: (Create if missing) Add Material CRUD services.
- `greencert.service.ts`: (Create if missing) Add GreenCert CRUD services.
- `comment.service.ts`: Expose comment deletion and moderation actions.

### Step 2: Implement Admin Dashboard Shell
1. Modify `AdminPage.tsx` layout to use a sidebar layout on desktop and a top menu on mobile.
2. Define a state tracking the active tab: `"products" | "categories" | "materials" | "greencerts" | "comments"`.

### Step 3: Implement Category Management Tab
1. Display a table of categories including columns: `ID`, `Name`, `Description`, and `Actions`.
2. Add a search box.
3. Add a "Create Category" button opening a modal with fields `Name` and `Description`.
4. Add "Edit" and "Delete" action buttons. Use `DELETE /v1/catalog/categories/{id}` for deletion.

### Step 4: Implement Material Management Tab
1. Display a table of materials with columns: `ID`, `Name`, `Type`, `Eco Rating`, and `Actions`.
2. Add a modal form to create/edit materials with validations (Eco Rating between `1.0` and `5.0`).
3. Wire edit and delete buttons to backend endpoints.

### Step 5: Implement GreenCert Management Tab
1. Display a table of certificates.
2. Provide a modal form to link certificates to a product ID, including fields: `Name`, `Issuer`, `Issue Date`, and `Image URL`.
3. Support delete and update actions.

### Step 6: Implement Product Management Tab
1. Display a table of products showing stock, price, carbon index, and categories.
2. Form fields in the modal:
   - `Name` (required)
   - `Price` (required, > 0)
   - `Stock` (required, >= 0)
   - `Green Points` (required, >= 0)
   - `Carbon Index` (required)
   - `Category IDs` (multiple selection)
   - `Material IDs` (multiple selection)
   - `Description` (text area)
3. Add a "Stock warning" flag badge for items under `5` units.
4. Support soft delete and restore actions.

### Step 7: Implement Comment Moderation Tab
1. Display a table of comments showing: `ID`, `User`, `Product`, `Content`, `Rating`, and `Parent ID` (identifies replies).
2. Support search filtering by content.
3. Expose a "Delete Comment" button to purge abusive reviews.

---

## 3. Technical Considerations
- **Bulk Delete Handling**: If the backend lacks a bulk deletion endpoint, execute `Promise.all` over the selected IDs' delete requests and refresh the view.
- **API Security**: The dashboard components will carry authorization headers. Any unauthorized requests made by non-admins will be rejected with `HTTP 403 Forbidden` by backend Spring Security filters.

---

## 4. Validation Checkpoints
- **Access Control**: Regular users cannot see the sidebar options or access the panel.
- **Dynamic Updates**: Creating or editing an entity instantly refreshes the active table.
- **Validations**: Form submit buttons remain disabled or alert users if inputs fail constraints.
- **Bulk Purge**: Check multiple rows, click "Bulk Delete", and verify the rows disappear and are deleted from the database.
