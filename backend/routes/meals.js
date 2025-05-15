import express from 'express';
import Meal from '../models/meal.js';
import { protect } from '../middleware/auth.js';

const router = express.Router();

// Get all meals for the logged-in user
router.get('/', protect, async (req, res) => {
  try {
    const meals = await Meal.find({ userId: req.user._id }).sort({ date: -1 });
    res.json(meals);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Add a new meal
router.post('/', protect, async (req, res) => {
  try {
    const meal = new Meal({
      ...req.body,
      userId: req.user._id
    });
    const savedMeal = await meal.save();
    res.status(201).json(savedMeal);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Get meals for a specific date range
router.get('/range', protect, async (req, res) => {
  try {
    const { startDate, endDate } = req.query;
    const meals = await Meal.find({
      userId: req.user._id,
      date: {
        $gte: new Date(startDate),
        $lte: new Date(endDate)
      }
    }).sort({ date: 1 });
    res.json(meals);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Delete a meal
router.delete('/:id', protect, async (req, res) => {
  try {
    const meal = await Meal.findOneAndDelete({
      _id: req.params.id,
      userId: req.user._id
    });
    if (!meal) {
      return res.status(404).json({ message: 'Meal not found' });
    }
    res.json({ message: 'Meal deleted' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

export default router;
