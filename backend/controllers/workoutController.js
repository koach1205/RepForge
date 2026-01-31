const Workout = require('../models/Workout');

// @desc    Add a new workout
// @route   POST /api/workouts
// @access  Private (requires authentication)
const addWorkout = async (req, res) => {
  try {
    const { exerciseName, weight, reps, sets, date } = req.body;

    // Validate required fields
    if (!exerciseName || weight === undefined || !reps || !sets) {
      return res.status(400).json({ 
        message: 'Please provide exerciseName, weight, reps, and sets' 
      });
    }

    // Create new workout
    // req.user._id is set by the auth middleware after successful token verification
    const workout = await Workout.create({
      user: req.user._id,
      exerciseName,
      weight,
      reps,
      sets,
      date: date || new Date() // Use provided date or default to current date
    });

    // Populate user field with basic user info (optional, for better response)
    await workout.populate('user', 'username email');

    res.status(201).json(workout);
  } catch (error) {
    console.error('Add workout error:', error);
    res.status(500).json({ 
      message: 'Server error while adding workout',
      error: error.message 
    });
  }
};

// @desc    Get all workouts for the authenticated user
// @route   GET /api/workouts
// @access  Private (requires authentication)
const getWorkouts = async (req, res) => {
  try {
    // Find all workouts belonging to the authenticated user
    // Sort by date in descending order (newest first)
    // Populate user field with username and email
    const workouts = await Workout.find({ user: req.user._id })
      .sort({ date: -1 })
      .populate('user', 'username email');

    res.json(workouts);
  } catch (error) {
    console.error('Get workouts error:', error);
    res.status(500).json({ 
      message: 'Server error while fetching workouts',
      error: error.message 
    });
  }
};

// @desc    Get a single workout by ID
// @route   GET /api/workouts/:id
// @access  Private (requires authentication)
const getWorkoutById = async (req, res) => {
  try {
    const workout = await Workout.findById(req.params.id)
      .populate('user', 'username email');

    // Check if workout exists
    if (!workout) {
      return res.status(404).json({ message: 'Workout not found' });
    }

    // Check if the workout belongs to the authenticated user
    if (workout.user._id.toString() !== req.user._id.toString()) {
      return res.status(403).json({ 
        message: 'Not authorized to access this workout' 
      });
    }

    res.json(workout);
  } catch (error) {
    console.error('Get workout error:', error);
    res.status(500).json({ 
      message: 'Server error while fetching workout',
      error: error.message 
    });
  }
};

// @desc    Update a workout
// @route   PUT /api/workouts/:id
// @access  Private (requires authentication)
const updateWorkout = async (req, res) => {
  try {
    const { exerciseName, weight, reps, sets, date } = req.body;

    // Find the workout
    const workout = await Workout.findById(req.params.id);

    // Check if workout exists
    if (!workout) {
      return res.status(404).json({ message: 'Workout not found' });
    }

    // Check if the workout belongs to the authenticated user
    if (workout.user.toString() !== req.user._id.toString()) {
      return res.status(403).json({ 
        message: 'Not authorized to update this workout' 
      });
    }

    // Update workout fields
    workout.exerciseName = exerciseName || workout.exerciseName;
    workout.weight = weight !== undefined ? weight : workout.weight;
    workout.reps = reps || workout.reps;
    workout.sets = sets || workout.sets;
    workout.date = date || workout.date;

    // Save updated workout
    const updatedWorkout = await workout.save();
    await updatedWorkout.populate('user', 'username email');

    res.json(updatedWorkout);
  } catch (error) {
    console.error('Update workout error:', error);
    res.status(500).json({ 
      message: 'Server error while updating workout',
      error: error.message 
    });
  }
};

// @desc    Delete a workout
// @route   DELETE /api/workouts/:id
// @access  Private (requires authentication)
const deleteWorkout = async (req, res) => {
  try {
    // Find the workout
    const workout = await Workout.findById(req.params.id);

    // Check if workout exists
    if (!workout) {
      return res.status(404).json({ message: 'Workout not found' });
    }

    // Check if the workout belongs to the authenticated user
    if (workout.user.toString() !== req.user._id.toString()) {
      return res.status(403).json({ 
        message: 'Not authorized to delete this workout' 
      });
    }

    // Delete the workout
    await workout.deleteOne();

    res.json({ message: 'Workout deleted successfully' });
  } catch (error) {
    console.error('Delete workout error:', error);
    res.status(500).json({ 
      message: 'Server error while deleting workout',
      error: error.message 
    });
  }
};

module.exports = {
  addWorkout,
  getWorkouts,
  getWorkoutById,
  updateWorkout,
  deleteWorkout
};
