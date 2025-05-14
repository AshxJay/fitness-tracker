import { useState } from 'react';
import {
  Box,
  Card,
  CardContent,
  TextField,
  Button,
  Typography,
  Grid,
  Avatar,
  IconButton,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Chip,
} from '@mui/material';
import { PhotoCamera, Save } from '@mui/icons-material';
import { toast } from 'react-toastify';
import useStore from '../../store/useStore';

export default function Profile() {
  const user = useStore((state) => state.user);
  const setUser = useStore((state) => state.setUser);
  
  const [formData, setFormData] = useState({
    name: user?.name || '',
    email: user?.email || '',
    age: user?.age || '',
    height: user?.height || '',
    weight: user?.weight || '',
    gender: user?.gender || '',
    fitnessGoals: user?.fitnessGoals || [],
    activityLevel: user?.activityLevel || '',
    profileImage: user?.profileImage || null,
  });

  const fitnessGoalsOptions = [
    'Build Muscle',
    'Lose Weight',
    'Improve Strength',
    'Increase Flexibility',
    'Enhance Endurance',
    'Maintain Health',
  ];

  const activityLevels = [
    'Sedentary',
    'Light',
    'Moderate',
    'Active',
    'Very Active',
  ];

  const handleImageChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setFormData({ ...formData, profileImage: reader.result });
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setUser(formData);
    toast.success('Profile updated successfully!');
  };

  const handleGoalToggle = (goal) => {
    const newGoals = formData.fitnessGoals.includes(goal)
      ? formData.fitnessGoals.filter((g) => g !== goal)
      : [...formData.fitnessGoals, goal];
    setFormData({ ...formData, fitnessGoals: newGoals });
  };

  return (
    <Box sx={{ p: 3, maxWidth: 800, mx: 'auto' }}>
      <Typography variant="h4" sx={{ mb: 4, fontWeight: 'bold' }}>
        Profile Settings
      </Typography>

      <form onSubmit={handleSubmit}>
        <Card sx={{ mb: 4, bgcolor: 'background.paper' }}>
          <CardContent>
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 4 }}>
              <Avatar
                src={formData.profileImage}
                sx={{ width: 100, height: 100, mr: 2 }}
              />
              <Box>
                <input
                  accept="image/*"
                  style={{ display: 'none' }}
                  id="icon-button-file"
                  type="file"
                  onChange={handleImageChange}
                />
                <label htmlFor="icon-button-file">
                  <IconButton
                    color="primary"
                    aria-label="upload picture"
                    component="span"
                  >
                    <PhotoCamera />
                  </IconButton>
                </label>
                <Typography variant="body2" color="text.secondary">
                  Upload Profile Picture
                </Typography>
              </Box>
            </Box>

            <Grid container spacing={3}>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Name"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Email"
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Age"
                  type="number"
                  value={formData.age}
                  onChange={(e) => setFormData({ ...formData, age: e.target.value })}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <FormControl fullWidth>
                  <InputLabel>Gender</InputLabel>
                  <Select
                    value={formData.gender}
                    label="Gender"
                    onChange={(e) => setFormData({ ...formData, gender: e.target.value })}
                  >
                    <MenuItem value="male">Male</MenuItem>
                    <MenuItem value="female">Female</MenuItem>
                    <MenuItem value="other">Other</MenuItem>
                  </Select>
                </FormControl>
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Height (cm)"
                  type="number"
                  value={formData.height}
                  onChange={(e) => setFormData({ ...formData, height: e.target.value })}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Weight (kg)"
                  type="number"
                  value={formData.weight}
                  onChange={(e) => setFormData({ ...formData, weight: e.target.value })}
                />
              </Grid>
              <Grid item xs={12}>
                <FormControl fullWidth>
                  <InputLabel>Activity Level</InputLabel>
                  <Select
                    value={formData.activityLevel}
                    label="Activity Level"
                    onChange={(e) => setFormData({ ...formData, activityLevel: e.target.value })}
                  >
                    {activityLevels.map((level) => (
                      <MenuItem key={level} value={level}>
                        {level}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Grid>
              <Grid item xs={12}>
                <Typography variant="subtitle1" sx={{ mb: 2 }}>
                  Fitness Goals
                </Typography>
                <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                  {fitnessGoalsOptions.map((goal) => (
                    <Chip
                      key={goal}
                      label={goal}
                      onClick={() => handleGoalToggle(goal)}
                      color={formData.fitnessGoals.includes(goal) ? 'primary' : 'default'}
                      sx={{
                        '&.MuiChip-root': {
                          background: formData.fitnessGoals.includes(goal)
                            ? 'linear-gradient(45deg, #FF4B2B, #FF416C)'
                            : 'default',
                        },
                      }}
                    />
                  ))}
                </Box>
              </Grid>
            </Grid>
          </CardContent>
        </Card>

        <Button
          type="submit"
          variant="contained"
          startIcon={<Save />}
          sx={{
            py: 1.5,
            px: 4,
            background: 'linear-gradient(45deg, #FF4B2B, #FF416C)',
            '&:hover': {
              background: 'linear-gradient(45deg, #FF416C, #FF4B2B)',
            },
          }}
        >
          Save Changes
        </Button>
      </form>
    </Box>
  );
}
