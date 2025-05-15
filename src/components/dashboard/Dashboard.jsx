import { useState, useEffect } from 'react';
import {
  Box,
  Grid,
  Card,
  CardContent,
  Typography,
  LinearProgress,
  Button,
  IconButton,
  Divider,
} from '@mui/material';
import {
  PlayArrow,
  Pause,
  Stop,
  FitnessCenter,
  LocalDining,
  DirectionsRun,
  WaterDrop,
  RestartAlt,
} from '@mui/icons-material';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler,
} from 'chart.js';
import { Line } from 'react-chartjs-2';
import useStore from '../../store/useStore';
import useMealStore from '../../store/mealStore';

// Register ChartJS components
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler
);

// Chart.js defaults
ChartJS.defaults.color = '#fff';
ChartJS.defaults.borderColor = 'rgba(255, 255, 255, 0.1)';
ChartJS.defaults.font.family = '"Roboto", "Helvetica", "Arial", sans-serif';

export default function Dashboard() {
  const user = useStore((state) => state.user);
  const [workoutTimer, setWorkoutTimer] = useState({
    isRunning: false,
    time: 0,
    interval: null,
  });

  const { meals, getMealsForRange } = useMealStore();

  const generateWeeklyData = () => {
    const days = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
    const today = new Date();
    const startOfWeek = new Date(today);
    startOfWeek.setDate(today.getDate() - today.getDay() + 1); // Monday
    
    // Calculate daily calories from meals
    const dailyCalories = meals.reduce((acc, meal) => {
      const mealDate = new Date(meal.date);
      const dateStr = mealDate.toISOString().split('T')[0];
      if (!acc[dateStr]) {
        acc[dateStr] = {
          calories: 0,
          protein: 0,
          carbs: 0,
          fat: 0
        };
      }
      acc[dateStr].calories += meal.calories || 0;
      acc[dateStr].protein += meal.protein || 0;
      acc[dateStr].carbs += meal.carbs || 0;
      acc[dateStr].fat += meal.fat || 0;
      return acc;
    }, {});

    const calorieGoal = user?.profile?.goals?.calorieGoal || 2000;

    return {
      labels: days,
      datasets: [
        {
          label: 'Calories Consumed',
          data: days.map((_, index) => {
            const date = new Date(startOfWeek);
            date.setDate(startOfWeek.getDate() + index);
            const dateStr = date.toISOString().split('T')[0];
            return dailyCalories[dateStr]?.calories || 0;
          }),
          borderColor: '#FF4B2B',
          backgroundColor: 'rgba(255, 75, 43, 0.1)',
          tension: 0.4,
          fill: true,
          pointBackgroundColor: '#FF4B2B',
          pointBorderColor: '#fff',
          pointHoverBackgroundColor: '#fff',
          pointHoverBorderColor: '#FF4B2B',
          pointRadius: 4,
          pointHoverRadius: 6,
        },
        {
          label: 'Target Calories',
          data: Array(7).fill(calorieGoal),
          borderColor: '#2ecc71',
          borderDash: [5, 5],
          tension: 0.4,
          fill: false,
          pointStyle: 'dash',
          pointRadius: 0,
        },
      ],
    };
  };

  const [caloriesData, setCaloriesData] = useState(generateWeeklyData());
  // Calculate daily stats from meals
  const calculateDailyStats = () => {
    const todayMeals = meals.filter(meal => {
      const mealDate = new Date(meal.date);
      const today = new Date();
      return mealDate.toISOString().split('T')[0] === today.toISOString().split('T')[0];
    });

    const totalCalories = todayMeals.reduce((sum, meal) => sum + meal.calories, 0);
    const totalProtein = todayMeals.reduce((sum, meal) => sum + (meal.protein || 0), 0);
    const totalCarbs = todayMeals.reduce((sum, meal) => sum + (meal.carbs || 0), 0);
    const totalFats = todayMeals.reduce((sum, meal) => sum + (meal.fat || 0), 0);

    return {
      calories: {
        current: totalCalories,
        target: user?.profile?.goals?.calorieGoal || 2000,
      },
      macros: {
        protein: totalProtein,
        carbs: totalCarbs,
        fats: totalFats,
      },
      water: {
        current: 2.5,
        target: 3.0,
      },
    };
  };

  const [dailyStats, setDailyStats] = useState({
    calories: {
      current: 0,
      target: user?.profile?.goals?.calorieGoal || 2000,
    },
    macros: {
      protein: 0,
      carbs: 0,
      fats: 0,
    },
    water: {
      current: 0,
      target: user?.profile?.goals?.waterIntake || 3.0,
    },
  });

  useEffect(() => {
    if (meals.length > 0) {
      const stats = calculateDailyStats();
      setDailyStats(stats);
      setCaloriesData(generateWeeklyData());
    }
  }, [meals, user?.profile]);

  useEffect(() => {
    // Fetch meals for the current week and update stats
    const today = new Date();
    const startOfWeek = new Date(today);
    startOfWeek.setDate(today.getDate() - today.getDay() + 1); // Monday
    startOfWeek.setHours(0, 0, 0, 0);

    const endOfWeek = new Date(startOfWeek);
    endOfWeek.setDate(startOfWeek.getDate() + 6);
    endOfWeek.setHours(23, 59, 59, 999);

    getMealsForRange(startOfWeek, endOfWeek);

    // Update chart data periodically
    const interval = setInterval(() => {
      getMealsForRange(startOfWeek, endOfWeek);
    }, 60000); // Update every minute

    return () => clearInterval(interval);
  }, [getMealsForRange]);

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    scales: {
      y: {
        beginAtZero: true,
        grid: {
          color: 'rgba(255, 255, 255, 0.1)',
        },
        ticks: {
          callback: (value) => `${value} cal`,
        },
      },
      x: {
        grid: {
          color: 'rgba(255, 255, 255, 0.1)',
        },
      },
    },
    plugins: {
      legend: {
        position: 'top',
      },
      title: {
        display: false,
      },
      tooltip: {
        mode: 'index',
        intersect: false,
        backgroundColor: 'rgba(26, 26, 26, 0.9)',
        titleColor: '#fff',
        bodyColor: '#fff',
        borderColor: 'rgba(255, 255, 255, 0.1)',
        borderWidth: 1,
        padding: 12,
        callbacks: {
          label: (context) => {
            const label = context.dataset.label || '';
            const value = context.parsed.y;
            return `${label}: ${value} calories`;
          },
        },
        bodyFont: {
          size: 12,
        },
        titleFont: {
          size: 14,
          weight: 'bold',
        },
        callbacks: {
          label: function(context) {
            return `${context.dataset.label}: ${context.parsed.y} kcal`;
          },
        },
      },
    },
    scales: {
      y: {
        beginAtZero: true,
        grid: {
          color: 'rgba(255, 255, 255, 0.1)',
          drawBorder: false,
        },
        ticks: {
          color: '#fff',
          font: {
            size: 12,
          },
          padding: 8,
          callback: function(value) {
            return value + ' kcal';
          },
        },
        border: {
          display: false,
        },
      },
      x: {
        grid: {
          color: 'rgba(255, 255, 255, 0.1)',
          drawBorder: false,
          display: false,
        },
        ticks: {
          color: '#fff',
          font: {
            size: 12,
          },
          padding: 8,
        },
        border: {
          display: false,
        },
      },
    },
    interaction: {
      mode: 'nearest',
      axis: 'x',
      intersect: false,
    },
    elements: {
      line: {
        borderWidth: 2,
      },
      point: {
        hitRadius: 8,
      },
    },
  };

  const startTimer = () => {
    if (!workoutTimer.isRunning) {
      const interval = setInterval(() => {
        setWorkoutTimer((prev) => ({
          ...prev,
          time: prev.time + 1,
        }));
      }, 1000);
      setWorkoutTimer((prev) => ({
        ...prev,
        isRunning: true,
        interval,
      }));
    }
  };

  const pauseTimer = () => {
    if (workoutTimer.interval) {
      clearInterval(workoutTimer.interval);
      setWorkoutTimer((prev) => ({
        ...prev,
        isRunning: false,
        interval: null,
      }));
    }
  };

  const stopTimer = () => {
    if (workoutTimer.interval) {
      clearInterval(workoutTimer.interval);
    }
    setWorkoutTimer({
      isRunning: false,
      time: 0,
      interval: null,
    });
  };

  const resetTimer = () => {
    if (workoutTimer.interval) {
      clearInterval(workoutTimer.interval);
    }
    setWorkoutTimer({
      isRunning: false,
      time: 0,
      interval: null,
    });
  };

  const formatTime = (seconds) => {
    const hrs = Math.floor(seconds / 3600);
    const mins = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    return `${hrs.toString().padStart(2, '0')}:${mins
      .toString()
      .padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h4" sx={{ mb: 4, fontWeight: 'bold', color: '#fff' }}>
        Welcome, {user?.name ? user.name.charAt(0).toUpperCase() + user.name.slice(1) : 'User'}! 👋
      </Typography>

      <Grid container spacing={3} justifyContent="center">
        {/* Workout Timer Card */}
        <Grid item xs={12} md={6}>
          <Card
            sx={{
              height: '100%',
              background: 'linear-gradient(135deg, #1a1a1a 0%, rgba(26, 26, 26, 0.9) 100%)',
              backdropFilter: 'blur(10px)',
              border: '1px solid rgba(255, 255, 255, 0.1)',
              boxShadow: '0 8px 32px 0 rgba(0, 0, 0, 0.37)',
            }}
          >
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                <FitnessCenter sx={{ mr: 1, color: '#FF4B2B' }} />
                <Typography variant="h6" sx={{ color: '#fff' }}>Workout Timer</Typography>
              </Box>
              <Box
                sx={{
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  p: 3,
                }}
              >
                <Typography variant="h2" sx={{ mb: 3, fontFamily: 'monospace', color: '#fff' }}>
                  {formatTime(workoutTimer.time)}
                </Typography>
                <Box sx={{ display: 'flex', gap: 2 }}>
                  {!workoutTimer.isRunning ? (
                    <Button
                      variant="contained"
                      startIcon={<PlayArrow />}
                      onClick={startTimer}
                      sx={{
                        background: 'linear-gradient(45deg, #FF4B2B, #FF416C)',
                        '&:hover': {
                          background: 'linear-gradient(45deg, #FF416C, #FF4B2B)',
                          transform: 'translateY(-2px)',
                        },
                        transition: 'transform 0.2s',
                      }}
                    >
                      Start
                    </Button>
                  ) : (
                    <Button
                      variant="contained"
                      startIcon={<Pause />}
                      onClick={pauseTimer}
                      sx={{
                        bgcolor: '#f39c12',
                        '&:hover': {
                          bgcolor: '#e67e22',
                          transform: 'translateY(-2px)',
                        },
                        transition: 'transform 0.2s',
                      }}
                    >
                      Pause
                    </Button>
                  )}
                  <Button
                    variant="contained"
                    startIcon={<Stop />}
                    onClick={stopTimer}
                    sx={{
                      bgcolor: '#e74c3c',
                      '&:hover': {
                        bgcolor: '#c0392b',
                        transform: 'translateY(-2px)',
                      },
                      transition: 'transform 0.2s',
                    }}
                  >
                    Stop
                  </Button>
                  <Button
                    variant="contained"
                    startIcon={<RestartAlt />}
                    onClick={resetTimer}
                    sx={{
                      bgcolor: '#3498db',
                      '&:hover': {
                        bgcolor: '#2980b9',
                        transform: 'translateY(-2px)',
                      },
                      transition: 'transform 0.2s',
                    }}
                  >
                    Reset
                  </Button>
                </Box>
              </Box>
            </CardContent>
          </Card>
        </Grid>

        {/* Daily Nutrition Card */}
        <Grid item xs={12} md={6}>
          <Card
            sx={{
              height: '100%',
              background: 'linear-gradient(135deg, #1a1a1a 0%, rgba(26, 26, 26, 0.9) 100%)',
              backdropFilter: 'blur(10px)',
              border: '1px solid rgba(255, 255, 255, 0.1)',
              boxShadow: '0 8px 32px rgba(0, 0, 0, 0.37)',
            }}
          >
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
                <LocalDining sx={{ mr: 1, color: '#FF4B2B' }} />
                <Typography variant="h6" sx={{ color: '#fff' }}>Daily Nutrition</Typography>
              </Box>
              
              <Grid container spacing={2}>
                {/* Calories Progress */}
                <Grid item xs={12}>
                  <Box sx={{ mb: 2 }}>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                      <Typography variant="body2" sx={{ color: 'rgba(255, 255, 255, 0.7)' }}>
                        Calories
                      </Typography>
                      <Typography variant="body2" sx={{ color: 'rgba(255, 255, 255, 0.7)' }}>
                        {dailyStats.calories.current} / {dailyStats.calories.target} kcal
                      </Typography>
                    </Box>
                    <LinearProgress
                      variant="determinate"
                      value={(dailyStats.calories.current / dailyStats.calories.target) * 100}
                      sx={{
                        height: 10,
                        borderRadius: 5,
                        backgroundColor: 'rgba(255, 75, 43, 0.1)',
                        '& .MuiLinearProgress-bar': {
                          background: 'linear-gradient(45deg, #FF4B2B, #FF416C)',
                          borderRadius: 5,
                        },
                      }}
                    />
                  </Box>
                </Grid>

                {/* Macronutrients */}
                <Grid item xs={4}>
                  <Box
                    sx={{
                      p: 2,
                      textAlign: 'center',
                      bgcolor: 'rgba(255, 75, 43, 0.1)',
                      borderRadius: 2,
                      transition: 'transform 0.2s',
                      '&:hover': {
                        transform: 'translateY(-2px)',
                      },
                    }}
                  >
                    <Typography variant="h6" sx={{ color: '#FF4B2B' }}>
                      {dailyStats.macros.protein}g
                    </Typography>
                    <Typography variant="body2" sx={{ color: 'rgba(255, 255, 255, 0.7)' }}>
                      Protein
                    </Typography>
                  </Box>
                </Grid>
                <Grid item xs={4}>
                  <Box
                    sx={{
                      p: 2,
                      textAlign: 'center',
                      bgcolor: 'rgba(46, 204, 113, 0.1)',
                      borderRadius: 2,
                      transition: 'transform 0.2s',
                      '&:hover': {
                        transform: 'translateY(-2px)',
                      },
                    }}
                  >
                    <Typography variant="h6" sx={{ color: '#2ecc71' }}>
                      {dailyStats.macros.carbs}g
                    </Typography>
                    <Typography variant="body2" sx={{ color: 'rgba(255, 255, 255, 0.7)' }}>
                      Carbs
                    </Typography>
                  </Box>
                </Grid>
                <Grid item xs={4}>
                  <Box
                    sx={{
                      p: 2,
                      textAlign: 'center',
                      bgcolor: 'rgba(52, 152, 219, 0.1)',
                      borderRadius: 2,
                      transition: 'transform 0.2s',
                      '&:hover': {
                        transform: 'translateY(-2px)',
                      },
                    }}
                  >
                    <Typography variant="h6" sx={{ color: '#3498db' }}>
                      {dailyStats.macros.fats}g
                    </Typography>
                    <Typography variant="body2" sx={{ color: 'rgba(255, 255, 255, 0.7)' }}>
                      Fats
                    </Typography>
                  </Box>
                </Grid>

                {/* Water Intake */}
                <Grid item xs={12}>
                  <Box sx={{ mt: 2 }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                      <WaterDrop sx={{ mr: 1, color: '#3498db' }} />
                      <Typography variant="body2" sx={{ color: 'rgba(255, 255, 255, 0.7)' }}>
                        Water Intake
                      </Typography>
                      <Typography
                        variant="body2"
                        sx={{ ml: 'auto', color: 'rgba(255, 255, 255, 0.7)' }}
                      >
                        {dailyStats.water.current} / {dailyStats.water.target} L
                      </Typography>
                    </Box>
                    <LinearProgress
                      variant="determinate"
                      value={(dailyStats.water.current / dailyStats.water.target) * 100}
                      sx={{
                        height: 10,
                        borderRadius: 5,
                        backgroundColor: 'rgba(52, 152, 219, 0.1)',
                        '& .MuiLinearProgress-bar': {
                          backgroundColor: '#3498db',
                          borderRadius: 5,
                        },
                      }}
                    />
                  </Box>
                </Grid>
              </Grid>
            </CardContent>
          </Card>
        </Grid>

        {/* Activity Chart */}
        <Grid item xs={12} md={10} sx={{ mx: 'auto' }}>
          <Card
            sx={{
              background: 'linear-gradient(135deg, #1a1a1a 0%, rgba(26, 26, 26, 0.9) 100%)',
              backdropFilter: 'blur(10px)',
              border: '1px solid rgba(255, 255, 255, 0.1)',
              boxShadow: '0 8px 32px rgba(0, 0, 0, 0.37)',
            }}
          >
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
                <DirectionsRun sx={{ mr: 1, color: '#FF4B2B' }} />
                <Typography variant="h6" sx={{ color: '#fff' }}>Weekly Activity</Typography>
              </Box>
              <Box sx={{ height: 300, p: 1 }}>
                <Line data={caloriesData} options={chartOptions} />
              </Box>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Box>
  );
}
