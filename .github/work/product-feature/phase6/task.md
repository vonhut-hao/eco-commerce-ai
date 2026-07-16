# Task: Phase 6 - Product Descriptions, Nested Comments, and Admin Panel

## 1. Feature Requirements

### 1.1 Product Description Field
- **Database**: Add `description TEXT` to the `products` table via a new Flyway migration.
- **Backend**: Update `ProductEntity` and DTOs (`ProductEntityRequest` and `ProductEntityResponse`) to include the description field.
- **Frontend**: Update `ProductDetailPage.tsx` to retrieve and display the description.

### 1.2 Comment Enhancements
- **Backend**: Include the commenter's real `userName` in `CommentEntityResponse`.
- **Frontend**: 
  - Render replies nested beneath their parent comments in a threaded layout.
  - Display the commenter's `userName` instead of their user ID.

### 1.3 Admin Page (FE)
- **RBAC Route Guard**: Implement a route guard on `/admin` that checks the user's role and redirects non-admin users.
- **Profile button**: Add an "Admin" button in [UserInfoCard.tsx](file:///E:/intelljProject/flix-plaftform/fe/src/components/profile/UserInfoCard.tsx) visible only to users with the `ADMIN` role.
- **Admin Panel View**: Create a placeholder dashboard view listing basic stats or management controls
- **Admin page**: in the admin page, let admin can execute CRUD feature that implemnt in phase 1-5
---

## 2. Implementation Steps (Numbered, Sequential)

### Step 1: Database Migration
1. Create a migration file `V7__Add_Description_To_Products.sql` in [be/app/src/main/resources/db/migration](file:///E:/intelljProject/flix-plaftform/be/app/src/main/resources/db/migration):
   ```sql
   ALTER TABLE products ADD COLUMN description TEXT NULL;
   ```

### Step 2: Backend Entities & DTOs
1. Update `ProductEntity.java`:
   ```java
   @Column(columnDefinition = "TEXT")
   private String description;
   ```
2. Update [ProductEntityRequest.java](file:///E:/intelljProject/flix-plaftform/be/catalog/src/main/java/com/flix/catalog/common/dto/ProductEntityRequest.java) to add `@Size(max = 2000) String description` and map it in `toEntity`.
3. Update [ProductEntityResponse.java](file:///E:/intelljProject/flix-plaftform/be/catalog/src/main/java/com/flix/catalog/common/dto/ProductEntityResponse.java) to include `String description`.
4. Update [CommentEntityResponse.java](file:///E:/intelljProject/flix-plaftform/be/catalog/src/main/java/com/flix/catalog/common/dto/CommentEntityResponse.java) to add `String userName` and map it using `entity.getUserEntity().getUsername()`.

### Step 3: Frontend Product Description
1. Update the `ProductEntityResponse` type in [product.service.ts](file:///E:/intelljProject/flix-plaftform/fe/src/services/product.service.ts) to include `description?: string`.
2. In [ProductDetailPage.tsx](file:///E:/intelljProject/flix-plaftform/fe/src/pages/ProductDetailPage.tsx), replace the hardcoded paragraph description with `{product.description}`.

### Step 4: Frontend Threaded Comments
1. Update the `CommentEntityResponse` type in [product.service.ts](file:///E:/intelljProject/flix-plaftform/fe/src/services/product.service.ts) to include `userName?: string`.
2. Refactor the review list in [ProductDetailPage.tsx](file:///E:/intelljProject/flix-plaftform/fe/src/pages/ProductDetailPage.tsx) to build a tree/threaded list:
   - Separate root comments (`parentId == null`) from replies (`parentId != null`).
   - Render root comments, and nest matching replies directly underneath them with indentation.
   - Display `comment.userName` instead of `User #id`.

### Step 5: Frontend Admin Route & RBAC
1. Add helper methods in `fe/src/services/auth.service.ts`:
   - `getUserRoles(): string[]`: Decode JWT claims to extract roles.
   - `isAdmin(): boolean`: Check if the user possesses the `ROLE_ADMIN` authority.
2. Create `AdminPage.tsx` at `fe/src/pages/admin/AdminPage.tsx` displaying a clean admin greeting and admin statistics.
3. Define a protected route `/admin` in [App.tsx](file:///E:/intelljProject/flix-plaftform/fe/src/App.tsx) that checks `authService.isAdmin()` and redirects to `/` if unauthorized.
4. Modify [UserInfoCard.tsx](file:///E:/intelljProject/flix-plaftform/fe/src/components/profile/UserInfoCard.tsx):
   - Check if the current user is an admin.
   - If true, display an "Admin Panel" button next to "Edit Profile" (in both mobile and desktop designs) that navigates to `/admin`.

---

## 3. Technical Considerations
- **JWT Decoding**: Ensure roles in the token match Spring Security authorities (e.g. `ROLE_ADMIN` or `ADMIN`).
- **CSS Threading**: Use Tailwind margin classes like `ml-8` or `border-l-2 border-gray-200 pl-4` for nesting comment replies to maintain clean layout hierarchy.
- **Null Safety**: Description can be null in old products. Fallback to name or default placeholder description if empty.

---

## 4. Validation Checkpoints
- **Database**: Product records in DB can be updated with description texts.
- **API**: GET `/v1/catalog/products/{id}` correctly responds with the new `description` and `comments.userName` fields.
- **Admin Visibility**:
  - Sign in as a regular user: "Admin Panel" button is hidden, and attempting to browse directly to `/admin` redirects to home.
  - Sign in as an admin: "Admin Panel" button is visible, and clicking it correctly routes to `/admin`.
