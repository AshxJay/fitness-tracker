import React, { useState } from 'react';
import './Tracking.css';

const foodDatabase = [
  { name: 'Chicken Breast', calories: 165, protein: 31, carbs: 0, fat: 3.6 },
  { name: 'Brown Rice', calories: 216, protein: 5, carbs: 45, fat: 1.8 },
  { name: 'Salmon', calories: 208, protein: 22, carbs: 0, fat: 13 },
  { name: 'Sweet Potato', calories: 103, protein: 2, carbs: 24, fat: 0 },
  { name: 'Broccoli', calories: 55, protein: 3.7, carbs: 11.2, fat: 0.6 },
  { name: 'Eggs', calories: 155, protein: 13, carbs: 1.1, fat: 11 },
];

export default function CalorieTracking() {
  const [meals, setMeals] = useState([]);
  const [selectedFood, setSelectedFood] = useState('');
  const [servingSize, setServingSize] = useState(1);
  const [mealType, setMealType] = useState('breakfast');

  const totalCalories = meals.reduce((sum, meal) => sum + meal.calories, 0);
  const totalProtein = meals.reduce((sum, meal) => sum + meal.protein, 0);
  const totalCarbs = meals.reduce((sum, meal) => sum + meal.carbs, 0);
  const totalFat = meals.reduce((sum, meal) => sum + meal.fat, 0);

  const handleAddMeal = (e) => {
    e.preventDefault();
    
    if (!selectedFood || servingSize <= 0) {
      alert('Please select a food and valid serving size');
      return;
    }

    const food = foodDatabase.find(f => f.name === selectedFood);
    const newMeal = {
      id: Date.now(),
      name: selectedFood,
      calories: Math.round(food.calories * servingSize),
      protein: Math.round(food.protein * servingSize),
      carbs: Math.round(food.carbs * servingSize),
      fat: Math.round(food.fat * servingSize),
      type: mealType,
      time: new Date().toLocaleTimeString(),
    };

    setMeals([...meals, newMeal]);
    setSelectedFood('');
    setServingSize(1);
  };

  const handleDeleteMeal = (mealId) => {
    setMeals(meals.filter((meal) => meal.id !== mealId));
  };

  return (
    <div className="tracking-container">
      <h2>Calorie Tracking</h2>
      
      <div className="stats-grid">
        <div className="stat-card">
          <h3>Calories</h3>
          <p className="stat-value">{totalCalories}</p>
          <div className="progress-bar">
            <div 
              className="progress-fill"
              style={{ width: `${Math.min((totalCalories / 2000) * 100, 100)}%` }}
            ></div>
          </div>
          <p className="stat-target">Target: 2000</p>
        </div>

        <div className="stat-card">
          <h3>Protein</h3>
          <p className="stat-value">{totalProtein}g</p>
          <div className="progress-bar">
            <div 
              className="progress-fill protein"
              style={{ width: `${Math.min((totalProtein / 150) * 100, 100)}%` }}
            ></div>
          </div>
          <p className="stat-target">Target: 150g</p>
        </div>

        <div className="stat-card">
          <h3>Carbs</h3>
          <p className="stat-value">{totalCarbs}g</p>
          <div className="progress-bar">
            <div 
              className="progress-fill carbs"
              style={{ width: `${Math.min((totalCarbs / 250) * 100, 100)}%` }}
            ></div>
          </div>
          <p className="stat-target">Target: 250g</p>
        </div>

        <div className="stat-card">
          <h3>Fat</h3>
          <p className="stat-value">{totalFat}g</p>
          <div className="progress-bar">
            <div 
              className="progress-fill fat"
              style={{ width: `${Math.min((totalFat / 55) * 100, 100)}%` }}
            ></div>
          </div>
          <p className="stat-target">Target: 55g</p>
        </div>
      </div>

      <form onSubmit={handleAddMeal} className="add-meal-form">
        <div className="form-group">
          <label>Food</label>
          <select 
            value={selectedFood}
            onChange={(e) => setSelectedFood(e.target.value)}
            required
          >
            <option value="">Select food</option>
            {foodDatabase.map((food) => (
              <option key={food.name} value={food.name}>
                {food.name}
              </option>
            ))}
          </select>
        </div>

        <div className="form-group">
          <label>Serving Size</label>
          <input
            type="number"
            min="0.25"
            step="0.25"
            value={servingSize}
            onChange={(e) => setServingSize(parseFloat(e.target.value) || 0)}
            required
          />
        </div>

        <div className="form-group">
          <label>Meal Type</label>
          <select
            value={mealType}
            onChange={(e) => setMealType(e.target.value)}
            required
          >
            <option value="breakfast">Breakfast</option>
            <option value="lunch">Lunch</option>
            <option value="dinner">Dinner</option>
            <option value="snack">Snack</option>
          </select>
        </div>

        <button type="submit" className="add-button">Add Meal</button>
      </form>

      <div className="meals-list">
        <h3>Today's Meals</h3>
        {meals.map((meal) => (
          <div key={meal.id} className="meal-item">
            <div className="meal-info">
              <h4>{meal.name}</h4>
              <p>
                {meal.time} · {meal.type} · {meal.calories} cal · 
                P: {meal.protein}g · C: {meal.carbs}g · F: {meal.fat}g
              </p>
            </div>
            <button 
              onClick={() => handleDeleteMeal(meal.id)}
              className="delete-button"
            >
              ×
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
