-- =========================
-- FOODIO DATABASE SCHEMA
-- Run this on your PostgreSQL database to create tables manually
-- (Or use: npx prisma migrate dev / prisma db push)
-- =========================


-- =========================
-- EXTENSIONS
-- =========================
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";


-- =========================
-- ENUM TYPES
-- =========================

CREATE TYPE user_role AS ENUM (
  'USER',
  'ADMIN'
);

CREATE TYPE order_status AS ENUM (
  'Pending',
  'Preparing',
  'Ready',
  'Completed'
);


-- =========================
-- USERS TABLE
-- =========================

CREATE TABLE users (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name VARCHAR(100) NOT NULL,
  email VARCHAR(150) UNIQUE NOT NULL,
  password VARCHAR(255) NOT NULL,
  role user_role DEFAULT 'USER',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);


-- =========================
-- CATEGORIES TABLE
-- =========================

CREATE TABLE categories (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name VARCHAR(120) NOT NULL,
  description TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);


-- =========================
-- MENU ITEMS TABLE
-- =========================

CREATE TABLE menu_items (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name VARCHAR(150) NOT NULL,
  description TEXT,
  price DECIMAL(10,2) NOT NULL,
  image_url TEXT,
  availability BOOLEAN DEFAULT TRUE,
  category_id UUID NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

  CONSTRAINT fk_category
    FOREIGN KEY (category_id)
    REFERENCES categories(id)
    ON DELETE CASCADE
);


-- =========================
-- ORDERS TABLE
-- =========================

CREATE TABLE orders (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL,
  total_price DECIMAL(10,2) NOT NULL,
  status order_status DEFAULT 'Pending',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

  CONSTRAINT fk_user
    FOREIGN KEY (user_id)
    REFERENCES users(id)
    ON DELETE CASCADE
);


-- =========================
-- ORDER ITEMS TABLE
-- =========================

CREATE TABLE order_items (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  order_id UUID NOT NULL,
  menu_item_id UUID NOT NULL,
  quantity INTEGER NOT NULL,
  price_snapshot DECIMAL(10,2) NOT NULL,

  CONSTRAINT fk_order
    FOREIGN KEY (order_id)
    REFERENCES orders(id)
    ON DELETE CASCADE,

  CONSTRAINT fk_menu_item
    FOREIGN KEY (menu_item_id)
    REFERENCES menu_items(id)
    ON DELETE CASCADE
);


-- =========================
-- INDEXES (Performance)
-- =========================

CREATE INDEX idx_menu_items_category
ON menu_items(category_id);

CREATE INDEX idx_orders_user
ON orders(user_id);

CREATE INDEX idx_order_items_order
ON order_items(order_id);


-- =========================
-- DEFAULT ADMIN USER
-- =========================

INSERT INTO users (name, email, password, role)
VALUES (
  'Admin',
  'admin@foodio.com',
  '$2b$10$examplehashedpassword',
  'ADMIN'
);
