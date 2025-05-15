import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { setAuthToken } from '../services/api';

const useStore = create(
  persist(
    (set, get) => ({
      user: null,
      token: null,
      isAuthenticated: false,
      workouts: [],
      nutrition: [],
      goals: [],
      achievements: [],

      // Auth actions
      setUser: (user) => set({ user }),
      setToken: (token) => {
        setAuthToken(token);
        set({ token, isAuthenticated: !!token });
      },
      setIsAuthenticated: (isAuthenticated) => set({ isAuthenticated }),

      // Goals actions
      setGoals: (goals) => set({ goals }),
      addGoal: (goal) => set((state) => ({
        goals: [...state.goals, goal]
      })),
      updateGoal: (goalId, updatedGoal) => set((state) => ({
        goals: state.goals.map(g => g._id === goalId ? { ...g, ...updatedGoal } : g)
      })),
      deleteGoal: (goalId) => set((state) => ({
        goals: state.goals.filter(g => g._id !== goalId)
      })),

      // Other actions
      addWorkout: (workout) => set((state) => ({ workouts: [...state.workouts, workout] })),
      addNutrition: (entry) => set((state) => ({ nutrition: [...state.nutrition, entry] })),
      addAchievement: (achievement) => set((state) => ({ achievements: [...state.achievements, achievement] })),

      // Clear store
      clearStore: () => {
        setAuthToken(null);
        set({
          user: null,
          token: null,
          isAuthenticated: false,
          workouts: [],
          nutrition: [],
          goals: [],
          achievements: []
        });
      },

      // User preferences
      updateUserPreferences: (preferences) =>
        set((state) => ({
          user: { ...state.user, preferences: { ...state.user?.preferences, ...preferences } },
        })),

      // Hydration callback
      onHydrate: (state) => {
        // Restore auth token on hydration
        if (state.token) {
          setAuthToken(state.token);
        }
      },
    }),
    {
      name: 'fitness-tracker-storage',
      getStorage: () => localStorage,
      partialize: (state) => ({
        user: state.user,
        token: state.token,
        isAuthenticated: state.isAuthenticated,
        goals: state.goals
      }),
    }
  )
);

export default useStore;
