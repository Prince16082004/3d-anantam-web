-- Create database
-- CREATE DATABASE anantam_db;

CREATE TABLE IF NOT EXISTS users (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    role VARCHAR(20) DEFAULT 'user',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS products (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    description TEXT NOT NULL,
    price DECIMAL(10, 2) NOT NULL,
    category VARCHAR(100) NOT NULL,
    image_url VARCHAR(500) NOT NULL,
    rating DECIMAL(3, 1) DEFAULT 5.0,
    reviews_count INT DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS orders (
    id SERIAL PRIMARY KEY,
    user_id INT REFERENCES users(id),
    customer_name VARCHAR(255) NOT NULL,
    customer_email VARCHAR(255) NOT NULL,
    address TEXT NOT NULL,
    total_amount DECIMAL(10, 2) NOT NULL,
    status VARCHAR(50) DEFAULT 'Pending',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);


CREATE TABLE IF NOT EXISTS order_items (
    id SERIAL PRIMARY KEY,
    order_id INT REFERENCES orders(id) ON DELETE CASCADE,
    product_id INT REFERENCES products(id),
    quantity INT NOT NULL,
    price_at_purchase DECIMAL(10, 2) NOT NULL
);

-- Insert dummy data if empty
INSERT INTO products (name, description, price, category, image_url, rating, reviews_count) 
SELECT 
    'Carbon Fiber Drone Frame VX-1', 
    'Ultra-lightweight, high-strength carbon fiber infused drone frame built for racing and agile maneuvers. Features modular arms for easy replacements.', 
    149.99, 
    'Drone Parts', 
    'https://images.unsplash.com/photo-1579824220023-adbd7d9959e4?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80', 
    4.8, 
    124
WHERE NOT EXISTS (SELECT id FROM products WHERE name = 'Carbon Fiber Drone Frame VX-1');

INSERT INTO products (name, description, price, category, image_url, rating, reviews_count)
SELECT 
    'Titanium Extruder Gear', 
    'High-precision titanium gear for superior gripping force and no slipping on your filament. Compatible with direct drive systems.', 
    24.50, 
    '3D Printing Mods', 
    'https://images.unsplash.com/photo-1622344071373-c8d76db8d264?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80', 
    4.9, 
    85
WHERE NOT EXISTS (SELECT id FROM products WHERE name = 'Titanium Extruder Gear');

INSERT INTO products (name, description, price, category, image_url, rating, reviews_count)
SELECT 
    'Autonomous Rover Chassis Kit', 
    'A complete 3D printed mechanical chassis base for DIY robotics and autonomous ground vehicles. Includes mounts for standard motors and sensors.', 
    89.00, 
    'Robotics', 
    'https://images.unsplash.com/photo-1518314916381-77a37c2a49ae?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80', 
    4.6, 
    42
WHERE NOT EXISTS (SELECT id FROM products WHERE name = 'Autonomous Rover Chassis Kit');

INSERT INTO products (name, description, price, category, image_url, rating, reviews_count)
SELECT 
    'Nylon Propeller Set (4x)', 
    'Durable, aero-optimized 5-inch nylon propellers balancing thrust and efficiency for FPV racing drones.', 
    12.99, 
    'Drone Parts', 
    'https://images.unsplash.com/photo-1527977966376-1c8408f9f108?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80', 
    4.7, 
    198
WHERE NOT EXISTS (SELECT id FROM products WHERE name = 'Nylon Propeller Set (4x)');

INSERT INTO products (name, description, price, category, image_url, rating, reviews_count)
SELECT 
    'Robotic Gripper Arm Module', 
    'High-torque servo-driven robotic gripper capable of lifting up to 2kg. Fully compatible with Arduino and Raspberry Pi interfaces.', 
    55.00, 
    'Robotics', 
    'https://images.unsplash.com/photo-1485827404703-89b55fcc595e?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80', 
    4.5, 
    67
WHERE NOT EXISTS (SELECT id FROM products WHERE name = 'Robotic Gripper Arm Module');
