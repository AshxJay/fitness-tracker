import axios from 'axios';

const BASE_URL = 'http://localhost:3000/api';

export const getGoals = async () => {
  try {
    const response = await axios.get(`${BASE_URL}/goals`);
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const createGoal = async (goalData) => {
  try {
    const response = await axios.post(`${BASE_URL}/goals`, goalData);
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const updateGoal = async (id, goalData) => {
  try {
    const response = await axios.put(`${BASE_URL}/goals/${id}`, goalData);
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const deleteGoal = async (id) => {
  try {
    const response = await axios.delete(`${BASE_URL}/goals/${id}`);
    return response.data;
  } catch (error) {
    throw error;
  }
};
