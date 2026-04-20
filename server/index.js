import express from 'express';
import cors from 'cors';
import Database from 'better-sqlite3';
import dotenv from 'dotenv';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import multer from 'multer';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

// --- Static uploads folder ---
const uploadsDir = path.join(__dirname, 'uploads');
if (!fs.existsSync(uploadsDir)) fs.mkdirSync(uploadsDir);
app.use('/uploads', express.static(uploadsDir));

// --- SQLite setup ---
const dbPath = path.join(__dirname, 'anantam.db');
const db = new Database(dbPath);
db.pragma('journal_mode = WAL');
db.pragma('foreign_keys = ON');

// --- DB Init & Seed ---
const initDb = () => {
  db.exec(`
    CREATE TABLE IF NOT EXISTS users (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL,
      email TEXT UNIQUE NOT NULL,
      password_hash TEXT NOT NULL,
      role TEXT DEFAULT 'user',
      created_at TEXT DEFAULT (datetime('now'))
    );

    CREATE TABLE IF NOT EXISTS products (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL,
      description TEXT NOT NULL,
      price REAL NOT NULL,
      category TEXT NOT NULL,
      image_url TEXT NOT NULL,
      rating REAL DEFAULT 5.0,
      reviews_count INTEGER DEFAULT 0,
      stock_quantity INTEGER DEFAULT 10,
      created_at TEXT DEFAULT (datetime('now'))
    );

    CREATE TABLE IF NOT EXISTS reviews (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      user_id INTEGER REFERENCES users(id),
      product_id INTEGER REFERENCES products(id),
      rating INTEGER NOT NULL,
      comment TEXT,
      created_at TEXT DEFAULT (datetime('now'))
    );

    CREATE TABLE IF NOT EXISTS orders (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      user_id INTEGER REFERENCES users(id),
      customer_name TEXT NOT NULL,
      customer_email TEXT NOT NULL,
      address TEXT NOT NULL,
      total_amount REAL NOT NULL,
      status TEXT DEFAULT 'Pending',
      created_at TEXT DEFAULT (datetime('now'))
    );

    CREATE TABLE IF NOT EXISTS order_items (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      order_id INTEGER REFERENCES orders(id) ON DELETE CASCADE,
      product_id INTEGER REFERENCES products(id),
      quantity INTEGER NOT NULL,
      price_at_purchase REAL NOT NULL
    );

    CREATE TABLE IF NOT EXISTS coupons (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      code TEXT UNIQUE NOT NULL,
      discount_type TEXT NOT NULL, -- 'percent' or 'flat'
      discount_value REAL NOT NULL,
      is_active INTEGER DEFAULT 1,
      expiry_date TEXT
    );
  `);

  // Seed products if empty
  const count = db.prepare('SELECT COUNT(*) as c FROM products').get();
  if (count.c === 0) {
    const insert = db.prepare(
      'INSERT INTO products (name, description, price, category, image_url, rating, reviews_count) VALUES (?, ?, ?, ?, ?, ?, ?)'
    );
    const seedProducts = [
      ['Carbon Fiber Drone Frame VX-1', 'Ultra-lightweight, high-strength carbon fiber infused drone frame built for racing and agile maneuvers. Features modular arms for easy replacements.', 149.99, 'Drone Parts', 'https://images.unsplash.com/photo-1579824220023-adbd7d9959e4?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80', 4.8, 124],
      ['Titanium Extruder Gear', 'High-precision titanium gear for superior gripping force and no slipping on your filament. Compatible with direct drive systems.', 24.50, '3D Printing Mods', 'https://images.unsplash.com/photo-1622344071373-c8d76db8d264?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80', 4.9, 85],
      ['Autonomous Rover Chassis Kit', 'A complete 3D printed mechanical chassis base for DIY robotics and autonomous ground vehicles. Includes mounts for standard motors and sensors.', 89.00, 'Robotics', 'https://images.unsplash.com/photo-1518314916381-77a37c2a49ae?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80', 4.6, 42],
      ['Nylon Propeller Set (4x)', 'Durable, aero-optimized 5-inch nylon propellers balancing thrust and efficiency for FPV racing drones.', 12.99, 'Drone Parts', 'https://images.unsplash.com/photo-1527977966376-1c8408f9f108?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80', 4.7, 198],
      ['Robotic Gripper Arm Module', 'High-torque servo-driven robotic gripper capable of lifting up to 2kg. Fully compatible with Arduino and Raspberry Pi interfaces.', 55.00, 'Robotics', 'https://images.unsplash.com/photo-1485827404703-89b55fcc595e?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80', 4.5, 67],
    ];
    for (const p of seedProducts) insert.run(...p);
    console.log('Database seeded with sample products.');
  }

  console.log('Database initialized at', dbPath);
};

