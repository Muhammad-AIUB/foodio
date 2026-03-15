-- Baseline: existing database created from schema.sql (no category image_url yet)

CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

CREATE TYPE "user_role" AS ENUM (
  'USER',
  'ADMIN'
);

CREATE TYPE "order_status" AS ENUM (
  'Pending',
  'Preparing',
  'Ready',
  'Completed'
);

CREATE TABLE "users" (
  "id" UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  "name" VARCHAR(100) NOT NULL,
  "email" VARCHAR(150) UNIQUE NOT NULL,
  "password" VARCHAR(255) NOT NULL,
  "role" "user_role" DEFAULT 'USER',
  "created_at" TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  "updated_at" TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE "categories" (
  "id" UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  "name" VARCHAR(120) NOT NULL UNIQUE,
  "description" TEXT,
  "created_at" TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  "updated_at" TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE "menu_items" (
  "id" UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  "name" VARCHAR(150) NOT NULL,
  "description" TEXT,
  "price" DECIMAL(10,2) NOT NULL,
  "image_url" TEXT,
  "availability" BOOLEAN DEFAULT TRUE,
  "category_id" UUID NOT NULL,
  "created_at" TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  "updated_at" TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT "menu_items_category_id_fkey" FOREIGN KEY ("category_id") REFERENCES "categories"("id") ON DELETE CASCADE ON UPDATE CASCADE
);

CREATE TABLE "orders" (
  "id" UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  "user_id" UUID NOT NULL,
  "total_price" DECIMAL(10,2) NOT NULL,
  "status" "order_status" DEFAULT 'Pending',
  "created_at" TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  "updated_at" TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT "orders_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE
);

CREATE TABLE "order_items" (
  "id" UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  "order_id" UUID NOT NULL,
  "menu_item_id" UUID NOT NULL,
  "quantity" INTEGER NOT NULL,
  "price_snapshot" DECIMAL(10,2) NOT NULL,
  CONSTRAINT "order_items_order_id_fkey" FOREIGN KEY ("order_id") REFERENCES "orders"("id") ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT "order_items_menu_item_id_fkey" FOREIGN KEY ("menu_item_id") REFERENCES "menu_items"("id") ON DELETE CASCADE ON UPDATE CASCADE
);

CREATE INDEX "menu_items_category_id_idx" ON "menu_items"("category_id");
CREATE INDEX "orders_user_id_idx" ON "orders"("user_id");
CREATE INDEX "order_items_order_id_idx" ON "order_items"("order_id");
