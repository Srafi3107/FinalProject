const express = require('express');
const router = express.Router();
const { verifyToken } = require('../middleware/authMiddleware');
const {
  getFavorites,
  getFavoriteIds,
  addFavorite,
  removeFavorite
} = require('../controllers/favoriteController');

// All favorite operations require authentication
router.use(verifyToken);

// GET /api/favorites - Get full list of favorite listings
router.get('/', getFavorites);

// GET /api/favorites/ids - Get array of listing IDs for fast state check
router.get('/ids', getFavoriteIds);

// POST /api/favorites - Add listing to favorites
router.post('/', addFavorite);

// POST /api/favorites/:listingId - Add listing to favorites (param alternative)
router.post('/:listingId', addFavorite);

// DELETE /api/favorites/:listingId - Remove listing from favorites
router.delete('/:listingId', removeFavorite);

module.exports = router;
