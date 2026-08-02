-- V10__Create_User_Product_Favorite.sql

CREATE TABLE user_product_favorites
(
    id         BIGINT AUTO_INCREMENT NOT NULL,
    user_id    BIGINT                NOT NULL,
    product_id BIGINT                NOT NULL,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP NOT NULL,
    CONSTRAINT pk_user_product_favorites PRIMARY KEY (id),
    CONSTRAINT fk_fav_on_user FOREIGN KEY (user_id) REFERENCES users (id) ON DELETE CASCADE,
    CONSTRAINT fk_fav_on_product FOREIGN KEY (product_id) REFERENCES products (id) ON DELETE CASCADE,
    CONSTRAINT uk_user_product_favorite UNIQUE (user_id, product_id)
);

CREATE INDEX idx_fav_user_id ON user_product_favorites (user_id);
CREATE INDEX idx_fav_product_id ON user_product_favorites (product_id);
