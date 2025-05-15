import api from './api';

export const nutritionService = {
  // Get all nutrition logs
  getNutritionLogs: async () => {
    const response = await api.get('/nutrition');
    return response.data;
  },

  // Get nutrition logs for a specific date
  getNutritionLogsByDate: async (date) => {
    const response = await api.get(`/nutrition/range?startDate=${date}T00:00:00&endDate=${date}T23:59:59`);
    return response.data;
  },

  // Add a new nutrition log
  addNutritionLog: async (nutritionData) => {
    const response = await api.post('/nutrition', nutritionData);
    return response.data;
  },

  // Update a nutrition log
  updateNutritionLog: async (id, nutritionData) => {
    const response = await api.patch(`/nutrition/${id}`, nutritionData);
    return response.data;
  },

  // Delete a nutrition log
  deleteNutritionLog: async (id) => {
    const response = await api.delete(`/nutrition/${id}`);
    return response.data;
  },

  // Get nutrition summary/stats
  getNutritionStats: async (days = 7) => {
    const response = await api.get(`/nutrition/stats?days=${days}`);
    return response.data;
  }
};
