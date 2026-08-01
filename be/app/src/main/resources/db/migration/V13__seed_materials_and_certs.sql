-- V11__seed_materials_and_certs.sql

-- ==========================================
-- SEED GREEN CERTIFICATES
-- ==========================================
-- FSC Certified
INSERT INTO green_certificates (name, issuer, issue_date, product_id) VALUES ('FSC Certified', 'FSC', '2023-01-01', 8);
-- Fair Trade
INSERT INTO green_certificates (name, issuer, issue_date, product_id) VALUES ('Fair Trade', 'FairTrade Int', '2023-02-01', 2);
-- GOTS Certified
INSERT INTO green_certificates (name, issuer, issue_date, product_id) VALUES ('GOTS Certified', 'GOTS', '2023-03-01', 2);
INSERT INTO green_certificates (name, issuer, issue_date, product_id) VALUES ('GOTS Certified', 'GOTS', '2023-03-01', 9);
INSERT INTO green_certificates (name, issuer, issue_date, product_id) VALUES ('FSC Certified', 'FSC', '2023-01-01', 1);

-- ==========================================
-- SEED MATERIALS
-- ==========================================
INSERT INTO materials (id, name, type, eco_rating) VALUES (1, 'Bamboo', 'Wood', 4.5);
INSERT INTO materials (id, name, type, eco_rating) VALUES (2, 'Organic Cotton', 'Textile', 4.0);
INSERT INTO materials (id, name, type, eco_rating) VALUES (3, 'Stainless Steel', 'Metal', 3.5);
INSERT INTO materials (id, name, type, eco_rating) VALUES (4, 'Hemp', 'Textile', 4.8);

-- ==========================================
-- MAP MATERIALS
-- ==========================================
INSERT INTO product_material (product_id, material_id) VALUES (1, 1);
INSERT INTO product_material (product_id, material_id) VALUES (2, 2);
INSERT INTO product_material (product_id, material_id) VALUES (9, 2);
INSERT INTO product_material (product_id, material_id) VALUES (4, 3);
INSERT INTO product_material (product_id, material_id) VALUES (7, 3);
INSERT INTO product_material (product_id, material_id) VALUES (6, 4);
INSERT INTO product_material (product_id, material_id) VALUES (11, 4);
INSERT INTO product_material (product_id, material_id) VALUES (12, 4);
