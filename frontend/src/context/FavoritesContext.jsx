import React, { createContext, useContext, useState, useEffect } from 'react';
import { useToast } from './ToastContext';
import { favoriteService } from '../services/favoriteService';

const FavoritesContext = createContext(null);

const STORAGE_KEY = 'homematch_favorite_listing_ids';

export const FavoritesProvider = ({ children }) => {
  const [favoriteIds, setFavoriteIds] = useState(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      return stored ? JSON.parse(stored) : [1, 4];
    } catch (e) {
      return [1, 4];
    }
  });

  const { showSuccess, showInfo } = useToast();

  // Load from backend API if authenticated on mount
  useEffect(() => {
    let isMounted = true;
    const fetchRemoteFavorites = async () => {
      const token = localStorage.getItem('homematch_token');
      if (!token) return;

      try {
        const { favoriteIds: remoteIds } = await favoriteService.getFavoriteIds();
        if (isMounted && Array.isArray(remoteIds)) {
          setFavoriteIds(remoteIds);
        }
      } catch (err) {
        // Fallback already handled
      }
    };

    fetchRemoteFavorites();
    return () => { isMounted = false; };
  }, []);

  // Sync to local storage
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(favoriteIds));
    } catch (e) {
      console.error('Failed to sync favorites to localStorage', e);
    }
  }, [favoriteIds]);

  const isFavorite = (id) => favoriteIds.includes(Number(id));

  const toggleFavorite = async (id, listingTitle = 'Property') => {
    const numId = Number(id);
    if (favoriteIds.includes(numId)) {
      setFavoriteIds((prev) => prev.filter((item) => item !== numId));
      showInfo(`Removed "${listingTitle}" from favorites`);
      await favoriteService.removeFavorite(numId);
    } else {
      setFavoriteIds((prev) => [...prev, numId]);
      showSuccess(`Saved "${listingTitle}" to your favorites! ❤️`);
      await favoriteService.addFavorite(numId);
    }
  };

  const removeFavorite = async (id, listingTitle = 'Property') => {
    const numId = Number(id);
    setFavoriteIds((prev) => prev.filter((item) => item !== numId));
    showInfo(`Removed "${listingTitle}" from favorites`);
    await favoriteService.removeFavorite(numId);
  };

  const clearAllFavorites = async () => {
    const currentIds = [...favoriteIds];
    setFavoriteIds([]);
    showInfo('Cleared all saved favorite properties');
    for (const id of currentIds) {
      await favoriteService.removeFavorite(id);
    }
  };

  return (
    <FavoritesContext.Provider
      value={{
        favoriteIds,
        isFavorite,
        toggleFavorite,
        removeFavorite,
        clearAllFavorites,
        favoritesCount: favoriteIds.length
      }}
    >
      {children}
    </FavoritesContext.Provider>
  );
};

export const useFavorites = () => {
  const context = useContext(FavoritesContext);
  if (!context) {
    return {
      favoriteIds: [],
      isFavorite: () => false,
      toggleFavorite: () => {},
      removeFavorite: () => {},
      clearAllFavorites: () => {},
      favoritesCount: 0
    };
  }
  return context;
};

export default FavoritesContext;
