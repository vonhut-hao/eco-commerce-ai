-- V5__create_schema_based_on_cdm4.sql

-- =====================================================
-- DOMAIN: Identity
-- =====================================================

-- 1. Alter user_profiles to add new columns
ALTER TABLE user_profiles
    ADD green_points       INT    DEFAULT 0   NULL,
    ADD total_carbon_index DOUBLE DEFAULT 0.0 NULL;

-- 2. CREATE ADDRESS
CREATE TABLE addresses
(
    id             BIGINT AUTO_INCREMENT NOT NULL,
    recipient_name VARCHAR(100)          NOT NULL,
    phone_number   VARCHAR(20)           NOT NULL,
    full_address   VARCHAR(255)          NOT NULL,
    is_default     BIT(1) DEFAULT b'0'   NULL,
    user_id        BIGINT                NOT NULL,
    CONSTRAINT pk_addresses PRIMARY KEY (id),
    CONSTRAINT fk_addresses_on_user FOREIGN KEY (user_id) REFERENCES users (id)
);


-- =====================================================
-- DOMAIN: Catalog
-- =====================================================

-- 3. CREATE CATEGORY
CREATE TABLE categories
(
    id          BIGINT AUTO_INCREMENT NOT NULL,
    name        VARCHAR(100)          NOT NULL,
    description TEXT                  NULL,
    CONSTRAINT pk_categories PRIMARY KEY (id)
);

-- 4. CREATE PRODUCT
CREATE TABLE products
(
    id               BIGINT AUTO_INCREMENT NOT NULL,
    name             VARCHAR(255)          NOT NULL,
    price            BIGINT                NOT NULL,
    stock            INT    DEFAULT 0      NOT NULL,
    green_points     INT    DEFAULT 0      NULL,
    eco_friendliness VARCHAR(50)           NULL,
    carbon_index     DOUBLE                NULL,
    avg_rating       DOUBLE DEFAULT 0.0    NULL,
    main_image       VARCHAR(255)          NULL,
    sub_images       TEXT                  NULL,
    CONSTRAINT pk_products PRIMARY KEY (id)
);

-- 5. CATEGORY_PRODUCT (Many-to-Many)
CREATE TABLE category_product
(
    category_id BIGINT NOT NULL,
    product_id  BIGINT NOT NULL,
    CONSTRAINT pk_category_product PRIMARY KEY (category_id, product_id),
    CONSTRAINT fk_catpro_on_category FOREIGN KEY (category_id) REFERENCES categories (id),
    CONSTRAINT fk_catpro_on_product FOREIGN KEY (product_id) REFERENCES products (id)
);

-- 6. CREATE MATERIAL
CREATE TABLE materials
(
    id         BIGINT AUTO_INCREMENT NOT NULL,
    name       VARCHAR(100)          NOT NULL,
    type       VARCHAR(50)           NULL,
    eco_rating DOUBLE DEFAULT 0.0    NOT NULL,
    CONSTRAINT pk_materials PRIMARY KEY (id)
);

-- 7. PRODUCT_MATERIAL (Many-to-Many)
CREATE TABLE product_material
(
    product_id  BIGINT NOT NULL,
    material_id BIGINT NOT NULL,
    CONSTRAINT pk_product_material PRIMARY KEY (product_id, material_id),
    CONSTRAINT fk_promat_on_product FOREIGN KEY (product_id) REFERENCES products (id),
    CONSTRAINT fk_promat_on_material FOREIGN KEY (material_id) REFERENCES materials (id)
);

-- 8. CREATE GREEN_CERTIFICATE
CREATE TABLE green_certificates
(
    id         BIGINT AUTO_INCREMENT NOT NULL,
    name       VARCHAR(255)          NOT NULL,
    issuer     VARCHAR(255)          NULL,
    issue_date DATE                  NULL,
    image_url  VARCHAR(255)          NULL,
    product_id BIGINT                NOT NULL,
    CONSTRAINT pk_green_certificates PRIMARY KEY (id),
    CONSTRAINT fk_green_certificates_on_product FOREIGN KEY (product_id) REFERENCES products (id)
);

