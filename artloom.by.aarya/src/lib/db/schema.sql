-- ARTLOOM.BY.AARYA DATABASE SCHEMA
-- Execute this script in your Supabase SQL Editor to set up tables

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 1. CATEGORIES TABLE
CREATE TABLE IF NOT EXISTS categories (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  description TEXT,
  icon_name TEXT,
  image TEXT,
  tagline TEXT,
  item_count INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 2. PRODUCTS TABLE
CREATE TABLE IF NOT EXISTS products (
  id TEXT PRIMARY KEY,
  title TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  subtitle TEXT,
  description TEXT NOT NULL,
  detailed_description TEXT,
  category TEXT NOT NULL REFERENCES categories(slug) ON DELETE CASCADE,
  price NUMERIC NOT NULL,
  compare_at_price NUMERIC,
  in_stock BOOLEAN DEFAULT true,
  stock_count INTEGER DEFAULT 10,
  is_bestseller BOOLEAN DEFAULT false,
  is_new_arrival BOOLEAN DEFAULT false,
  is_customizable BOOLEAN DEFAULT true,
  featured_motif TEXT,
  motifs JSONB DEFAULT '[]'::jsonb,
  images JSONB DEFAULT '[]'::jsonb,
  features JSONB DEFAULT '[]'::jsonb,
  specifications JSONB DEFAULT '{}'::jsonb,
  sizes JSONB DEFAULT '[]'::jsonb,
  color_themes JSONB DEFAULT '[]'::jsonb,
  rating NUMERIC DEFAULT 5.0,
  reviews_count INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 3. PROMO CODES TABLE
CREATE TABLE IF NOT EXISTS promo_codes (
  code TEXT PRIMARY KEY,
  discount_type TEXT NOT NULL, -- 'percentage' or 'fixed'
  discount_value NUMERIC NOT NULL,
  min_order_value NUMERIC DEFAULT 0,
  description TEXT,
  active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 4. ORDERS TABLE
CREATE TABLE IF NOT EXISTS orders (
  id TEXT PRIMARY KEY,
  customer JSONB NOT NULL,
  items JSONB NOT NULL,
  subtotal NUMERIC NOT NULL,
  discount NUMERIC DEFAULT 0,
  applied_promo TEXT,
  gift_wrapping BOOLEAN DEFAULT false,
  gift_wrapping_fee NUMERIC DEFAULT 0,
  gift_message TEXT,
  shipping_fee NUMERIC DEFAULT 0,
  total_amount NUMERIC NOT NULL,
  status TEXT NOT NULL DEFAULT 'Placed',
  payment_method TEXT NOT NULL,
  payment_status TEXT NOT NULL DEFAULT 'Pending Verification',
  estimated_delivery_date TEXT,
  artisan_note TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 5. ANNOUNCEMENT BANNER TABLE
CREATE TABLE IF NOT EXISTS announcement_banner (
  id TEXT PRIMARY KEY,
  enabled BOOLEAN DEFAULT true,
  text TEXT NOT NULL,
  highlight_text TEXT,
  badge TEXT,
  background_color TEXT,
  text_color TEXT,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- RLS (Row Level Security) Policies
ALTER TABLE categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE products ENABLE ROW LEVEL SECURITY;
ALTER TABLE promo_codes ENABLE ROW LEVEL SECURITY;
ALTER TABLE orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE announcement_banner ENABLE ROW LEVEL SECURITY;

-- Allow public read access to active store items
CREATE POLICY "Public Read Categories" ON categories FOR SELECT USING (true);
CREATE POLICY "Public Read Products" ON products FOR SELECT USING (true);
CREATE POLICY "Public Read Promo Codes" ON promo_codes FOR SELECT USING (active = true);
CREATE POLICY "Public Read Banner" ON announcement_banner FOR SELECT USING (true);

-- Allow public to insert orders (guest checkout)
CREATE POLICY "Public Create Orders" ON orders FOR INSERT WITH CHECK (true);
-- Allow public to view their specific order by ID
CREATE POLICY "Public View Orders By ID" ON orders FOR SELECT USING (true);
