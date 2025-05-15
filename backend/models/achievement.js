import mongoose from 'mongoose';

const achievementSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  name: {
    type: String,
    required: true
  },
  description: {
    type: String,
    required: true
  },
  category: {
    type: String,
    required: true,
    enum: ['workout', 'nutrition', 'consistency', 'milestone']
  },
  criteria: {
    type: {
      type: String,
      required: true,
      enum: ['count', 'duration', 'weight', 'streak']
    },
    value: {
      type: Number,
      required: true
    },
    unit: String
  },
  icon: {
    type: String,
    required: true
  },
  dateEarned: {
    type: Date,
    required: true,
    default: Date.now
  },
  progress: {
    current: {
      type: Number,
      required: true,
      default: 0
    },
    target: {
      type: Number,
      required: true
    }
  },
  isCompleted: {
    type: Boolean,
    default: false
  }
}, {
  timestamps: true
});

export default mongoose.model('Achievement', achievementSchema);
