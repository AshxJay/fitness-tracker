import React, { useState } from 'react';
import './Exercises.css';

const ExerciseLibrary = () => {
  const [selectedMuscleGroup, setSelectedMuscleGroup] = useState('all');

  // Mock data - replace with actual data from your backend
  const muscleGroups = [
    { id: 'chest', name: 'Chest' },
    { id: 'back', name: 'Back' },
    { id: 'shoulders', name: 'Shoulders' },
    { id: 'legs', name: 'Legs' },
    { id: 'arms', name: 'Arms' },
    { id: 'core', name: 'Core' },
  ];

  const exercises = {
    chest: [
      {
        id: 1,
        name: 'Push-Ups',
        description: 'Basic but effective chest exercise',
        difficulty: 'Beginner',
        videoUrl: 'https://www.youtube.com/embed/IODxDxX7oi4',
        muscleGroup: 'chest',
        tips: ['Keep your core tight', 'Maintain straight body alignment', 'Lower chest to ground']
      },
      {
        id: 2,
        name: 'Bench Press',
        description: 'Classic chest building exercise',
        difficulty: 'Intermediate',
        videoUrl: 'https://www.youtube.com/embed/rT7DgCr-3pg',
        muscleGroup: 'chest',
        tips: ['Keep shoulders back', 'Feet flat on ground', 'Control the movement']
      }
    ],
    back: [
      {
        id: 3,
        name: 'Pull-Ups',
        description: 'Upper body strength builder',
        difficulty: 'Intermediate',
        videoUrl: 'https://www.youtube.com/embed/eGo4IYlbE5g',
        muscleGroup: 'back',
        tips: ['Engage your lats', 'Keep core tight', 'Full range of motion']
      }
    ],
    shoulders: [
      {
        id: 4,
        name: 'Overhead Press',
        description: 'Shoulder strength and stability',
        difficulty: 'Intermediate',
        videoUrl: 'https://www.youtube.com/embed/2yjwXTZQDDI',
        muscleGroup: 'shoulders',
        tips: ['Maintain straight back', 'Engage core', 'Full lockout at top']
      }
    ],
    legs: [
      {
        id: 5,
        name: 'Squats',
        description: 'Fundamental leg exercise',
        difficulty: 'Beginner',
        videoUrl: 'https://www.youtube.com/embed/ultWZbUMPL8',
        muscleGroup: 'legs',
        tips: ['Keep chest up', 'Knees in line with toes', 'Hip hinge movement']
      }
    ],
    arms: [
      {
        id: 6,
        name: 'Bicep Curls',
        description: 'Isolation exercise for biceps',
        difficulty: 'Beginner',
        videoUrl: 'https://www.youtube.com/embed/ykJmrZ5v0Oo',
        muscleGroup: 'arms',
        tips: ['Keep elbows still', 'Control the movement', 'Full range of motion']
      }
    ],
    core: [
      {
        id: 7,
        name: 'Plank',
        description: 'Core stability exercise',
        difficulty: 'Beginner',
        videoUrl: 'https://www.youtube.com/embed/ASdvN_XEl_c',
        muscleGroup: 'core',
        tips: ['Keep body straight', 'Engage core', 'Breathe steadily']
      }
    ]
  };

  const filteredExercises = selectedMuscleGroup === 'all' 
    ? Object.values(exercises).flat()
    : exercises[selectedMuscleGroup] || [];

  return (
    <div className="exercise-library">
      <h2>Exercise Library</h2>
      <div className="muscle-group-filter">
        <button 
          className={`filter-btn ${selectedMuscleGroup === 'all' ? 'active' : ''}`}
          onClick={() => setSelectedMuscleGroup('all')}
        >
          All
        </button>
        {muscleGroups.map((group) => (
          <button
            key={group.id}
            className={`filter-btn ${selectedMuscleGroup === group.id ? 'active' : ''}`}
            onClick={() => setSelectedMuscleGroup(group.id)}
          >
            {group.name}
          </button>
        ))}
      </div>

      <div className="exercise-grid">
        {filteredExercises.map((exercise) => (
          <div key={exercise.id} className="exercise-card">
            <h3>{exercise.name}</h3>
            <div className="video-container">
              <iframe
                src={exercise.videoUrl}
                title={exercise.name}
                frameBorder="0"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              ></iframe>
            </div>
            <div className="exercise-info">
              <p className="description">{exercise.description}</p>
              <span className={`difficulty ${exercise.difficulty.toLowerCase()}`}>
                {exercise.difficulty}
              </span>
              <div className="tips">
                <h4>Tips:</h4>
                <ul>
                  {exercise.tips.map((tip, index) => (
                    <li key={index}>{tip}</li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ExerciseLibrary;
