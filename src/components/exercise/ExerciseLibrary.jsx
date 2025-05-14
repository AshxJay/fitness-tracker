import { useState } from 'react';
import {
  Box,
  Grid,
  Card,
  CardContent,
  CardMedia,
  Typography,
  TextField,
  InputAdornment,
  IconButton,
  Dialog,
  DialogContent,
  Chip,
  Tab,
  Tabs,
  Button,
} from '@mui/material';
import { Search, PlayArrow, FilterList } from '@mui/icons-material';

// Sample exercise data with YouTube video IDs
const exercises = [
  {
    id: 1,
    name: 'Barbell Bench Press',
    category: 'Chest',
    equipment: 'Barbell',
    difficulty: 'Intermediate',
    videoId: 'rT7DgCr-3pg',
    thumbnail: 'https://img.youtube.com/vi/rT7DgCr-3pg/maxresdefault.jpg',
    description: 'A compound exercise that primarily targets the chest muscles.',
    muscles: ['Chest', 'Shoulders', 'Triceps'],
    instructions: [
      'Lie on a flat bench with your feet flat on the ground',
      'Grip the barbell slightly wider than shoulder-width',
      'Lower the bar to your chest',
      'Press the bar back up to the starting position',
    ],
  },
  {
    id: 2,
    name: 'Deadlift',
    category: 'Back',
    equipment: 'Barbell',
    difficulty: 'Advanced',
    videoId: 'op9kVnSso6Q',
    thumbnail: 'https://img.youtube.com/vi/op9kVnSso6Q/maxresdefault.jpg',
    description: 'A compound exercise that targets multiple muscle groups.',
    muscles: ['Back', 'Legs', 'Core'],
    instructions: [
      'Stand with feet hip-width apart',
      'Bend at hips and knees to grip the barbell',
      'Keep your back straight and chest up',
      'Lift the bar by extending hips and knees',
    ],
  },
  {
    id: 3,
    name: 'Squats',
    category: 'Legs',
    equipment: 'Barbell',
    difficulty: 'Intermediate',
    videoId: 'ultWZbUMPL8',
    thumbnail: 'https://img.youtube.com/vi/ultWZbUMPL8/maxresdefault.jpg',
    description: 'The king of leg exercises, targeting multiple lower body muscles.',
    muscles: ['Quadriceps', 'Hamstrings', 'Glutes'],
    instructions: [
      'Stand with feet shoulder-width apart',
      'Lower your body by bending knees and hips',
      'Keep your back straight and chest up',
      'Return to starting position',
    ],
  },
  {
    id: 4,
    name: 'Pull-ups',
    category: 'Back',
    equipment: 'Pull-up Bar',
    difficulty: 'Advanced',
    videoId: 'eGo4IYlbE5g',
    thumbnail: 'https://img.youtube.com/vi/eGo4IYlbE5g/maxresdefault.jpg',
    description: 'An upper body compound exercise that builds back and arm strength.',
    muscles: ['Back', 'Biceps', 'Shoulders'],
    instructions: [
      'Grip the pull-up bar with hands wider than shoulder-width',
      'Hang with arms fully extended',
      'Pull yourself up until your chin is over the bar',
      'Lower yourself back down with control',
    ],
  },
  {
    id: 5,
    name: 'Shoulder Press',
    category: 'Shoulders',
    equipment: 'Dumbbells',
    difficulty: 'Intermediate',
    videoId: 'qEwKCR5JCog',
    thumbnail: 'https://img.youtube.com/vi/qEwKCR5JCog/maxresdefault.jpg',
    description: 'An overhead press that targets the shoulder muscles.',
    muscles: ['Shoulders', 'Triceps'],
    instructions: [
      'Stand with feet shoulder-width apart',
      'Hold dumbbells at shoulder height',
      'Press weights overhead until arms are extended',
      'Lower weights back to shoulders',
    ],
  },
];

const categories = ['All', 'Chest', 'Back', 'Legs', 'Shoulders', 'Arms', 'Core'];
const difficulties = ['Beginner', 'Intermediate', 'Advanced'];

