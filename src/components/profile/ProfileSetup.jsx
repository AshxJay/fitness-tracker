import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Box,
  Card,
  CardContent,
  TextField,
  Button,
  Typography,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Stepper,
  Step,
  StepLabel,
} from '@mui/material';
import useStore from '../../store/useStore';
import { toast } from 'react-toastify';

export default function ProfileSetup() {
  const navigate = useNavigate();
  const [activeStep, setActiveStep] = useState(0);
  const setUser = useStore((state) => state.setUser);
  const user = useStore((state) => state.user);

  const [formData, setFormData] = useState({
    name: '',
    age: '',
    height: '',
    weight: '',
    gender: '',
    fitnessGoals: '',
    activityLevel: '',
  });

  const steps = ['Personal Info', 'Body Metrics', 'Fitness Goals'];

  const handleNext = (e) => {
    e.preventDefault();
    if (!validateStep(activeStep)) {
      toast.error('Please fill in all required fields');
      return;
    }
    if (activeStep === steps.length - 1) {
      handleSubmit(e);
    } else {
      setActiveStep((prevStep) => prevStep + 1);
    }
  };

  const handleBack = () => {
    setActiveStep((prevStep) => prevStep - 1);
  };

  const validateStep = (step) => {
    switch (step) {
      case 0:
        return formData.name && formData.age;
      case 1:
        return formData.height && formData.weight && formData.gender;
      case 2:
        return formData.fitnessGoals && formData.activityLevel;
      default:
        return true;
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!validateStep(activeStep)) {
      toast.error('Please fill in all required fields');
      return;
    }

    const updatedUser = {
      ...user,
      ...formData,
    };
    setUser(updatedUser);
    toast.success('Profile setup completed!');
    navigate('/dashboard', { replace: true });
  };

  return (
    <div className="auth-container">
      <Card className="auth-card" sx={{ maxWidth: 600 }}>
        <CardContent>
          <Typography variant="h4" className="auth-title">
            Profile Setup
          </Typography>

          <Stepper activeStep={activeStep} sx={{ mb: 4 }}>
            {steps.map((label) => (
              <Step key={label}>
                <StepLabel>{label}</StepLabel>
              </Step>
            ))}
          </Stepper>

          <form onSubmit={handleNext}>
            {activeStep === 0 && (
              <Box>
                <TextField
                  fullWidth
                  label="Full Name"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  sx={{ mb: 2 }}
                  required
                />
                <TextField
                  fullWidth
                  label="Age"
                  type="number"
                  value={formData.age}
                  onChange={(e) => setFormData({ ...formData, age: e.target.value })}
                  required
                />
              </Box>
            )}

            {activeStep === 1 && (
              <Box>
                <TextField
                  fullWidth
                  label="Height (cm)"
                  type="number"
                  value={formData.height}
                  onChange={(e) => setFormData({ ...formData, height: e.target.value })}
                  sx={{ mb: 2 }}
                  required
                />
                <TextField
                  fullWidth
                  label="Weight (kg)"
                  type="number"
                  value={formData.weight}
                  onChange={(e) => setFormData({ ...formData, weight: e.target.value })}
                  sx={{ mb: 2 }}
                  required
                />
                <FormControl fullWidth>
                  <InputLabel>Gender</InputLabel>
                  <Select
                    value={formData.gender}
                    label="Gender"
                    onChange={(e) => setFormData({ ...formData, gender: e.target.value })}
                    required
                  >
                    <MenuItem value="male">Male</MenuItem>
                    <MenuItem value="female">Female</MenuItem>
                    <MenuItem value="other">Other</MenuItem>
                  </Select>
                </FormControl>
              </Box>
            )}

            {activeStep === 2 && (
              <Box>
                <FormControl fullWidth sx={{ mb: 2 }}>
                  <InputLabel>Fitness Goals</InputLabel>
                  <Select
                    value={formData.fitnessGoals}
                    label="Fitness Goals"
                    onChange={(e) => setFormData({ ...formData, fitnessGoals: e.target.value })}
                    required
                  >
                    <MenuItem value="weight_loss">Weight Loss</MenuItem>
                    <MenuItem value="muscle_gain">Muscle Gain</MenuItem>
                    <MenuItem value="strength">Strength Training</MenuItem>
                    <MenuItem value="endurance">Endurance</MenuItem>
                    <MenuItem value="flexibility">Flexibility</MenuItem>
                  </Select>
                </FormControl>
                <FormControl fullWidth>
                  <InputLabel>Activity Level</InputLabel>
                  <Select
                    value={formData.activityLevel}
                    label="Activity Level"
                    onChange={(e) => setFormData({ ...formData, activityLevel: e.target.value })}
                    required
                  >
                    <MenuItem value="sedentary">Sedentary</MenuItem>
                    <MenuItem value="light">Lightly Active</MenuItem>
                    <MenuItem value="moderate">Moderately Active</MenuItem>
                    <MenuItem value="very">Very Active</MenuItem>
                    <MenuItem value="extra">Extra Active</MenuItem>
                  </Select>
                </FormControl>
              </Box>
            )}

            <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 4 }}>
              <Button
                onClick={handleBack}
                disabled={activeStep === 0}
                sx={{
                  color: 'white',
                  '&:hover': {
                    backgroundColor: 'rgba(255, 255, 255, 0)',
                  },
                }}
              >
                Back
              </Button>
              <Button
                type="submit"
                variant="contained"
                sx={{
                  background: 'var(--primary-gradient)',
                  '&:hover': {
                    opacity: 0.9,
                  }
                }}
              >
                {activeStep === steps.length - 1 ? 'Complete' : 'Next'}
              </Button>
            </Box>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
