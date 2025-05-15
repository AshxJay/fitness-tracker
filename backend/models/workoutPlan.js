import mongoose from 'mongoose';

const workoutPlanSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  name: {
    type: String,
    required: true
  },
  description: String,
  level: {
    type: String,
    required: true,
    enum: ['beginner', 'intermediate', 'advanced']
  },
  duration: {
    type: Number,  // in weeks
    required: true
  },
  schedule: [{
    day: {
      type: String,
      required: true,
      enum: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday']
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
        type: String,  // Can be "12" or "8-12" for rep ranges
        required: true
      },
      weight: {
        type: String,  // Can be actual weight or "bodyweight"
        required: true
      },
      restBetweenSets: {
        type: Number,  // in seconds
        required: true
      },
      notes: String,
      alternatives: [{
        name: String,
        description: String
      }]
    }],
    restBetweenExercises: {
      type: Number,  // in seconds
      default: 60
    }
  }],
  goals: [{
    type: {
      type: String,
      required: true,
      enum: ['strength', 'muscle', 'endurance', 'weight-loss']
    },
    description: String
  }],
  equipment: [{
    type: String,
    required: true
  }],
  estimatedTime: {
    type: Number,  // in minutes
    required: true
  },
  isActive: {
    type: Boolean,
    default: true
  },
  progress: [{
    week: {
      type: Number,
      required: true
    },
    day: {
      type: String,
      required: true
    },
    completed: {
      type: Boolean,
      required: true
    },
    date: {
      type: Date,
      required: true,
      default: Date.now
    },
    notes: String
  }]
}, {
  timestamps: true
});

export default mongoose.model('WorkoutPlan', workoutPlanSchema);
