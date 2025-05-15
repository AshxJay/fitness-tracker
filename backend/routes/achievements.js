import express from 'express';
import { protect } from '../middleware/auth.js';
import Achievement from '../models/achievement.js';

const router = express.Router();

// Apply auth middleware to all routes
router.use(protect);

// Get all achievements for the user
router.get('/', async (req, res) => {
  try {
    const achievements = await Achievement.find({ userId: req.user._id })
      .sort({ dateEarned: -1 });
    res.json(achievements);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get achievements by category
router.get('/category/:category', async (req, res) => {
  try {
    const achievements = await Achievement.find({
      userId: req.user._id,
      category: req.params.category
    }).sort({ dateEarned: -1 });
    res.json(achievements);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Create a new achievement
router.post('/', async (req, res) => {
  try {
    const achievement = new Achievement({
      ...req.body,
      userId: req.user._id
    });
    const savedAchievement = await achievement.save();
    res.status(201).json(savedAchievement);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Update achievement progress
router.patch('/:id/progress', async (req, res) => {
  try {
    const achievement = await Achievement.findOne({
      _id: req.params.id,
      userId: req.user._id
    });

    if (!achievement) {
      return res.status(404).json({ message: 'Achievement not found' });
    }

    const { current } = req.body;
    achievement.progress.current = current;

    // Check if achievement is completed
    if (current >= achievement.progress.target && !achievement.isCompleted) {
      achievement.isCompleted = true;
      achievement.dateEarned = new Date();
    }

    const updatedAchievement = await achievement.save();
    res.json(updatedAchievement);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Get achievement statistics
router.get('/stats', async (req, res) => {
  try {
    const totalAchievements = await Achievement.countDocuments({
      userId: req.user._id
    });

    const completedAchievements = await Achievement.countDocuments({
      userId: req.user._id,
      isCompleted: true
    });

    const stats = await Achievement.aggregate([
      { $match: { userId: req.user._id } },
      { $group: {
        _id: '$category',
        total: { $sum: 1 },
        completed: {
          $sum: { $cond: ['$isCompleted', 1, 0] }
        }
      }}
    ]);

    const categoryStats = stats.reduce((acc, stat) => {
      acc[stat._id] = {
        total: stat.total,
        completed: stat.completed,
        percentage: Math.round((stat.completed / stat.total) * 100)
      };
      return acc;
    }, {});

    res.json({
      total: totalAchievements,
      completed: completedAchievements,
      percentage: Math.round((completedAchievements / totalAchievements) * 100),
      byCategory: categoryStats
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get recent achievements
router.get('/recent', async (req, res) => {
  try {
    const achievements = await Achievement.find({
      userId: req.user._id,
      isCompleted: true
    })
      .sort({ dateEarned: -1 })
      .limit(5);
    res.json(achievements);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

export default router;
