/**
 * Get the previous workout for the same exercise (by date) from workout history.
 * @param {Object} workout - Current workout { exerciseName, date, ... }
 * @param {Array} allWorkouts - All workouts (same user), any order
 * @returns {Object|null} Previous workout or null
 */
export function getPreviousWorkout(workout, allWorkouts) {
  const sameExercise = allWorkouts.filter(
    (w) =>
      w.exerciseName?.toLowerCase() === workout.exerciseName?.toLowerCase() &&
      w._id !== workout._id &&
      new Date(w.date) < new Date(workout.date)
  );
  if (sameExercise.length === 0) return null;
  sameExercise.sort((a, b) => new Date(b.date) - new Date(a.date));
  return sameExercise[0];
}

/**
 * Compare current workout to previous same exercise and return status + per-metric changes.
 * @param {Object} workout - Current workout { weight, reps, ... }
 * @param {Object|null} previous - Previous workout for same exercise
 * @returns {{ status: 'progressed'|'same'|'regressed'|'first', previous: Object|null, weightChange: number, repsChange: number }}
 */
export function getProgressiveOverloadComparison(workout, previous) {
  if (!previous) {
    return { status: 'first', previous: null, weightChange: 0, repsChange: 0 };
  }

  const weightChange = Math.sign((workout.weight ?? 0) - (previous.weight ?? 0));
  const repsChange = Math.sign((workout.reps ?? 0) - (previous.reps ?? 0));

  let status = 'same';
  if (weightChange > 0 || repsChange > 0) status = 'progressed';
  else if (weightChange < 0 || repsChange < 0) status = 'regressed';

  return {
    status,
    previous,
    weightChange,
    repsChange,
  };
}
