import { useState, useEffect } from 'react';
import useStore from '../../store/useStore';
import { nutritionService } from '../../services/nutritionService';
import {
  Box, Grid, Card, CardContent, Typography, Button, TextField, FormControl,
  InputLabel, Select, MenuItem, IconButton, LinearProgress, Divider, Tabs, Tab
} from '@mui/material';
import { Delete as DeleteIcon } from '@mui/icons-material';
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

export default function NutritionLog() {
  const user = useStore((state) => state.user);
  const [meals, setMeals] = useState([]);
  const [nutrition, setNutrition] = useState(getInitialNutrition(user?.profile));
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);
  const [selectedTab, setSelectedTab] = useState(0);

  const [newMeal, setNewMeal] = useState({
    name: '',
    type: '',
    calories: '',
    protein: '',
    carbs: '',
    fat: '',
  });

  const updateNutrition = (meal, action) => {
    const multiplier = action === 'add' ? 1 : -1;
    setNutrition((prev) => ({
      calories: {
        ...prev.calories,
        current: prev.calories.current + multiplier * Number(meal.calories || 0),
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

  const handleDeleteMeal = async (meal) => {
    try {
      await nutritionService.deleteNutritionLog(meal.logId);
      setMeals((prev) => prev.filter((m) => m.logId !== meal.logId));
      updateNutrition(meal, 'remove');
      toast.success('Meal deleted successfully!');
    } catch (error) {
      console.error('Error deleting meal:', error);
      toast.error('Failed to delete meal');
    }
  };

  const fetchMeals = async () => {
    if (!user?.profile) return;

    setNutrition(getInitialNutrition(user.profile));
    try {
      const logs = await nutritionService.getNutritionLogsByDate(selectedDate);
      const formattedMeals = logs
        .filter(log => {
          const logDate = new Date(log.date).toISOString().split('T')[0];
          return logDate === selectedDate;
        })
        .flatMap((log) =>
          log.meals.map((meal) => {
            const food = meal.foods[0];
            return {
              logId: log._id,
              name: food.name,
              type: meal.name,
              calories: food.calories,
              protein: food.protein,
              carbs: food.carbs,
              fat: food.fat,
              date: log.date
            };
          })
        );
      setMeals(formattedMeals);
      formattedMeals.forEach((meal) => updateNutrition(meal, 'add'));
    } catch (error) {
      console.error('Error loading meals:', error);
      toast.error('Failed to load meals');
    }
  };

  useEffect(() => {
    fetchMeals();
  }, [user?.profile, selectedDate]);

  const handleAddMeal = async () => {
    const { name, type, calories, protein, carbs, fat } = newMeal;

    if (!name || !type || !calories || !protein || !carbs || !fat) {
      toast.error('Please fill in all fields');
      return;
    }

    try {
      const mealData = {
        meals: [{
          name: type,
          time: new Date(),
          foods: [{
            name,
            calories: Number(calories),
            protein: Number(protein),
            carbs: Number(carbs),
            fat: Number(fat),
            servingSize: 1,
            unit: 'serving'
          }]
        }],
        totalCalories: Number(calories),
        totalProtein: Number(protein),
        totalCarbs: Number(carbs),
        totalFat: Number(fat)
      };

      const savedMeal = await nutritionService.addNutritionLog(mealData);

      const mealObj = {
        name,
        type,
        calories: Number(calories),
        protein: Number(protein),
        carbs: Number(carbs),
        fat: Number(fat),
        logId: savedMeal._id,
      };

      setMeals((prev) => [...prev, mealObj]);
      updateNutrition(mealObj, 'add');
      setNewMeal({ name: '', type: '', calories: '', protein: '', carbs: '', fat: '' });
      
      // Refresh nutrition stats immediately
      await fetchMeals();
      toast.success('Meal added successfully!');
    } catch (error) {
      console.error('Error adding meal:', error);
      toast.error('Failed to add meal');
    }
  };

  return (
    <Box sx={{ p: 2 }}>
      <Grid container spacing={2}>
        {/* Nutrition Summary */}
        <Grid item xs={12} md={6}>
          <Card sx={{ height: '100%' }}>
            <CardContent>
              <Typography variant="h6" gutterBottom>Nutrition Summary</Typography>
              <LinearProgress
                sx={{ mb: 2 }}
                variant="determinate"
                value={(nutrition.calories.current / nutrition.calories.target) * 100}
              />
              <Grid container spacing={2}>
                <Grid item xs={6}><Typography variant="body2">Calories</Typography><Typography>{nutrition.calories.current} / {nutrition.calories.target}</Typography></Grid>
                <Grid item xs={6}><Typography variant="body2">Protein</Typography><Typography>{nutrition.protein.current} / {nutrition.protein.target}</Typography></Grid>
                <Grid item xs={6}><Typography variant="body2">Carbs</Typography><Typography>{nutrition.carbs.current} / {nutrition.carbs.target}</Typography></Grid>
                <Grid item xs={6}><Typography variant="body2">Fat</Typography><Typography>{nutrition.fat.current} / {nutrition.fat.target}</Typography></Grid>
              </Grid>
            </CardContent>
          </Card>
        </Grid>

        {/* Meal Log and Add Meal */}
        <Grid item xs={12} md={6}>
          <Card sx={{ height: '100%' }}>
            <CardContent>
              <Typography variant="h6" gutterBottom>Meals</Typography>
              <Tabs value={selectedTab} onChange={(e, val) => setSelectedTab(val)} sx={{ mb: 2 }}>
                <Tab label="Today" />
                <Tab label="Yesterday" />
                <Tab label="This Week" />
                <Tab label="This Month" />
              </Tabs>

              <Box sx={{ maxHeight: '300px', overflowY: 'auto' }}>
                {meals.length === 0 ? (
                  <Typography variant="body2">No meals logged for this day.</Typography>
                ) : (
                  <ul style={{ listStyle: 'none', padding: 0 }}>
                    {meals.map((meal, index) => (
                      <li key={meal.logId + '-' + index}>
                        <Grid container alignItems="center" spacing={1}>
                          <Grid item xs={6}><Typography>{meal.name}</Typography></Grid>
                          <Grid item xs={3}><Typography variant="body2">{meal.type}</Typography></Grid>
                          <Grid item xs={3}>
                            <IconButton onClick={() => handleDeleteMeal(meal)} color="secondary">
                              <DeleteIcon />
                            </IconButton>
                          </Grid>
                        </Grid>
                      </li>
                    ))}
                  </ul>
                )}
              </Box>

              <Divider sx={{ my: 2 }} />
              <Typography variant="h6" gutterBottom>Add Meal</Typography>
              <Grid container spacing={2}>
                <Grid item xs={12} md={6}>
                  <TextField fullWidth label="Meal Name" value={newMeal.name}
                    onChange={(e) => setNewMeal({ ...newMeal, name: e.target.value })} />
                </Grid>
                <Grid item xs={12} md={6}>
                  <FormControl fullWidth>
                    <InputLabel id="meal-type-label">Meal Type</InputLabel>
                    <Select
                      labelId="meal-type-label"
                      value={newMeal.type}
                      onChange={(e) => setNewMeal({ ...newMeal, type: e.target.value })}
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
                  <TextField fullWidth label="Calories" type="number" value={newMeal.calories}
                    onChange={(e) => setNewMeal({ ...newMeal, calories: e.target.value })} />
                </Grid>
                <Grid item xs={12} md={6}>
                  <TextField fullWidth label="Protein" type="number" value={newMeal.protein}
                    onChange={(e) => setNewMeal({ ...newMeal, protein: e.target.value })} />
                </Grid>
                <Grid item xs={12} md={6}>
                  <TextField fullWidth label="Carbs" type="number" value={newMeal.carbs}
                    onChange={(e) => setNewMeal({ ...newMeal, carbs: e.target.value })} />
                </Grid>
                <Grid item xs={12} md={6}>
                  <TextField fullWidth label="Fat" type="number" value={newMeal.fat}
                    onChange={(e) => setNewMeal({ ...newMeal, fat: e.target.value })} />
                </Grid>
                <Grid item xs={12}>
                  <Button fullWidth variant="contained" onClick={handleAddMeal}>Add Meal</Button>
                </Grid>
              </Grid>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Box>
  );
}
