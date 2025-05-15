import express from 'express';
import jwt from 'jsonwebtoken';
import User from '../models/user.js';
import { protect } from '../middleware/auth.js';
import validator from 'validator';

const router = express.Router();

// Register user
router.post('/signup', async (req, res) => {
  try {
    console.log('Received signup request:', req.body);
    const { email, password, name, profile } = req.body;

    // Validate email format
    if (!validator.isEmail(email)) {
      console.log('Invalid email format:', email);
      return res.status(400).json({ message: 'Please provide a valid email address' });
    }

    // Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      console.log('Email already registered:', email);
      return res.status(400).json({ message: 'Email already registered' });
    }

    // Validate password
    if (!password) {
      console.log('Password missing');
      return res.status(400).json({ message: 'Password is required' });
    }
    
    if (password.length < 8) {
      console.log('Password too short');
      return res.status(400).json({ message: 'Password must be at least 8 characters long' });
    }

    // Validate required profile fields
    const requiredFields = ['height', 'weight', 'age', 'gender', 'activityLevel', 'bmr', 'tdee'];
    const missingFields = requiredFields.filter(field => !profile[field]);
    
    if (missingFields.length > 0) {
      console.log('Missing required profile fields:', missingFields);
      return res.status(400).json({
        message: `Missing required profile fields: ${missingFields.join(', ')}`
      });
    }

    // Create user with validated data
    console.log('Creating new user with data:', { email, name, profile });
    const user = await User.create({
      email,
      password,
      name,
      profile: {
        ...profile,
        lastUpdated: new Date()
      }
    });

    console.log('User created successfully:', user._id);

    // Generate JWT token
    const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, {
      expiresIn: '7d'
    });

    // Return user data without password and with token
    const userResponse = user.toObject();
    delete userResponse.password;

    console.log('Sending successful signup response');
    res.status(201).json({
      user: userResponse,
      token
    });
  } catch (error) {
    console.error('Signup error:', error);
    res.status(400).json({ message: error.message || 'Failed to create account' });
  }
});

// Login user
router.post('/login', async (req, res) => {
  const { email, password } = req.body;

  // Validate email format
  if (!validator.isEmail(email)) {
    return res.status(400).json({ message: 'Please provide a valid email address' });
  }
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    
    if (!user || !(await user.comparePassword(password))) {
      throw new Error('Invalid login credentials');
    }

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET);
    res.json({ user, token });
  } catch (error) {
    res.status(401).json({ message: error.message });
  }
});

// Get user profile
router.get('/profile', protect, async (req, res) => {
  res.json(req.user);
});

// Update user profile
router.patch('/profile', protect, async (req, res) => {
  const updates = Object.keys(req.body);
  const allowedUpdates = ['name', 'password', 'profile'];
  const isValidOperation = updates.every(update => allowedUpdates.includes(update));

  if (!isValidOperation) {
    return res.status(400).json({ message: 'Invalid updates' });
  }

  try {
    updates.forEach(update => {
      req.user[update] = req.body[update];
    });
    await req.user.save();
    res.json(req.user);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

export default router;