initDb();

// --- Multer for STL/OBJ uploads ---
const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, uploadsDir),
  filename: (req, file, cb) => cb(null, `${Date.now()}-${file.originalname}`)
});
const upload = multer({
  storage,
  limits: { fileSize: 50 * 1024 * 1024 },
  fileFilter: (req, file, cb) => {
    const allowed = ['.stl', '.obj'];
    const ext = path.extname(file.originalname).toLowerCase();
    if (allowed.includes(ext)) cb(null, true);
    else cb(new Error('Only STL and OBJ files are allowed'));
  }
});

// --- Auth Middleware ---
const authMiddleware = (req, res, next) => {
  const token = req.header('Authorization')?.replace('Bearer ', '');
  if (!token) return res.status(401).json({ msg: 'No token, access denied' });
  try {
    req.user = jwt.verify(token, process.env.JWT_SECRET || 'anantam_secret_key');
    next();
  } catch (err) {
    res.status(401).json({ msg: 'Invalid token' });
  }
};

const adminMiddleware = (req, res, next) => {
  if (req.user?.role !== 'admin') return res.status(403).json({ msg: 'Admin access required' });
  next();
};

// ═══════════════════════════════════════
// AUTH ROUTES
// ═══════════════════════════════════════
app.post('/api/auth/register', async (req, res) => {
  try {
    const { name, email, password } = req.body;
    if (!name || !email || !password) return res.status(400).json({ msg: 'All fields required' });

    const existing = db.prepare('SELECT id FROM users WHERE email = ?').get(email);
    if (existing) return res.status(400).json({ msg: 'Email already registered' });

    const salt = await bcrypt.genSalt(12);
    const passwordHash = await bcrypt.hash(password, salt);

    const result = db.prepare(
      'INSERT INTO users (name, email, password_hash) VALUES (?, ?, ?)'
    ).run(name, email, passwordHash);

    const user = db.prepare('SELECT id, name, email, role FROM users WHERE id = ?').get(result.lastInsertRowid);
    const token = jwt.sign(
      { id: user.id, email: user.email, role: user.role },
      process.env.JWT_SECRET || 'anantam_secret_key',
      { expiresIn: '7d' }
    );
    res.json({ token, user });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

app.post('/api/auth/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = db.prepare('SELECT * FROM users WHERE email = ?').get(email);
    if (!user) return res.status(400).json({ msg: 'Invalid credentials' });

    const isMatch = await bcrypt.compare(password, user.password_hash);
    if (!isMatch) return res.status(400).json({ msg: 'Invalid credentials' });

    const token = jwt.sign(
      { id: user.id, email: user.email, role: user.role },
      process.env.JWT_SECRET || 'anantam_secret_key',
      { expiresIn: '7d' }
    );
    res.json({ token, user: { id: user.id, name: user.name, email: user.email, role: user.role } });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// Get logged-in user profile
app.get('/api/auth/me', authMiddleware, (req, res) => {
  try {
    const user = db.prepare('SELECT id, name, email, role, created_at FROM users WHERE id = ?').get(req.user.id);
    res.json(user);
  } catch (err) {
    res.status(500).send('Server Error');
  }
});

// ═══════════════════════════════════════
// PRODUCTS ROUTES
// ═══════════════════════════════════════
app.get('/api/products', (req, res) => {
  try {
    const { search, category, featured } = req.query;
    let query = 'SELECT * FROM products';
    const params = [];
    const conditions = [];

    if (search) {
      conditions.push(`(name LIKE ? OR description LIKE ?)`);
      params.push(`%${search}%`, `%${search}%`);
    }
    if (category) {
      conditions.push(`category = ?`);
      params.push(category);
    }
    if (featured === 'true') {
      conditions.push(`is_featured = 1`);
    }
    if (conditions.length > 0) query += ' WHERE ' + conditions.join(' AND ');
    query += ' ORDER BY created_at DESC';

    const rows = db.prepare(query).all(...params);
    res.json(rows);
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ msg: 'Server Error' });
  }
});

app.get('/api/products/:id', (req, res) => {
  try {
    const product = db.prepare('SELECT * FROM products WHERE id = ?').get(req.params.id);
    if (!product) return res.status(404).json({ msg: 'Product not found' });
    res.json(product);
  } catch (err) {
    res.status(500).json({ msg: 'Server Error' });
  }
});

app.get('/api/products/:id/related', (req, res) => {
  try {
    const product = db.prepare('SELECT category FROM products WHERE id = ?').get(req.params.id);
    if (!product) return res.status(404).json({ msg: 'Product not found' });
    
    const related = db.prepare(
      'SELECT * FROM products WHERE category = ? AND id != ? LIMIT 4'
    ).all(product.category, req.params.id);
    
    res.json(related);
  } catch (err) {
    res.status(500).json({ msg: 'Server Error' });
  }
});

// --- REVIEWS ROUTES ---
app.get('/api/products/:id/reviews', (req, res) => {
  try {
    const reviews = db.prepare(`
      SELECT r.*, u.name as user_name 
      FROM reviews r 
      JOIN users u ON r.user_id = u.id 
      WHERE r.product_id = ? 
      ORDER BY r.created_at DESC
    `).all(req.params.id);
    res.json(reviews);
  } catch (err) {
    res.status(500).json({ msg: 'Server Error' });
  }
});

app.post('/api/products/:id/reviews', authMiddleware, (req, res) => {
  try {
    const { rating, comment } = req.body;
    const productId = req.params.id;
    const userId = req.user.id;

    if (!rating || rating < 1 || rating > 5) {
      return res.status(400).json({ msg: 'Rating must be between 1 and 5' });
    }

    db.transaction(() => {
      // Insert review
      db.prepare(
        'INSERT INTO reviews (user_id, product_id, rating, comment) VALUES (?, ?, ?, ?)'
      ).run(userId, productId, rating, comment);

      // Update product rating and count
      const ratings = db.prepare('SELECT rating FROM reviews WHERE product_id = ?').all(productId);
      const newCount = ratings.length;
      const newRating = ratings.reduce((acc, curr) => acc + curr.rating, 0) / newCount;

      db.prepare(
        'UPDATE products SET rating = ?, reviews_count = ? WHERE id = ?'
      ).run(newRating.toFixed(1), newCount, productId);
    })();

    res.json({ msg: 'Review submitted successfully' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ msg: 'Server Error' });
  }
});

// ADMIN: Add product
app.post('/api/products', authMiddleware, adminMiddleware, (req, res) => {
  try {
    const { name, description, price, category, image_url } = req.body;
    const result = db.prepare(
      'INSERT INTO products (name, description, price, category, image_url) VALUES (?, ?, ?, ?, ?)'
    ).run(name, description, price, category, image_url);
    const product = db.prepare('SELECT * FROM products WHERE id = ?').get(result.lastInsertRowid);
    res.json(product);
  } catch (err) {
    res.status(500).json({ msg: 'Server Error' });
  }
});

// ADMIN: Edit product
app.put('/api/products/:id', authMiddleware, adminMiddleware, (req, res) => {
  try {
    const { name, description, price, category, image_url } = req.body;
    db.prepare(
      'UPDATE products SET name=?, description=?, price=?, category=?, image_url=? WHERE id=?'
    ).run(name, description, price, category, image_url, req.params.id);
    const product = db.prepare('SELECT * FROM products WHERE id = ?').get(req.params.id);
    if (!product) return res.status(404).json({ msg: 'Product not found' });
    res.json(product);
  } catch (err) {
    res.status(500).json({ msg: 'Server Error' });
  }
});

// --- COUPON ROUTES ---
app.post('/api/coupons/validate', (req, res) => {
  try {
    const { code } = req.body;
    console.log('Validating coupon:', code);
    const coupon = db.prepare('SELECT * FROM coupons WHERE code = ? AND is_active = 1').get(code);
    console.log('Coupon result:', coupon);
    if (!coupon) return res.status(404).json({ msg: 'Invalid or expired coupon' });
    
    // Simple expiry check
    if (coupon.expiry_date && new Date(coupon.expiry_date) < new Date()) {
      return res.status(400).json({ msg: 'Coupon has expired' });
    }
    
    res.json(coupon);
  } catch (err) {
    console.error('Coupon validation error:', err.message);
    res.status(500).json({ msg: 'Server Error' });
  }
});

// ADMIN: Get stats
app.get('/api/admin/stats', authMiddleware, adminMiddleware, (req, res) => {
  try {
    const totalRevenue = db.prepare('SELECT SUM(total_amount) as total FROM orders').get().total || 0;
    const totalOrders = db.prepare('SELECT COUNT(*) as count FROM orders').get().count;
    const totalUsers = db.prepare('SELECT COUNT(*) as count FROM users').get().count;
    const lowStockCount = db.prepare('SELECT COUNT(*) as count FROM products WHERE stock_quantity < 5').get().count;
    
    // Revenue last 30 days
    const revenue30Days = db.prepare(`
      SELECT SUM(total_amount) as total 
      FROM orders 
      WHERE created_at > datetime('now','-30 days')
    `).get().total || 0;

    res.json({ totalRevenue, totalOrders, totalUsers, lowStockCount, revenue30Days });
  } catch (err) {
    res.status(500).json({ msg: 'Server Error' });
  }
});

// ADMIN: Manage Coupons
app.get('/api/admin/coupons', authMiddleware, adminMiddleware, (req, res) => {
  const coupons = db.prepare('SELECT * FROM coupons ORDER BY id DESC').all();
  res.json(coupons);
});

app.post('/api/admin/coupons', authMiddleware, adminMiddleware, (req, res) => {
  const { code, discount_type, discount_value, expiry_date } = req.body;
  db.prepare(
    'INSERT INTO coupons (code, discount_type, discount_value, expiry_date) VALUES (?, ?, ?, ?)'
  ).run(code, discount_type, discount_value, expiry_date);
  res.json({ msg: 'Coupon created' });
});

app.patch('/api/admin/products/:id/stock', authMiddleware, adminMiddleware, (req, res) => {
  const { stock_quantity } = req.body;
  db.prepare('UPDATE products SET stock_quantity = ? WHERE id = ?').run(stock_quantity, req.params.id);
  res.json({ msg: 'Stock updated' });
});

app.patch('/api/admin/products/:id/featured', authMiddleware, adminMiddleware, (req, res) => {
  const { is_featured } = req.body;
  db.prepare('UPDATE products SET is_featured = ? WHERE id = ?').run(is_featured ? 1 : 0, req.params.id);
  res.json({ msg: 'Product feature status updated' });
});

// ADMIN: Delete product
app.delete('/api/products/:id', authMiddleware, adminMiddleware, (req, res) => {
  try {
    db.prepare('DELETE FROM products WHERE id = ?').run(req.params.id);
    res.json({ msg: 'Product deleted' });
  } catch (err) {
    res.status(500).json({ msg: 'Server Error' });
  }
});

// ═══════════════════════════════════════
// ORDERS ROUTES (SECURE PRICING)
// ═══════════════════════════════════════
app.post('/api/orders', authMiddleware, (req, res) => {
  try {
    const { customer_name, customer_email, address, items, couponCode } = req.body;

    // SECURITY: Recalculate total from DB prices (never trust client)
    let totalAmount = 0;
    const validatedItems = [];

    for (const item of items) {
      const product = db.prepare('SELECT price FROM products WHERE id = ?').get(item.product_id);
      if (!product) return res.status(400).json({ msg: `Product ${item.product_id} not found` });
      const truePrice = parseFloat(product.price);
      totalAmount += truePrice * item.quantity;
      validatedItems.push({ ...item, price: truePrice });
    }

    // Apply Coupon if provided
    if (couponCode) {
      const coupon = db.prepare('SELECT * FROM coupons WHERE code = ? AND is_active = 1').get(couponCode);
      if (coupon) {
        // Simple expiry check
        if (!coupon.expiry_date || new Date(coupon.expiry_date) >= new Date()) {
          if (coupon.discount_type === 'percent') {
            totalAmount *= (1 - coupon.discount_value / 100);
          } else {
            totalAmount = Math.max(0, totalAmount - coupon.discount_value);
          }
        }
      }
    }

    const placeOrder = db.transaction(() => {
      // 1. Validate Stock first
      for (const item of validatedItems) {
        const prod = db.prepare('SELECT stock_quantity, name FROM products WHERE id = ?').get(item.product_id);
        if (prod.stock_quantity < item.quantity) {
          throw new Error(`Insufficient stock for ${prod.name}. Only ${prod.stock_quantity} remaining.`);
        }
      }

      // 2. Create Order
      const orderResult = db.prepare(
        'INSERT INTO orders (customer_name, customer_email, address, total_amount, user_id) VALUES (?, ?, ?, ?, ?)'
      ).run(customer_name, customer_email, address, totalAmount, req.user.id);

      const orderId = orderResult.lastInsertRowid;

      // 3. Create Items & Decrement Stock
      for (const item of validatedItems) {
        db.prepare(
          'INSERT INTO order_items (order_id, product_id, quantity, price_at_purchase) VALUES (?, ?, ?, ?)'
        ).run(orderId, item.product_id, item.quantity, item.price);

        db.prepare(
          'UPDATE products SET stock_quantity = stock_quantity - ? WHERE id = ?'
        ).run(item.quantity, item.product_id);
      }

      return orderId;
    });

    const orderId = placeOrder();
    res.json({ msg: 'Order placed successfully', orderId, totalAmount });
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ msg: err.message });
  }
});

