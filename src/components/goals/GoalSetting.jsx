import React, { useState } from 'react';
import './Goals.css';

const GoalSetting = () => {
  const [weeklyGoal, setWeeklyGoal] = useState({
    startDate: '',
    weightGoal: '',
    workoutFrequency: '',
    calorieTarget: '',
    specificGoals: [{ id: 1, description: '', completed: false }],
  });

  const addSpecificGoal = () => {
    setWeeklyGoal(prev => ({
      ...prev,
      specificGoals: [
        ...prev.specificGoals,
        { 
          id: prev.specificGoals.length + 1, 
          description: '', 
          completed: false 
        }
      ]
    }));
  };

  const updateSpecificGoal = (id, description) => {
    setWeeklyGoal(prev => ({
      ...prev,
      specificGoals: prev.specificGoals.map(goal =>
        goal.id === id ? { ...goal, description } : goal
      )
    }));
  };

  const removeSpecificGoal = (id) => {
    setWeeklyGoal(prev => ({
      ...prev,
      specificGoals: prev.specificGoals.filter(goal => goal.id !== id)
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // TODO: Save weekly goals
    console.log('Weekly goals:', weeklyGoal);
  };

  return (
    <div className="goals-container">
      <h2>Set Weekly Goals</h2>
      <form onSubmit={handleSubmit} className="goals-form">
        <div className="form-group">
          <label>Week Starting</label>
          <input
            type="date"
            value={weeklyGoal.startDate}
            onChange={(e) => setWeeklyGoal({ ...weeklyGoal, startDate: e.target.value })}
            required
          />
        </div>

        <div className="form-row">
          <div className="form-group">
            <label>Weight Goal (kg)</label>
            <input
              type="number"
              step="0.1"
              value={weeklyGoal.weightGoal}
              onChange={(e) => setWeeklyGoal({ ...weeklyGoal, weightGoal: e.target.value })}
              placeholder="Target weight for the week"
            />
          </div>

          <div className="form-group">
            <label>Workout Sessions</label>
            <input
              type="number"
              min="1"
              max="7"
              value={weeklyGoal.workoutFrequency}
              onChange={(e) => setWeeklyGoal({ ...weeklyGoal, workoutFrequency: e.target.value })}
              placeholder="Number of workouts this week"
            />
          </div>

          <div className="form-group">
            <label>Daily Calorie Target</label>
            <input
              type="number"
              value={weeklyGoal.calorieTarget}
              onChange={(e) => setWeeklyGoal({ ...weeklyGoal, calorieTarget: e.target.value })}
              placeholder="Daily calorie target"
            />
          </div>
        </div>

        <div className="specific-goals-section">
          <h3>Specific Goals for the Week</h3>
          {weeklyGoal.specificGoals.map((goal) => (
            <div key={goal.id} className="specific-goal-item">
              <input
                type="text"
                value={goal.description}
                onChange={(e) => updateSpecificGoal(goal.id, e.target.value)}
                placeholder="Enter a specific goal (e.g., Run 5km, Do 20 pushups)"
              />
              <button
                type="button"
                className="remove-goal-btn"
                onClick={() => removeSpecificGoal(goal.id)}
              >
                ✕
              </button>
            </div>
          ))}
          <button
            type="button"
            className="add-goal-btn"
            onClick={addSpecificGoal}
          >
            + Add Another Goal
          </button>
        </div>

        <button type="submit" className="save-goals-btn">Save Weekly Goals</button>
      </form>
    </div>
  );
};

export default GoalSetting;
