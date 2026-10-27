const {
  createRequest: createRequestModel,
  getRequestById: getRequestByIdModel,
  getRequestsByTenantId,
  getRequestsByOwnerId,
  updateRequestStatus: updateRequestStatusModel
} = require('../models/requestModel');

/**
 * @route   POST /api/requests
 * @desc    Submit a property visit or rent inquiry
 * @access  Private (Authenticated users/tenants)
 */
const createRequest = async (req, res, next) => {
  try {
    const tenantId = req.user.id;
    const {
      listingId,
      type = 'visit',
      targetDate,
      preferredSlot,
      numberOfVisitors,
      offerRent,
      message
    } = req.body;

    if (!listingId) {
      return res.status(400).json({
        success: false,
        message: 'listingId is required to submit a request'
      });
    }

    if (!['visit', 'rent'].includes(type)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid request type. Must be either "visit" or "rent"'
      });
    }

    if (type === 'visit' && !targetDate) {
      return res.status(400).json({
        success: false,
        message: 'Target date is required for scheduling a property visit'
      });
    }

    const newRequest = await createRequestModel({
      listingId: Number(listingId),
      tenantId,
      type,
      targetDate: targetDate || null,
      preferredSlot: preferredSlot || null,
      numberOfVisitors: numberOfVisitors ? Number(numberOfVisitors) : 1,
      offerRent: offerRent ? Number(offerRent) : null,
      message: message || ''
    });

    res.status(201).json({
      success: true,
      message: type === 'visit' ? 'Visit request booked successfully' : 'Rent application submitted successfully',
      request: newRequest
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @route   GET /api/requests/my-requests
 * @desc    Get all outgoing requests submitted by the logged-in tenant
 * @access  Private
 */
const getMyRequests = async (req, res, next) => {
  try {
    const tenantId = req.user.id;
    const requests = await getRequestsByTenantId(tenantId);

    res.json({
      success: true,
      count: requests.length,
      requests
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @route   GET /api/requests/owner-requests
 * @desc    Get all incoming inquiries received by the logged-in owner
 * @access  Private (Owner / Admin)
 */
const getOwnerRequests = async (req, res, next) => {
  try {
    const ownerId = req.user.id;
    const requests = await getRequestsByOwnerId(ownerId);

    res.json({
      success: true,
      count: requests.length,
      requests
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @route   GET /api/requests/:id
 * @desc    Get single request details by ID
 * @access  Private (Owner, Tenant, or Admin)
 */
const getRequestById = async (req, res, next) => {
  try {
    const requestId = Number(req.params.id);
    const request = await getRequestByIdModel(requestId);

    if (!request) {
      return res.status(404).json({
        success: false,
        message: 'Request not found'
      });
    }

    // Authorization check
    if (
      request.tenantId !== req.user.id &&
      request.ownerId !== req.user.id &&
      req.user.role !== 'admin'
    ) {
      return res.status(403).json({
        success: false,
        message: 'Access denied. You do not have permission to view this request.'
      });
    }

    res.json({
      success: true,
      request
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @route   PATCH /api/requests/:id/status
 * @desc    Accept, reject, or cancel a request
 * @access  Private (Owner or Tenant)
 */
const updateRequestStatus = async (req, res, next) => {
  try {
    const requestId = Number(req.params.id);
    const { status } = req.body;

    if (!status) {
      return res.status(400).json({
        success: false,
        message: 'Status is required (pending, accepted, rejected)'
      });
    }

    const updated = await updateRequestStatusModel(
      requestId,
      status,
      req.user.id,
      req.user.role
    );

    res.json({
      success: true,
      message: `Request #${requestId} status updated to "${status}"`,
      request: updated
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  createRequest,
  getMyRequests,
  getOwnerRequests,
  getRequestById,
  updateRequestStatus
};