// Public: Track order by ID and Email
app.post('/api/orders/track', (req, res) => {
  try {
    const { orderId, email } = req.body;
    if (!orderId || !email) return res.status(400).json({ msg: 'Order ID and Email are required' });

    const order = db.prepare(
      'SELECT id, total_amount, status, created_at FROM orders WHERE id = ? AND customer_email = ?'
    ).get(orderId, email);

    if (!order) return res.status(404).json({ msg: 'Order not found or invalid email' });
    
    res.json({ order });
  } catch (err) {
    res.status(500).json({ msg: 'Server Error' });
  }
});

// User: Get their orders
app.get('/api/orders/my', authMiddleware, (req, res) => {
  try {
    const orders = db.prepare(
      `SELECT o.id, o.customer_name, o.customer_email, o.address, o.total_amount, o.status, o.created_at
       FROM orders o WHERE o.user_id = ? ORDER BY o.created_at DESC`
    ).all(req.user.id);

    const result = orders.map(order => {
      const items = db.prepare(
        `SELECT p.name, oi.quantity, oi.price_at_purchase as price
         FROM order_items oi JOIN products p ON oi.product_id = p.id
         WHERE oi.order_id = ?`
      ).all(order.id);
      return { ...order, items };
    });

    res.json(result);
  } catch (err) {
    res.status(500).json({ msg: 'Server Error' });
  }
});

