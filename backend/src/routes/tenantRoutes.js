const express = require('express');
const router = express.Router();
const { verifyToken } = require('../middleware/authMiddleware');
const {
  getProfile,
  updatePreferences,
  updateLifestyle,
  updatePersonal
} = require('../controllers/tenantController');

// All tenant routes require authentication
router.use(verifyToken);

// GET /api/tenant/profile - Get tenant profile & completeness
router.get('/profile', getProfile);

// PUT /api/tenant/preferences - Update target budget, preferred areas, amenities
router.put('/preferences', updatePreferences);

// PUT /api/tenant/lifestyle - Update smoking, cleanliness, sleeping, cooking, guests
router.put('/lifestyle', updateLifestyle);

// PUT /api/tenant/personal - Update bio, age, occupation, institution, contact
router.put('/personal', updatePersonal);

module.exports = router;
