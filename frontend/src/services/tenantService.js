import api from './api';
import { defaultTenantProfile } from '../data/mockData';

const STORAGE_KEY = 'homematch_tenant_profile_cache';

/**
 * Tenant Service: Handles profile retrieval and updates for housing preferences,
 * lifestyle habits, and personal details.
 * Seamlessly falls back to localStorage/mock profile if API is offline.
 */
export const tenantService = {
  /**
   * Fetch current tenant profile with completeness percentage
   */
  async getProfile() {
    try {
      const res = await api.get('/tenant/profile');
      if (res.data?.success && res.data.profile) {
        // Cache to localStorage
        localStorage.setItem(STORAGE_KEY, JSON.stringify(res.data.profile));
        return { profile: res.data.profile, fromApi: true };
      }
      throw new Error('Invalid profile response');
    } catch (error) {
      console.warn('[tenantService] GET /tenant/profile unavailable, using cached/mock profile:', error.message);
      const cached = localStorage.getItem(STORAGE_KEY);
      if (cached) {
        try {
          return { profile: JSON.parse(cached), fromApi: false };
        } catch (e) {
          // fall through
        }
      }
      return { profile: { ...defaultTenantProfile, completeness: 90 }, fromApi: false };
    }
  },

  /**
   * Update housing preferences (budget, areas, room type, amenities)
   */
  async updatePreferences(preferences) {
    try {
      const res = await api.put('/tenant/preferences', preferences);
      if (res.data?.success && res.data.profile) {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(res.data.profile));
        return { success: true, profile: res.data.profile, fromApi: true };
      }
      throw new Error(res.data?.message || 'Update failed');
    } catch (error) {
      console.warn('[tenantService] PUT /tenant/preferences offline, saving to local state:', error.message);
      // Update local cache
      const cached = localStorage.getItem(STORAGE_KEY);
      const current = cached ? JSON.parse(cached) : defaultTenantProfile;
      const updated = {
        ...current,
        housingPreferences: {
          ...current.housingPreferences,
          ...preferences
        }
      };
      localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
      return { success: true, profile: updated, fromApi: false };
    }
  },

  /**
   * Update lifestyle habits (smoking, cleanliness, sleep time, cooking, guests, gender preference)
   */
  async updateLifestyle(lifestyleHabits) {
    try {
      const res = await api.put('/tenant/lifestyle', lifestyleHabits);
      if (res.data?.success && res.data.profile) {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(res.data.profile));
        return { success: true, profile: res.data.profile, fromApi: true };
      }
      throw new Error(res.data?.message || 'Update failed');
    } catch (error) {
      console.warn('[tenantService] PUT /tenant/lifestyle offline, saving to local state:', error.message);
      const cached = localStorage.getItem(STORAGE_KEY);
      const current = cached ? JSON.parse(cached) : defaultTenantProfile;
      const updated = {
        ...current,
        lifestyleHabits: {
          ...current.lifestyleHabits,
          ...lifestyleHabits
        }
      };
      localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
      return { success: true, profile: updated, fromApi: false };
    }
  },

  /**
   * Update personal info (name, phone, bio, age, occupation, institution)
   */
  async updatePersonal(personalData) {
    try {
      const res = await api.put('/tenant/personal', personalData);
      if (res.data?.success && res.data.profile) {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(res.data.profile));
        return { success: true, profile: res.data.profile, fromApi: true };
      }
      throw new Error(res.data?.message || 'Update failed');
    } catch (error) {
      console.warn('[tenantService] PUT /tenant/personal offline, saving to local state:', error.message);
      const cached = localStorage.getItem(STORAGE_KEY);
      const current = cached ? JSON.parse(cached) : defaultTenantProfile;
      const updated = {
        ...current,
        ...personalData
      };
      localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
      return { success: true, profile: updated, fromApi: false };
    }
  }
};

export default tenantService;
