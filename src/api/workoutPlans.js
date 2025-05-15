import axios from 'axios';

const BASE_URL = 'http://localhost:27017';

export const getWorkoutPlans = async () => {
  try {
    const response = await axios.get(`${BASE_URL}/workoutplans`);
    if (!response.data) return [];
    return Array.isArray(response.data) ? response.data : [];
  } catch (error) {
    console.error('Error fetching workout plans:', error);
    return [];
  }
};

export const createWorkoutPlan = async (planData) => {
  try {
    const response = await axios.post(`${BASE_URL}/workoutplans`, planData);
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const updateWorkoutPlan = async (id, planData) => {
  try {
    const response = await axios.put(`${BASE_URL}/workoutplans/${id}`, planData);
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const deleteWorkoutPlan = async (id) => {
  try {
    const response = await axios.delete(`${BASE_URL}/workoutplans/${id}`);
    return response.data;
  } catch (error) {
    throw error;
  }
};
