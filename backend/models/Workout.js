const mongoose = require('mongoose');

// Workout Schema - defines the structure of workout documents in MongoDB
const workoutSchema = new mongoose.Schema({
  // Reference to the user who created this workout
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User', // References the User model
    required: [true, 'User ID is required']
  },
  // Name of the exercise (e.g., "Bench Press", "Squat")
  exerciseName: {
    type: String,
    required: [true, 'Exercise name is required'],
    trim: true
  },
  // Weight lifted (in kg or lbs)
  weight: {
    type: Number,
    required: [true, 'Weight is required'],
    min: [0, 'Weight cannot be negative']
  },
  // Number of repetitions per set
  reps: {
    type: Number,
    required: [true, 'Reps are required'],
    min: [1, 'Reps must be at least 1']
  },
  // Number of sets performed
  sets: {
    type: Number,
    required: [true, 'Sets are required'],
    min: [1, 'Sets must be at least 1']
  },
  // Date when the workout was performed
  date: {
    type: Date,
    required: [true, 'Date is required'],
    default: Date.now // Defaults to current date if not provided
  }
}, {
  timestamps: true // Automatically adds createdAt and updatedAt fields
});

// Index for faster queries - helps optimize fetching workouts by user and date
workoutSchema.index({ user: 1, date: -1 });

// Create and export the Workout model
module.exports = mongoose.model('Workout', workoutSchema);
