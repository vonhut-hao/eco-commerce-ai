# Task: Phase 1 - Database Migration & Entity Mapping

## 1. Requirements
Create the database table for tracking user favorite products and construct the JPA entity mapping in the `catalog` module.

## 2. Steps
1. Create Flyway migration script [`V10__Create_User_Product_Favorite.sql`](file:///E:/intelljProject/flix-plaftform/be/app/src/main/resources/db/migration/V10__Create_User_Product_Favorite.sql):
   - Table `user_product_favorites`
   - Columns: `id` (BIGINT AUTO_INCREMENT PK), `user_id` (BIGINT NOT NULL), `product_id` (BIGINT NOT NULL), `created_at` (DATETIME DEFAULT CURRENT_TIMESTAMP NOT NULL)
   - Foreign key constraints referencing `users(id)` and `products(id)`
   - Unique key on `(user_id, product_id)`

2. Create JPA Entity [`UserFavoriteEntity.java`](file:///E:/intelljProject/flix-plaftform/be/catalog/src/main/java/com/flix/catalog/entity/UserFavoriteEntity.java):
   - Map to table `user_product_favorites`
   - Fields: `id`, `user` (`@ManyToOne`), `product` (`@ManyToOne`), `createdAt` (`LocalDateTime`)
