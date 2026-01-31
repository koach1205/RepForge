const jwt = require('jsonwebtoken');
const User = require('../models/User');

// Generate JWT Token
// This function creates a JSON Web Token for authenticated users
// The token contains the user's ID and expires after 30 days
const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: '30d' // Token expires in 30 days
  });
};

// @desc    Register a new user
// @route   POST /api/auth/register
// @access  Public
const registerUser = async (req, res) => {
  try {
    const { username, email, password } = req.body;

    // Validate that all required fields are provided
    if (!username || !email || !password) {
      return res.status(400).json({ 
        message: 'Please provide username, email, and password' 
      });
    }

    // Check if user already exists
    const userExists = await User.findOne({ 
      $or: [{ email }, { username }] 
    });

    if (userExists) {
      return res.status(400).json({ 
        message: 'User already exists with this email or username' 
      });
    }

    // Create new user
    // The password will be automatically hashed by the pre-save middleware in the User model
    const user = await User.create({
      username,
      email,
      password
    });

    // Return user data and token
    res.status(201).json({
      _id: user._id,
      username: user.username,
      email: user.email,
      token: generateToken(user._id) // Generate and return JWT token
    });
  } catch (error) {
    console.error('Registration error:', error);
    res.status(500).json({ 
      message: 'Server error during registration',
      error: error.message 
    });
  }
};

// @desc    Authenticate a user and get token
// @route   POST /api/auth/login
// @access  Public
const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Validate that email and password are provided
    if (!email || !password) {
      return res.status(400).json({ 
        message: 'Please provide email and password' 
      });
    }

    // Find user by email and include password field (normally excluded)
    // We need the password to compare it with the provided password
    const user = await User.findOne({ email }).select('+password');

    // Check if user exists and password matches
    if (user && (await user.matchPassword(password))) {
      // Login successful - return user data and token
      res.json({
        _id: user._id,
        username: user.username,
        email: user.email,
        token: generateToken(user._id) // Generate and return JWT token
      });
    } else {
      // Invalid credentials
      res.status(401).json({ 
        message: 'Invalid email or password' 
      });
    }
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ 
      message: 'Server error during login',
      error: error.message 
    });
  }
};

// @desc    Get current user profile
// @route   GET /api/auth/me
// @access  Private (requires authentication)
const getMe = async (req, res) => {
  try {
    // req.user is set by the auth middleware after successful token verification
    const user = await User.findById(req.user._id);

    res.json({
      _id: user._id,
      username: user.username,
      email: user.email
    });
  } catch (error) {
    console.error('Get user error:', error);
    res.status(500).json({ 
      message: 'Server error',
      error: error.message 
    });
  }
};

module.exports = {
  registerUser,
  loginUser,
  getMe
};
