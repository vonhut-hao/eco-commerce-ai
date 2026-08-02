INSERT INTO payment_methods (id, method_name, is_active) VALUES (1, 'COD', 1) ON DUPLICATE KEY UPDATE is_active=1;
INSERT INTO payment_methods (id, method_name, is_active) VALUES (2, 'BANK_TRANSFER', 1) ON DUPLICATE KEY UPDATE is_active=1;
INSERT INTO payment_methods (id, method_name, is_active) VALUES (3, 'MOMO', 1) ON DUPLICATE KEY UPDATE is_active=1;
INSERT INTO payment_methods (id, method_name, is_active) VALUES (4, 'ZALOPAY', 1) ON DUPLICATE KEY UPDATE is_active=1;
