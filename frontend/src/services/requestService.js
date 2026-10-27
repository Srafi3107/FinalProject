import api from './api';
import { mockRequests } from '../data/mockData';

const STORAGE_KEY = 'homematch_requests_cache';

/**
 * Helper to get locally cached or added requests
 */
const getLocalRequests = () => {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    return stored ? JSON.parse(stored) : mockRequests;
  } catch (e) {
    return mockRequests;
  }
};

/**
 * Helper to save requests cache locally
 */
const saveLocalRequests = (requests) => {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(requests));
  } catch (e) {
    console.error('Failed to save requests cache:', e);
  }
};

/**
 * Request Service: Handles visit scheduling and rent inquiries
 * Includes offline mock fallback for uninterrupted viva presentations
 */
export const requestService = {
  /**
   * Submit a new visit or rent request
   */
  async createRequest(requestData) {
    try {
      const res = await api.post('/requests', requestData);
      if (res.data?.success && res.data.request) {
        // Also update local cache
        const all = getLocalRequests();
        saveLocalRequests([res.data.request, ...all]);
        return { success: true, request: res.data.request, fromApi: true };
      }
      throw new Error(res.data?.message || 'Failed to submit request');
    } catch (error) {
      console.warn('[requestService] POST /requests unavailable, saving locally:', error.message);
      const newMockRequest = {
        id: Date.now(),
        listingId: requestData.listingId,
        listingTitle: requestData.listingTitle || 'Dhaka Property',
        listingArea: requestData.listingArea || 'Dhaka',
        listingRent: requestData.listingRent || 15000,
        type: requestData.type || 'visit',
        targetDate: requestData.targetDate || null,
        preferredSlot: requestData.preferredSlot || null,
        numberOfVisitors: requestData.numberOfVisitors || 1,
        offerRent: requestData.offerRent || null,
        message: requestData.message || '',
        status: 'pending',
        createdAt: new Date().toISOString().split('T')[0],
        tenantName: requestData.visitorName || 'Tanvir Ahmed',
        tenantPhone: requestData.visitorPhone || '01712345678',
        isTenantVerified: true
      };

      const all = getLocalRequests();
      saveLocalRequests([newMockRequest, ...all]);
      return { success: true, request: newMockRequest, fromApi: false };
    }
  },

  /**
   * Fetch all requests sent by the logged-in tenant
   */
  async getMyRequests() {
    try {
      const res = await api.get('/requests/my-requests');
      if (res.data?.success && Array.isArray(res.data.requests)) {
        return { requests: res.data.requests, fromApi: true };
      }
      throw new Error('Invalid requests response');
    } catch (error) {
      console.warn('[requestService] GET /requests/my-requests offline, using local cache:', error.message);
      const all = getLocalRequests();
      return { requests: all, fromApi: false };
    }
  },

  /**
   * Fetch all incoming requests received by property owner
   */
  async getOwnerRequests() {
    try {
      const res = await api.get('/requests/owner-requests');
      if (res.data?.success && Array.isArray(res.data.requests)) {
        return { requests: res.data.requests, fromApi: true };
      }
      throw new Error('Invalid requests response');
    } catch (error) {
      console.warn('[requestService] GET /requests/owner-requests offline, using local cache:', error.message);
      const all = getLocalRequests();
      return { requests: all, fromApi: false };
    }
  },

  /**
   * Update request status (accepted, rejected, or pending)
   */
  async updateStatus(requestId, status) {
    try {
      const res = await api.patch(`/requests/${requestId}/status`, { status });
      if (res.data?.success && res.data.request) {
        // Update local cache
        const all = getLocalRequests().map((r) =>
          r.id === Number(requestId) ? { ...r, status } : r
        );
        saveLocalRequests(all);
        return { success: true, request: res.data.request, fromApi: true };
      }
      throw new Error(res.data?.message || 'Failed to update request status');
    } catch (error) {
      console.warn(`[requestService] PATCH /requests/${requestId}/status offline, updating locally:`, error.message);
      const all = getLocalRequests().map((r) =>
        r.id === Number(requestId) ? { ...r, status } : r
      );
      saveLocalRequests(all);
      return {
        success: true,
        request: { id: requestId, status },
        fromApi: false
      };
    }
  }
};

export default requestService;
