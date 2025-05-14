import React, { useState, useEffect } from 'react';
import { Grid, Card, CardContent, Typography, Button, Box, FormControl, InputLabel, Select, MenuItem, TextField } from '@mui/material';
import TimerIcon from '@mui/icons-material/Timer';
import FitnessCenterIcon from '@mui/icons-material/FitnessCenter';
import LocalFireDepartmentIcon from '@mui/icons-material/LocalFireDepartment';

const WorkoutTracker = () => {
  const [timer, setTimer] = useState({ time: 0, isRunning: false, interval: null });
  const [selectedWorkout, setSelectedWorkout] = useState('');
  const [weight, setWeight] = useState(70); // Default weight in kg
  const [caloriesBurned, setCaloriesBurned] = useState(0);

  const workoutOptions = {
    // Cardio exercises
    'Running (moderate)': 8.0,
    'Running (vigorous)': 11.5,
    'Cycling (moderate)': 6.0,
    'Cycling (vigorous)': 10.0,
    'Swimming (moderate)': 6.0,
    'Swimming (vigorous)': 10.0,
    'Jump Rope': 12.0,
    'Walking': 3.5,
    'Elliptical': 7.0,
    'Rowing Machine': 7.0,
    'Stair Climbing': 8.0,
    
    // Strength Training
    'Weight Lifting (general)': 5.0,
    'Bodyweight Exercises': 4.0,
    'CrossFit': 9.0,
    'Circuit Training': 8.0,
    'Powerlifting': 6.0,
    
    // Sports
    'Basketball': 8.0,
    'Tennis': 7.0,
    'Soccer': 9.0,
    'Volleyball': 4.0,
    'Boxing': 9.0,
    
    // Flexibility & Mind-Body
    'Yoga': 3.0,
    'Pilates': 3.5,
    'Stretching': 2.5,
    
    // Other Activities
    'HIIT': 10.0,
    'Dancing': 6.0,
    'Martial Arts': 8.0,
    'Rock Climbing': 7.0
  };

  useEffect(() => {
    if (timer.isRunning && selectedWorkout) {
      const MET = workoutOptions[selectedWorkout];
      // Calorie calculation formula: Calories = MET × Weight (kg) × Time (hours)
      const hours = timer.time / 3600; // Convert seconds to hours
      const calories = MET * weight * hours;
      setCaloriesBurned(Math.round(calories * 100) / 100);
    }
  }, [timer.time, selectedWorkout, weight]);

  const startTimer = () => {
    if (!timer.isRunning) {
      const newInterval = setInterval(() => {
        setTimer((prev) => ({ ...prev, time: prev.time + 1 }));
      }, 1000);
      setTimer((prev) => ({ ...prev, isRunning: true, interval: newInterval }));
    }
  };

  const stopTimer = () => {
    if (timer.interval) {
      clearInterval(timer.interval);
      setTimer((prev) => ({ ...prev, isRunning: false, interval: null }));
    }
  };

  const resetTimer = () => {
    if (timer.interval) {
      clearInterval(timer.interval);
    }
    setTimer({ time: 0, isRunning: false, interval: null });
  };

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60).toString().padStart(2, '0');
    const secs = (seconds % 60).toString().padStart(2, '0');
    return `${mins}:${secs}`;
  };

  return (
    <Grid container justifyContent="center" sx={{ minHeight: '100vh', padding: 3, backgroundColor: '#121212', width:"73vw" }}>
      <Grid item xs={12} md={8}>
        <Card sx={{
          background: 'linear-gradient(135deg, #1a1a1a 0%, rgba(26, 26, 26, 0.9) 100%)',
          border: '1px solid rgba(255, 255, 255, 0.1)',
          padding: 4,
        }}>
          <CardContent>
            <Grid container spacing={4}>
              {/* Workout Selection */}
              <Grid item xs={12}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 3 }}>
                  <FitnessCenterIcon sx={{ color: '#FF4B2B', fontSize: 40 }} />
                  <Typography variant="h4" sx={{ color: '#fff', fontWeight: 'bold' }}>
                    Workout Tracker
                  </Typography>
                </Box>
                <FormControl fullWidth sx={{ mb: 3 }}>
                  <InputLabel sx={{ color: '#fff' }}>Select Workout</InputLabel>
                  <Select
                    value={selectedWorkout}
                    onChange={(e) => setSelectedWorkout(e.target.value)}
                    sx={{ color: '#fff', '& .MuiOutlinedInput-notchedOutline': { borderColor: 'rgba(255, 255, 255, 0.23)' } }}
                  >
                    {Object.keys(workoutOptions).map((workout) => (
                      <MenuItem key={workout} value={workout}>{workout}</MenuItem>
                    ))}
                  </Select>
                </FormControl>
                <TextField
                  type="number"
                  label="Your Weight (kg)"
                  value={weight}
                  onChange={(e) => setWeight(Math.max(0, parseFloat(e.target.value) || 0))}
                  fullWidth
                  sx={{
                    mb: 3,
                    '& label': { color: '#fff' },
                    '& input': { color: '#fff' },
                    '& .MuiOutlinedInput-notchedOutline': { borderColor: 'rgba(255, 255, 255, 0.23)' }
                  }}
                />
              </Grid>

              {/* Timer */}
              <Grid item xs={12} md={6}>
                <Card sx={{ background: 'rgba(255, 255, 255, 0.05)', p: 3 }}>
                  <Box sx={{ textAlign: 'center' }}>
                    <TimerIcon sx={{ fontSize: 40, color: '#FF4B2B', mb: 1 }} />
                    <Typography variant="h6" sx={{ color: '#fff', mb: 2 }}>
                      Workout Timer
                    </Typography>
                    <Typography variant="h2" sx={{ fontFamily: 'monospace', color: '#fff', mb: 2 }}>
                      {formatTime(timer.time)}
                    </Typography>
                    <Box sx={{ display: 'flex', gap: 2, justifyContent: 'center' }}>
                      {!timer.isRunning ? (
                        <Button
                          variant="contained"
                          color="success"
                          onClick={startTimer}
                          disabled={!selectedWorkout}
                        >
                          Start
                        </Button>
                      ) : (
                        <Button
                          variant="contained"
                          color="error"
                          onClick={stopTimer}
                          disabled={!selectedWorkout}
                        >
                          Stop
                        </Button>
                      )}
                      <Button
                        variant="outlined"
                        onClick={resetTimer}
                        sx={{ color: '#fff', borderColor: '#fff' }}
                      >
                        Reset
                      </Button>
                    </Box>
                  </Box>
                </Card>
              </Grid>

              {/* Calories */}
              <Grid item xs={12} md={6}>
                <Card sx={{ background: 'rgba(255, 255, 255, 0.05)', p: 3 }}>
                  <Box sx={{ textAlign: 'center' }}>
                    <LocalFireDepartmentIcon sx={{ fontSize: 40, color: '#FF4B2B', mb: 1 }} />
                    <Typography variant="h6" sx={{ color: '#fff', mb: 2 }}>
                      Calories Burned
                    </Typography>
                    <Typography variant="h2" sx={{ fontFamily: 'monospace', color: '#fff', mb: 2 }}>
                      {caloriesBurned.toFixed(1)}
                    </Typography>
                    <Typography variant="body1" sx={{ color: '#aaa' }}>
                      {selectedWorkout && `MET Value: ${workoutOptions[selectedWorkout]}`}
                    </Typography>
                  </Box>
                </Card>
              </Grid>
            </Grid>
          </CardContent>
        </Card>
      </Grid>
    </Grid>
  );
};

export default WorkoutTracker;
