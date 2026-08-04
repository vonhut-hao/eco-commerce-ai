ALTER TABLE orders
ADD COLUMN payment_status VARCHAR(50) NOT NULL DEFAULT 'UNPAID' AFTER payment_method_id;