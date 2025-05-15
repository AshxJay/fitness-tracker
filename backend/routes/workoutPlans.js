import express from 'express';
import { protect } from '../middleware/auth.js';
import WorkoutPlan from '../models/workoutPlan.js';

const router = express.Router();

// Apply auth middleware to all routes
router.use(protect);

// Get all workout plans for the user
router.get('/', async (req, res) => {
  try {
    const plans = await WorkoutPlan.find({ userId: req.user._id })
      .sort({ createdAt: -1 });
    res.json(plans);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get active workout plan
router.get('/active', async (req, res) => {
  try {
    const plan = await WorkoutPlan.findOne({
      userId: req.user._id,
      isActive: true
    });
    
    if (!plan) {
      return res.status(404).json({ message: 'No active workout plan found' });
    }
    
    res.json(plan);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Create a new workout plan
router.post('/', async (req, res) => {
  try {
    // If this is marked as active, deactivate all other plans
    if (req.body.isActive) {
      await WorkoutPlan.updateMany(
        { userId: req.user._id },
        { isActive: false }
      );
    }

    const plan = new WorkoutPlan({
      ...req.body,
      userId: req.user._id
    });
    const savedPlan = await plan.save();
    res.status(201).json(savedPlan);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Update a workout plan
router.patch('/:id', async (req, res) => {
  try {
    const plan = await WorkoutPlan.findOne({
      _id: req.params.id,
      userId: req.user._id
    });

    if (!plan) {
      return res.status(404).json({ message: 'Workout plan not found' });
    }

    // If this plan is being activated, deactivate all other plans
    if (!plan.isActive && req.body.isActive) {
      await WorkoutPlan.updateMany(
        { userId: req.user._id, _id: { $ne: plan._id } },
        { isActive: false }
      );
    }

    Object.assign(plan, req.body);
    const updatedPlan = await plan.save();
    res.json(updatedPlan);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Delete a workout plan
router.delete('/:id', async (req, res) => {
  try {
    const plan = await WorkoutPlan.findOneAndDelete({
      _id: req.params.id,
      userId: req.user._id
    });

    if (!plan) {
      return res.status(404).json({ message: 'Workout plan not found' });
    }

    res.json({ message: 'Workout plan deleted' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Record workout completion
router.post('/:id/progress', async (req, res) => {
  try {
    const plan = await WorkoutPlan.findOne({
      _id: req.params.id,
      userId: req.user._id
    });

    if (!plan) {
      return res.status(404).json({ message: 'Workout plan not found' });
    }

    const { week, day, completed, notes } = req.body;
    plan.progress.push({
      week,
      day,
      completed,
      notes,
      date: new Date()
    });

    const updatedPlan = await plan.save();
    res.json(updatedPlan);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Get workout plan statistics
router.get('/stats', async (req, res) => {
  try {
    const totalWorkouts = await WorkoutPlan.aggregate([
      { $match: { userId: req.user._id } },
      { $project: {
        totalWorkouts: { $size: '$progress' },
        completedWorkouts: {
          $size: {
            $filter: {
              input: '$progress',
              as: 'progress',
              cond: { $eq: ['$$progress.completed', true] }
            }
          }
        }
      }},
      { $group: {
        _id: null,
        totalWorkouts: { $sum: '$totalWorkouts' },
        completedWorkouts: { $sum: '$completedWorkouts' }
      }}
    ]);

    const stats = {
      totalWorkouts: 0,
      completedWorkouts: 0,
      completionRate: 0
    };

    if (totalWorkouts.length > 0) {
      stats.totalWorkouts = totalWorkouts[0].totalWorkouts;
      stats.completedWorkouts = totalWorkouts[0].completedWorkouts;
      stats.completionRate = Math.round((stats.completedWorkouts / stats.totalWorkouts) * 100);
    }

    res.json(stats);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

export default router;
