import { useState, useMemo, useEffect } from 'react';
import useStore from '../../store/useStore';
import {
  Box,
  Grid,
  Card,
  CardContent,
  Typography,
  Button,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  IconButton,
  LinearProgress,
  Divider,
  Avatar,
  Tab,
  Tabs,
  Tooltip,
  CircularProgress,
} from '@mui/material';
import {
  Add as AddIcon,
  Delete as DeleteIcon,
  Restaurant,
  LocalDining,
  TrendingUp,
  AccessTime,
  Info as InfoIcon,
  CalendarToday,
  FilterList,
} from '@mui/icons-material';
import { toast } from 'react-toastify';

const mealTypes = [
  { type: 'Breakfast', icon: '🍳', time: '6:00 AM - 10:00 AM' },
  { type: 'Lunch', icon: '🍱', time: '12:00 PM - 2:00 PM' },
  { type: 'Dinner', icon: '🍽️', time: '6:00 PM - 9:00 PM' },
  { type: 'Snack', icon: '🥨', time: 'Any time' },
];

const getInitialNutrition = (userProfile) => ({
  calories: { current: 0, target: userProfile?.goals?.calorieGoal || 2000 },
  protein: { current: 0, target: userProfile?.goals?.protein || 150 },
  carbs: { current: 0, target: userProfile?.goals?.carbs || 250 },
  fat: { current: 0, target: userProfile?.goals?.fat || 70 },
});

const updateNutrition = (meal, action) => {
  const multiplier = action === 'add' ? 1 : -1;
  setNutrition((prev) => ({
    calories: {
      ...prev.calories,
      current: prev.calories.current + multiplier * Number(meal.calories),
    },
    protein: {
      ...prev.protein,
      current: prev.protein.current + multiplier * Number(meal.protein || 0),
    },
    carbs: {
      ...prev.carbs,
      current: prev.carbs.current + multiplier * Number(meal.carbs || 0),
    },
    fat: {
      ...prev.fat,
      current: prev.fat.current + multiplier * Number(meal.fat || 0),
    },
  }));
};

const handleDeleteMeal = (meal) => {
  setMeals(meals.filter((m) => m.id !== meal.id));
  updateNutrition(meal, 'remove');
  toast.success('Meal deleted successfully!');
};

