import { create } from 'zustand';

const useMealStore = create((set) => ({
  meals: [],
  isLoading: false,
  error: null,

  // Add a new meal
  addMeal: async (mealData) => {
    set({ isLoading: true });
    try {
      const response = await fetch('/api/meals', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify(mealData)
      });
      
      if (!response.ok) {
        throw new Error('Failed to add meal');
      }

      const newMeal = await response.json();
      set((state) => ({
        meals: [...state.meals, newMeal],
        isLoading: false
      }));
    } catch (error) {
      set({ error: error.message, isLoading: false });
    }
  },

  // Get meals for a date range
  getMealsForRange: async (startDate, endDate) => {
    set({ isLoading: true });
    try {
      const response = await fetch(
        `/api/meals/range?startDate=${startDate.toISOString()}&endDate=${endDate.toISOString()}`,
        {
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('token')}`
          }
        }
      );
      
      if (!response.ok) {
        throw new Error('Failed to fetch meals');
      }

      const meals = await response.json();
      set({ meals, isLoading: false });
    } catch (error) {
      set({ error: error.message, isLoading: false });
    }
  },

  // Delete a meal
  deleteMeal: async (mealId) => {
    set({ isLoading: true });
    try {
      const response = await fetch(`/api/meals/${mealId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });
      
      if (!response.ok) {
        throw new Error('Failed to delete meal');
      }

      set((state) => ({
        meals: state.meals.filter(meal => meal._id !== mealId),
        isLoading: false
      }));
    } catch (error) {
      set({ error: error.message, isLoading: false });
    }
  },

  // Clear error
  clearError: () => set({ error: null })
}));

export default useMealStore;
