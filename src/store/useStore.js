import { create } from 'zustand';
import { persist } from 'zustand/middleware';

const useStore = create(
  persist(
    (set) => ({
      user: null,
      isAuthenticated: false,
      workouts: [],
      nutrition: [],
      goals: [],
      achievements: [],
      setUser: (user) => set({ user }),
      setIsAuthenticated: (isAuthenticated) => set({ isAuthenticated }),
      addWorkout: (workout) => set((state) => ({ workouts: [...state.workouts, workout] })),
      addNutrition: (entry) => set((state) => ({ nutrition: [...state.nutrition, entry] })),
      setGoal: (goal) => set((state) => ({ goals: [...state.goals, goal] })),
      addAchievement: (achievement) => set((state) => ({ achievements: [...state.achievements, achievement] })),
      clearStore: () => set({ user: null, isAuthenticated: false, workouts: [], nutrition: [], goals: [], achievements: [] }),
      updateUserPreferences: (preferences) =>
        set((state) => ({
          user: { ...state.user, preferences: { ...state.user?.preferences, ...preferences } },
        })),
    }),
    {
      name: 'fitness-tracker-storage',
      getStorage: () => localStorage,
    }
  )
);

export default useStore;
