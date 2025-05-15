import mongoose from 'mongoose';

const nutritionSchema = new mongoose.Schema({
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
  meals: [{
    name: {
      type: String,
      required: true
    },
    time: {
      type: Date,
      required: true
    },
    foods: [{
      name: {
        type: String,
        required: true
      },
      calories: {
        type: Number,
        required: true
      },
      protein: {
        type: Number,
        required: true
      },
      carbs: {
        type: Number,
        required: true
      },
      fat: {
        type: Number,
        required: true
      },
      servingSize: {
        type: Number,
        required: true
      },
      unit: {
        type: String,
        required: true,
        enum: ['g', 'ml', 'oz', 'piece', 'serving'] // ✅ 'serving' added here
      }
    }]
  }],
  totalCalories: {
    type: Number,
    required: true
  },
  totalProtein: {
    type: Number,
    required: true
  },
  totalCarbs: {
    type: Number,
    required: true
  },
  totalFat: {
    type: Number,
    required: true
  }
}, {
  timestamps: true
});

export default mongoose.model('Nutrition', nutritionSchema);
