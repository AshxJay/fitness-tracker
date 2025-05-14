import { useState } from 'react';
import {
  Box,
  Grid,
  Card,
  CardContent,
  Typography,
  LinearProgress,
  Avatar,
  Tooltip,
} from '@mui/material';
import {
  EmojiEvents,
  DirectionsRun,
  FitnessCenter,
  Restaurant,
  LocalFireDepartment,
  Timer,
  TrendingUp,
  Grade,
} from '@mui/icons-material';

const achievementsList = [
  {
    id: 1,
    title: 'Workout Warrior',
    description: 'Complete 10 workouts',
    icon: <FitnessCenter />,
    color: '#FF4B2B',
    target: 10,
    current: 0,
    category: 'Workout',
  },
  {
    id: 2,
    title: 'Running Enthusiast',
    description: 'Run a total of 50km',
    icon: <DirectionsRun />,
    color: '#2ecc71',
    target: 50,
    current: 0,
    category: 'Cardio',
  },
  {
    id: 3,
    title: 'Nutrition Master',
    description: 'Log meals for 30 consecutive days',
    icon: <Restaurant />,
    color: '#3498db',
    target: 30,
    current: 0,
    category: 'Nutrition',
  },
  {
    id: 4,
    title: 'Calorie Crusher',
    description: 'Burn 5000 calories',
    icon: <LocalFireDepartment />,
    color: '#e74c3c',
    target: 5000,
    current: 0,
    category: 'Workout',
  },
  {
    id: 5,
    title: 'Early Bird',
    description: 'Complete 5 morning workouts',
    icon: <Timer />,
    color: '#f1c40f',
    target: 5,
    current: 0,
    category: 'Workout',
  },
  {
    id: 6,
    title: 'Goal Getter',
    description: 'Achieve 3 personal goals',
    icon: <TrendingUp />,
    color: '#9b59b6',
    target: 3,
    current: 0,
    category: 'Goals',
  },
  {
    id: 7,
    title: 'Strength Champion',
    description: 'Increase strength in any exercise by 50%',
    icon: <Grade />,
    color: '#e67e22',
    target: 50,
    current: 0,
    category: 'Strength',
  },
  {
    id: 8,
    title: 'Consistency King',
    description: 'Log in for 60 consecutive days',
    icon: <EmojiEvents />,
    color: '#1abc9c',
    target: 60,
    current: 0,
    category: 'General',
  },
];

export default function Achievements() {
  const [achievements, setAchievements] = useState(achievementsList);

  const calculateProgress = (current, target) => {
    return Math.min((current / target) * 100, 100);
  };

  const isAchieved = (achievement) => {
    return achievement.current >= achievement.target;
  };

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h4" sx={{ mb: 4, fontWeight: 'bold' }}>
        Achievements
      </Typography>

      <Grid container spacing={3}>
        {achievements.map((achievement) => (
          <Grid item xs={12} sm={6} md={4} lg={3} key={achievement.id}>
            <Card
              sx={{
                height: '100%',
                background: isAchieved(achievement)
                  ? `linear-gradient(135deg, rgba(${achievement.color}, 0.2) 0%, rgba(26, 26, 26, 0.9) 100%)`
                  : 'linear-gradient(135deg, #1a1a1a 0%, rgba(26, 26, 26, 0.9) 100%)',
                border: '1px solid rgba(255, 255, 255, 0.1)',
                position: 'relative',
                overflow: 'hidden',
              }}
            >
              <CardContent>
                <Box
                  sx={{
                    display: 'flex',
                    alignItems: 'center',
                    mb: 2,
                  }}
                >
                  <Avatar
                    sx={{
                      bgcolor: `${achievement.color}20`,
                      color: achievement.color,
                      mr: 2,
                    }}
                  >
                    {achievement.icon}
                  </Avatar>
                  <Box>
                    <Typography variant="h6" sx={{ fontSize: '1.1rem' }}>
                      {achievement.title}
                    </Typography>
                    <Typography
                      variant="caption"
                      sx={{
                        color: 'text.secondary',
                        bgcolor: `${achievement.color}20`,
                        px: 1,
                        py: 0.5,
                        borderRadius: 1,
                      }}
                    >
                      {achievement.category}
                    </Typography>
                  </Box>
                </Box>

                <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                  {achievement.description}
                </Typography>

                <Box sx={{ mt: 2 }}>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                    <Typography variant="body2" color="text.secondary">
                      Progress
                    </Typography>
                    <Typography variant="body2">
                      {achievement.current} / {achievement.target}
                    </Typography>
                  </Box>
                  <Tooltip
                    title={`${Math.round(calculateProgress(achievement.current, achievement.target))}%`}
                    placement="top"
                  >
                    <LinearProgress
                      variant="determinate"
                      value={calculateProgress(achievement.current, achievement.target)}
                      sx={{
                        height: 8,
                        borderRadius: 4,
                        bgcolor: 'rgba(255, 255, 255, 0.1)',
                        '& .MuiLinearProgress-bar': {
                          bgcolor: achievement.color,
                        },
                      }}
                    />
                  </Tooltip>
                </Box>

                {isAchieved(achievement) && (
                  <Box
                    sx={{
                      position: 'absolute',
                      top: 16,
                      right: 16,
                      color: achievement.color,
                    }}
                  >
                    <EmojiEvents />
                  </Box>
                )}
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>
    </Box>
  );
}
