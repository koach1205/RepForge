const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const User = require('../models/User');

// TEST ROUTE
router.get('/test', (req, res) => {
  res.json({ message: 'Auth route working' });
});

// REGISTER ROUTE (FINAL, CORRECT)
router.post('/register', async (req, res) => {
  try {
    // IMPORTANT: match User schema
    const { username, email, password } = req.body;

    // Validation
    if (!username || !email || !password) {
      return res.status(400).json({ message: 'All fields are required' });
    }

    // Check if user already exists (email OR username)
    const userExists = await User.findOne({
      $or: [{ email }, { username }]
    });

    if (userExists) {
      return res.status(409).json({ message: 'User already exists' });
    }

    // Create user
    // NOTE: password hashing happens in User model (pre-save hook)
    const user = await User.create({
      username,
      email,
      password
    });

    // Generate JWT
    const token = jwt.sign(
      { id: user._id },
      process.env.JWT_SECRET,
      { expiresIn: '7d' }
    );

    res.status(201).json({
      token,
      user: {
        id: user._id,
        username: user.username,
        email: user.email,
        profilePic: user.profilePic || null,
      },
    });

  } catch (error) {
    console.error('REGISTER ERROR:', error);
    res.status(500).json({ message: error.message });
  }
});

// LOGIN ROUTE
router.post('/login', async (req, res) => {
    try {
      const { email, password } = req.body;
  
      if (!email || !password) {
        return res.status(400).json({ message: 'Email and password are required' });
      }
  
      // Find user and explicitly include password
      const user = await User.findOne({ email }).select('+password');
  
      if (!user) {
        return res.status(401).json({ message: 'Invalid credentials' });
      }
  
      const isMatch = await user.matchPassword(password);
  
      if (!isMatch) {
        return res.status(401).json({ message: 'Invalid credentials' });
      }
  
      const token = jwt.sign(
        { id: user._id },
        process.env.JWT_SECRET,
        { expiresIn: '7d' }
      );
  
      res.json({
        token,
        user: {
          id: user._id,
          username: user.username,
          email: user.email,
          profilePic: user.profilePic || null,
        },
      });
  
    } catch (error) {
      console.error('LOGIN ERROR:', error);
      res.status(500).json({ message: 'Server error' });
    }
  });
  
module.exports = router;
