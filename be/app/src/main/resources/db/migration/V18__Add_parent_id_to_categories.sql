ALTER TABLE categories
ADD COLUMN parent_id BIGINT;

ALTER TABLE categories
ADD CONSTRAINT fk_categories_parent_id
FOREIGN KEY (parent_id) REFERENCES categories(id) ON DELETE SET NULL;
