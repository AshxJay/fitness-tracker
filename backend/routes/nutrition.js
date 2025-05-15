import express from 'express';
import { protect } from '../middleware/auth.js';
import Nutrition from '../models/nutrition.js';

const router = express.Router();

// Apply auth middleware to all routes
router.use(protect);

// Get all nutrition logs for the user
router.get('/', async (req, res) => {
  try {
    const logs = await Nutrition.find({ userId: req.user._id })
      .sort({ date: -1 });
    res.json(logs);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get nutrition logs by date range
router.get('/range', async (req, res) => {
  try {
    const { startDate, endDate } = req.query;
    const logs = await Nutrition.find({
      userId: req.user._id,
      date: {
        $gte: new Date(startDate),
        $lte: new Date(endDate)
      }
    }).sort({ date: 1 });
    res.json(logs);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Add a new nutrition log
router.post('/', async (req, res) => {
  try {
    const nutrition = new Nutrition({
      ...req.body,
      userId: req.user._id
    });
    const savedNutrition = await nutrition.save();
    res.status(201).json(savedNutrition);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Update a nutrition log
router.patch('/:id', async (req, res) => {
  try {
    const nutrition = await Nutrition.findOne({
      _id: req.params.id,
      userId: req.user._id
    });

    if (!nutrition) {
      return res.status(404).json({ message: 'Nutrition log not found' });
    }

    Object.assign(nutrition, req.body);
    const updatedNutrition = await nutrition.save();
    res.json(updatedNutrition);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Delete a nutrition log
router.delete('/:id', async (req, res) => {
  try {
    const nutrition = await Nutrition.findOneAndDelete({
      _id: req.params.id,
      userId: req.user._id
    });

    if (!nutrition) {
      return res.status(404).json({ message: 'Nutrition log not found' });
    }

    res.json({ message: 'Nutrition log deleted' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get nutrition summary/stats
router.get('/stats', async (req, res) => {
  try {
    const { days = 7 } = req.query;
    const startDate = new Date();
    startDate.setDate(startDate.getDate() - parseInt(days));

    const logs = await Nutrition.find({
      userId: req.user._id,
      date: { $gte: startDate }
    });

    const summary = {
      averageCalories: 0,
      averageProtein: 0,
      averageCarbs: 0,
      averageFat: 0,
      totalLogs: logs.length
    };

    if (logs.length > 0) {
      const totals = logs.reduce((acc, log) => ({
        calories: acc.calories + log.totalCalories,
        protein: acc.protein + log.totalProtein,
        carbs: acc.carbs + log.totalCarbs,
        fat: acc.fat + log.totalFat
      }), { calories: 0, protein: 0, carbs: 0, fat: 0 });

      summary.averageCalories = Math.round(totals.calories / logs.length);
      summary.averageProtein = Math.round(totals.protein / logs.length);
      summary.averageCarbs = Math.round(totals.carbs / logs.length);
      summary.averageFat = Math.round(totals.fat / logs.length);
    }

    res.json(summary);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

export default router;
