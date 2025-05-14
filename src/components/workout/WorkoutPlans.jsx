import { useState } from 'react';
import {
  Box,
  Grid,
  Card,
  CardContent,
  Typography,
  Button,
  Chip,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  Divider,
  IconButton,
  Collapse,
} from '@mui/material';
import {
  Schedule,
  FitnessCenter,
  Timer,
  ExpandMore,
  ExpandLess,
  Add as AddIcon,
  PlayArrow,
} from '@mui/icons-material';
import { toast } from 'react-toastify';

const sampleWorkoutPlans = [
  {
    id: 1,
    name: 'Beginner Full Body',
    duration: '4 weeks',
    frequency: '3x per week',
    level: 'Beginner',
    description: 'Perfect for those just starting their fitness journey',
    workouts: [
      {
        day: 'Day 1',
        exercises: [
          { name: 'Bodyweight Squats', sets: 3, reps: 12 },
          { name: 'Push-ups', sets: 3, reps: 10 },
          { name: 'Dumbbell Rows', sets: 3, reps: 12 },
          { name: 'Plank', sets: 3, duration: '30 seconds' },
        ],
      },
      {
        day: 'Day 2',
        exercises: [
          { name: 'Walking Lunges', sets: 3, reps: 10 },
          { name: 'Dumbbell Shoulder Press', sets: 3, reps: 12 },
          { name: 'Glute Bridges', sets: 3, reps: 15 },
          { name: 'Bird Dogs', sets: 3, reps: 10 },
        ],
      },
      {
        day: 'Day 3',
        exercises: [
          { name: 'Romanian Deadlifts', sets: 3, reps: 12 },
          { name: 'Bench Press', sets: 3, reps: 10 },
          { name: 'Lat Pulldowns', sets: 3, reps: 12 },
          { name: 'Russian Twists', sets: 3, reps: 20 },
        ],
      },
    ],
  },
  {
    id: 2,
    name: 'Intermediate Strength',
    duration: '8 weeks',
    frequency: '4x per week',
    level: 'Intermediate',
    description: 'Focus on building strength and muscle mass',
    workouts: [
      {
        day: 'Day 1 - Upper Body',
        exercises: [
          { name: 'Bench Press', sets: 4, reps: '8-10' },
          { name: 'Barbell Rows', sets: 4, reps: '8-10' },
          { name: 'Military Press', sets: 3, reps: '10-12' },
          { name: 'Pull-ups', sets: 3, reps: 'AMRAP' },
        ],
      },
      {
        day: 'Day 2 - Lower Body',
        exercises: [
          { name: 'Squats', sets: 4, reps: '8-10' },
          { name: 'Romanian Deadlifts', sets: 4, reps: '8-10' },
          { name: 'Leg Press', sets: 3, reps: '12-15' },
          { name: 'Calf Raises', sets: 4, reps: '15-20' },
        ],
      },
    ],
  },
  // Add more workout plans...
];

export default function WorkoutPlans() {
  const [plans, setPlans] = useState(sampleWorkoutPlans);
  const [selectedPlan, setSelectedPlan] = useState(null);
  const [expandedDay, setExpandedDay] = useState(null);
  const [dialogOpen, setDialogOpen] = useState(false);

  const handleStartPlan = (plan) => {
    setSelectedPlan(plan);
    setDialogOpen(true);
  };

  const handleConfirmStart = () => {
    // In a real app, this would save to the user's active plan
    toast.success('Workout plan started successfully!');
    setDialogOpen(false);
  };

  const toggleDay = (day) => {
    setExpandedDay(expandedDay === day ? null : day);
  };

  return (
    <Box sx={{ p: 3 ,  width:"73vw"}}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 4 }}>
        <Typography variant="h4" sx={{ fontWeight: 'bold' }}>
          Workout Plans
        </Typography>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          sx={{
            background: 'linear-gradient(45deg, #FF4B2B, #FF416C)',
            '&:hover': {
              background: 'linear-gradient(45deg, #FF416C, #FF4B2B)',
            },
          }}
        >
          Create Custom Plan
        </Button>
      </Box>

      <Grid container spacing={3}>
        {plans.map((plan) => (
          <Grid item xs={12} md={6} key={plan.id}>
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
                    <Typography variant="h6" sx={{ mb: 1 }}>
                      {plan.name}
                    </Typography>
                    <Box sx={{ display: 'flex', gap: 1, mb: 2 }}>
                      <Chip
                        size="small"
                        icon={<Schedule />}
                        label={plan.duration}
                        sx={{ bgcolor: 'primary.main' }}
                      />
                      <Chip
                        size="small"
                        icon={<FitnessCenter />}
                        label={plan.frequency}
                        sx={{ bgcolor: 'secondary.main' }}
                      />
                      <Chip
                        size="small"
                        icon={<Timer />}
                        label={plan.level}
                        sx={{ bgcolor: 'success.main' }}
                      />
                    </Box>
                  </Box>
                  <Button
                    variant="contained"
                    startIcon={<PlayArrow />}
                    onClick={() => handleStartPlan(plan)}
                    sx={{
                      background: 'linear-gradient(45deg, #FF4B2B, #FF416C)',
                      '&:hover': {
                        background: 'linear-gradient(45deg, #FF416C, #FF4B2B)',
                      },
                    }}
                  >
                    Start Plan
                  </Button>
                </Box>

                <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                  {plan.description}
                </Typography>

                <List>
                  {plan.workouts.map((workout) => (
                    <Box key={workout.day}>
                      <ListItem
                        button
                        onClick={() => toggleDay(workout.day)}
                        sx={{
                          bgcolor: 'rgba(255, 255, 255, 0.05)',
                          borderRadius: 1,
                          mb: 1,
                        }}
                      >
                        <ListItemText primary={workout.day} />
                        <IconButton edge="end">
                          {expandedDay === workout.day ? <ExpandLess /> : <ExpandMore />}
                        </IconButton>
                      </ListItem>
                      <Collapse in={expandedDay === workout.day}>
                        <List sx={{ pl: 2 }}>
                          {workout.exercises.map((exercise, index) => (
                            <ListItem key={index}>
                              <ListItemIcon>
                                <FitnessCenter sx={{ color: 'primary.main' }} />
                              </ListItemIcon>
                              <ListItemText
                                primary={exercise.name}
                                secondary={`${exercise.sets} sets × ${exercise.reps} reps`}
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

      <Dialog open={dialogOpen} onClose={() => setDialogOpen(false)} maxWidth="sm" fullWidth>
        <DialogTitle>Start Workout Plan</DialogTitle>
        <DialogContent>
          <Typography variant="body1" sx={{ mb: 2 }}>
            Are you sure you want to start the "{selectedPlan?.name}" plan?
          </Typography>
          <Typography variant="body2" color="text.secondary">
            This will set this as your active workout plan. You can track your progress and get
            reminders for your workouts.
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDialogOpen(false)}>Cancel</Button>
          <Button
            onClick={handleConfirmStart}
            variant="contained"
            sx={{
              background: 'linear-gradient(45deg, #FF4B2B, #FF416C)',
              '&:hover': {
                background: 'linear-gradient(45deg, #FF416C, #FF4B2B)',
              },
            }}
          >
            Start Plan
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}