-- 9. CREATE COMMENT
CREATE TABLE comments
(
    id         BIGINT AUTO_INCREMENT NOT NULL,
    content    TEXT                  NOT NULL,
    rating     INT                   NULL,
    media_urls TEXT                  NULL,
    user_id    BIGINT                NOT NULL,
    product_id BIGINT                NULL,
    parent_id  BIGINT                NULL,
    CONSTRAINT pk_comments PRIMARY KEY (id),
    CONSTRAINT fk_comments_on_user FOREIGN KEY (user_id) REFERENCES users (id),
    CONSTRAINT fk_comments_on_product FOREIGN KEY (product_id) REFERENCES products (id),
    CONSTRAINT fk_comments_on_parent FOREIGN KEY (parent_id) REFERENCES comments (id)
);

-- =====================================================
-- DOMAIN: Commerce
-- =====================================================

-- 10. CREATE PAYMENT_METHOD
CREATE TABLE payment_methods
(
    id          BIGINT AUTO_INCREMENT NOT NULL,
    method_name VARCHAR(50)           NOT NULL,
    is_active   BIT(1) DEFAULT b'1'   NULL,
    CONSTRAINT pk_payment_methods PRIMARY KEY (id)
);

-- 11. CREATE ORDER
CREATE TABLE orders
(
    id                BIGINT AUTO_INCREMENT NOT NULL,
    total_amount      BIGINT                NOT NULL,
    status            VARCHAR(50)           NOT NULL,
    user_id           BIGINT                NOT NULL,
    payment_method_id BIGINT                NOT NULL,
    CONSTRAINT pk_orders PRIMARY KEY (id),
    CONSTRAINT fk_orders_on_user FOREIGN KEY (user_id) REFERENCES users (id),
    CONSTRAINT fk_orders_on_payment_method FOREIGN KEY (payment_method_id) REFERENCES payment_methods (id)
);

-- 12. CREATE ORDER_ITEM
CREATE TABLE order_items
(
    id                    BIGINT AUTO_INCREMENT NOT NULL,
    quantity              INT                   NOT NULL,
    price                 BIGINT                NOT NULL,
    line_carbon_footprint DOUBLE DEFAULT 0.0    NOT NULL,
    order_id              BIGINT                NOT NULL,
    product_id            BIGINT                NOT NULL,
    CONSTRAINT pk_order_items PRIMARY KEY (id),
    CONSTRAINT fk_order_items_on_order FOREIGN KEY (order_id) REFERENCES orders (id),
    CONSTRAINT fk_order_items_on_product FOREIGN KEY (product_id) REFERENCES products (id)
);

CREATE TABLE cart_items
(
    id         BIGINT AUTO_INCREMENT NOT NULL,
    quantity   INT DEFAULT 1         NOT NULL,
    user_id    BIGINT                NOT NULL,
    product_id BIGINT                NOT NULL,
    CONSTRAINT pk_cart_items PRIMARY KEY (id),
    CONSTRAINT fk_cart_items_on_user FOREIGN KEY (user_id) REFERENCES users (id),
    CONSTRAINT fk_cart_items_on_product FOREIGN KEY (product_id) REFERENCES products (id)
);

-- =====================================================
-- DOMAIN: Chat
-- =====================================================

-- 13. CREATE CONVERSATION
CREATE TABLE conversations
(
    id       BIGINT AUTO_INCREMENT NOT NULL,
    type     VARCHAR(50)           NOT NULL,
    user1_id BIGINT                NOT NULL,
    user2_id BIGINT                NULL,
    CONSTRAINT pk_conversations PRIMARY KEY (id),
    CONSTRAINT fk_conversations_on_user1 FOREIGN KEY (user1_id) REFERENCES users (id),
    CONSTRAINT fk_conversations_on_user2 FOREIGN KEY (user2_id) REFERENCES users (id)
);

-- 14. CREATE MESSAGE
CREATE TABLE messages
(
    id              BIGINT AUTO_INCREMENT NOT NULL,
    content         TEXT                  NOT NULL,
    conversation_id BIGINT                NOT NULL,
    sender_id       BIGINT                NOT NULL,
    file_url        VARCHAR(255)          NULL,
    CONSTRAINT pk_messages PRIMARY KEY (id),
    CONSTRAINT fk_messages_on_conversation FOREIGN KEY (conversation_id) REFERENCES conversations (id),
    CONSTRAINT fk_messages_on_sender FOREIGN KEY (sender_id) REFERENCES users (id)
);