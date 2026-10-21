const listingModel = require('../models/listingModel');

/**
 * @route   POST /api/listings
 * @desc    Create a new property listing with photo upload support
 * @access  Private (Owner, Admin)
 */
const createListing = async (req, res, next) => {
  try {
    const ownerId = req.user.id;
    let imageUrls = [];

    // 1. If files uploaded via Multer
    if (req.files && req.files.length > 0) {
      const baseUrl = `${req.protocol}://${req.get('host')}`;
      imageUrls = req.files.map(file => `${baseUrl}/uploads/listings/${file.filename}`);
    }

    // 2. If imageUrls array provided in body (e.g. Unsplash sample URLs)
    if (req.body.imageUrls) {
      let urls = [];
      try {
        urls = typeof req.body.imageUrls === 'string' ? JSON.parse(req.body.imageUrls) : req.body.imageUrls;
      } catch (e) {
        urls = [req.body.imageUrls];
      }
      if (Array.isArray(urls)) {
        imageUrls = [...imageUrls, ...urls];
      }
    }

    // Parse tenantType if stringified in multipart form-data
    let tenantType = req.body.tenantType || ['bachelor'];
    if (typeof tenantType === 'string') {
      try {
        tenantType = JSON.parse(tenantType);
      } catch (e) {
        tenantType = [tenantType];
      }
    }

    const listingData = {
      ownerId,
      title: req.body.title,
      area: req.body.area,
      address: req.body.address,
      rent: Number(req.body.rent),
      serviceCharge: Number(req.body.serviceCharge || req.body.service_charge || 0),
      depositMonths: Number(req.body.depositMonths || req.body.deposit_months || 2),
      bedrooms: Number(req.body.bedrooms || 1),
      bathrooms: Number(req.body.bathrooms || 1),
      sizeSqft: Number(req.body.sizeSqft || req.body.size || 500),
      furnished: req.body.furnished || 'Unfurnished',
      hasWifi: String(req.body.hasWifi) === 'true' || Boolean(req.body.hasWifi),
      hasGas: String(req.body.hasGas) === 'true' || Boolean(req.body.hasGas),
      hasLift: String(req.body.hasLift) === 'true' || Boolean(req.body.hasLift),
      hasGenerator: String(req.body.hasGenerator) === 'true' || Boolean(req.body.hasGenerator),
      tenantType,
      genderAllowed: req.body.genderAllowed || 'any',
      description: req.body.description || ''
    };

    const newListingId = await listingModel.createListing(listingData, imageUrls);
    const createdListing = await listingModel.getListingById(newListingId);

    res.status(201).json({
      success: true,
      message: 'Property listing published successfully!',
      listing: createdListing
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @route   GET /api/listings/my-listings
 * @desc    Get all listings published by currently authenticated property owner
 * @access  Private (Owner, Admin)
 */
const getMyListings = async (req, res, next) => {
  try {
    const ownerId = req.user.id;
    const listings = await listingModel.getListingsByOwner(ownerId);

    res.status(200).json({
      success: true,
      count: listings.length,
      listings
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @route   GET /api/listings/:id
 * @desc    Get single listing by ID with full details & owner specs
 * @access  Public
 */
const getListingById = async (req, res, next) => {
  try {
    const { id } = req.params;
    const listing = await listingModel.getListingById(id);

    if (!listing) {
      return res.status(404).json({
        success: false,
        message: `Property listing with ID ${id} not found.`
      });
    }

    res.status(200).json({
      success: true,
      listing
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @route   PUT /api/listings/:id
 * @desc    Update listing details (Owner can update own listing; Admin can update any)
 * @access  Private (Owner, Admin)
 */
const updateListing = async (req, res, next) => {
  try {
    const { id } = req.params;
    const existing = await listingModel.getListingById(id);

    if (!existing) {
      return res.status(404).json({
        success: false,
        message: `Property listing with ID ${id} not found.`
      });
    }

    // Permission check: owner must own the listing or user is admin
    if (existing.ownerId !== req.user.id && req.user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        message: 'Forbidden: You do not have permission to edit this listing.'
      });
    }

    let imageUrls = null;
    if (req.files && req.files.length > 0) {
      const baseUrl = `${req.protocol}://${req.get('host')}`;
      imageUrls = req.files.map(file => `${baseUrl}/uploads/listings/${file.filename}`);
    } else if (req.body.imageUrls) {
      try {
        imageUrls = typeof req.body.imageUrls === 'string' ? JSON.parse(req.body.imageUrls) : req.body.imageUrls;
      } catch (e) {
        imageUrls = [req.body.imageUrls];
      }
    }

    // Build update fields object
    const updateFields = {};
    if (req.body.title) updateFields.title = req.body.title;
    if (req.body.area) updateFields.area = req.body.area;
    if (req.body.address) updateFields.address = req.body.address;
    if (req.body.rent) updateFields.rent = Number(req.body.rent);
    if (req.body.serviceCharge !== undefined) updateFields.service_charge = Number(req.body.serviceCharge);
    if (req.body.depositMonths !== undefined) updateFields.deposit_months = Number(req.body.depositMonths);
    if (req.body.bedrooms !== undefined) updateFields.bedrooms = Number(req.body.bedrooms);
    if (req.body.bathrooms !== undefined) updateFields.bathrooms = Number(req.body.bathrooms);
    if (req.body.sizeSqft || req.body.size) updateFields.size_sqft = Number(req.body.sizeSqft || req.body.size);
    if (req.body.furnished) updateFields.furnished = req.body.furnished;
    if (req.body.hasWifi !== undefined) updateFields.has_wifi = String(req.body.hasWifi) === 'true';
    if (req.body.hasGas !== undefined) updateFields.has_gas = String(req.body.hasGas) === 'true';
    if (req.body.hasLift !== undefined) updateFields.has_lift = String(req.body.hasLift) === 'true';
    if (req.body.hasGenerator !== undefined) updateFields.has_generator = String(req.body.hasGenerator) === 'true';
    if (req.body.genderAllowed) updateFields.gender_allowed = req.body.genderAllowed;
    if (req.body.description !== undefined) updateFields.description = req.body.description;
    if (req.body.status) updateFields.status = req.body.status;

    if (req.body.tenantType) {
      let tType = req.body.tenantType;
      if (typeof tType === 'string') {
        try { tType = JSON.parse(tType); } catch (e) { tType = [tType]; }
      }
      updateFields.tenant_type = tType;
    }

    await listingModel.updateListing(id, updateFields, imageUrls);
    const updated = await listingModel.getListingById(id);

    res.status(200).json({
      success: true,
      message: 'Listing updated successfully.',
      listing: updated
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @route   DELETE /api/listings/:id
 * @desc    Delete a listing (Owner or Admin)
 * @access  Private (Owner, Admin)
 */
const deleteListing = async (req, res, next) => {
  try {
    const { id } = req.params;
    const existing = await listingModel.getListingById(id);

    if (!existing) {
      return res.status(404).json({
        success: false,
        message: `Property listing with ID ${id} not found.`
      });
    }

    if (existing.ownerId !== req.user.id && req.user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        message: 'Forbidden: You do not have permission to delete this listing.'
      });
    }

    await listingModel.deleteListing(id);

    res.status(200).json({
      success: true,
      message: 'Listing deleted successfully.'
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @route   PATCH /api/listings/:id/status
 * @desc    Quick toggle availability status ('available' / 'rented')
 * @access  Private (Owner, Admin)
 */
const toggleListingStatus = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    if (!['available', 'rented'].includes(status)) {
      return res.status(400).json({
        success: false,
        message: "Status must be either 'available' or 'rented'."
      });
    }

    const existing = await listingModel.getListingById(id);
    if (!existing) {
      return res.status(404).json({
        success: false,
        message: `Property listing with ID ${id} not found.`
      });
    }

    if (existing.ownerId !== req.user.id && req.user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        message: 'Forbidden: You do not have permission to update this listing.'
      });
    }

    await listingModel.updateListingStatus(id, status);

    res.status(200).json({
      success: true,
      message: `Listing marked as ${status}.`,
      status
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  createListing,
  getMyListings,
  getListingById,
  updateListing,
  deleteListing,
  toggleListingStatus
};
