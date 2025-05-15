import axios from 'axios';

const BASE_URL = 'http://localhost:5000/api';

export const userService = {
  async updateProfile(userData) {
    try {
      const response = await axios.put(`${BASE_URL}/users/profile`, userData, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  async getProfile() {
    try {
      const response = await axios.get(`${BASE_URL}/users/profile`, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  }
};
