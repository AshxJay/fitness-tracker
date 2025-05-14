import React, { useState } from 'react';
import './Goals.css';

const GoalTracking = () => {
  // Mock data - replace with actual data from backend
  const [weeklyGoals] = useState({
    startDate: '2025-02-24',
    weightGoal: 70,
    currentWeight: 72,
    workoutFrequency: 4,
    completedWorkouts: 2,
    calorieTarget: 2000,
    averageCalories: 2100,
    specificGoals: [
      { id: 1, description: 'Run 5km without stopping', completed: false },
      { id: 2, description: 'Do 20 pushups in one set', completed: true },
      { id: 3, description: 'Meal prep for the whole week', completed: false },
    ],
  });

  const [progress, setProgress] = useState({
    currentWeight: weeklyGoals.currentWeight,
    completedWorkouts: weeklyGoals.completedWorkouts,
  });

  const toggleGoalCompletion = (goalId) => {
    // TODO: Update goal completion status in backend
    console.log('Toggling goal completion:', goalId);
  };

  const updateProgress = (e) => {
    e.preventDefault();
    // TODO: Save progress update
    console.log('Updated progress:', progress);
  };

  const calculateProgress = (current, target) => {
    return Math.min(Math.round((current / target) * 100), 100);
  };

  return (
    <div className="goals-container">
      <h2>Weekly Goals Progress</h2>
      <div className="week-info">
        <p>Week Starting: {new Date(weeklyGoals.startDate).toLocaleDateString()}</p>
      </div>

      <div className="progress-grid">
        <div className="progress-card">
          <h3>Weight Goal</h3>
          <div className="progress-info">
            <span>Target: {weeklyGoals.weightGoal} kg</span>
            <span>Current: {progress.currentWeight} kg</span>
          </div>
          <div className="progress-bar">
            <div 
              className="progress-fill"
              style={{ 
                width: `${100 - calculateProgress(
                  Math.abs(weeklyGoals.weightGoal - progress.currentWeight),
                  Math.abs(weeklyGoals.weightGoal - weeklyGoals.currentWeight)
                )}%` 
              }}
            ></div>
          </div>
        </div>

        <div className="progress-card">
          <h3>Workout Sessions</h3>
          <div className="progress-info">
            <span>Target: {weeklyGoals.workoutFrequency}</span>
            <span>Completed: {progress.completedWorkouts}</span>
          </div>
          <div className="progress-bar">
            <div 
              className="progress-fill"
              style={{ 
                width: `${calculateProgress(progress.completedWorkouts, weeklyGoals.workoutFrequency)}%` 
              }}
            ></div>
          </div>
        </div>

        <div className="progress-card">
          <h3>Calorie Target</h3>
          <div className="progress-info">
            <span>Target: {weeklyGoals.calorieTarget}</span>
            <span>Average: {weeklyGoals.averageCalories}</span>
          </div>
          <div className="progress-bar">
            <div 
              className="progress-fill"
              style={{ 
                width: `${100 - calculateProgress(
                  Math.abs(weeklyGoals.calorieTarget - weeklyGoals.averageCalories),
                  weeklyGoals.calorieTarget * 0.2
                )}%` 
              }}
            ></div>
          </div>
        </div>
      </div>

      <div className="specific-goals-progress">
        <h3>Specific Goals</h3>
        {weeklyGoals.specificGoals.map((goal) => (
          <div key={goal.id} className="specific-goal-item">
            <label className="checkbox-label">
              <input
                type="checkbox"
                checked={goal.completed}
                onChange={() => toggleGoalCompletion(goal.id)}
              />
              <span className="checkbox-custom"></span>
              <span className="goal-text">{goal.description}</span>
            </label>
          </div>
        ))}
      </div>

      <form onSubmit={updateProgress} className="update-progress-form">
        <h3>Update Progress</h3>
        <div className="form-row">
          <div className="form-group">
            <label>Current Weight (kg)</label>
            <input
              type="number"
              step="0.1"
              value={progress.currentWeight}
              onChange={(e) => setProgress({ ...progress, currentWeight: e.target.value })}
            />
          </div>
          <div className="form-group">
            <label>Completed Workouts</label>
            <input
              type="number"
              min="0"
              max="7"
              value={progress.completedWorkouts}
              onChange={(e) => setProgress({ ...progress, completedWorkouts: e.target.value })}
            />
          </div>
        </div>
        <button type="submit" className="update-progress-btn">Update Progress</button>
      </form>
    </div>
  );
};

export default GoalTracking;
