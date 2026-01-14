-- USERS
INSERT INTO users (email, first_name, last_name, password, role) VALUES 
('admin@example.com', 'Admin', 'User', 'password', 'ADMIN'),
('user@example.com', 'Test', 'Customer', 'password', 'USER');

-- PRODUCTS and IMAGES (Stored as BLOBs)
-- Placeholder 1x1 transparent GIF HEX: 47494638396101000100800000ffffff00000021f90401000000002c00000000010001000002024401003b
-- We will use this content for all seeded images initially.

-- 1. Phra Pidta
INSERT INTO products (id, name, description, price, sku, slug, active, stock_level) VALUES 
(1, 'Phra Pidta', 'Amulet of protective wealth and good fortune. Closes properties against danger.', 150.0, 'AMU-001', 'phra-pidta', true, 10);
INSERT INTO product_images (content, content_type, image_url, thumbnail, product_id) VALUES 
(X'47494638396101000100800000ffffff00000021f90401000000002c00000000010001000002024401003b', 'image/png', 'seed:phra_pidta.png', true, 1);

-- 2. Ganesha Amulet
INSERT INTO products (id, name, description, price, sku, slug, active, stock_level) VALUES 
(2, 'Ganesha Amulet', 'The remover of obstacles and god of new beginnings.', 200.0, 'AMU-002', 'ganesha-amulet', true, 5);
INSERT INTO product_images (content, content_type, image_url, thumbnail, product_id) VALUES 
(X'47494638396101000100800000ffffff00000021f90401000000002c00000000010001000002024401003b', 'image/png', 'seed:ganesha.png', true, 2);

-- 3. Butterfly Amulet
INSERT INTO products (id, name, description, price, sku, slug, active, stock_level) VALUES 
(3, 'Butterfly Amulet (Thep Jamleng)', 'Enhances charm, kindness, and popularity.', 180.0, 'AMU-003', 'butterfly-amulet', true, 10);
INSERT INTO product_images (content, content_type, image_url, thumbnail, product_id) VALUES 
(X'47494638396101000100800000ffffff00000021f90401000000002c00000000010001000002024401003b', 'image/png', 'seed:butterfly.png', true, 3);

-- 4. Takrut
INSERT INTO products (id, name, description, price, sku, slug, active, stock_level) VALUES 
(4, 'Takrut (Protection Scroll)', 'Traditional rolled metal amulet for invulnerability.', 120.0, 'AMU-004', 'takrut-scroll', true, 10);
INSERT INTO product_images (content, content_type, image_url, thumbnail, product_id) VALUES 
(X'47494638396101000100800000ffffff00000021f90401000000002c00000000010001000002024401003b', 'image/png', 'seed:takrut.png', true, 4);

-- 5. Nang Kwak
INSERT INTO products (id, name, description, price, sku, slug, active, stock_level) VALUES 
(5, 'Nang Kwak', 'The Beckoning Lady, brings business and wealth.', 160.0, 'AMU-005', 'nang-kwak', true, 10);
INSERT INTO product_images (content, content_type, image_url, thumbnail, product_id) VALUES 
(X'47494638396101000100800000ffffff00000021f90401000000002c00000000010001000002024401003b', 'image/png', 'seed:nang_kwak.png', true, 5);

-- 6. Phra Khun Paen
INSERT INTO products (id, name, description, price, sku, slug, active, stock_level) VALUES 
(6, 'Phra Khun Paen', 'For charm, attraction, and success in love.', 250.0, 'AMU-006', 'phra-khun-paen', true, 10);
INSERT INTO product_images (content, content_type, image_url, thumbnail, product_id) VALUES 
(X'47494638396101000100800000ffffff00000021f90401000000002c00000000010001000002024401003b', 'image/jpeg', 'seed:phra_khun_paen.jpg', true, 6);

-- 7. Tiger Takrut
INSERT INTO products (id, name, description, price, sku, slug, active, stock_level) VALUES 
(7, 'Tiger Takrut', 'Power, authority, and protection from enemies.', 220.0, 'AMU-007', 'tiger-takrut', true, 10);
INSERT INTO product_images (content, content_type, image_url, thumbnail, product_id) VALUES 
(X'47494638396101000100800000ffffff00000021f90401000000002c00000000010001000002024401003b', 'image/jpeg', 'seed:tiger_takrut.jpg', true, 7);
