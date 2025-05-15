import { useState, useEffect } from 'react';
import { workoutPlansService } from '../../services/workoutPlansService';
import {
  Box, Grid, Card, CardContent, Typography, Button, Chip, Dialog,
  DialogTitle, DialogContent, DialogActions, List, ListItem,
  ListItemText, ListItemIcon, Divider, IconButton, Collapse,
  MenuItem, Select, TextField, FormControl, InputLabel
} from '@mui/material';
import {
  Schedule, FitnessCenter, Timer, ExpandMore, ExpandLess,
  Add as AddIcon, PlayArrow, Pause, Stop, Edit, Delete as DeleteIcon
} from '@mui/icons-material';
import { toast } from 'react-toastify';

const planDurations = [
  { value: 4, label: '4 weeks' },
  { value: 8, label: '8 weeks' },
  { value: 12, label: '12 weeks' },
  { value: 16, label: '16 weeks' }
];

const planFrequencies = [
  '2-3 times per week',
  '3-4 times per week',
  '4-5 times per week',
  '5-6 times per week'
];

const planLevels = [
  { value: 'beginner', label: 'Beginner' },
  { value: 'intermediate', label: 'Intermediate' },
  { value: 'advanced', label: 'Advanced' }
];

const allExercises = [
  { name: 'Push-ups', category: 'Upper Body', equipment: 'Bodyweight' },
  { name: 'Squats', category: 'Lower Body', equipment: 'Bodyweight' },
  { name: 'Bench Press', category: 'Upper Body', equipment: 'Barbell' },
  { name: 'Deadlifts', category: 'Full Body', equipment: 'Barbell' },
  { name: 'Lunges', category: 'Lower Body', equipment: 'Bodyweight' },
  { name: 'Plank', category: 'Core', equipment: 'Bodyweight' },
  { name: 'Pull-ups', category: 'Upper Body', equipment: 'Bodyweight' },
  { name: 'Rows', category: 'Upper Body', equipment: 'Dumbbell' },
  { name: 'Shoulder Press', category: 'Upper Body', equipment: 'Dumbbell' },
  { name: 'Crunches', category: 'Core', equipment: 'Bodyweight' },
  { name: 'Bicep Curls', category: 'Upper Body', equipment: 'Dumbbell' },
  { name: 'Tricep Extensions', category: 'Upper Body', equipment: 'Dumbbell' }
];

const initialCustomPlan = {
  name: '',
  duration: 4,
  frequency: '3-4 times per week',
  level: 'beginner',
  description: '',
  estimatedTime: 45,
  workouts: [{ day: 'Day 1', exercises: [], notes: '' }]
};

