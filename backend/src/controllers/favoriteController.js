const {
  getFavoritesByUserId,
  getFavoriteListingIds,
  addFavorite: addFavoriteModel,
  removeFavorite: removeFavoriteModel
} = require('../models/favoriteModel');

/**
 * @route   GET /api/favorites
 * @desc    Get all bookmarked listings for the authenticated user
 * @access  Private
 */
const getFavorites = async (req, res, next) => {
  try {
    const userId = req.user.id;
    const favorites = await getFavoritesByUserId(userId);

    res.json({
      success: true,
      count: favorites.length,
      favorites
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @route   GET /api/favorites/ids
 * @desc    Get list of listing IDs favorited by the user (fast sync for UI)
 * @access  Private
 */
const getFavoriteIds = async (req, res, next) => {
  try {
    const userId = req.user.id;
    const favoriteIds = await getFavoriteListingIds(userId);

    res.json({
      success: true,
      favoriteIds
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @route   POST /api/favorites
 * @desc    Add listing to favorites (supports body { listingId } or param /api/favorites/:listingId)
 * @access  Private
 */
const addFavorite = async (req, res, next) => {
  try {
    const userId = req.user.id;
    const listingId = req.body.listingId || req.params.listingId;

    if (!listingId) {
      return res.status(400).json({
        success: false,
        message: 'listingId is required'
      });
    }

    const result = await addFavoriteModel(userId, Number(listingId));

    res.status(201).json({
      success: true,
      message: 'Listing added to favorites',
      data: result
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @route   DELETE /api/favorites/:listingId
 * @desc    Remove listing from favorites
 * @access  Private
 */
const removeFavorite = async (req, res, next) => {
  try {
    const userId = req.user.id;
    const listingId = req.params.listingId;

    if (!listingId) {
      return res.status(400).json({
        success: false,
        message: 'listingId is required'
      });
    }

    const result = await removeFavoriteModel(userId, Number(listingId));

    res.json({
      success: true,
      message: 'Listing removed from favorites',
      data: result
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getFavorites,
  getFavoriteIds,
  addFavorite,
  removeFavorite
};