export default function NutritionLog() {
  const user = useStore((state) => state.user);
  const [meals, setMeals] = useState([]);
  const [openDialog, setOpenDialog] = useState(false);
  const [nutrition, setNutrition] = useState(getInitialNutrition(user?.profile));

  useEffect(() => {
    if (user?.profile) {
      setNutrition(getInitialNutrition(user.profile));
    }
  }, [user?.profile]);

  const [selectedTab, setSelectedTab] = useState(0);
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);
  const [newMeal, setNewMeal] = useState({
    name: '',
    type: '',
    calories: '',
    protein: '',
    carbs: '',
    fat: '',
    notes: '',
  });

  const handleAddMeal = () => {
    if (newMeal.name && newMeal.calories && newMeal.protein && newMeal.carbs && newMeal.fat) {
      const newMealData = { ...newMeal, id: Date.now() };
      setMeals((prev) => [...prev, newMealData]);
      updateNutrition(newMealData, 'add');
      setNewMeal({ name: '', type: '', calories: '', protein: '', carbs: '', fat: '', notes: '' });
      toast.success('Meal added successfully!');
    } else {
      toast.error('Please fill in all fields');
    }
  };

  return (
    <Box sx={{ p: 2 }}>
      <Grid container spacing={2}>
        {/* Left column: Nutrition Summary */}
        <Grid item xs={12} md={6}>
          <Card sx={{ height: '100%' }}>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Nutrition Summary
              </Typography>
              <LinearProgress
                sx={{ mb: 2 }}
                variant="determinate"
                value={(nutrition.calories.current / nutrition.calories.target) * 100}
              />
              <Grid container spacing={2}>
                <Grid item xs={6}>
                  <Typography variant="body2">Calories</Typography>
                  <Typography variant="body1">{nutrition.calories.current} / {nutrition.calories.target}</Typography>
                </Grid>
                <Grid item xs={6}>
                  <Typography variant="body2">Protein</Typography>
                  <Typography variant="body1">{nutrition.protein.current} / {nutrition.protein.target}</Typography>
                </Grid>
                <Grid item xs={6}>
                  <Typography variant="body2">Carbs</Typography>
                  <Typography variant="body1">{nutrition.carbs.current} / {nutrition.carbs.target}</Typography>
                </Grid>
                <Grid item xs={6}>
                  <Typography variant="body2">Fat</Typography>
                  <Typography variant="body1">{nutrition.fat.current} / {nutrition.fat.target}</Typography>
                </Grid>
              </Grid>
            </CardContent>
          </Card>
        </Grid>

        {/* Right column: Meals List and Add Meal Form */}
        <Grid item xs={12} md={6}>
          <Card sx={{ height: '100%' }}>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Meals
              </Typography>
              <Tabs
                value={selectedTab}
                onChange={(event, newValue) => setSelectedTab(newValue)}
                variant="scrollable"
                scrollButtons="auto"
                sx={{ mb: 2 }}
              >
                <Tab label="Today" />
                <Tab label="Yesterday" />
                <Tab label="This Week" />
                <Tab label="This Month" />
              </Tabs>

              {/* Meal List */}
              <Box sx={{ maxHeight: '300px', overflowY: 'auto' }}>
                <ul>
                  {meals.map((meal) => (
                    <li key={meal.id}>
                      <Grid container alignItems="center" spacing={1}>
                        <Grid item xs={6}>
                          <Typography variant="body1">{meal.name}</Typography>
                        </Grid>
                        <Grid item xs={3}>
                          <Typography variant="body2">{meal.type}</Typography>
                        </Grid>
                        <Grid item xs={3}>
                          <IconButton onClick={() => handleDeleteMeal(meal)} color="secondary">
                            <DeleteIcon />
                          </IconButton>
                        </Grid>
                      </Grid>
                    </li>
                  ))}
                </ul>
              </Box>

              <Divider sx={{ my: 2 }} />

              {/* Add Meal Form */}
              <Typography variant="h6" gutterBottom>
                Add Meal
              </Typography>
              <form>
                <Grid container spacing={2}>
                  <Grid item xs={12} md={6}>
                    <TextField
                      fullWidth
                      label="Meal Name"
                      value={newMeal.name}
                      onChange={(event) => setNewMeal({ ...newMeal, name: event.target.value })}
                    />
                  </Grid>
                  <Grid item xs={12} md={6}>
                    <FormControl fullWidth>
                      <InputLabel id="meal-type-label">Meal Type</InputLabel>
                      <Select
                        labelId="meal-type-label"
                        value={newMeal.type}
                        onChange={(event) => setNewMeal({ ...newMeal, type: event.target.value })}
                      >
                        {mealTypes.map((mealType) => (
                          <MenuItem key={mealType.type} value={mealType.type}>
                            {mealType.icon} {mealType.type}
                          </MenuItem>
                        ))}
                      </Select>
                    </FormControl>
                  </Grid>
                  <Grid item xs={12} md={6}>
                    <TextField
                      fullWidth
                      label="Calories"
                      value={newMeal.calories}
                      onChange={(event) => setNewMeal({ ...newMeal, calories: event.target.value })}
                    />
                  </Grid>
                  <Grid item xs={12} md={6}>
                    <TextField
                      fullWidth
                      label="Protein"
                      value={newMeal.protein}
                      onChange={(event) => setNewMeal({ ...newMeal, protein: event.target.value })}
                    />
                  </Grid>
                  <Grid item xs={12} md={6}>
                    <TextField
                      fullWidth
                      label="Carbs"
                      value={newMeal.carbs}
                      onChange={(event) => setNewMeal({ ...newMeal, carbs: event.target.value })}
                    />
                  </Grid>
                  <Grid item xs={12} md={6}>
                    <TextField
                      fullWidth
                      label="Fat"
                      value={newMeal.fat}
                      onChange={(event) => setNewMeal({ ...newMeal, fat: event.target.value })}
                    />
                  </Grid>
                  <Grid item xs={12}>
                    <Button
                      fullWidth
                      variant="contained"
                      color="primary"
                      onClick={handleAddMeal}
                    >
                      Add Meal
                    </Button>
                  </Grid>
                </Grid>
              </form>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Box>
  );
}
