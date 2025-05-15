import mongoose from 'mongoose';

const workoutSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true
  },
  exercises: [{
    name: {
      type: String,
      required: true
    },
    sets: {
      type: Number,
      required: true
    },
    reps: {
      type: Number,
      required: true
    },
    weight: {
      type: Number,
      required: true
    },
    notes: String
  }],
  date: {
    type: Date,
    default: Date.now
  },
  duration: {
    type: Number,
    required: true
  },
  type: {
    type: String,
    enum: ['strength', 'cardio', 'flexibility', 'hiit'],
    required: true
  },
  caloriesBurned: Number,
  notes: String,
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  }
}, { timestamps: true });

// Add index for faster queries
workoutSchema.index({ user: 1, date: -1 });

export default mongoose.model('Workout', workoutSchema);
