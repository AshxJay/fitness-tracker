import api from './api';

export const progressService = {
  // Get all progress entries
  getProgress: async () => {
    const response = await api.get('/progress');
    return response.data;
  },

  // Get progress by type
  getProgressByType: async (type) => {
    const response = await api.get(`/progress/type/${type}`);
    return response.data;
  },

  // Create a new progress entry
  createProgress: async (progressData) => {
    const response = await api.post('/progress', progressData);
    return response.data;
  },

  // Update a progress entry
  updateProgress: async (id, progressData) => {
    const response = await api.patch(`/progress/${id}`, progressData);
    return response.data;
  },

  // Delete a progress entry
  deleteProgress: async (id) => {
    const response = await api.delete(`/progress/${id}`);
    return response.data;
  }
};
