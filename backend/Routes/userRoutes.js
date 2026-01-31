const express = require('express');
const router = express.Router();
const User = require('../models/User');
const authMiddleware = require('../middleware/authMiddleware');

/**
 * PUT /api/users/profile
 * Update current user profile (username, email, profilePic).
 * JWT required. Does not change password.
 */
router.put('/profile', authMiddleware.protect, async (req, res) => {
  try {
    const { username, email, profilePic } = req.body;
    const user = await User.findById(req.user._id).select('-password');

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    if (username !== undefined && username !== null) {
      const trimmed = String(username).trim();
      if (!trimmed) {
        return res.status(400).json({ message: 'Username cannot be empty' });
      }
      const existing = await User.findOne({ username: trimmed, _id: { $ne: user._id } });
      if (existing) {
        return res.status(409).json({ message: 'Username already taken' });
      }
      user.username = trimmed;
    }

    if (email !== undefined && email !== null) {
      const trimmed = String(email).trim().toLowerCase();
      if (!trimmed) {
        return res.status(400).json({ message: 'Email cannot be empty' });
      }
      const existing = await User.findOne({ email: trimmed, _id: { $ne: user._id } });
      if (existing) {
        return res.status(409).json({ message: 'Email already in use' });
      }
      user.email = trimmed;
    }

    if (profilePic !== undefined) {
      user.profilePic = profilePic === '' || profilePic == null ? null : String(profilePic).trim();
    }

    await user.save();

    res.json({
      _id: user._id,
      username: user.username,
      email: user.email,
      profilePic: user.profilePic || null,
    });
  } catch (error) {
    console.error('Profile update error:', error);
    res.status(500).json({
      message: 'Failed to update profile',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined,
    });
  }
});

module.exports = router;
