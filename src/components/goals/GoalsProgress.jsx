import { useState, useEffect } from 'react';
import { goalsService } from '../../services/goalsService';
import {
  Box,
  Grid,
  Card,
  CardContent,
  Typography,
  Button,
  TextField,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  IconButton,
  LinearProgress,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
} from '@mui/material';
import {
  Add as AddIcon,
  Delete as DeleteIcon,
  Flag,
  CheckCircle,
  DirectionsRun,
} from '@mui/icons-material';
import { toast } from 'react-toastify';

const goalTypes = [
  'Weight Goal',
  'Muscle Mass Goal'
];

const measurementUnits = {
  'Weight Goal': 'kg',
  'Muscle Mass Goal': '%'
};

export default function GoalsProgress() {
  const [goals, setGoals] = useState([]);

  useEffect(() => {
    const fetchGoals = async () => {
      try {
        const data = await goalsService.getGoals();
        setGoals(data);
      } catch (error) {
        toast.error('Failed to fetch goals');
      }
    };
    fetchGoals();
  }, []);
  const [openDialog, setOpenDialog] = useState(false);
  const [newGoal, setNewGoal] = useState({
    type: '',
    target: '',
    current: '',
    deadline: '',
    notes: '',
  });

  const handleAddGoal = async () => {
    if (!newGoal.type || !newGoal.target || !newGoal.deadline) {
      toast.error('Please fill in all required fields');
      return;
    }

    try {
      const goalData = {
        ...newGoal,
        progress: 0,
        createdAt: new Date().toISOString(),
      };

      const savedGoal = await goalsService.createGoal(goalData);
      setGoals([...goals, savedGoal]);
      setNewGoal({
        type: '',
        target: '',
        current: '',
        deadline: '',
        notes: '',
      });
      setOpenDialog(false);
      toast.success('Goal added successfully!');
    } catch (error) {
      toast.error('Failed to add goal');
    }
  };

  const handleDeleteGoal = async (id) => {
    try {
      await goalsService.deleteGoal(id);
      setGoals(goals.filter((goal) => goal._id !== id));
      toast.success('Goal deleted successfully!');
    } catch (error) {
      toast.error('Failed to delete goal');
    }
  };

  const handleUpdateProgress = async (id, value) => {
    try {
      const goal = goals.find(g => g._id === id);
      if (!goal) return;

      const progress = Math.min(Math.max((value / goal.target) * 100, 0), 100);
      const updatedGoal = { ...goal, current: value, progress };
      
      await goalsService.updateGoal(id, updatedGoal);
      setGoals(
        goals.map((g) => g._id === id ? updatedGoal : g)
      );
    } catch (error) {
      toast.error('Failed to update progress');
    }
  };

  return (
    <Box sx={{ p: 3, width:"73vw" }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 4 }}>
        <Typography variant="h4" sx={{ fontWeight: 'bold' }}>
          Goals & Progress
        </Typography>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={() => setOpenDialog(true)}
          sx={{
            background: 'linear-gradient(45deg, #FF4B2B, #FF416C)',
            '&:hover': {
              background: 'linear-gradient(45deg, #FF416C, #FF4B2B)',
            },
          }}
        >
          Add Goal
        </Button>
      </Box>

      <Grid container spacing={3}>
        {goals.length === 0 ? (
          <Grid item xs={12}>
            <Card
              sx={{
                textAlign: 'center',
                py: 8,
                background: 'linear-gradient(135deg, #1a1a1a 0%, rgba(26, 26, 26, 0.9) 100%)',
                border: '1px solid rgba(255, 255, 255, 0.1)',
              }}
            >
              <Flag sx={{ fontSize: 48, color: 'text.secondary', mb: 2 }} />
              <Typography color="text.secondary">No goals set yet</Typography>
              <Typography color="text.secondary" variant="body2" sx={{ mt: 1 }}>
                Click the "Add Goal" button to set your first goal
              </Typography>
            </Card>
          </Grid>
        ) : (
          goals.map((goal) => (
            <Grid item xs={12} md={6} lg={4} key={goal.id}>
              <Card
                sx={{
                  height: '100%',
                  background: 'linear-gradient(135deg, #1a1a1a 0%, rgba(26, 26, 26, 0.9) 100%)',
                  border: '1px solid rgba(255, 255, 255, 0.1)',
                }}
              >
                <CardContent>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start' }}>
                    <Typography variant="h6" sx={{ mb: 2 }}>
                      {goal.type}
                    </Typography>
                    <IconButton
                      onClick={() => handleDeleteGoal(goal.id)}
                      sx={{ color: 'error.main' }}
                    >
                      <DeleteIcon />
                    </IconButton>
                  </Box>

                  <Box sx={{ mb: 3 }}>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                      <Typography variant="body2" color="text.secondary">
                        Progress
                      </Typography>
                      <Typography variant="body2">
                        {goal.current || 0} / {goal.target} {measurementUnits[goal.type]}
                      </Typography>
                    </Box>
                    <LinearProgress
                      variant="determinate"
                      value={goal.progress || 0}
                      sx={{
                        height: 8,
                        borderRadius: 4,
                        bgcolor: 'rgba(255, 75, 43, 0.1)',
                        '& .MuiLinearProgress-bar': {
                          bgcolor: '#FF4B2B',
                        },
                      }}
                    />
                  </Box>

                  <TextField
                    fullWidth
                    label="Current Progress"
                    type="number"
                    value={goal.current || ''}
                    onChange={(e) => handleUpdateProgress(goal.id, e.target.value)}
                    sx={{ mb: 2 }}
                  />

                  <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                    Deadline: {new Date(goal.deadline).toLocaleDateString()}
                  </Typography>

                  {goal.notes && (
                    <Typography variant="body2" color="text.secondary">
                      Notes: {goal.notes}
                    </Typography>
                  )}
                </CardContent>
              </Card>
            </Grid>
          ))
        )}
      </Grid>

      <Dialog open={openDialog} onClose={() => setOpenDialog(false)} maxWidth="sm" fullWidth>
        <DialogTitle>Add New Goal</DialogTitle>
        <DialogContent>
          <FormControl fullWidth sx={{ mt: 2 }}>
            <InputLabel>Goal Type</InputLabel>
            <Select
              value={newGoal.type}
              onChange={(e) => setNewGoal({ ...newGoal, type: e.target.value })}
              label="Goal Type"
            >
              {goalTypes.map((type) => (
                <MenuItem key={type} value={type}>
                  {type}
                </MenuItem>
              ))}
            </Select>
          </FormControl>

          <TextField
            fullWidth
            label={`Target Value (${newGoal.type ? measurementUnits[newGoal.type] : ''})`}
            type="number"
            value={newGoal.target}
            onChange={(e) => setNewGoal({ ...newGoal, target: e.target.value })}
            sx={{ mt: 2 }}
            InputProps={{
              inputProps: { 
                step: newGoal.type === 'Weight Goal' ? '0.1' : '1',
                min: 0
              }
            }}
          />

          <TextField
            fullWidth
            label={`Current Value (${newGoal.type ? measurementUnits[newGoal.type] : ''})`}
            type="number"
            value={newGoal.current}
            onChange={(e) => setNewGoal({ ...newGoal, current: e.target.value })}
            sx={{ mt: 2 }}
            InputProps={{
              inputProps: { 
                step: newGoal.type === 'Weight Goal' ? '0.1' : '1',
                min: 0
              }
            }}
          />

          <TextField
            fullWidth
            label="Deadline"
            type="date"
            value={newGoal.deadline}
            onChange={(e) => setNewGoal({ ...newGoal, deadline: e.target.value })}
            InputLabelProps={{ shrink: true }}
            sx={{ mt: 2 }}
          />

          <TextField
            fullWidth
            label="Notes"
            multiline
            rows={3}
            value={newGoal.notes}
            onChange={(e) => setNewGoal({ ...newGoal, notes: e.target.value })}
            sx={{ mt: 2 }}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenDialog(false)}>Cancel</Button>
          <Button
            onClick={handleAddGoal}
            variant="contained"
            sx={{
              background: 'linear-gradient(45deg, #FF4B2B, #FF416C)',
              '&:hover': {
                background: 'linear-gradient(45deg, #FF416C, #FF4B2B)',
              },
            }}
          >
            Add Goal
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}
