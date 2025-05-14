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
} from '@mui/material';
import { Visibility, VisibilityOff, FitnessCenter } from '@mui/icons-material';
import { Link as RouterLink } from 'react-router-dom';
import { toast } from 'react-toastify';
import useStore from '../../store/useStore';

export default function Login() {
  const navigate = useNavigate();
  const setUser = useStore((state) => state.setUser);
  const setIsAuthenticated = useStore((state) => state.setIsAuthenticated);
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });
  const [showPassword, setShowPassword] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (!formData.email || !formData.password) {
      toast.error('Please fill in all fields');
      return;
    }
    
    const user = {
      email: formData.email,
      name: 'User',
      preferences: {
        calorieGoal: 2000,
        workoutDays: ['Monday', 'Wednesday', 'Friday'],
      }
    };
    
    setUser(user);
    setIsAuthenticated(true);
    toast.success('Login successful!');
    navigate('/dashboard', { replace: true });
  };

  return (
    <Box
      sx={{
        height: '100vh',
        width: '100vw',
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
              Welcome Back
            </Typography>
            <Typography variant="body1" sx={{ color: 'rgba(255, 255, 255, 0.7)' }}>
              Start your fitness journey today
            </Typography>
          </Box>

          <form onSubmit={handleSubmit}>
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
              Login
            </Button>
          </form>

          <Typography align="center" sx={{ mt: 3, color: 'rgba(255, 255, 255, 0.7)' }}>
            Don't have an account?{' '}
            <Link 
              component={RouterLink} 
              to="/signup" 
              sx={{ 
                color: '#FF4B2B',
                textDecoration: 'none',
                '&:hover': {
                  textDecoration: 'underline',
                },
              }}
            >
              Sign Up
            </Link>
          </Typography>
        </CardContent>
      </Card>
    </Box>
  );
}
