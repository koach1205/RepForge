const express = require('express');
const router = express.Router();
const workoutController = require('../controllers/workoutController');
const authMiddleware = require('../middleware/authMiddleware');

if (!authMiddleware.protect) {
  throw new Error('authMiddleware.protect is not defined. Check middleware/authMiddleware.js exports.');
}
if (!workoutController.addWorkout) {
  throw new Error('workoutController.addWorkout is not defined. Check controllers/workoutController.js exports.');
}

// All workout routes require authentication
router.route('/')
  .post(authMiddleware.protect, workoutController.addWorkout)
  .get(authMiddleware.protect, workoutController.getWorkouts);

router.route('/:id')
  .get(authMiddleware.protect, workoutController.getWorkoutById)
  .put(authMiddleware.protect, workoutController.updateWorkout)
  .delete(authMiddleware.protect, workoutController.deleteWorkout);

module.exports = router;
