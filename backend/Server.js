const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config(); // Load environment variables from .env file

// Load middleware first so it's fully initialized before routes use it
require('./middleware/authMiddleware');

// Import routes
const authRoutes = require('./Routes/authRoutes');
const workoutRoutes = require('./Routes/workoutRoutes');
const aiRoutes = require('./Routes/aiRoutes');
const userRoutes = require('./Routes/userRoutes');

// Initialize Express app
const app = express();

// Middleware
// CORS - allows frontend to make requests from different origins
app.use(cors());

// Body parser - allows us to read JSON data from request body
app.use(express.json({ limit: '2mb' }));
app.use(express.urlencoded({ extended: true, limit: '2mb' }));

// MongoDB connection – server only starts after this succeeds
const connectDB = async () => {
  const uri = process.env.MONGO_URI;
  if (!uri) {
    throw new Error('MONGO_URI is not set in .env');
  }
  const conn = await mongoose.connect(uri);
  console.log(`MongoDB Connected: ${conn.connection.host}`);
  return conn;
};
    

// API Routes
app.use('/api/auth', authRoutes);
app.use('/api/workouts', workoutRoutes);
app.use('/api/ai', aiRoutes);
app.use('/api/users', userRoutes);

app.get('/', (req, res) => {
  res.json({ message: 'RepForge API is running!' });
});

app.use((req, res) => {
  res.status(404).json({ message: 'Route not found' });
});

app.use((err, req, res, next) => {
  console.error('Error:', err);
  res.status(500).json({
    message: 'Internal server error',
    error: process.env.NODE_ENV === 'development' ? err.message : {},
  });
});

const PORT = process.env.PORT || 5000;

// Connect to MongoDB first, then start server (registration needs DB)
connectDB()
  .then(() => {
    app.listen(PORT, () => {
      console.log(`Server is running on port ${PORT}`);
    });
  })
  .catch((err) => {
    console.error('MongoDB connection error:', err.message);
    console.error('\nMake sure MongoDB is running. Options:');
    console.error('  - Install: https://www.mongodb.com/try/download/community');
    console.error('  - Or use Docker: docker run -d -p 27017:27017 mongo:latest');
    process.exit(1);
  });
