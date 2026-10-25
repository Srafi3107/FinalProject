const { pool } = require('../config/db');

/**
 * Format a database row into a structured profile object
 */
const formatTenantProfile = (row) => {
  if (!row) return null;

  let preferredAreas = ['Mirpur', 'Dhanmondi'];
  try {
    preferredAreas = typeof row.preferred_areas === 'string'
      ? JSON.parse(row.preferred_areas)
      : (row.preferred_areas || ['Mirpur', 'Dhanmondi']);
  } catch (e) {
    preferredAreas = ['Mirpur', 'Dhanmondi'];
  }

  // Calculate completeness percentage
  let completedFields = 0;
  const totalFields = 10;
  if (row.name) completedFields++;
  if (row.phone) completedFields++;
  if (row.bio && row.bio.trim().length > 10) completedFields++;
  if (row.institution || row.occupation) completedFields++;
  if (row.age) completedFields++;
  if (row.target_budget) completedFields++;
  if (preferredAreas && preferredAreas.length > 0) completedFields++;
  if (row.smoking) completedFields++;
  if (row.cleanliness) completedFields++;
  if (row.sleep_time) completedFields++;

  const completeness = Math.round((completedFields / totalFields) * 100);

  return {
    id: row.id,
    userId: row.user_id,
    name: row.name,
    email: row.email,
    phone: row.phone,
    role: row.role,
    avatar: row.avatar,
    isVerified: Boolean(row.is_verified),
    verificationDocType: row.verification_doc_type,
    verificationDocNumber: row.verification_doc_number,
    age: row.age,
    gender: row.gender,
    occupation: row.occupation,
    institution: row.institution,
    bio: row.bio,
    completeness,
    housingPreferences: {
      targetBudget: Number(row.target_budget || 15000),
      preferredAreas,
      roomType: row.room_type || 'bachelor',
      furnished: row.furnished_preference || 'Furnished',
      wifiRequired: Boolean(row.wifi_required),
      gasRequired: Boolean(row.gas_required),
      liftRequired: Boolean(row.lift_required),
      moveInDate: row.move_in_date
    },
    lifestyleHabits: {
      smoking: row.smoking || 'non_smoker',
      cleanliness: Number(row.cleanliness || 5),
      sleepTime: row.sleep_time || 'normal',
      cookingFrequency: row.cooking_frequency || 'daily',
      guestsPolicy: row.guests_policy || 'weekends_only',
      genderPreference: row.gender_preference || 'male'
    },
    createdAt: row.created_at,
    updatedAt: row.updated_at
  };
};

/**
 * Get tenant profile by user ID (joins with users table)
 */
const getTenantProfileByUserId = async (userId) => {
  const [rows] = await pool.query(
    `SELECT tp.*,
            u.name, u.email, u.phone, u.role, u.avatar,
            u.is_verified, u.verification_doc_type, u.verification_doc_number
     FROM tenant_profiles tp
     JOIN users u ON tp.user_id = u.id
     WHERE tp.user_id = ?`,
    [userId]
  );

  if (rows.length > 0) {
    return formatTenantProfile(rows[0]);
  }

  // If no profile exists yet, create default row
  const [users] = await pool.query(`SELECT * FROM users WHERE id = ?`, [userId]);
  if (users.length === 0) return null;

  await pool.query(
    `INSERT INTO tenant_profiles (user_id, target_budget, preferred_areas)
     VALUES (?, 15000, ?)`,
    [userId, JSON.stringify(['Mirpur', 'Dhanmondi'])]
  );

  return getTenantProfileByUserId(userId);
};

/**
 * Update housing preferences
 */
const updateHousingPreferences = async (userId, preferences) => {
  const {
    targetBudget,
    preferredAreas,
    roomType,
    furnished,
    wifiRequired,
    gasRequired,
    liftRequired,
    moveInDate
  } = preferences;

  const areasJson = JSON.stringify(
    Array.isArray(preferredAreas) ? preferredAreas : ['Mirpur', 'Dhanmondi']
  );

  await pool.query(
    `UPDATE tenant_profiles
     SET target_budget = COALESCE(?, target_budget),
         preferred_areas = ?,
         room_type = COALESCE(?, room_type),
         furnished_preference = COALESCE(?, furnished_preference),
         wifi_required = COALESCE(?, wifi_required),
         gas_required = COALESCE(?, gas_required),
         lift_required = COALESCE(?, lift_required),
         move_in_date = ?
     WHERE user_id = ?`,
    [
      targetBudget !== undefined ? Number(targetBudget) : null,
      areasJson,
      roomType || null,
      furnished || null,
      wifiRequired !== undefined ? Boolean(wifiRequired) : null,
      gasRequired !== undefined ? Boolean(gasRequired) : null,
      liftRequired !== undefined ? Boolean(liftRequired) : null,
      moveInDate || null,
      userId
    ]
  );

  return getTenantProfileByUserId(userId);
};

/**
 * Update lifestyle habits (5 weighted AI compatibility factors)
 */
const updateLifestyleHabits = async (userId, habits) => {
  const {
    smoking,
    cleanliness,
    sleepTime,
    cookingFrequency,
    guestsPolicy,
    genderPreference
  } = habits;

  await pool.query(
    `UPDATE tenant_profiles
     SET smoking = COALESCE(?, smoking),
         cleanliness = COALESCE(?, cleanliness),
         sleep_time = COALESCE(?, sleep_time),
         cooking_frequency = COALESCE(?, cooking_frequency),
         guests_policy = COALESCE(?, guests_policy),
         gender_preference = COALESCE(?, gender_preference)
     WHERE user_id = ?`,
    [
      smoking || null,
      cleanliness !== undefined ? Number(cleanliness) : null,
      sleepTime || null,
      cookingFrequency || null,
      guestsPolicy || null,
      genderPreference || null,
      userId
    ]
  );

  return getTenantProfileByUserId(userId);
};

/**
 * Update personal basic details (bio, age, occupation, institution, gender)
 */
const updatePersonalDetails = async (userId, details) => {
  const { age, gender, occupation, institution, bio, name, phone } = details;

  if (name || phone) {
    await pool.query(
      `UPDATE users SET name = COALESCE(?, name), phone = COALESCE(?, phone) WHERE id = ?`,
      [name || null, phone || null, userId]
    );
  }

  await pool.query(
    `UPDATE tenant_profiles
     SET age = COALESCE(?, age),
         gender = COALESCE(?, gender),
         occupation = COALESCE(?, occupation),
         institution = COALESCE(?, institution),
         bio = COALESCE(?, bio)
     WHERE user_id = ?`,
    [
      age !== undefined ? Number(age) : null,
      gender || null,
      occupation || null,
      institution || null,
      bio || null,
      userId
    ]
  );

  return getTenantProfileByUserId(userId);
};

module.exports = {
  getTenantProfileByUserId,
  updateHousingPreferences,
  updateLifestyleHabits,
  updatePersonalDetails,
  formatTenantProfile
};
