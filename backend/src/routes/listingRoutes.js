const express = require('express');
const {
  getListings,
  createListing,
  getMyListings,
  getListingById,
  updateListing,
  deleteListing,
  toggleListingStatus
} = require('../controllers/listingController');
const { verifyToken } = require('../middleware/authMiddleware');
const { requireRole } = require('../middleware/roleMiddleware');
const { validateListing } = require('../middleware/validateListing');
const { uploadListingPhotos } = require('../middleware/uploadMiddleware');

const router = express.Router();

/**
 * @route   GET /api/listings
 * @desc    Search and filter public listings with pagination
 * @access  Public
 */
router.get('/', getListings);

/**
 * @route   GET /api/listings/my-listings
 * @desc    Get listings published by logged-in owner
 * @access  Private (Owner, Admin)
 */
router.get(
  '/my-listings',
  verifyToken,
  requireRole('owner', 'admin'),
  getMyListings
);

/**
 * @route   POST /api/listings
 * @desc    Create new listing with Multer photo upload
 * @access  Private (Owner, Admin)
 */
router.post(
  '/',
  verifyToken,
  requireRole('owner', 'admin'),
  uploadListingPhotos,
  validateListing,
  createListing
);

/**
 * @route   GET /api/listings/:id
 * @desc    Get single listing details
 * @access  Public
 */
router.get('/:id', getListingById);

/**
 * @route   PUT /api/listings/:id
 * @desc    Update listing details
 * @access  Private (Owner, Admin)
 */
router.put(
  '/:id',
  verifyToken,
  requireRole('owner', 'admin'),
  uploadListingPhotos,
  validateListing,
  updateListing
);

/**
 * @route   DELETE /api/listings/:id
 * @desc    Delete listing
 * @access  Private (Owner, Admin)
 */
router.delete(
  '/:id',
  verifyToken,
  requireRole('owner', 'admin'),
  deleteListing
);

/**
 * @route   PATCH /api/listings/:id/status
 * @desc    Quick toggle availability status ('available' / 'rented')
 * @access  Private (Owner, Admin)
 */
router.patch(
  '/:id/status',
  verifyToken,
  requireRole('owner', 'admin'),
  toggleListingStatus
);

module.exports = router;
