const express = require('express');
const router = express.Router();
const { verifyToken } = require('../middleware/authMiddleware');
const {
  createRequest,
  getMyRequests,
  getOwnerRequests,
  getRequestById,
  updateRequestStatus
} = require('../controllers/requestController');

// All request endpoints require authentication
router.use(verifyToken);

// POST /api/requests - Create new visit or rent request
router.post('/', createRequest);

// GET /api/requests/my-requests - Get current tenant's outgoing requests
router.get('/my-requests', getMyRequests);

// GET /api/requests/owner-requests - Get property owner's incoming requests
router.get('/owner-requests', getOwnerRequests);

// GET /api/requests/:id - Get details of a single request
router.get('/:id', getRequestById);

// PATCH /api/requests/:id/status - Update request status (accept / reject / cancel)
router.patch('/:id/status', updateRequestStatus);

module.exports = router;