export default function ExerciseLibrary() {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [selectedExercise, setSelectedExercise] = useState(null);
  const [videoDialogOpen, setVideoDialogOpen] = useState(false);

  const filteredExercises = exercises.filter((exercise) => {
    const matchesSearch = exercise.name
      .toLowerCase()
      .includes(searchTerm.toLowerCase());
    const matchesCategory =
      selectedCategory === 'All' || exercise.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const handleVideoClick = (exercise) => {
    setSelectedExercise(exercise);
    setVideoDialogOpen(true);
  };

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h4" sx={{ mb: 4, fontWeight: 'bold' }}>
        Exercise Library
      </Typography>

      {/* Search and Filter Section */}
      <Box sx={{ mb: 4 }}>
        <Grid container spacing={2} alignItems="center">
          <Grid item xs={12} md={6}>
            <TextField
              fullWidth
              placeholder="Search exercises..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <Search />
                  </InputAdornment>
                ),
              }}
            />
          </Grid>
          <Grid item xs={12} md={6}>
            <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
              {categories.map((category) => (
                <Chip
                  key={category}
                  label={category}
                  onClick={() => setSelectedCategory(category)}
                  color={selectedCategory === category ? 'primary' : 'default'}
                  sx={{
                    '&.MuiChip-root': {
                      background:
                        selectedCategory === category
                          ? 'linear-gradient(45deg, #FF4B2B, #FF416C)'
                          : 'default',
                    },
                  }}
                />
              ))}
            </Box>
          </Grid>
        </Grid>
      </Box>

      {/* Exercise Grid */}
      <Grid container spacing={3}>
        {filteredExercises.map((exercise) => (
          <Grid item xs={12} sm={6} md={4} key={exercise.id}>
            <Card
              sx={{
                height: '100%',
                display: 'flex',
                flexDirection: 'column',
                background: 'linear-gradient(135deg, #1a1a1a 0%, rgba(26, 26, 26, 0.9) 100%)',
                backdropFilter: 'blur(10px)',
                border: '1px solid rgba(255, 255, 255, 0.1)',
                transition: 'transform 0.2s',
                '&:hover': {
                  transform: 'translateY(-4px)',
                },
              }}
            >
              <Box sx={{ position: 'relative' }}>
                <CardMedia
                  component="img"
                  height="200"
                  image={exercise.thumbnail}
                  alt={exercise.name}
                />
                <IconButton
                  sx={{
                    position: 'absolute',
                    top: '50%',
                    left: '50%',
                    transform: 'translate(-50%, -50%)',
                    bgcolor: 'rgba(0, 0, 0, 0.7)',
                    '&:hover': {
                      bgcolor: 'rgba(0, 0, 0, 0.8)',
                    },
                  }}
                  onClick={() => handleVideoClick(exercise)}
                >
                  <PlayArrow sx={{ fontSize: 40 }} />
                </IconButton>
              </Box>
              <CardContent sx={{ flexGrow: 1 }}>
                <Typography variant="h6" gutterBottom>
                  {exercise.name}
                </Typography>
                <Box sx={{ mb: 2 }}>
                  <Chip
                    label={exercise.category}
                    size="small"
                    sx={{ mr: 1, mb: 1 }}
                  />
                  <Chip
                    label={exercise.difficulty}
                    size="small"
                    sx={{ mb: 1 }}
                    color={
                      exercise.difficulty === 'Advanced'
                        ? 'error'
                        : exercise.difficulty === 'Intermediate'
                        ? 'warning'
                        : 'success'
                    }
                  />
                </Box>
                <Typography
                  variant="body2"
                  color="text.secondary"
                  sx={{
                    display: '-webkit-box',
                    WebkitLineClamp: 3,
                    WebkitBoxOrient: 'vertical',
                    overflow: 'hidden',
                  }}
                >
                  {exercise.description}
                </Typography>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>

      {/* Video Dialog */}
      <Dialog
        open={videoDialogOpen}
        onClose={() => setVideoDialogOpen(false)}
        maxWidth="md"
        fullWidth
      >
        <DialogContent sx={{ p: 0, bgcolor: 'background.paper' }}>
          {selectedExercise && (
            <Box>
              <Box sx={{ position: 'relative', paddingTop: '56.25%' }}>
                <iframe
                  style={{
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    width: '100%',
                    height: '100%',
                    border: 0,
                  }}
                  src={`https://www.youtube.com/embed/${selectedExercise.videoId}`}
                  title={selectedExercise.name}
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                />
              </Box>
              <Box sx={{ p: 3 }}>
                <Typography variant="h5" gutterBottom>
                  {selectedExercise.name}
                </Typography>
                <Typography variant="body1" paragraph>
                  {selectedExercise.description}
                </Typography>
                <Typography variant="h6" gutterBottom>
                  Instructions:
                </Typography>
                <ol>
                  {selectedExercise.instructions.map((instruction, index) => (
                    <li key={index}>
                      <Typography variant="body1" paragraph>
                        {instruction}
                      </Typography>
                    </li>
                  ))}
                </ol>
                <Box sx={{ mt: 2 }}>
                  <Typography variant="subtitle1" gutterBottom>
                    Target Muscles:
                  </Typography>
                  <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
                    {selectedExercise.muscles.map((muscle) => (
                      <Chip key={muscle} label={muscle} size="small" />
                    ))}
                  </Box>
                </Box>
              </Box>
            </Box>
          )}
        </DialogContent>
      </Dialog>
    </Box>
  );
}
