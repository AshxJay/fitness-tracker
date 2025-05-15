import mongoose from 'mongoose';

const goalSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  type: {
    type: String,
    required: true,
    enum: ['weight', 'strength', 'endurance', 'nutrition']
  },
  name: {
    type: String,
    required: true
  },
  description: String,
  targetValue: {
    type: Number,
    required: true
  },
  currentValue: {
    type: Number,
    required: true
  },
  unit: {
    type: String,
    required: true
  },
  startDate: {
    type: Date,
    required: true,
    default: Date.now
  },
  targetDate: {
    type: Date,
    required: true
  },
  status: {
    type: String,
    required: true,
    enum: ['in-progress', 'completed', 'failed'],
    default: 'in-progress'
  },
  progress: [{
    value: {
      type: Number,
      required: true
    },
    date: {
      type: Date,
      required: true,
      default: Date.now
    },
    note: String
  }]
}, {
  timestamps: true
});

export default mongoose.model('Goal', goalSchema);
