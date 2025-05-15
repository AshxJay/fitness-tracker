import express from 'express';
import { protect } from '../middleware/auth.js';
import Goal from '../models/goal.js';

const router = express.Router();

// Apply auth middleware to all routes
router.use(protect);

// Get all goals for the user
router.get('/', async (req, res) => {
  try {
    const goals = await Goal.find({ userId: req.user._id })
      .sort({ createdAt: -1 });
    res.json(goals);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get goals by type
router.get('/type/:type', async (req, res) => {
  try {
    const goals = await Goal.find({
      userId: req.user._id,
      type: req.params.type
    }).sort({ createdAt: -1 });
    res.json(goals);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Create a new goal
router.post('/', async (req, res) => {
  try {
    const { type, name, description, targetValue, currentValue, unit, startDate, targetDate } = req.body;

    // Validate required fields
    if (!type || !name || targetValue === undefined || currentValue === undefined || !unit || !targetDate) {
      return res.status(400).json({
        message: 'Missing required fields',
        required: ['type', 'name', 'targetValue', 'currentValue', 'unit', 'targetDate'],
        received: req.body
      });
    }

    // Create goal with validated data
    const goal = new Goal({
      type,
      name,
      description,
      targetValue: Number(targetValue),
      currentValue: Number(currentValue),
      unit,
      startDate: startDate || new Date(),
      targetDate,
      userId: req.user._id,
      status: 'in-progress'
    });

    const savedGoal = await goal.save();
    res.status(201).json(savedGoal);
  } catch (error) {
    console.error('Goal creation error:', error);
    res.status(400).json({
      message: 'Error creating goal',
      error: error.message,
      validationErrors: error.errors
    });
  }
});

// Update a goal
router.patch('/:id', async (req, res) => {
  try {
    const goal = await Goal.findOne({
      _id: req.params.id,
      userId: req.user._id
    });

    if (!goal) {
      return res.status(404).json({ message: 'Goal not found' });
    }

    Object.assign(goal, req.body);
    const updatedGoal = await goal.save();
    res.json(updatedGoal);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Delete a goal
router.delete('/:id', async (req, res) => {
  try {
    const goal = await Goal.findOneAndDelete({
      _id: req.params.id,
      userId: req.user._id
    });

    if (!goal) {
      return res.status(404).json({ message: 'Goal not found' });
    }

    res.json({ message: 'Goal deleted' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Update goal progress
router.post('/:id/progress', async (req, res) => {
  try {
    const goal = await Goal.findOne({
      _id: req.params.id,
      userId: req.user._id
    });

    if (!goal) {
      return res.status(404).json({ message: 'Goal not found' });
    }

    const { value, note } = req.body;
    goal.progress.push({
      value,
      note,
      date: new Date()
    });

    goal.currentValue = value;

    // Update status if goal is met
    if (goal.type === 'weight' || goal.type === 'strength') {
      if (value >= goal.targetValue) {
        goal.status = 'completed';
      }
    } else if (goal.type === 'endurance') {
      if (value >= goal.targetValue) {
        goal.status = 'completed';
      }
    }

    const updatedGoal = await goal.save();
    res.json(updatedGoal);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Get goal statistics
router.get('/stats', async (req, res) => {
  try {
    const stats = await Goal.aggregate([
      { $match: { userId: req.user._id } },
      { $group: {
        _id: '$status',
        count: { $sum: 1 }
      }}
    ]);

    const formattedStats = stats.reduce((acc, stat) => {
      acc[stat._id] = stat.count;
      return acc;
    }, {
      'in-progress': 0,
      'completed': 0,
      'failed': 0
    });

    res.json(formattedStats);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

export default router;
