import { create } from 'zustand';
import api from '../services/api';
import { useAuthStore } from './useAuthStore';

const getInitialWishlist = () => {
  try {
    const saved = localStorage.getItem('veloura_wishlist');
    return saved ? JSON.parse(saved) : [];
  } catch (e) {
    return [];
  }
};

export const useWishlistStore = create((set, get) => ({
  items: getInitialWishlist(),
  isLoading: false,

  isInWishlist: (productId) => {
    return get().items.some((item) => (item._id || item) === productId);
  },

  toggleWishlist: async (product) => {
    const { isAuthenticated } = useAuthStore.getState();
    const productId = product._id || product;
    const isCurrentlyIn = get().isInWishlist(productId);

    let updatedItems;
    if (isCurrentlyIn) {
      updatedItems = get().items.filter((item) => (item._id || item) !== productId);
    } else {
      updatedItems = [...get().items, product];
    }

    set({ items: updatedItems });
    localStorage.setItem('veloura_wishlist', JSON.stringify(updatedItems));

    if (isAuthenticated) {
      try {
        await api.post(`/users/wishlist/${productId}`);
      } catch (err) {
        console.warn('Wishlist sync warning:', err.message);
      }
    }
  },

  setWishlist: (items) => {
    set({ items });
    localStorage.setItem('veloura_wishlist', JSON.stringify(items));
  },
}));
