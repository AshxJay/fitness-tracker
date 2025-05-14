import React, { useState, useEffect } from 'react';
import './Tracking.css';

const exerciseDatabase = [
  { name: 'Bench Press', category: 'Chest', caloriesPerMinute: 7 },
  { name: 'Squats', category: 'Legs', caloriesPerMinute: 8 },
  { name: 'Deadlift', category: 'Back', caloriesPerMinute: 9 },
  { name: 'Pull-ups', category: 'Back', caloriesPerMinute: 6 },
  { name: 'Push-ups', category: 'Chest', caloriesPerMinute: 5 },
];

export default function FitnessTracking() {
  const [workouts, setWorkouts] = useState([]);
  const [selectedExercise, setSelectedExercise] = useState('');
  const [sets, setSets] = useState(3);
  const [reps, setReps] = useState(12);
  const [weight, setWeight] = useState(0);
  const [timer, setTimer] = useState(0);
  const [isTimerRunning, setIsTimerRunning] = useState(false);

  useEffect(() => {
    let interval;
    if (isTimerRunning) {
      interval = setInterval(() => {
        setTimer(timer => timer + 1);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [isTimerRunning]);

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const handleAddWorkout = (e) => {
    e.preventDefault();
    
    if (!selectedExercise || sets <= 0 || reps <= 0) {
      alert('Please fill in all required fields');
      return;
    }

    const exercise = exerciseDatabase.find(ex => ex.name === selectedExercise);
    const newWorkout = {
      id: Date.now(),
      exercise: selectedExercise,
      sets,
      reps,
      weight,
      category: exercise.category,
      time: new Date().toLocaleTimeString(),
      caloriesBurned: Math.round(exercise.caloriesPerMinute * (sets * reps * 0.1)),
    };

    setWorkouts([...workouts, newWorkout]);
    setSelectedExercise('');
    setSets(3);
    setReps(12);
    setWeight(0);
  };

  const handleDeleteWorkout = (workoutId) => {
    setWorkouts(workouts.filter((workout) => workout.id !== workoutId));
  };

  const totalCaloriesBurned = workouts.reduce(
    (sum, workout) => sum + workout.caloriesBurned,
    0
  );

  return (
    <div className="tracking-container">
      <h2>Workout Tracking</h2>

      <div className="timer-section">
        <div className="timer-display">
          <h3>Workout Timer</h3>
          <p className="timer-value">{formatTime(timer)}</p>
          <div className="timer-controls">
            <button
              onClick={() => setIsTimerRunning(!isTimerRunning)}
              className={`timer-button ${isTimerRunning ? 'pause' : 'start'}`}
            >
              {isTimerRunning ? 'Pause' : 'Start'}
            </button>
            <button
              onClick={() => {
                setTimer(0);
                setIsTimerRunning(false);
              }}
              className="timer-button reset"
            >
              Reset
            </button>
          </div>
        </div>

        <div className="workout-stats">
          <div className="stat-box">
            <h4>Exercises Done</h4>
            <p>{workouts.length}</p>
          </div>
          <div className="stat-box">
            <h4>Calories Burned</h4>
            <p>{totalCaloriesBurned}</p>
          </div>
        </div>
      </div>

      <form onSubmit={handleAddWorkout} className="add-workout-form">
        <div className="form-group">
          <label>Exercise</label>
          <select
            value={selectedExercise}
            onChange={(e) => setSelectedExercise(e.target.value)}
            required
          >
            <option value="">Select exercise</option>
            {exerciseDatabase.map((exercise) => (
              <option key={exercise.name} value={exercise.name}>
                {exercise.name} ({exercise.category})
              </option>
            ))}
          </select>
        </div>

        <div className="form-row">
          <div className="form-group">
            <label>Sets</label>
            <input
              type="number"
              min="1"
              value={sets}
              onChange={(e) => setSets(parseInt(e.target.value) || 0)}
              required
            />
          </div>

          <div className="form-group">
            <label>Reps</label>
            <input
              type="number"
              min="1"
              value={reps}
              onChange={(e) => setReps(parseInt(e.target.value) || 0)}
              required
            />
          </div>

          <div className="form-group">
            <label>Weight (kg)</label>
            <input
              type="number"
              min="0"
              step="0.5"
              value={weight}
              onChange={(e) => setWeight(parseFloat(e.target.value) || 0)}
            />
          </div>
        </div>

        <button type="submit" className="add-button">Add Exercise</button>
      </form>

      <div className="workouts-list">
        <h3>Today's Workouts</h3>
        {workouts.map((workout) => (
          <div key={workout.id} className="workout-item">
            <div className="workout-info">
              <h4>{workout.exercise}</h4>
              <p>
                {workout.time} · {workout.sets} sets × {workout.reps} reps
                {workout.weight > 0 ? ` @ ${workout.weight}kg` : ''} ·
                {workout.caloriesBurned} cal
              </p>
            </div>
            <button 
              onClick={() => handleDeleteWorkout(workout.id)}
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
