const {
  getTenantProfileByUserId,
  updateHousingPreferences,
  updateLifestyleHabits,
  updatePersonalDetails
} = require('../models/tenantProfileModel');

/**
 * @route   GET /api/tenant/profile
 * @desc    Get tenant profile with completeness percentage
 * @access  Private (Tenant or Admin)
 */
const getProfile = async (req, res, next) => {
  try {
    const userId = req.user.id;
    const profile = await getTenantProfileByUserId(userId);

    if (!profile) {
      return res.status(404).json({
        success: false,
        message: 'Tenant profile not found'
      });
    }

    res.json({
      success: true,
      profile
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @route   PUT /api/tenant/preferences
 * @desc    Save/update housing preferences (budget, areas, room type, amenities)
 * @access  Private (Tenant)
 */
const updatePreferences = async (req, res, next) => {
  try {
    const userId = req.user.id;
    const {
      targetBudget,
      preferredAreas,
      roomType,
      furnished,
      wifiRequired,
      gasRequired,
      liftRequired,
      moveInDate
    } = req.body;

    if (targetBudget !== undefined && (isNaN(targetBudget) || Number(targetBudget) < 0)) {
      return res.status(400).json({
        success: false,
        message: 'Target budget must be a positive number'
      });
    }

    const updatedProfile = await updateHousingPreferences(userId, {
      targetBudget,
      preferredAreas,
      roomType,
      furnished,
      wifiRequired,
      gasRequired,
      liftRequired,
      moveInDate
    });

    res.json({
      success: true,
      message: 'Housing preferences updated successfully',
      profile: updatedProfile
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @route   PUT /api/tenant/lifestyle
 * @desc    Save/update lifestyle habits (smoking, cleanliness, sleep time, cooking, guests, gender preference)
 * @access  Private (Tenant)
 */
const updateLifestyle = async (req, res, next) => {
  try {
    const userId = req.user.id;
    const {
      smoking,
      cleanliness,
      sleepTime,
      cookingFrequency,
      guestsPolicy,
      genderPreference
    } = req.body;

    if (cleanliness !== undefined && (cleanliness < 1 || cleanliness > 10)) {
      return res.status(400).json({
        success: false,
        message: 'Cleanliness rating must be between 1 and 10'
      });
    }

    const updatedProfile = await updateLifestyleHabits(userId, {
      smoking,
      cleanliness,
      sleepTime,
      cookingFrequency,
      guestsPolicy,
      genderPreference
    });

    res.json({
      success: true,
      message: 'Lifestyle habits updated successfully',
      profile: updatedProfile
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @route   PUT /api/tenant/personal
 * @desc    Update basic personal info (bio, age, occupation, institution, name, phone)
 * @access  Private (Tenant)
 */
const updatePersonal = async (req, res, next) => {
  try {
    const userId = req.user.id;
    const { name, phone, age, gender, occupation, institution, bio } = req.body;

    if (age !== undefined && (isNaN(age) || Number(age) < 16 || Number(age) > 100)) {
      return res.status(400).json({
        success: false,
        message: 'Age must be between 16 and 100'
      });
    }

    const updatedProfile = await updatePersonalDetails(userId, {
      name,
      phone,
      age,
      gender,
      occupation,
      institution,
      bio
    });

    res.json({
      success: true,
      message: 'Personal details updated successfully',
      profile: updatedProfile
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getProfile,
  updatePreferences,
  updateLifestyle,
  updatePersonal
};
