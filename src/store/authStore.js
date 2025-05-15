import { create } from 'zustand';
import { auth as authApi, setAuthToken } from '../services/api';

import useStore from './useStore';

const useAuthStore = create((set) => ({
  user: null,
  isAuthenticated: false,
  isLoading: false,
  error: null,

  login: async (email, password) => {
    set({ isLoading: true, error: null });
    try {
      const response = await authApi.login({ email, password });
      const { user, token } = response.data;
      set({ user, isAuthenticated: true, isLoading: false });
      // Sync with main store
      useStore.getState().setUser(user);
      useStore.getState().setToken(token);
      return true;
    } catch (error) {
      set({
        error: error.response?.data?.message || 'Login failed',
        isLoading: false
      });
      return false;
    }
  },

  signup: async (userData) => {
    console.log('AuthStore: Starting signup process');
    set({ isLoading: true, error: null });
    try {
      console.log('AuthStore: Calling signup API');
      const response = await authApi.signup(userData);
      console.log('AuthStore: Signup API response:', response.data);
      const { user, token } = response.data;
      console.log('AuthStore: Setting user and auth state');
      set({ user, isAuthenticated: true, isLoading: false });
      // Sync with main store
      useStore.getState().setUser(user);
      useStore.getState().setToken(token);
      console.log('AuthStore: Signup successful');
      return true;
    } catch (error) {
      console.error('AuthStore: Signup error details:', {
        response: error.response?.data,
        status: error.response?.status,
        message: error.message,
        error: error
      });
      set({
        error: error.response?.data?.message || 'Signup failed',
        isLoading: false
      });
      return false;
    }
  },

  logout: () => {
    setAuthToken(null);
    set({ user: null, isAuthenticated: false });
    // Sync with main store
    useStore.getState().clearStore();
  },

  updateProfile: async (profileData) => {
    set({ isLoading: true, error: null });
    try {
      const response = await authApi.updateProfile(profileData);
      set({ user: response.data, isLoading: false });
      return true;
    } catch (error) {
      set({
        error: error.response?.data?.message || 'Profile update failed',
        isLoading: false
      });
      return false;
    }
  },

  clearError: () => set({ error: null })
}));

export default useAuthStore;
