require('dotenv').config();
const express = require('express');
const cors = require('cors');
const path = require('path');
const rateLimit = require('express-rate-limit');

// Import Routes
const authRoutes = require('./routes/auth.routes');
const userRoutes = require('./routes/user.routes');
const productRoutes = require('./routes/product.routes');
const cartRoutes = require('./routes/cart.routes');
const orderRoutes = require('./routes/order.routes');
const paymentRoutes = require('./routes/payment.routes');
const deliveryRoutes = require('./routes/delivery.routes');
const riderRoutes = require('./routes/rider.routes');
const creditRoutes = require('./routes/credit.routes');
const analyticsRoutes = require('./routes/analytics.routes');

const stockRoutes = require('./routes/stock.routes');

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Rate Limiting
const limiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 999999 // Set to a very high number to effectively disable during development
});
app.use(limiter);

// Static folder for uploads
app.use('/uploads', express.static(path.join(__dirname, '../uploads')));

// Routes
app.use('/api/v1/auth', authRoutes);
app.use('/api/v1/users', userRoutes);
app.use('/api/v1/products', productRoutes);
app.use('/api/v1/cart', cartRoutes);
app.use('/api/v1/orders', orderRoutes);
app.use('/api/v1/payments', paymentRoutes);
app.use('/api/v1/deliveries', deliveryRoutes);
app.use('/api/v1/riders', riderRoutes);
app.use('/api/v1/credits', creditRoutes);
app.use('/api/v1/admin/analytics', analyticsRoutes);
app.use('/api/v1/admin/stock', stockRoutes);

// Base route
app.get('/', (req, res) => {
    res.send('Liquor Shop API is running');
});

// Error Handling Middleware
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({ message: 'Something went wrong!' });
});

// Start Server
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
