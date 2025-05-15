import { create } from 'zustand';
import { workouts as workoutApi } from '../services/api';

const useWorkoutStore = create((set, get) => ({
  workouts: [],
  currentWorkout: null,
  isLoading: false,
  error: null,

  fetchWorkouts: async () => {
    set({ isLoading: true, error: null });
    try {
      const response = await workoutApi.getAll();
      set({ workouts: response.data, isLoading: false });
    } catch (error) {
      set({
        error: error.response?.data?.message || 'Failed to fetch workouts',
        isLoading: false
      });
    }
  },

  addWorkout: async (workoutData) => {
    set({ isLoading: true, error: null });
    try {
      const response = await workoutApi.create(workoutData);
      set(state => ({
        workouts: [...state.workouts, response.data],
        isLoading: false
      }));
      return true;
    } catch (error) {
      set({
        error: error.response?.data?.message || 'Failed to add workout',
        isLoading: false
      });
      return false;
    }
  },

  updateWorkout: async (id, workoutData) => {
    set({ isLoading: true, error: null });
    try {
      const response = await workoutApi.update(id, workoutData);
      set(state => ({
        workouts: state.workouts.map(workout =>
          workout._id === id ? response.data : workout
        ),
        isLoading: false
      }));
      return true;
    } catch (error) {
      set({
        error: error.response?.data?.message || 'Failed to update workout',
        isLoading: false
      });
      return false;
    }
  },

  deleteWorkout: async (id) => {
    set({ isLoading: true, error: null });
    try {
      await workoutApi.delete(id);
      set(state => ({
        workouts: state.workouts.filter(workout => workout._id !== id),
        isLoading: false
      }));
      return true;
    } catch (error) {
      set({
        error: error.response?.data?.message || 'Failed to delete workout',
        isLoading: false
      });
      return false;
    }
  },

  setCurrentWorkout: (workout) => {
    set({ currentWorkout: workout });
  },

  clearError: () => set({ error: null })
}));

export default useWorkoutStore;
