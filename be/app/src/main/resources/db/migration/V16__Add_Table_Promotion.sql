-- Table Promotion
CREATE TABLE promotions (
    id BIGINT PRIMARY KEY AUTO_INCREMENT,
    code VARCHAR(50) UNIQUE NULL,          -- Mã voucher/coupon (VD: 'SUMMER2026', NULL nếu tự động áp dụng)
    name VARCHAR(255) NOT NULL,           -- Tên chương trình (VD: 'Giảm giá mùa hè')
    description TEXT,                      -- Mô tả chi tiết điều kiện chương trình
    discount_type ENUM('PERCENTAGE', 'FIXED_AMOUNT') NOT NULL, -- Giảm theo % hoặc Giảm số tiền cố định
    discount_value DECIMAL(12, 2) NOT NULL, -- Giá trị giảm (20 = 20% hoặc 20000 = 20.000đ)
    max_discount_amount DECIMAL(12, 2) NULL,-- Số tiền giảm tối đa (nếu là giảm theo %)
    min_order_value DECIMAL(12, 2) DEFAULT 0, -- Giá trị đơn hàng tối thiểu để áp dụng
    usage_limit INT NULL,                  -- Tổng số lần được sử dụng mã này
    used_count INT DEFAULT 0,              -- Số lần đã được sử dụng
    start_date DATETIME NOT NULL,          -- Ngày bắt đầu áp dụng
    end_date DATETIME NOT NULL,            -- Ngày kết thúc
    is_active BOOLEAN DEFAULT TRUE,        -- Bật/Tắt chương trình thủ công
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);


-- Promotion connect foreign to table order
ALTER TABLE orders
ADD COLUMN promotion_id BIGINT NULL,
ADD FOREIGN KEY (promotion_id) REFERENCES promotions(id);