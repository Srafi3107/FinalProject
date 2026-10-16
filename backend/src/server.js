const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const { testConnection } = require('./config/db');
const healthRoutes = require('./routes/healthRoutes');
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
