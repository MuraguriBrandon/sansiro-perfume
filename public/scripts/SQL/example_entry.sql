-- Insert the product
INSERT INTO products (item_code, code_name, designer, category_id, gender, notes)
VALUES (
    'U19',
    'BLACK ORCHID',
    'TOM FORD',
    (SELECT id FROM categories WHERE name = 'Oriental'),
    'Unisex',
    ARRAY['warm spicy', 'earthy', 'woody', 'sweet', 'amber', 'patchouli', 'chocolate', 'floral', 'fruity', 'balsamic']
);

-- Insert the variants
INSERT INTO product_variants (product_id, size_ml, price, available, image_url)
-- image url is public/images/8ml-men.png and public/images/U19-50ml.png or null
VALUES 
    ((SELECT id FROM products WHERE item_code = 'U19'), 8, 350, false, '/public/images/8ml-men.png'),
    ((SELECT id FROM products WHERE item_code = 'U19'), 50, 2000, false, '/public/images/U19-50ml.png');