const { pool } = require('../config/db');

/**
 * Format a database row into a structured request object
 */
const formatRequest = (row) => {
  if (!row) return null;
  return {
    id: row.id,
    listingId: row.listing_id,
    listingTitle: row.listing_title,
    listingArea: row.listing_area,
    listingRent: row.listing_rent !== undefined ? Number(row.listing_rent) : undefined,
    listingImage: row.cover_image || null,
    ownerId: row.owner_id,
    ownerName: row.owner_name,
    ownerPhone: row.owner_phone,
    ownerEmail: row.owner_email,
    tenantId: row.tenant_id,
    tenantName: row.tenant_name,
    tenantPhone: row.tenant_phone,
    tenantEmail: row.tenant_email,
    tenantOccupation: row.tenant_occupation,
    isTenantVerified: Boolean(row.tenant_is_verified),
    type: row.type, // 'visit' or 'rent'
    targetDate: row.target_date,
    preferredSlot: row.preferred_slot,
    numberOfVisitors: Number(row.number_of_visitors || 1),
    offerRent: row.offer_rent !== null && row.offer_rent !== undefined ? Number(row.offer_rent) : null,
    message: row.message,
    status: row.status, // 'pending', 'accepted', 'rejected'
    createdAt: row.created_at,
    updatedAt: row.updated_at
  };
};

/**
 * Create a new property request (visit or rent application)
 */
const createRequest = async ({
  listingId,
  tenantId,
  type = 'visit',
  targetDate = null,
  preferredSlot = null,
  numberOfVisitors = 1,
  offerRent = null,
  message = ''
}) => {
  // Validate listing exists
  const [listings] = await pool.query(
    `SELECT id, owner_id, title FROM listings WHERE id = ?`,
    [listingId]
  );

  if (listings.length === 0) {
    const error = new Error('Listing not found');
    error.statusCode = 404;
    throw error;
  }

  // Prevent property owner from requesting their own listing
  if (listings[0].owner_id === tenantId) {
    const error = new Error('You cannot send a visit or rent request for your own listing');
    error.statusCode = 400;
    throw error;
  }

  const [result] = await pool.query(
    `INSERT INTO property_requests (
      listing_id, tenant_id, type, target_date, preferred_slot,
      number_of_visitors, offer_rent, message, status
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, 'pending')`,
    [
      listingId,
      tenantId,
      type,
      targetDate || null,
      preferredSlot || null,
      numberOfVisitors || 1,
      offerRent !== null && offerRent !== undefined ? Number(offerRent) : null,
      message || null
    ]
  );

  return getRequestById(result.insertId);
};

/**
 * Get single request by ID with joined metadata
 */
const getRequestById = async (id) => {
  const [rows] = await pool.query(
    `SELECT r.*,
            l.title AS listing_title,
            l.area AS listing_area,
            l.rent AS listing_rent,
            l.owner_id,
            owner.name AS owner_name,
            owner.phone AS owner_phone,
            owner.email AS owner_email,
            tenant.name AS tenant_name,
            tenant.phone AS tenant_phone,
            tenant.email AS tenant_email,
            tenant.is_verified AS tenant_is_verified,
            tp.occupation AS tenant_occupation,
            (SELECT image_url FROM listing_images WHERE listing_id = l.id ORDER BY is_cover DESC, id ASC LIMIT 1) AS cover_image
     FROM property_requests r
     JOIN listings l ON r.listing_id = l.id
     JOIN users tenant ON r.tenant_id = tenant.id
     LEFT JOIN users owner ON l.owner_id = owner.id
     LEFT JOIN tenant_profiles tp ON tenant.id = tp.user_id
     WHERE r.id = ?`,
    [id]
  );

  if (rows.length === 0) return null;
  return formatRequest(rows[0]);
};

/**
 * Get all requests initiated by a tenant (outgoing inquiries)
 */
const getRequestsByTenantId = async (tenantId) => {
  const [rows] = await pool.query(
    `SELECT r.*,
            l.title AS listing_title,
            l.area AS listing_area,
            l.rent AS listing_rent,
            l.owner_id,
            owner.name AS owner_name,
            owner.phone AS owner_phone,
            owner.email AS owner_email,
            tenant.name AS tenant_name,
            tenant.phone AS tenant_phone,
            tenant.email AS tenant_email,
            tenant.is_verified AS tenant_is_verified,
            tp.occupation AS tenant_occupation,
            (SELECT image_url FROM listing_images WHERE listing_id = l.id ORDER BY is_cover DESC, id ASC LIMIT 1) AS cover_image
     FROM property_requests r
     JOIN listings l ON r.listing_id = l.id
     JOIN users tenant ON r.tenant_id = tenant.id
     LEFT JOIN users owner ON l.owner_id = owner.id
     LEFT JOIN tenant_profiles tp ON tenant.id = tp.user_id
     WHERE r.tenant_id = ?
     ORDER BY r.created_at DESC`,
    [tenantId]
  );

  return rows.map(formatRequest);
};

/**
 * Get all requests received by a landlord/owner (incoming requests on owned listings)
 */
const getRequestsByOwnerId = async (ownerId) => {
  const [rows] = await pool.query(
    `SELECT r.*,
            l.title AS listing_title,
            l.area AS listing_area,
            l.rent AS listing_rent,
            l.owner_id,
            owner.name AS owner_name,
            owner.phone AS owner_phone,
            owner.email AS owner_email,
            tenant.name AS tenant_name,
            tenant.phone AS tenant_phone,
            tenant.email AS tenant_email,
            tenant.is_verified AS tenant_is_verified,
            tp.occupation AS tenant_occupation,
            (SELECT image_url FROM listing_images WHERE listing_id = l.id ORDER BY is_cover DESC, id ASC LIMIT 1) AS cover_image
     FROM property_requests r
     JOIN listings l ON r.listing_id = l.id
     JOIN users tenant ON r.tenant_id = tenant.id
     LEFT JOIN users owner ON l.owner_id = owner.id
     LEFT JOIN tenant_profiles tp ON tenant.id = tp.user_id
     WHERE l.owner_id = ?
     ORDER BY r.created_at DESC`,
    [ownerId]
  );

  return rows.map(formatRequest);
};

/**
 * Update request status (owner accepts/rejects, or tenant cancels)
 */
const updateRequestStatus = async (requestId, status, userId, userRole = 'tenant') => {
  const existing = await getRequestById(requestId);
  if (!existing) {
    const error = new Error('Request not found');
    error.statusCode = 404;
    throw error;
  }

  // Authorization check:
  // Landlord of the listing can accept or reject
  // Tenant who sent the request can reject/cancel
  const isOwner = existing.ownerId === userId;
  const isSender = existing.tenantId === userId;
  const isAdmin = userRole === 'admin';

  if (!isOwner && !isSender && !isAdmin) {
    const error = new Error('Not authorized to update this request');
    error.statusCode = 403;
    throw error;
  }

  const validStatuses = ['pending', 'accepted', 'rejected'];
  if (!validStatuses.includes(status)) {
    const error = new Error(`Invalid status. Must be one of: ${validStatuses.join(', ')}`);
    error.statusCode = 400;
    throw error;
  }

  await pool.query(
    `UPDATE property_requests SET status = ? WHERE id = ?`,
    [status, requestId]
  );

  return getRequestById(requestId);
};

module.exports = {
  createRequest,
  getRequestById,
  getRequestsByTenantId,
  getRequestsByOwnerId,
  updateRequestStatus,
  formatRequest
};
