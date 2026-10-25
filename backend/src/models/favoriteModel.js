const { pool } = require('../config/db');
const { formatListing } = require('./listingModel');

/**
 * Get all favorite listings saved by a tenant
 */
const getFavoritesByUserId = async (userId) => {
  const [rows] = await pool.query(
    `SELECT l.*,
            f.id AS favorite_id,
            f.created_at AS favorited_at,
            u.name AS owner_name,
            u.email AS owner_email,
            u.phone AS owner_phone,
            u.is_verified AS owner_is_verified,
            (SELECT image_url FROM listing_images WHERE listing_id = l.id ORDER BY is_cover DESC, id ASC LIMIT 1) AS cover_image
     FROM favorites f
     JOIN listings l ON f.listing_id = l.id
     LEFT JOIN users u ON l.owner_id = u.id
     WHERE f.user_id = ?
     ORDER BY f.created_at DESC`,
    [userId]
  );

  return rows.map(row => {
    const listing = formatListing(row);
    return {
      ...listing,
      favoriteId: row.favorite_id,
      favoritedAt: row.favorited_at
    };
  });
};

/**
 * Get just the listing IDs favorited by a user (quick lookup for UI hearts)
 */
const getFavoriteListingIds = async (userId) => {
  const [rows] = await pool.query(
    `SELECT listing_id FROM favorites WHERE user_id = ?`,
    [userId]
  );
  return rows.map(r => Number(r.listing_id));
};

/**
 * Add a listing to favorites
 */
const addFavorite = async (userId, listingId) => {
  // Check if listing exists first
  const [listings] = await pool.query(`SELECT id FROM listings WHERE id = ?`, [listingId]);
  if (listings.length === 0) {
    const error = new Error('Listing not found');
    error.statusCode = 404;
    throw error;
  }

  const [result] = await pool.query(
    `INSERT INTO favorites (user_id, listing_id)
     VALUES (?, ?)
     ON DUPLICATE KEY UPDATE id = LAST_INSERT_ID(id)`,
    [userId, listingId]
  );

  return {
    success: true,
    favoriteId: result.insertId,
    listingId: Number(listingId)
  };
};

/**
 * Remove a listing from favorites
 */
const removeFavorite = async (userId, listingId) => {
  const [result] = await pool.query(
    `DELETE FROM favorites WHERE user_id = ? AND listing_id = ?`,
    [userId, listingId]
  );

  return {
    success: true,
    deleted: result.affectedRows > 0,
    listingId: Number(listingId)
  };
};

/**
 * Check if a specific listing is favorited by a user
 */
const isFavorite = async (userId, listingId) => {
  const [rows] = await pool.query(
    `SELECT id FROM favorites WHERE user_id = ? AND listing_id = ?`,
    [userId, listingId]
  );
  return rows.length > 0;
};

module.exports = {
  getFavoritesByUserId,
  getFavoriteListingIds,
  addFavorite,
  removeFavorite,
  isFavorite
};
