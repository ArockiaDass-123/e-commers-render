require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const User = require('./models/User');
const Product = require('./models/Product');
const Cart = require('./models/Cart');
const Order = require('./models/Order');

const app = express();
app.use(express.json());
app.use(cors());

const PORT = process.env.PORT || 5000;
const JWT_SECRET = process.env.JWT_SECRET || 'your_super_secret_key';

mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/ecommerce').then(() => {
    console.log('Connected to MongoDB');
    seedProducts();
}).catch(err => console.error('MongoDB connection error:', err));

// Auth Middleware
const auth = (req, res, next) => {
    const token = req.header('Authorization')?.replace('Bearer ', '');
    if (!token) return res.status(401).json({ error: 'No token, authorization denied' });
    try {
        const decoded = jwt.verify(token, JWT_SECRET);
        req.user = decoded;
        next();
    } catch (err) {
        res.status(401).json({ error: 'Token is not valid' });
    }
};

// Routes
app.post('/api/auth/register', async (req, res) => {
    try {
        const { username, password } = req.body;
        const user = new User({ username, password });
        await user.save();

        // Generate token for immediate login
        const token = jwt.sign({ id: user._id }, JWT_SECRET, { expiresIn: '1h' });
        res.status(201).json({ message: 'User registered', token });
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
});

app.post('/api/auth/login', async (req, res) => {
    try {
        const { username, password } = req.body;
        const user = await User.findOne({ username });
        if (!user || !(await bcrypt.compare(password, user.password))) {
            return res.status(400).json({ error: 'Invalid username/password' });
        }
        const token = jwt.sign({ id: user._id }, JWT_SECRET, { expiresIn: '1h' });
        res.json({ token });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

app.get('/api/products', async (req, res) => {
    try {
        const products = await Product.find();
        res.json(products);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Cart Routes
app.get('/api/carts', auth, async (req, res) => {
    try {
        let cart = await Cart.findOne({ user_id: req.user.id, status: 'active' }).populate('items.product_id');
        if (!cart) {
            cart = new Cart({ user_id: req.user.id, items: [] });
            await cart.save();
        }
        // Map to format expected by frontend Cart.jsx (which looks for cart.items and item.item.price)
        const formattedItems = cart.items.map(i => ({
            id: i._id,
            product_id: i.product_id._id,
            item: i.product_id // Nesting the product data under 'item' to match Cart.jsx
        }));
        res.json({ data: { id: cart._id, items: formattedItems } });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

app.post('/api/carts/add', auth, async (req, res) => {
    try {
        const { product_id } = req.body;
        console.log(`Adding product ${product_id} to cart for user ${req.user.id}`);
        let cart = await Cart.findOne({ user_id: req.user.id, status: 'active' });
        if (!cart) {
            console.log('Creating new cart');
            cart = new Cart({ user_id: req.user.id, items: [] });
        }
        cart.items.push({ product_id });
        await cart.save();
        console.log('Item added to cart successfully');
        res.json({ message: 'Item added to cart' });
    } catch (err) {
        console.error('Cart add error:', err);
        res.status(500).json({ error: err.message });
    }
});

// Order Routes
app.post('/api/orders', auth, async (req, res) => {
    try {
        const { cart_id } = req.body;
        const cart = await Cart.findById(cart_id).populate('items.product_id');
        if (!cart || cart.status !== 'active') return res.status(400).json({ error: 'Invalid cart' });

        const items = cart.items.map(i => ({
            product_id: i.product_id._id,
            name: i.product_id.name,
            price: i.product_id.price,
            quantity: 1
        }));

        const total_price = items.reduce((sum, i) => sum + i.price, 0);

        const order = new Order({
            user_id: req.user.id,
            cart_id: cart._id,
            items,
            total_price
        });

        await order.save();
        cart.status = 'converted';
        await cart.save();

        res.status(201).json({ message: 'Order created', data: order });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

app.get('/api/orders', auth, async (req, res) => {
    try {
        const orders = await Order.find({ user_id: req.user.id }).sort({ createdAt: -1 });
        res.json({ data: orders });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

async function seedProducts() {
    const count = await Product.countDocuments();
    if (count === 0) {
        const products = [
            { name: "Wireless Mouse", price: 29.99, category: "Accessories", image_url: "https://images.unsplash.com/photo-1527864550417-7fd91fc51a46?w=500" },
            { name: "Mechanical Keyboard", price: 89.99, category: "Accessories", image_url: "https://images.unsplash.com/photo-1511467687858-23d96c32e4ae?w=500" },
            { name: "USB-C Charger", price: 19.99, category: "Cables", image_url: "https://images.unsplash.com/photo-1611186871348-b1ec696e52c9?w=500" },
            { name: "Bluetooth Headphones", price: 129.99, category: "Audio", image_url: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=500" },
            { name: "Laptop Stand", price: 34.99, category: "Office", image_url: "https://images.unsplash.com/photo-1586210579191-33b45e38fa2c?w=500" },
            { name: "Smartphone Tripod", price: 24.99, category: "Photography", image_url: "https://images.unsplash.com/photo-1590234791387-a2f07d2af18a?w=500" },
            { name: "Webcam HD 1080p", price: 59.99, category: "Video", image_url: "https://images.unsplash.com/photo-1583209814683-c023dd293cc6?w=500" },
            { name: "External Hard Drive 1TB", price: 69.99, category: "Storage", image_url: "https://images.unsplash.com/photo-1531492746076-1a1bd9b29fcb?w=500" },
            { name: "Portable SSD 512GB", price: 79.99, category: "Storage", image_url: "https://images.unsplash.com/photo-1591488320449-011701bb6704?w=500" },
            { name: "Wireless Earbuds", price: 49.99, category: "Audio", image_url: "https://images.unsplash.com/photo-1590658268037-6bf12165a8df?w=500" },
            { name: "Smart Watch", price: 199.99, category: "Wearables", image_url: "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=500" },
            { name: "Fitness Tracker Band", price: 39.99, category: "Wearables", image_url: "https://images.unsplash.com/photo-1557166983-5939644443a0?w=500" },
            { name: "Gaming Mouse Pad", price: 14.99, category: "Accessories", image_url: "https://images.unsplash.com/photo-1593305841991-05c297ba4575?w=500" },
            { name: "Noise Cancelling Headphones", price: 249.99, category: "Audio", image_url: "https://images.unsplash.com/photo-1546435770-a3e426bf472b?w=500" },
            { name: "Bluetooth Speaker", price: 45.99, category: "Audio", image_url: "https://images.unsplash.com/photo-1589125773751-719584d4692a?w=500" },
            { name: "Laptop Backpack", price: 55.99, category: "Travel", image_url: "https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=500" },
            { name: "Phone Fast Charging Cable", price: 12.99, category: "Cables", image_url: "https://images.unsplash.com/photo-1563203369-26f2e4a5ccf7?w=500" },
            { name: "USB Hub 4-Port", price: 18.99, category: "Accessories", image_url: "https://images.unsplash.com/photo-1531297484001-80022131f5a1?w=500" },
            { name: "Desk LED Lamp", price: 28.99, category: "Office", image_url: "https://images.unsplash.com/photo-1534073828943-f801091bb18c?w=500" },
            { name: "Power Bank 20000mAh", price: 39.99, category: "Accessories", image_url: "https://images.unsplash.com/photo-1609591035230-818274197e41?w=500" }
        ];
        await Product.insertMany(products);
        console.log('Database seeded with 20 premium products');
    }
}

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
