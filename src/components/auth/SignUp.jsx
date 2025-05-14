import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Box,
  Card,
  CardContent,
  TextField,
  Button,
  Typography,
  InputAdornment,
  IconButton,
  Link,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
} from '@mui/material';
import { Visibility, VisibilityOff, FitnessCenter } from '@mui/icons-material';
import { Link as RouterLink } from 'react-router-dom';
import { toast } from 'react-toastify';
import useStore from '../../store/useStore';

export default function SignUp() {
  const navigate = useNavigate();
  const setUser = useStore((state) => state.setUser);
  const setIsAuthenticated = useStore((state) => state.setIsAuthenticated);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    height: '',
    weight: '',
    age: '',
    gender: '',
    activityLevel: '',
  });
  const [showPassword, setShowPassword] = useState(false);

  const activityLevels = [
    { value: 'sedentary', label: 'Sedentary (little or no exercise)' },
    { value: 'light', label: 'Lightly active (light exercise 1-3 days/week)' },
    { value: 'moderate', label: 'Moderately active (moderate exercise 3-5 days/week)' },
    { value: 'very', label: 'Very active (hard exercise 6-7 days/week)' },
    { value: 'extra', label: 'Extra active (very hard exercise & physical job)' },
  ];

  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (!formData.name || !formData.email || !formData.password || !formData.confirmPassword ||
        !formData.height || !formData.weight || !formData.activityLevel) {
      toast.error('Please fill in all fields');
      return;
    }

    if (formData.password !== formData.confirmPassword) {
      toast.error('Passwords do not match');
      return;
    }
    
    // Calculate BMR using Mifflin-St Jeor Equation
    const calculateBMR = (weight, height, age, gender) => {
      const bmr = (10 * weight) + (6.25 * height) - (5 * age) + (gender === 'male' ? 5 : -161);
      return Math.round(bmr);
    };

    // Calculate TDEE based on activity level
    const activityMultipliers = {
      sedentary: 1.2,
      light: 1.375,
      moderate: 1.55,
      very: 1.725,
      extra: 1.9
    };

    const bmr = calculateBMR(parseFloat(formData.weight), parseFloat(formData.height), parseFloat(formData.age), formData.gender);
    const tdee = Math.round(bmr * activityMultipliers[formData.activityLevel]);

    const user = {
      name: formData.name,
      email: formData.email,
      profile: {
        height: parseFloat(formData.height),
        weight: parseFloat(formData.weight),
        age: parseFloat(formData.age),
        gender: formData.gender,
        activityLevel: formData.activityLevel,
        bmr: bmr,
        tdee: tdee,
        goals: {
          calorieGoal: tdee,
          protein: Math.round(formData.weight * 1.6), // 1.6g per kg of body weight
          carbs: Math.round((tdee * 0.5) / 4), // 50% of calories from carbs
          fat: Math.round((tdee * 0.25) / 9), // 25% of calories from fat
        },
        workoutDays: ['Monday', 'Wednesday', 'Friday'],
        lastUpdated: new Date().toISOString()
      }
    };
    
    setUser(user);
    setIsAuthenticated(true);
    toast.success('Account created successfully!');
    navigate('/dashboard', { replace: true });
  };

  return (
    <Box
      sx={{
        height: '100vh',
        width:"100vw",
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        background: 'linear-gradient(135deg, #121212 0%, #1a1a1a 100%)',
        p: 2,
      }}
    >
      <Card
        sx={{
          maxWidth: 400,
          width: '100%',
          position: 'relative',
          background: 'rgba(26, 26, 26, 0.8)',
          backdropFilter: 'blur(10px)',
          border: '1px solid rgba(255, 255, 255, 0.1)',
          boxShadow: '0 8px 32px 0 rgba(0, 0, 0, 0.37)',
        }}
      >
        <CardContent>
          <Box sx={{ textAlign: 'center', mb: 4 }}>
            <FitnessCenter 
              sx={{ 
                fontSize: 48, 
                color: '#FF4B2B',
                mb: 2,
                animation: 'pulse 2s infinite',
                '@keyframes pulse': {
                  '0%': { transform: 'scale(1)' },
                  '50%': { transform: 'scale(1.1)' },
                  '100%': { transform: 'scale(1)' },
                },
              }} 
            />
            <Typography variant="h4" sx={{ color: '#fff', fontWeight: 'bold', mb: 1 }}>
              Create Account
            </Typography>
            <Typography variant="body1" sx={{ color: 'rgba(255, 255, 255, 0.7)' }}>
              Start your fitness journey today
            </Typography>
          </Box>

          <form onSubmit={handleSubmit}>
            <TextField
              fullWidth
              label="Name"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              sx={{ 
                mb: 2,
                '& .MuiOutlinedInput-root': {
                  '& fieldset': {
                    borderColor: 'rgba(255, 255, 255, 0.23)',
                  },
                  '&:hover fieldset': {
                    borderColor: '#FF4B2B',
                  },
                  '&.Mui-focused fieldset': {
                    borderColor: '#FF4B2B',
                  },
                },
                '& .MuiInputLabel-root': {
                  color: 'rgba(255, 255, 255, 0.7)',
                  '&.Mui-focused': {
                    color: '#FF4B2B',
                  },
                },
                '& .MuiOutlinedInput-input': {
                  color: '#fff',
                },
              }}
            />

            <TextField
              fullWidth
              label="Email"
              type="email"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              sx={{ 
                mb: 2,
                '& .MuiOutlinedInput-root': {
                  '& fieldset': {
                    borderColor: 'rgba(255, 255, 255, 0.23)',
                  },
                  '&:hover fieldset': {
                    borderColor: '#FF4B2B',
                  },
                  '&.Mui-focused fieldset': {
                    borderColor: '#FF4B2B',
                  },
                },
                '& .MuiInputLabel-root': {
                  color: 'rgba(255, 255, 255, 0.7)',
                  '&.Mui-focused': {
                    color: '#FF4B2B',
                  },
                },
                '& .MuiOutlinedInput-input': {
                  color: '#fff',
                },
              }}
            />

            <Grid container spacing={2} sx={{ mb: 2 }}>
              <Grid item xs={6}>
                <TextField
                  fullWidth
                  label="Height"
                  type="number"
                  value={formData.height}
                  onChange={(e) => setFormData({ ...formData, height: e.target.value })}
                  InputProps={{
                    endAdornment: <InputAdornment position="end">cm</InputAdornment>,
                  }}
                  sx={{ 
                    '& .MuiOutlinedInput-root': {
                      '& fieldset': {
                        borderColor: 'rgba(255, 255, 255, 0.23)',
                      },
                      '&:hover fieldset': {
                        borderColor: '#FF4B2B',
                      },
                      '&.Mui-focused fieldset': {
                        borderColor: '#FF4B2B',
                      },
                    },
                    '& .MuiInputLabel-root': {
                      color: 'rgba(255, 255, 255, 0.7)',
                      '&.Mui-focused': {
                        color: '#FF4B2B',
                      },
                    },
                    '& .MuiOutlinedInput-input': {
                      color: '#fff',
                    },
                  }}
                />
              </Grid>
              <Grid item xs={6}>
                <TextField
                  fullWidth
                  label="Weight"
                  type="number"
                  value={formData.weight}
                  onChange={(e) => setFormData({ ...formData, weight: e.target.value })}
                  InputProps={{
                    endAdornment: <InputAdornment position="end">kg</InputAdornment>,
                  }}
                  sx={{ 
                    '& .MuiOutlinedInput-root': {
                      '& fieldset': {
                        borderColor: 'rgba(255, 255, 255, 0.23)',
                      },
                      '&:hover fieldset': {
                        borderColor: '#FF4B2B',
                      },
                      '&.Mui-focused fieldset': {
                        borderColor: '#FF4B2B',
                      },
                    },
                    '& .MuiInputLabel-root': {
                      color: 'rgba(255, 255, 255, 0.7)',
                      '&.Mui-focused': {
                        color: '#FF4B2B',
                      },
                    },
                    '& .MuiOutlinedInput-input': {
                      color: '#fff',
                    },
                  }}
                />
              </Grid>
            </Grid>

            <Grid container spacing={2} sx={{ mb: 2 }}>
              <Grid item xs={6}>
                <TextField
                  fullWidth
                  label="Age"
                  type="number"
                  value={formData.age}
                  onChange={(e) => setFormData({ ...formData, age: e.target.value })}
                  sx={{ 
                    '& .MuiOutlinedInput-root': {
                      '& fieldset': {
                        borderColor: 'rgba(255, 255, 255, 0.23)',
                      },
                      '&:hover fieldset': {
                        borderColor: '#FF4B2B',
                      },
                      '&.Mui-focused fieldset': {
                        borderColor: '#FF4B2B',
                      },
                    },
                    '& .MuiInputLabel-root': {
                      color: 'rgba(255, 255, 255, 0.7)',
                      '&.Mui-focused': {
                        color: '#FF4B2B',
                      },
                    },
                    '& .MuiOutlinedInput-input': {
                      color: '#fff',
                    },
                  }}
                />
              </Grid>
              <Grid item xs={6}>
                <FormControl
                  fullWidth
                  sx={{ 
                    '& .MuiOutlinedInput-root': {
                      '& fieldset': {
                        borderColor: 'rgba(255, 255, 255, 0.23)',
                      },
                      '&:hover fieldset': {
                        borderColor: '#FF4B2B',
                      },
                      '&.Mui-focused fieldset': {
                        borderColor: '#FF4B2B',
                      },
                    },
                    '& .MuiInputLabel-root': {
                      color: 'rgba(255, 255, 255, 0.7)',
                      '&.Mui-focused': {
                        color: '#FF4B2B',
                      },
                    },
                    '& .MuiSelect-select': {
                      color: '#fff',
                    },
                  }}
                >
                  <InputLabel>Gender</InputLabel>
                  <Select
                    value={formData.gender}
                    onChange={(e) => setFormData({ ...formData, gender: e.target.value })}
                    label="Gender"
                  >
                    <MenuItem value="male">Male</MenuItem>
                    <MenuItem value="female">Female</MenuItem>
                  </Select>
                </FormControl>
              </Grid>
            </Grid>

            <FormControl 
              fullWidth 
              sx={{ 
                mb: 2,
                '& .MuiOutlinedInput-root': {
                  '& fieldset': {
                    borderColor: 'rgba(255, 255, 255, 0.23)',
                  },
                  '&:hover fieldset': {
                    borderColor: '#FF4B2B',
                  },
                  '&.Mui-focused fieldset': {
                    borderColor: '#FF4B2B',
                  },
                },
                '& .MuiInputLabel-root': {
                  color: 'rgba(255, 255, 255, 0.7)',
                  '&.Mui-focused': {
                    color: '#FF4B2B',
                  },
                },
                '& .MuiSelect-select': {
                  color: '#fff',
                },
              }}
            >
              <InputLabel>Activity Level</InputLabel>
              <Select
                value={formData.activityLevel}
                label="Activity Level"
                onChange={(e) => setFormData({ ...formData, activityLevel: e.target.value })}
              >
                {activityLevels.map((level) => (
                  <MenuItem key={level.value} value={level.value}>
                    {level.label}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>

            <TextField
              fullWidth
              label="Password"
              type={showPassword ? 'text' : 'password'}
              value={formData.password}
              onChange={(e) => setFormData({ ...formData, password: e.target.value })}
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton 
                      onClick={() => setShowPassword(!showPassword)}
                      edge="end"
                      sx={{ color: 'rgba(255, 255, 255, 0.7)' }}
                    >
                      {showPassword ? <VisibilityOff /> : <Visibility />}
                    </IconButton>
                  </InputAdornment>
                ),
              }}
              sx={{ 
                mb: 2,
                '& .MuiOutlinedInput-root': {
                  '& fieldset': {
                    borderColor: 'rgba(255, 255, 255, 0.23)',
                  },
                  '&:hover fieldset': {
                    borderColor: '#FF4B2B',
                  },
                  '&.Mui-focused fieldset': {
                    borderColor: '#FF4B2B',
                  },
                },
                '& .MuiInputLabel-root': {
                  color: 'rgba(255, 255, 255, 0.7)',
                  '&.Mui-focused': {
                    color: '#FF4B2B',
                  },
                },
                '& .MuiOutlinedInput-input': {
                  color: '#fff',
                },
              }}
            />

            <TextField
              fullWidth
              label="Confirm Password"
              type={showPassword ? 'text' : 'password'}
              value={formData.confirmPassword}
              onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
              sx={{ 
                mb: 3,
                '& .MuiOutlinedInput-root': {
                  '& fieldset': {
                    borderColor: 'rgba(255, 255, 255, 0.23)',
                  },
                  '&:hover fieldset': {
                    borderColor: '#FF4B2B',
                  },
                  '&.Mui-focused fieldset': {
                    borderColor: '#FF4B2B',
                  },
                },
                '& .MuiInputLabel-root': {
                  color: 'rgba(255, 255, 255, 0.7)',
                  '&.Mui-focused': {
                    color: '#FF4B2B',
                  },
                },
                '& .MuiOutlinedInput-input': {
                  color: '#fff',
                },
              }}
            />

            <Button
              fullWidth
              type="submit"
              variant="contained"
              sx={{
                py: 1.5,
                background: 'linear-gradient(45deg, #FF4B2B, #FF416C)',
                '&:hover': {
                  background: 'linear-gradient(45deg, #FF416C, #FF4B2B)',
                  transform: 'translateY(-2px)',
                },
                transition: 'transform 0.2s',
                boxShadow: '0 4px 20px rgba(255, 75, 43, 0.25)',
              }}
            >
              Create Account
            </Button>
          </form>

          <Typography align="center" sx={{ mt: 3, color: 'rgba(255, 255, 255, 0.7)' }}>
            Already have an account?{' '}
            <Link 
              component={RouterLink} 
              to="/login" 
              sx={{ 
                color: '#FF4B2B',
                textDecoration: 'none',
                '&:hover': {
                  textDecoration: 'underline',
                },
              }}
            >
              Login
            </Link>
          </Typography>
        </CardContent>
      </Card>
    </Box>
  );
}
