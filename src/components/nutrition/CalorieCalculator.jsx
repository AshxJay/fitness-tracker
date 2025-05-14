import { useState } from 'react';
import {
  Box,
  Grid,
  Card,
  CardContent,
  Typography,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Button,
  RadioGroup,
  FormControlLabel,
  Radio,
  Slider,
} from '@mui/material';
import { Calculate, LocalFireDepartment } from '@mui/icons-material';

export default function CalorieCalculator() {
  const [formData, setFormData] = useState({
    age: '',
    gender: 'male',
    weight: '',
    height: '',
    activityLevel: 'sedentary',
    goal: 'maintain',
  });

  const [result, setResult] = useState(null);

  const activityLevels = {
    sedentary: { label: 'Sedentary (little or no exercise)', multiplier: 1.2 },
    light: { label: 'Lightly active (light exercise 1-3 days/week)', multiplier: 1.375 },
    moderate: { label: 'Moderately active (moderate exercise 3-5 days/week)', multiplier: 1.55 },
    active: { label: 'Very active (hard exercise 6-7 days/week)', multiplier: 1.725 },
    extreme: { label: 'Extremely active (very hard exercise & physical job)', multiplier: 1.9 },
  };

  const goals = {
    lose: { label: 'Lose weight', multiplier: 0.85 },
    maintain: { label: 'Maintain weight', multiplier: 1 },
    gain: { label: 'Gain weight', multiplier: 1.15 },
  };

  const calculateBMR = () => {
    const { age, gender, weight, height } = formData;
    // Mifflin-St Jeor Equation
    if (gender === 'male') {
      return 10 * weight + 6.25 * height - 5 * age + 5;
    } else {
      return 10 * weight + 6.25 * height - 5 * age - 161;
    }
  };

  const calculateCalories = () => {
    if (!formData.age || !formData.weight || !formData.height) {
      return;
    }

    const bmr = calculateBMR();
    const tdee = bmr * activityLevels[formData.activityLevel].multiplier;
    const targetCalories = tdee * goals[formData.goal].multiplier;

    const macros = {
      protein: (targetCalories * 0.3) / 4, // 30% protein, 4 calories per gram
      carbs: (targetCalories * 0.4) / 4, // 40% carbs, 4 calories per gram
      fat: (targetCalories * 0.3) / 9, // 30% fat, 9 calories per gram
    };

    setResult({
      bmr: Math.round(bmr),
      tdee: Math.round(tdee),
      targetCalories: Math.round(targetCalories),
      macros: {
        protein: Math.round(macros.protein),
        carbs: Math.round(macros.carbs),
        fat: Math.round(macros.fat),
      },
    });
  };

  const handleChange = (event) => {
    const { name, value } = event.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h4" sx={{ mb: 4, fontWeight: 'bold' }}>
        Calorie Calculator
      </Typography>

      <Grid container spacing={3}>
        <Grid item xs={12} md={6}>
          <Card
            sx={{
              background: 'linear-gradient(135deg, #1a1a1a 0%, rgba(26, 26, 26, 0.9) 100%)',
              border: '1px solid rgba(255, 255, 255, 0.1)',
            }}
          >
            <CardContent>
              <Typography variant="h6" sx={{ mb: 3 }}>
                Personal Information
              </Typography>

              <Grid container spacing={2}>
                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    label="Age"
                    type="number"
                    name="age"
                    value={formData.age}
                    onChange={handleChange}
                  />
                </Grid>

                <Grid item xs={12} sm={6}>
                  <FormControl fullWidth>
                    <Typography sx={{ mb: 1 }}>Gender</Typography>
                    <RadioGroup
                      row
                      name="gender"
                      value={formData.gender}
                      onChange={handleChange}
                    >
                      <FormControlLabel value="male" control={<Radio />} label="Male" />
                      <FormControlLabel value="female" control={<Radio />} label="Female" />
                    </RadioGroup>
                  </FormControl>
                </Grid>

                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    label="Weight (kg)"
                    type="number"
                    name="weight"
                    value={formData.weight}
                    onChange={handleChange}
                  />
                </Grid>

                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    label="Height (cm)"
                    type="number"
                    name="height"
                    value={formData.height}
                    onChange={handleChange}
                  />
                </Grid>

                <Grid item xs={12}>
                  <FormControl fullWidth>
                    <InputLabel>Activity Level</InputLabel>
                    <Select
                      name="activityLevel"
                      value={formData.activityLevel}
                      label="Activity Level"
                      onChange={handleChange}
                    >
                      {Object.entries(activityLevels).map(([key, { label }]) => (
                        <MenuItem key={key} value={key}>
                          {label}
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                </Grid>

                <Grid item xs={12}>
                  <FormControl fullWidth>
                    <InputLabel>Goal</InputLabel>
                    <Select
                      name="goal"
                      value={formData.goal}
                      label="Goal"
                      onChange={handleChange}
                    >
                      {Object.entries(goals).map(([key, { label }]) => (
                        <MenuItem key={key} value={key}>
                          {label}
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                </Grid>

                <Grid item xs={12}>
                  <Button
                    fullWidth
                    variant="contained"
                    onClick={calculateCalories}
                    startIcon={<Calculate />}
                    sx={{
                      mt: 2,
                      background: 'linear-gradient(45deg, #FF4B2B, #FF416C)',
                      '&:hover': {
                        background: 'linear-gradient(45deg, #FF416C, #FF4B2B)',
                      },
                    }}
                  >
                    Calculate
                  </Button>
                </Grid>
              </Grid>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} md={6}>
          {result && (
            <Card
              sx={{
                background: 'linear-gradient(135deg, #1a1a1a 0%, rgba(26, 26, 26, 0.9) 100%)',
                border: '1px solid rgba(255, 255, 255, 0.1)',
              }}
            >
              <CardContent>
                <Typography variant="h6" sx={{ mb: 3 }}>
                  Your Results
                </Typography>

                <Box sx={{ mb: 4 }}>
                  <Typography variant="subtitle1" color="text.secondary" gutterBottom>
                    Base Metabolic Rate (BMR)
                  </Typography>
                  <Typography variant="h4" sx={{ color: 'primary.main' }}>
                    {result.bmr} calories/day
                  </Typography>
                </Box>

                <Box sx={{ mb: 4 }}>
                  <Typography variant="subtitle1" color="text.secondary" gutterBottom>
                    Total Daily Energy Expenditure (TDEE)
                  </Typography>
                  <Typography variant="h4" sx={{ color: 'primary.main' }}>
                    {result.tdee} calories/day
                  </Typography>
                </Box>

                <Box sx={{ mb: 4 }}>
                  <Typography variant="subtitle1" color="text.secondary" gutterBottom>
                    Recommended Daily Calories
                  </Typography>
                  <Typography variant="h4" sx={{ color: 'primary.main' }}>
                    {result.targetCalories} calories/day
                  </Typography>
                </Box>

                <Typography variant="h6" sx={{ mb: 2 }}>
                  Recommended Macronutrients
                </Typography>

                <Grid container spacing={2}>
                  <Grid item xs={4}>
                    <Box sx={{ textAlign: 'center' }}>
                      <Typography variant="h5" color="primary">
                        {result.macros.protein}g
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        Protein
                      </Typography>
                    </Box>
                  </Grid>
                  <Grid item xs={4}>
                    <Box sx={{ textAlign: 'center' }}>
                      <Typography variant="h5" color="primary">
                        {result.macros.carbs}g
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        Carbs
                      </Typography>
                    </Box>
                  </Grid>
                  <Grid item xs={4}>
                    <Box sx={{ textAlign: 'center' }}>
                      <Typography variant="h5" color="primary">
                        {result.macros.fat}g
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        Fat
                      </Typography>
                    </Box>
                  </Grid>
                </Grid>
              </CardContent>
            </Card>
          )}
        </Grid>
      </Grid>
    </Box>
  );
}
