import express from 'express';
import { protect } from '../middleware/auth.js';
import Progress from '../models/progress.js';

const router = express.Router();

// Apply auth middleware to all routes
router.use(protect);

// Get all progress entries for the user
router.get('/', async (req, res) => {
  try {
    const progress = await Progress.find({ userId: req.user._id })
      .sort({ date: -1 });
    res.json(progress);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get progress by type
router.get('/type/:type', async (req, res) => {
  try {
    const progress = await Progress.find({
      userId: req.user._id,
      type: req.params.type
    }).sort({ date: -1 });
    res.json(progress);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Create a new progress entry
router.post('/', async (req, res) => {
  try {
    const progress = new Progress({
      ...req.body,
      userId: req.user._id
    });
    const savedProgress = await progress.save();
    res.status(201).json(savedProgress);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Update a progress entry
router.patch('/:id', async (req, res) => {
  try {
    const progress = await Progress.findOne({
      _id: req.params.id,
      userId: req.user._id
    });

    if (!progress) {
      return res.status(404).json({ message: 'Progress not found' });
    }

    Object.assign(progress, req.body);
    const updatedProgress = await progress.save();
    res.json(updatedProgress);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Delete a progress entry
router.delete('/:id', async (req, res) => {
  try {
    const progress = await Progress.findOneAndDelete({
      _id: req.params.id,
      userId: req.user._id
    });

    if (!progress) {
      return res.status(404).json({ message: 'Progress not found' });
    }

    res.json({ message: 'Progress deleted' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

export default router;
