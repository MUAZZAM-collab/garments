import { create } from 'zustand';
import api from '../services/api';

export const useAuthStore = create((set, get) => ({
  user: null,
  isAuthenticated: false,
  isAdmin: false,
  isLoading: true,
  error: null,

  // Check current session on load
  checkAuth: async () => {
    try {
      set({ isLoading: true, error: null });
      const data = await api.get('/auth/me');
      if (data?.user) {
        set({
          user: data.user,
          isAuthenticated: true,
          isAdmin: data.user.role === 'admin',
          isLoading: false,
        });
      } else {
        set({ user: null, isAuthenticated: false, isAdmin: false, isLoading: false });
      }
    } catch (err) {
      set({ user: null, isAuthenticated: false, isAdmin: false, isLoading: false });
    }
  },

  login: async (email, password) => {
    try {
      set({ isLoading: true, error: null });
      const data = await api.post('/auth/login', { email, password });
      set({
        user: data.user,
        isAuthenticated: true,
        isAdmin: data.user.role === 'admin',
        isLoading: false,
      });
      return { success: true, user: data.user };
    } catch (err) {
      set({ error: err.message, isLoading: false });
      return { success: false, message: err.message };
    }
  },

  register: async (name, email, phone, password) => {
    try {
      set({ isLoading: true, error: null });
      const data = await api.post('/auth/register', { name, email, phone, password });
      set({
        user: data.user,
        isAuthenticated: true,
        isAdmin: data.user.role === 'admin',
        isLoading: false,
      });
      return { success: true, user: data.user };
    } catch (err) {
      set({ error: err.message, isLoading: false });
      return { success: false, message: err.message };
    }
  },

  logout: async () => {
    try {
      await api.post('/auth/logout');
    } catch (err) {
      console.warn('Logout warning:', err.message);
    } finally {
      set({ user: null, isAuthenticated: false, isAdmin: false });
    }
  },

  updateUser: (updatedUser) => {
    set((state) => ({
      user: { ...state.user, ...updatedUser },
      isAdmin: updatedUser.role ? updatedUser.role === 'admin' : state.isAdmin,
    }));
  },

  clearError: () => set({ error: null }),
}));
