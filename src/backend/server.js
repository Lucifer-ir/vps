const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const morgan = require('morgan');
const path = require('path');
const db = require('./config/database');
const authRoutes = require('./routes/auth');
const configRoutes = require('./routes/config');
const userRoutes = require('./routes/users');
const monitoringRoutes = require('./routes/monitoring');
const androidRoutes = require('./routes/android');
const authMiddleware = require('./middleware/auth');

dotenv.config();

const app = express();

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(morgan('combined'));

// Static files for Android APK download
app.use('/downloads', express.static(path.join(__dirname, '../android/build')));

// Public routes
app.use('/api/auth', authRoutes);

// Protected routes (require authentication)
app.use('/api/admin/config', authMiddleware.adminAuth, configRoutes);
app.use('/api/admin/users', authMiddleware.adminAuth, userRoutes);
app.use('/api/admin/monitoring', authMiddleware.adminAuth, monitoringRoutes);
app.use('/api/android', androidRoutes);

// Health check
app.get('/api/health', (req, res) => {
    res.json({ status: 'online', timestamp: new Date() });
});

// Error handling middleware
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(err.status || 500).json({
        error: err.message,
        status: err.status || 500
    });
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
    console.log(`VPN Backend Server running on port ${PORT}`);
    console.log(`Environment: ${process.env.NODE_ENV}`);
});

module.exports = app;
