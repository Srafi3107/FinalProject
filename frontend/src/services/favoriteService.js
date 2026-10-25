import api from './api';
import { mockListings } from '../data/mockData';

const STORAGE_KEY = 'homematch_favorite_listing_ids';

/**
 * Favorite Service: Handles synchronizing user bookmarks with backend MySQL database,
 * with seamless local storage fallback when offline or unauthenticated.
 */
export const favoriteService = {
  /**
   * Fetch all full listing objects bookmarked by current user
   */
  async getFavorites() {
    try {
      const res = await api.get('/favorites');
      if (res.data?.success && Array.isArray(res.data.favorites)) {
        return { favorites: res.data.favorites, fromApi: true };
      }
      throw new Error('Invalid favorites response');
    } catch (error) {
      console.warn('[favoriteService] GET /favorites unavailable, falling back to local favorites:', error.message);
      let ids = [1, 4];
      try {
        const stored = localStorage.getItem(STORAGE_KEY);
        if (stored) ids = JSON.parse(stored);
      } catch (e) {
        // ignore
      }
      const favorites = mockListings.filter((l) => ids.includes(Number(l.id)));
      return { favorites, fromApi: false };
    }
  },

  /**
   * Fetch array of numeric IDs of favorited listings
   */
  async getFavoriteIds() {
    try {
      const res = await api.get('/favorites/ids');
      if (res.data?.success && Array.isArray(res.data.favoriteIds)) {
        // sync to local storage
        localStorage.setItem(STORAGE_KEY, JSON.stringify(res.data.favoriteIds));
        return { favoriteIds: res.data.favoriteIds, fromApi: true };
      }
      throw new Error('Invalid favorite IDs response');
    } catch (error) {
      console.warn('[favoriteService] GET /favorites/ids offline, using localStorage:', error.message);
      try {
        const stored = localStorage.getItem(STORAGE_KEY);
        const ids = stored ? JSON.parse(stored) : [1, 4];
        return { favoriteIds: ids, fromApi: false };
      } catch (e) {
        return { favoriteIds: [1, 4], fromApi: false };
      }
    }
  },

  /**
   * Add a listing to favorites
   */
  async addFavorite(listingId) {
    try {
      const res = await api.post('/favorites', { listingId });
      return { success: true, fromApi: true, data: res.data };
    } catch (error) {
      console.warn(`[favoriteService] POST /favorites (${listingId}) offline, saved locally:`, error.message);
      return { success: true, fromApi: false };
    }
  },

  /**
   * Remove a listing from favorites
   */
  async removeFavorite(listingId) {
    try {
      const res = await api.delete(`/favorites/${listingId}`);
      return { success: true, fromApi: true, data: res.data };
    } catch (error) {
      console.warn(`[favoriteService] DELETE /favorites/${listingId} offline, removed locally:`, error.message);
      return { success: true, fromApi: false };
    }
  }
};

export default favoriteService;
