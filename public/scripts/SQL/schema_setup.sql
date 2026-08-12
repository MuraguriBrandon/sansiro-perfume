-- Create categories table
CREATE TABLE categories (
    id SERIAL PRIMARY KEY,
    name TEXT NOT NULL UNIQUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create products table
CREATE TABLE products (
    id SERIAL PRIMARY KEY,
    item_code TEXT NOT NULL UNIQUE,
    code_name TEXT NOT NULL,
    designer TEXT NOT NULL,
    category_id INTEGER REFERENCES categories(id),
    gender TEXT,
    notes TEXT[],
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create product_variants table
CREATE TABLE product_variants (
    id SERIAL PRIMARY KEY,
    product_id INTEGER REFERENCES products(id) ON DELETE CASCADE,
    size_ml INTEGER NOT NULL,
    price DECIMAL(10,2) NOT NULL,
    available BOOLEAN DEFAULT true,
    image_url TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create orders table
CREATE TABLE orders (
    id SERIAL PRIMARY KEY,
    order_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    total_amount DECIMAL(10,2) NOT NULL,
    whatsapp_sent BOOLEAN DEFAULT false
);

-- Create order_items table
CREATE TABLE order_items (
    id SERIAL PRIMARY KEY,
    order_id INTEGER REFERENCES orders(id) ON DELETE CASCADE,
    product_id INTEGER REFERENCES products(id),
    variant_id INTEGER REFERENCES product_variants(id),
    quantity INTEGER NOT NULL,
    price_at_purchase DECIMAL(10,2) NOT NULL
);

-- Insert initial categories
INSERT INTO categories (name) VALUES
    ('Floral'),
    ('Oriental'),
    ('Woody'),
    ('Fresh-Chypre');


-- 2. Prevent duplicate size entries per product (e.g. two 50ml rows for the same perfume)
ALTER TABLE product_variants ADD CONSTRAINT unique_product_size UNIQUE (product_id, size_ml);

-- 3. Guard against nonsense data
ALTER TABLE product_variants ADD CONSTRAINT positive_price CHECK (price >= 0);
ALTER TABLE order_items ADD CONSTRAINT positive_quantity CHECK (quantity > 0);