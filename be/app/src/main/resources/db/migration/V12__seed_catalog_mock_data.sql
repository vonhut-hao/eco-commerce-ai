-- V10__seed_catalog_mock_data.sql

-- ==========================================
-- CLEAN UP EXISTING DATA
-- ==========================================
SET FOREIGN_KEY_CHECKS = 0;
TRUNCATE TABLE comments;
TRUNCATE TABLE order_items;
TRUNCATE TABLE orders;
TRUNCATE TABLE cart_items;
TRUNCATE TABLE category_product;
TRUNCATE TABLE green_certificates;
TRUNCATE TABLE product_material;
TRUNCATE TABLE products;
TRUNCATE TABLE categories;
SET FOREIGN_KEY_CHECKS = 1;

-- ==========================================
-- SEED CATEGORIES
-- ==========================================
INSERT INTO categories (id, name, description) VALUES (1, 'Home & Kitchen', 'Eco-friendly products for your home and kitchen');
INSERT INTO categories (id, name, description) VALUES (2, 'Personal Care', 'Sustainable and natural personal care items');
INSERT INTO categories (id, name, description) VALUES (3, 'Fashion', 'Organic and sustainable clothing and accessories');
INSERT INTO categories (id, name, description) VALUES (4, 'Food & Beverage', 'Zero-waste dining and drinking solutions');
INSERT INTO categories (id, name, description) VALUES (5, 'Office', 'Green office supplies and stationeries');
INSERT INTO categories (id, name, description) VALUES (6, 'Travel', 'Reusable and sustainable travel essentials');
INSERT INTO categories (id, name, description) VALUES (7, 'Pet', 'Eco-friendly pet care and accessories');

-- ==========================================
-- SEED PRODUCTS
-- ==========================================
INSERT INTO products (id, name, price, stock, green_points, eco_friendliness, carbon_index, avg_rating, main_image, sub_images, description) VALUES
(1, 'Bamboo Toothbrush Set (Pack of 4)', 149000, 52, 15, 'BIODEGRADABLE', 0.3, 4.8, '/mock/Homepage/df364685721837b1c94e206231a2459a5567c713.png', '[]', 'Biodegradable bamboo handles with BPA-free bristles, compostable packaging.'),
(2, 'Organic Cotton Tote Bag', 180000, 120, 18, '100% ORGANIC', 0.2, 4.6, '/mock/Homepage/2453e361fa67829ce12b4285c2cd0104c9033f4f.png', '[]', 'Certified organic cotton tote, durable and washable for everyday use.'),
(3, 'Beeswax Food Wraps (Set of 3)', 120000, 88, 12, 'ZERO PLASTIC', 0.3, 4.5, '/mock/Homepage/de82f55d7406d552cc2b88ec09decae36ead1bb4.png', '[]', 'Reusable, washable food wraps made from beeswax and organic cotton.'),
(4, 'Reusable Steel Straw Kit', 95000, 200, 10, '85% RECYCLABLE', 0.1, 4.9, '/mock/Homepage/82c9e0aa20b494988973cc4813a0de140208caec.png', '[]', 'Set of 8 reusable straws with cleaning brushes and carry pouch.'),
(5, 'Natural Coconut Bowl Set', 320000, 35, 32, 'BIODEGRADABLE', 0.4, 4.7, '/mock/Homepage/cd13fcef5220de430ddfa2f32fe3d9c43d945ae1.png', '[]', 'Handcrafted coconut shell bowls, each unique. Great for smoothie bowls.'),
(6, 'Natural Hemp Soap Bar', 85000, 145, 9, '100% NATURAL', 0.15, 4.6, '/mock/ProductDetail2/661ae1dc3261c06fd40d7850808050bb043597e2.png', '[]', 'Cold-pressed hemp soap with essential oils, zero synthetic chemicals.'),
(7, 'Insulated Steel Bottle (500ml)', 420000, 67, 42, 'RECYCLABLE', 0.8, 4.9, '/mock/ProductDetail2/2ccdd5009814ec649a2b510e35fa65e10486e35f.png', '[]', 'Double-wall vacuum insulated bottle, keeps drinks cold 24h, hot 12h.'),
(8, 'Wooden Paddle Brush', 210000, 29, 21, 'FSC CERTIFIED', 0.25, 4.4, '/mock/ProductDetail2/ca87ed92ba3631ba5fd1a530c128e1b26d267b2f.png', '[]', 'Sustainably sourced beech wood brush with natural boar bristle blend.'),
(9, 'Cotton Produce Bags (6-pack)', 125000, 98, 13, '100% ORGANIC', 0.12, 4.7, '/mock/ProductDetail2/50c1e0310cec1ec9c5b44ca1743c6ba3a6722a7a.png', '[]', 'Lightweight mesh bags for plastic-free grocery shopping.'),
(10, 'Seed Paper Notebook A5', 95000, 75, 10, 'PLANTABLE', 0.18, 4.3, '/mock/Homepage/df364685721837b1c94e206231a2459a5567c713.png', '[]', 'When you''re done writing, plant the cover to grow wildflowers.'),
(11, 'Hemp Canvas Backpack', 680000, 18, 68, 'SUSTAINABLE', 0.6, 4.5, '/mock/Homepage/2453e361fa67829ce12b4285c2cd0104c9033f4f.png', '[]', 'Durable 20L hemp backpack, naturally water-resistant, no plastic lining.'),
(12, 'Natural Hemp Dog Collar', 165000, 42, 17, 'PET SAFE', 0.2, 4.6, '/mock/ProductDetail2/661ae1dc3261c06fd40d7850808050bb043597e2.png', '[]', 'Natural hemp dog collar, gentle on skin, adjustable, available in all sizes.');

-- ==========================================
-- MAP PRODUCTS TO CATEGORIES
-- ==========================================
-- 1: Personal Care (2)
INSERT INTO category_product (category_id, product_id) VALUES (2, 1);
-- 2: Fashion (3)
INSERT INTO category_product (category_id, product_id) VALUES (3, 2);
-- 3: Home & Kitchen (1)
INSERT INTO category_product (category_id, product_id) VALUES (1, 3);
-- 4: Food & Beverage (4)
INSERT INTO category_product (category_id, product_id) VALUES (4, 4);
-- 5: Home & Kitchen (1)
INSERT INTO category_product (category_id, product_id) VALUES (1, 5);
-- 6: Personal Care (2)
INSERT INTO category_product (category_id, product_id) VALUES (2, 6);
-- 7: Travel (6)
INSERT INTO category_product (category_id, product_id) VALUES (6, 7);
-- 8: Personal Care (2)
INSERT INTO category_product (category_id, product_id) VALUES (2, 8);
-- 9: Home & Kitchen (1)
INSERT INTO category_product (category_id, product_id) VALUES (1, 9);
-- 10: Office (5)
INSERT INTO category_product (category_id, product_id) VALUES (5, 10);
-- 11: Fashion (3)
INSERT INTO category_product (category_id, product_id) VALUES (3, 11);
-- 12: Pet (7)
INSERT INTO category_product (category_id, product_id) VALUES (7, 12);
