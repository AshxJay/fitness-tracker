import { useState, useEffect } from 'react';
import { Box, Typography, Button, CircularProgress } from '@mui/material';
import { auth, workouts } from '../services/api';

export default function TestConnection() {
  const [status, setStatus] = useState('');
  const [loading, setLoading] = useState(false);

  const testBackendConnection = async () => {
    setLoading(true);
    setStatus('Testing connection...');
    
    try {
      // Try to register a test user
      await auth.register({
        email: 'test@example.com',
        password: 'password123',
        name: 'Test User'
      });
      setStatus('✅ Successfully connected to backend!');
    } catch (error) {
      if (error.response?.status === 400 && error.response?.data?.message?.includes('duplicate')) {
        setStatus('✅ Successfully connected to backend! (User already exists)');
      } else {
        setStatus(`❌ Connection error: ${error.message}`);
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box sx={{ p: 4, textAlign: 'center' }}>
      <Typography variant="h4" gutterBottom>
        Backend Connection Test
      </Typography>
      
      <Button 
        variant="contained" 
        onClick={testBackendConnection}
        disabled={loading}
        sx={{ my: 2 }}
      >
        {loading ? <CircularProgress size={24} /> : 'Test Connection'}
      </Button>

      <Typography 
        variant="body1" 
        sx={{ 
          mt: 2, 
          p: 2, 
          bgcolor: 'background.paper',
          borderRadius: 1
        }}
      >
        {status || 'Click the button to test connection'}
      </Typography>
    </Box>
  );
}
