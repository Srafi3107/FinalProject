const express = require('express');
const cors = require('cors');
const path = require('path');
const dotenv = require('dotenv');
const { testConnection } = require('./config/db');
const healthRoutes = require('./routes/healthRoutes');
const authRoutes = require('./routes/authRoutes');
const listingRoutes = require('./routes/listingRoutes');
const tenantRoutes = require('./routes/tenantRoutes');
const favoriteRoutes = require('./routes/favoriteRoutes');
const { errorHandler, notFoundHandler } = require('./middleware/errorHandler');

// Load environment variables from .env
dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Security & Parsing Middlewares
app.use(cors({
  origin: process.env.CLIENT_URL || 'http://localhost:5173',
  credentials: true
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Serve uploaded listing photos statically
app.use('/uploads', express.static(path.join(__dirname, '../uploads')));

// Root welcome endpoint
app.get('/', (req, res) => {
  res.json({
    message: 'Welcome to HomeMatch API — Housing & Roommate Matching for Dhaka',
    docs: '/api/health',
    version: '1.0.0'
  });
});

// Direct and API-prefixed health check routes
app.use('/', healthRoutes); // Provides GET /health
app.use('/api', healthRoutes); // Provides GET /api/health

// API Routes
app.use('/api/auth', authRoutes); // Auth & Session endpoints
app.use('/api/listings', listingRoutes); // Property Listings & Photo Upload endpoints
app.use('/api/tenant', tenantRoutes); // Tenant profile, housing preferences, lifestyle habits
app.use('/api/favorites', favoriteRoutes); // Bookmarked properties

// 404 handler for undefined routes
app.use(notFoundHandler);

// Global Error Handler
app.use(errorHandler);

// Start Server & Test Database Connection
app.listen(PORT, async () => {
  console.log(`=========================================`);
  console.log(`🚀 HomeMatch Backend running on port ${PORT}`);
  console.log(`📡 Health Check: http://localhost:${PORT}/api/health`);
  console.log(`🌐 Environment: ${process.env.NODE_ENV || 'development'}`);
  console.log(`=========================================`);
  await testConnection();
});

module.exports = app;
