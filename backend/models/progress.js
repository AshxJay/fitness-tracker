import mongoose from 'mongoose';

const progressSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  date: {
    type: Date,
    required: true,
    default: Date.now
  },
  type: {
    type: String,
    required: true,
    enum: ['weight', 'workout', 'measurements']
  },
  value: {
    type: Number,
    required: true
  },
  notes: {
    type: String
  },
  // For workout progress
  workoutDetails: {
    exerciseName: String,
    sets: Number,
    reps: Number,
    weight: Number
  },
  // For body measurements
  measurements: {
    chest: Number,
    waist: Number,
    hips: Number,
    biceps: Number,
    thighs: Number
  }
}, {
  timestamps: true
});

const Progress = mongoose.model('Progress', progressSchema);

export default Progress;
