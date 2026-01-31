const jwt = require('jsonwebtoken');
const User = require('../models/User');

// Authentication middleware - protects routes that require user authentication
const protect = async (req, res, next) => {
  let token;

  // Check if Authorization header exists and starts with "Bearer"
  // Format: "Bearer <token>"
  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    try {
      // Extract the token from the header (remove "Bearer " prefix)
      token = req.headers.authorization.split(' ')[1];

      // Verify the token using the JWT_SECRET from environment variables
      // This decodes the token and verifies its signature
      const decoded = jwt.verify(token, process.env.JWT_SECRET);

      // Find the user by ID from the decoded token (without password)
      // The decoded object contains the user ID that was set during token creation
      req.user = await User.findById(decoded.id).select('-password');

      // If user not found, token is invalid
      if (!req.user) {
        return res.status(401).json({ message: 'User not found' });
      }

      // Move to the next middleware/route handler
      next();
    } catch (error) {
      // Token is invalid or expired
      console.error('Token verification error:', error);
      return res.status(401).json({ message: 'Not authorized, token failed' });
    }
  } else {
    // No token provided
    return res.status(401).json({ message: 'Not authorized, no token' });
  }
};

exports.protect = protect;