// ADMIN: Get all orders
app.get('/api/orders/all', authMiddleware, adminMiddleware, (req, res) => {
  try {
    const orders = db.prepare(
      `SELECT o.id, o.customer_name, o.customer_email, o.address, o.total_amount, o.status, o.created_at, u.name as user_name
       FROM orders o JOIN users u ON o.user_id = u.id ORDER BY o.created_at DESC`
    ).all();

    const result = orders.map(order => {
      const items = db.prepare(
        `SELECT p.name, oi.quantity, oi.price_at_purchase as price
         FROM order_items oi JOIN products p ON oi.product_id = p.id
         WHERE oi.order_id = ?`
      ).all(order.id);
      return { ...order, items };
    });

    res.json(result);
  } catch (err) {
    res.status(500).json({ msg: 'Server Error' });
  }
});

// ADMIN: Update order status
app.put('/api/orders/:id/status', authMiddleware, adminMiddleware, (req, res) => {
  try {
    const { status } = req.body;
    db.prepare('UPDATE orders SET status=? WHERE id=?').run(status, req.params.id);
    res.json({ msg: 'Status updated' });
  } catch (err) {
    res.status(500).json({ msg: 'Server Error' });
  }
});

// ═══════════════════════════════════════
// FILE UPLOAD (STL/OBJ)
// ═══════════════════════════════════════
app.post('/api/upload/stl', authMiddleware, upload.single('file'), (req, res) => {
  if (!req.file) return res.status(400).json({ msg: 'No file uploaded' });
  res.json({
    msg: 'File uploaded successfully',
    filename: req.file.filename,
    path: `/uploads/${req.file.filename}`
  });
});

// Serve static frontend files
const frontendDistPath = path.join(__dirname, '..', 'dist');
app.use(express.static(frontendDistPath));

// Handle client-side routing - serve index.html for all non-API routes
app.get('*', (req, res) => {
  res.sendFile(path.join(frontendDistPath, 'index.html'));
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
