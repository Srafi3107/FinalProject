const { pool } = require('../config/db');

/**
 * Helper: format a database row and its image URLs into a clean listing object
 */
const formatListing = (row, images = []) => {
  let tenantType = [];
  try {
    tenantType = typeof row.tenant_type === 'string' ? JSON.parse(row.tenant_type) : (row.tenant_type || []);
  } catch (e) {
    tenantType = [];
  }

  return {
    id: row.id,
    ownerId: row.owner_id,
    title: row.title,
    area: row.area,
    address: row.address,
    rent: Number(row.rent),
    serviceCharge: Number(row.service_charge || 0),
    depositMonths: Number(row.deposit_months || 2),
    bedrooms: Number(row.bedrooms),
    bathrooms: Number(row.bathrooms),
    size: Number(row.size_sqft),
    furnished: row.furnished,
    hasWifi: Boolean(row.has_wifi),
    hasGas: Boolean(row.has_gas),
    hasLift: Boolean(row.has_lift),
    hasGenerator: Boolean(row.has_generator),
    tenantType,
    genderAllowed: row.gender_allowed,
    description: row.description,
    status: row.status,
    isAvailable: row.status === 'available',
    isApproved: Boolean(row.is_approved),
    predictedRent: row.predicted_rent ? Number(row.predicted_rent) : null,
    isOverpriced: Boolean(row.is_overpriced),
    createdAt: row.created_at,
    updatedAt: row.updated_at,
    images: images.length > 0 ? images.map(img => img.image_url) : (row.cover_image ? [row.cover_image] : []),
    owner: row.owner_name ? {
      id: row.owner_id,
      name: row.owner_name,
      email: row.owner_email,
      phone: row.owner_phone,
      isVerified: Boolean(row.owner_is_verified)
    } : undefined
  };
};

/**
 * Create a new property listing with images
 */
const createListing = async (listingData, imageUrls = []) => {
  const connection = await pool.getConnection();
  try {
    await connection.beginTransaction();

    const {
      ownerId,
      title,
      area,
      address,
      rent,
      serviceCharge = 0,
      depositMonths = 2,
      bedrooms = 1,
      bathrooms = 1,
      sizeSqft,
      furnished = 'Unfurnished',
      hasWifi = false,
      hasGas = true,
      hasLift = false,
      hasGenerator = false,
      tenantType = ['bachelor'],
      genderAllowed = 'any',
      description = ''
    } = listingData;

    const tenantTypeJson = JSON.stringify(Array.isArray(tenantType) ? tenantType : [tenantType]);

    const [result] = await connection.query(
      `INSERT INTO listings (
        owner_id, title, area, address, rent, service_charge, deposit_months,
        bedrooms, bathrooms, size_sqft, furnished, has_wifi, has_gas, has_lift,
        has_generator, tenant_type, gender_allowed, description, status, is_approved
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 'available', TRUE)`,
      [
        ownerId, title, area, address, rent, serviceCharge, depositMonths,
        bedrooms, bathrooms, sizeSqft, furnished, hasWifi, hasGas, hasLift,
        hasGenerator, tenantTypeJson, genderAllowed, description
      ]
    );

    const newListingId = result.insertId;

    // Insert image URLs if present
    if (imageUrls && imageUrls.length > 0) {
      const imageValues = imageUrls.map((url, idx) => [newListingId, url, idx === 0]);
      await connection.query(
        `INSERT INTO listing_images (listing_id, image_url, is_cover) VALUES ?`,
        [imageValues]
      );
    }

    await connection.commit();
    return newListingId;
  } catch (error) {
    await connection.rollback();
    throw error;
  } finally {
    connection.release();
  }
};

/**
 * Get single listing by ID including owner details and all photos
 */
const getListingById = async (id) => {
  const [rows] = await pool.query(
    `SELECT l.*,
            u.name AS owner_name,
            u.email AS owner_email,
            u.phone AS owner_phone,
            u.is_verified AS owner_is_verified
     FROM listings l
     LEFT JOIN users u ON l.owner_id = u.id
     WHERE l.id = ?`,
    [id]
  );

  if (rows.length === 0) return null;

  const [images] = await pool.query(
    `SELECT image_url, is_cover FROM listing_images WHERE listing_id = ? ORDER BY is_cover DESC, id ASC`,
    [id]
  );

  return formatListing(rows[0], images);
};

/**
 * Get all listings owned by a specific owner
 */
const getListingsByOwner = async (ownerId) => {
  const [rows] = await pool.query(
    `SELECT l.*,
            (SELECT image_url FROM listing_images WHERE listing_id = l.id ORDER BY is_cover DESC, id ASC LIMIT 1) AS cover_image
     FROM listings l
     WHERE l.owner_id = ?
     ORDER BY l.created_at DESC`,
    [ownerId]
  );

  return rows.map(r => formatListing(r));
};

/**
 * Update an existing listing (owner or admin permission enforced)
 */
const updateListing = async (id, updateData, newImageUrls = null) => {
  const connection = await pool.getConnection();
  try {
    await connection.beginTransaction();

    const allowedFields = [
      'title', 'area', 'address', 'rent', 'service_charge', 'deposit_months',
      'bedrooms', 'bathrooms', 'size_sqft', 'furnished', 'has_wifi', 'has_gas',
      'has_lift', 'has_generator', 'tenant_type', 'gender_allowed', 'description', 'status'
    ];

    const updates = [];
    const values = [];

    for (const [key, value] of Object.entries(updateData)) {
      if (allowedFields.includes(key)) {
        updates.push(`${key} = ?`);
        values.push(key === 'tenant_type' && Array.isArray(value) ? JSON.stringify(value) : value);
      }
    }

    if (updates.length > 0) {
      values.push(id);
      await connection.query(
        `UPDATE listings SET ${updates.join(', ')} WHERE id = ?`,
        values
      );
    }

    // Replace images if new image URLs provided
    if (newImageUrls && Array.isArray(newImageUrls) && newImageUrls.length > 0) {
      await connection.query(`DELETE FROM listing_images WHERE listing_id = ?`, [id]);
      const imageValues = newImageUrls.map((url, idx) => [id, url, idx === 0]);
      await connection.query(
        `INSERT INTO listing_images (listing_id, image_url, is_cover) VALUES ?`,
        [imageValues]
      );
    }

    await connection.commit();
    return true;
  } catch (error) {
    await connection.rollback();
    throw error;
  } finally {
    connection.release();
  }
};

/**
 * Delete a listing by ID
 */
const deleteListing = async (id) => {
  const [result] = await pool.query(`DELETE FROM listings WHERE id = ?`, [id]);
  return result.affectedRows > 0;
};

/**
 * Update listing status (e.g. 'available' <-> 'rented')
 */
const updateListingStatus = async (id, status) => {
  const [result] = await pool.query(
    `UPDATE listings SET status = ? WHERE id = ?`,
    [status, id]
  );
  return result.affectedRows > 0;
};

module.exports = {
  createListing,
  getListingById,
  getListingsByOwner,
  updateListing,
  deleteListing,
  updateListingStatus
};
