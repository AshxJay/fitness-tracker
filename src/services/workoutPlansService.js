import api from './api';

const handleError = (error) => {
  console.error('Service error:', error.response?.data || error.message);
  if (error.response?.data?.message) {
    throw new Error(error.response.data.message);
  }
  throw error;
};

export const workoutPlansService = {
  // Get all workout plans
  getWorkoutPlans: async () => {
    try {
      const response = await api.get('/workout-plans');
      return response.data;
    } catch (error) {
      handleError(error);
    }
  },

  // Create a new workout plan
  createWorkoutPlan: async (planData) => {
    try {
      const response = await api.post('/workout-plans', planData);
      return response.data;
    } catch (error) {
      handleError(error);
    }
  },

  // Update a workout plan
  updateWorkoutPlan: async (id, planData) => {
    try {
      const response = await api.patch(`/workout-plans/${id}`, planData);
      return response.data;
    } catch (error) {
      handleError(error);
    }
  },

  // Delete a workout plan
  deleteWorkoutPlan: async (id) => {
    try {
      const response = await api.delete(`/workout-plans/${id}`);
      return response.data;
    } catch (error) {
      handleError(error);
    }
  }
};
