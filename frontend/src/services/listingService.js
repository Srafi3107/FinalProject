import api from './api';
import { mockListings } from '../data/mockData';

/**
 * Listing Service: Handles all API calls for properties
 * Includes graceful mock data fallback if backend or database is offline
 */
export const listingService = {
  /**
   * Fetch public listings with query filters & pagination
   */
  async getListings(params = {}) {
    try {
      const res = await api.get('/listings', { params });
      if (res.data?.success && Array.isArray(res.data.listings)) {
        return {
          listings: res.data.listings,
          pagination: res.data.pagination,
          fromApi: true
        };
      }
      throw new Error('Invalid listings payload');
    } catch (error) {
      console.warn('[listingService] Backend /listings unavailable, falling back to mock listings:', error.message);
      // Client-side mock filter fallback
      return {
        listings: mockListings,
        pagination: {
          total: mockListings.length,
          page: 1,
          limit: mockListings.length,
          totalPages: 1
        },
        fromApi: false
      };
    }
  },

  /**
   * Fetch single listing by ID
   */
  async getListingById(id) {
    try {
      const res = await api.get(`/listings/${id}`);
      if (res.data?.success && res.data.listing) {
        return { listing: res.data.listing, fromApi: true };
      }
      throw new Error('Listing not found');
    } catch (error) {
      console.warn(`[listingService] Backend /listings/${id} unavailable, using mock data:`, error.message);
      const mock = mockListings.find((item) => item.id === Number(id));
      return { listing: mock || null, fromApi: false };
    }
  },

  /**
   * Fetch listings owned by current logged-in user
   */
  async getMyListings() {
    try {
      const res = await api.get('/listings/my-listings');
      if (res.data?.success && Array.isArray(res.data.listings)) {
        return { listings: res.data.listings, fromApi: true };
      }
      throw new Error('Could not fetch owner listings');
    } catch (error) {
      console.warn('[listingService] Backend /my-listings unavailable, falling back to mock owner listings:', error.message);
      // Filter mockListings for owner #101 or first two
      const mockOwnerListings = mockListings.filter(l => l.owner?.id === 101 || l.ownerId === 101);
      return {
        listings: mockOwnerListings.length > 0 ? mockOwnerListings : mockListings.slice(0, 3),
        fromApi: false
      };
    }
  },

  /**
   * Create new listing (supports both FormData and regular JSON)
   */
  async createListing(formDataOrJson) {
    const isFormData = typeof FormData !== 'undefined' && formDataOrJson instanceof FormData;
    const config = isFormData ? { headers: { 'Content-Type': 'multipart/form-data' } } : {};
    return await api.post('/listings', formDataOrJson, config);
  },

  /**
   * Update existing listing
   */
  async updateListing(id, formDataOrJson) {
    const isFormData = typeof FormData !== 'undefined' && formDataOrJson instanceof FormData;
    const config = isFormData ? { headers: { 'Content-Type': 'multipart/form-data' } } : {};
    return await api.put(`/listings/${id}`, formDataOrJson, config);
  },

  /**
   * Delete listing
   */
  async deleteListing(id) {
    return await api.delete(`/listings/${id}`);
  },

  /**
   * Toggle status ('available' / 'rented')
   */
  async toggleStatus(id, status) {
    return await api.patch(`/listings/${id}/status`, { status });
  }
};

export default listingService;
