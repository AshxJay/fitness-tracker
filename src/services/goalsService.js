import api from './api';

export const goalsService = {
  // Get all goals
  getGoals: async () => {
    const response = await api.get('/goals');
    return response.data;
  },

  // Create a new goal
  createGoal: async (goalData) => {
    const response = await api.post('/goals', goalData);
    return response.data;
  },

  // Update a goal
  updateGoal: async (id, goalData) => {
    const response = await api.patch(`/goals/${id}`, goalData);
    return response.data;
  },

  // Delete a goal
  deleteGoal: async (id) => {
    const response = await api.delete(`/goals/${id}`);
    return response.data;
  }
};