export default function WorkoutPlans() {
  const [plans, setPlans] = useState([]);
  const [selectedPlan, setSelectedPlan] = useState(null);
  const [expandedDay, setExpandedDay] = useState(null);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [customDialogOpen, setCustomDialogOpen] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [customPlan, setCustomPlan] = useState(initialCustomPlan);
  const [newExercise, setNewExercise] = useState('');
  const [sets, setSets] = useState('');
  const [reps, setReps] = useState('');
  const [selectedDayIndex, setSelectedDayIndex] = useState(0);
  const [activePlan, setActivePlan] = useState(null);

  useEffect(() => {
    const fetchPlans = async () => {
      try {
        const data = await workoutPlansService.getWorkoutPlans();
        setPlans(data);
      } catch (error) {
        console.error('Error fetching workout plans:', error);
        toast.error('Failed to fetch workout plans');
      }
    };
    fetchPlans();
  }, []);

  const handleDeletePlan = async (id) => {
    try {
      await workoutPlansService.deleteWorkoutPlan(id);
      setPlans(plans.filter((plan) => plan._id !== id));
      toast.success('Plan deleted successfully!');
    } catch (error) {
      toast.error('Failed to delete workout plan');
    }
  };

  const handleStartPlan = (plan) => {
    setSelectedPlan(plan);
    setDialogOpen(true);
  };

  const handleConfirmStart = () => {
    setActivePlan(selectedPlan);
    toast.success('Workout plan started!');
    setDialogOpen(false);
  };

  const handleStopPlan = () => {
    setActivePlan(null);
    toast.info('Workout plan stopped!');
  };

  const toggleDay = (day) => {
    setExpandedDay(expandedDay === day ? null : day);
  };

  const openCustomPlanDialog = (plan = null) => {
    if (plan) {
      // Safely convert the plan data to match the form structure
      const formattedPlan = {
        ...initialCustomPlan, // Start with defaults
        ...plan, // Override with plan data
        duration: parseInt(plan.duration) || initialCustomPlan.duration,
        level: (plan.level || initialCustomPlan.level).toLowerCase(),
        workouts: plan.workouts?.length ? plan.workouts : initialCustomPlan.workouts
      };
      setCustomPlan(formattedPlan);
      setEditMode(true);
    } else {
      setCustomPlan(initialCustomPlan);
      setEditMode(false);
    }
    setCustomDialogOpen(true);
  };

  const handleExerciseChange = (dayIndex, exerciseIndex, value) => {
    setCustomPlan(prevPlan => {
      const updatedWorkouts = [...prevPlan.workouts];
      if (!updatedWorkouts[dayIndex].exercises) {
        updatedWorkouts[dayIndex].exercises = [];
      }
      updatedWorkouts[dayIndex].exercises[exerciseIndex] = value;
      return {
        ...prevPlan,
        workouts: updatedWorkouts
      };
    });
  };

  const addExerciseToDay = () => {
    if (!newExercise || !sets || !reps) {
      toast.error('Please fill in all exercise details');
      return;
    }

    setCustomPlan(prevPlan => {
      const updatedWorkouts = [...(prevPlan.workouts || [])];
      if (!updatedWorkouts[selectedDayIndex]) {
        updatedWorkouts[selectedDayIndex] = {
          day: `Day ${selectedDayIndex + 1}`,
          exercises: [],
          notes: ''
        };
      }

      const exercise = {
        name: newExercise,
        sets: parseInt(sets),
        reps: parseInt(reps),
        weight: 0,
        notes: ''
      };

      updatedWorkouts[selectedDayIndex].exercises = [
        ...(updatedWorkouts[selectedDayIndex].exercises || []),
        exercise
      ];

      return {
        ...prevPlan,
        workouts: updatedWorkouts
      };
    });

    setNewExercise('');
    setSets('');
    setReps('');
  };

  const handleRemoveDay = (index) => {
    setCustomPlan(prevPlan => ({
      ...prevPlan,
      workouts: prevPlan.workouts.filter((_, i) => i !== index)
    }));
  };

  const handleAddDay = () => {
    setCustomPlan(prevPlan => ({
      ...prevPlan,
      workouts: [
        ...prevPlan.workouts,
        {
          day: `Day ${prevPlan.workouts.length + 1}`,
          exercises: [],
          notes: ''
        }
      ]
    }));
  };

  const saveCustomPlan = async () => {
    if (!customPlan.name || !customPlan.duration || !customPlan.frequency || !customPlan.level || !customPlan.workouts || customPlan.workouts.length === 0) {
      toast.error('Please fill in all required fields');
      return;
    }

    if (!customPlan.estimatedTime || customPlan.estimatedTime < 1) {
      toast.error('Please enter a valid estimated time');
      return;
    }

    try {
      const planData = {
        name: customPlan.name,
        duration: parseInt(customPlan.duration),
        frequency: customPlan.frequency,
        level: customPlan.level.toLowerCase(),
        description: customPlan.description,
        estimatedTime: parseInt(customPlan.estimatedTime) || 45,
        workouts: customPlan.workouts.map(workout => ({
          day: workout.day,
          exercises: workout.exercises || [],
          notes: workout.notes || ''
        })),
        isActive: true
      };

      if (editMode && customPlan._id) {
        const updatedPlan = await workoutPlansService.updateWorkoutPlan(customPlan._id, planData);
        setPlans(prevPlans => prevPlans.map(p => p._id === customPlan._id ? updatedPlan : p));
      } else {
        const newPlan = await workoutPlansService.createWorkoutPlan(planData);
        setPlans(prevPlans => [...prevPlans, newPlan]);
      }

      setCustomDialogOpen(false);
      setCustomPlan(initialCustomPlan);
      setEditMode(false);
      toast.success(editMode ? 'Plan updated successfully!' : 'Plan created successfully!');
    } catch (error) {
      console.error('Error saving workout plan:', error);
      toast.error('Failed to save workout plan');
    }
  };

  return (
    <Box sx={{ p: 3, width: "73vw" }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 4 }}>
        <Typography variant="h4" sx={{ fontWeight: 'bold' }}>Workout Plans</Typography>
        <Box>
          {activePlan && (
            <Button
              variant="outlined"
              startIcon={<Stop />}
              color="error"
              onClick={handleStopPlan}
              sx={{ mr: 2 }}
            >
              Stop Plan
            </Button>
          )}
          <Button
            variant="contained"
            startIcon={<AddIcon />}
            onClick={() => openCustomPlanDialog()}
            sx={{
              background: 'linear-gradient(45deg, #FF4B2B, #FF416C)',
              '&:hover': { background: 'linear-gradient(45deg, #FF416C, #FF4B2B)' },
            }}
          >
            Create Custom Plan
          </Button>
        </Box>
      </Box>

      <Grid container spacing={3}>
        {plans.map((plan) => (
          <Grid item xs={12} md={6} key={plan._id || plan.id}>
            <Card
              sx={{
                height: '100%',
                background: 'linear-gradient(135deg, #1a1a1a 0%, rgba(26, 26, 26, 0.9) 100%)',
                border: '1px solid rgba(255, 255, 255, 0.1)',
              }}
            >
              <CardContent>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start' }}>
                  <Box>
                    <Typography variant="h6" sx={{ mb: 1 }}>{plan.name}</Typography>
                    <Box sx={{ display: 'flex', gap: 1, mb: 2 }}>
                      <Chip size="small" icon={<Schedule />} label={`${plan.duration} weeks`} sx={{ bgcolor: 'primary.main' }} />
                      <Chip size="small" icon={<FitnessCenter />} label={plan.frequency} sx={{ bgcolor: 'secondary.main' }} />
                      <Chip size="small" icon={<Timer />} label={plan.level ? plan.level.charAt(0).toUpperCase() + plan.level.slice(1) : 'Beginner'} sx={{ bgcolor: 'success.main' }} />
                    </Box>
                  </Box>
                  <Box sx={{ display: 'flex', gap: 1 }}>
                    <IconButton onClick={() => handleStartPlan(plan)} color="primary">
                      <PlayArrow />
                    </IconButton>
                    <IconButton onClick={() => openCustomPlanDialog(plan)} color="info">
                      <Edit />
                    </IconButton>
                    <IconButton onClick={() => handleDeletePlan(plan._id)} color="error">
                      <DeleteIcon />
                    </IconButton>
                  </Box>
                </Box>

                <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                  {plan.description}
                </Typography>

                <List>
                  {(plan.workouts || []).map((workout) => (
                    <Box key={workout.day}>
                      <ListItem button onClick={() => toggleDay(workout.day)}
                        sx={{ bgcolor: 'rgba(255,255,255,0.05)', borderRadius: 1, mb: 1 }}>
                        <ListItemText primary={workout.day} />
                        <IconButton edge="end">
                          {expandedDay === workout.day ? <ExpandLess /> : <ExpandMore />}
                        </IconButton>
                      </ListItem>
                      <Collapse in={expandedDay === workout.day}>
                        <List sx={{ pl: 2 }}>
                          {(workout.exercises || []).map((ex, idx) => (
                            <ListItem key={idx}>
                              <ListItemIcon><FitnessCenter sx={{ color: 'primary.main' }} /></ListItemIcon>
                              <ListItemText 
                                primary={
                                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                    <Typography>{ex.name}</Typography>
                                    <Chip 
                                      size="small" 
                                      label={ex.equipment} 
                                      sx={{ backgroundColor: 'rgba(255,255,255,0.1)' }}
                                    />
                                  </Box>
                                }
                                secondary={
                                  <>
                                    <Typography variant="body2" component="span">
                                      {`${ex.sets} sets × ${ex.reps} reps`}
                                    </Typography>
                                    {ex.notes && (
                                      <Typography variant="caption" display="block" color="text.secondary">
                                        Note: {ex.notes}
                                      </Typography>
                                    )}
                                  </>
                                }
                              />
                            </ListItem>
                          ))}
                        </List>
                      </Collapse>
                      <Divider sx={{ my: 1 }} />
                    </Box>
                  ))}
                </List>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>

      {/* Start Plan Dialog */}
      <Dialog open={dialogOpen} onClose={() => setDialogOpen(false)} maxWidth="sm" fullWidth>
        <DialogTitle>Start Workout Plan</DialogTitle>
        <DialogContent>
          <Typography variant="body1" sx={{ mb: 2 }}>
            Are you sure you want to start the "{selectedPlan?.name}" plan?
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDialogOpen(false)}>Cancel</Button>
          <Button
            onClick={handleConfirmStart}
            variant="contained"
            sx={{
              background: 'linear-gradient(45deg, #FF4B2B, #FF416C)',
              '&:hover': { background: 'linear-gradient(45deg, #FF416C, #FF4B2B)' },
            }}
          >
            Start Plan
          </Button>
        </DialogActions>
      </Dialog>

      {/* Create Custom Plan Dialog */}
      <Dialog 
        open={customDialogOpen} 
        onClose={() => {
          setCustomDialogOpen(false);
          setEditMode(false);
          setCustomPlan({...initialCustomPlan});
          setNewExercise('');
          setSets('');
          setReps('');
          setSelectedDayIndex(0);
        }}
        maxWidth="md"
        fullWidth
        PaperProps={{
          sx: {
            bgcolor: 'background.paper',
            maxHeight: '90vh',
            overflowY: 'auto'
          }
        }}
      >
        <DialogTitle>{editMode ? 'Edit Workout Plan' : 'Create Custom Plan'}</DialogTitle>
        <DialogContent>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, mt: 2 }}>
            <TextField label="Plan Name" value={customPlan.name} onChange={(e) => setCustomPlan({ ...customPlan, name: e.target.value })} />
            <FormControl fullWidth sx={{ mb: 2 }}>
              <InputLabel>Duration</InputLabel>
              <Select
                value={customPlan.duration || ''}
                label="Duration"
                onChange={(e) => setCustomPlan({ ...customPlan, duration: parseInt(e.target.value) })}
              >
                {planDurations.map((duration) => (
                  <MenuItem key={duration.value} value={duration.value}>{duration.label}</MenuItem>
                ))}
              </Select>
            </FormControl>
            <FormControl fullWidth sx={{ mb: 2 }}>
              <InputLabel>Frequency</InputLabel>
              <Select
                value={customPlan.frequency || ''}
                label="Frequency"
                onChange={(e) => setCustomPlan({ ...customPlan, frequency: e.target.value })}
              >
                {planFrequencies.map((frequency) => (
                  <MenuItem key={frequency} value={frequency}>{frequency}</MenuItem>
                ))}
              </Select>
            </FormControl>
            <FormControl fullWidth sx={{ mb: 2 }}>
              <InputLabel>Level</InputLabel>
              <Select
                value={customPlan.level || ''}
                label="Level"
                onChange={(e) => setCustomPlan({ ...customPlan, level: e.target.value })}
              >
                {planLevels.map((level) => (
                  <MenuItem key={level.value} value={level.value}>{level.label}</MenuItem>
                ))}
              </Select>
            </FormControl>
            <TextField 
              label="Description" 
              multiline 
              fullWidth 
              sx={{ mb: 2 }}
              value={customPlan.description} 
              onChange={(e) => setCustomPlan({ ...customPlan, description: e.target.value })} 
            />
            <TextField
              label="Estimated Time (minutes)"
              type="number"
              fullWidth
              sx={{ mb: 2 }}
              value={customPlan.estimatedTime}
              onChange={(e) => setCustomPlan({ ...customPlan, estimatedTime: parseInt(e.target.value) || '' })}
            />
            <Divider />
            <Typography variant="h6">Add Exercises</Typography>
            <FormControl fullWidth>
              <InputLabel>Exercise</InputLabel>
              <Select
                fullWidth
                value={newExercise}
                label="Exercise"
                onChange={(e) => setNewExercise(e.target.value)}
                renderValue={(selected) => selected}
              >
                {allExercises.map((ex) => (
                  <MenuItem key={ex.name} value={ex.name}>
                    <Box sx={{ display: 'flex', flexDirection: 'column' }}>
                      <Typography>{ex.name}</Typography>
                      <Typography variant="caption" color="text.secondary">
                        {ex.category} • {ex.equipment}
                      </Typography>
                    </Box>
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
            <Grid container spacing={2}>
              <Grid item xs={12} sm={6}>
                <TextField fullWidth label="Sets" type="number" value={sets} onChange={(e) => setSets(e.target.value)} />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField fullWidth label="Reps" type="number" value={reps} onChange={(e) => setReps(e.target.value)} />
              </Grid>
              <Grid item xs={12}>
                <FormControl fullWidth>
                  <InputLabel>Workout Day</InputLabel>
                  <Select
                    value={selectedDayIndex}
                    label="Workout Day"
                    onChange={(e) => setSelectedDayIndex(e.target.value)}
                  >
                    {customPlan?.workouts?.map((workout, index) => (
                      <MenuItem key={index} value={index}>{workout.day}</MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Grid>
            </Grid>
            <Button onClick={addExerciseToDay} variant="outlined">Add Exercise</Button>
            <Button onClick={handleAddDay} variant="outlined" sx={{ mt: 1 }}>+ Add New Day</Button>
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setCustomDialogOpen(false)}>Cancel</Button>
          <Button onClick={saveCustomPlan} variant="contained" sx={{ background: '#FF416C' }}>
            Save Plan
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}