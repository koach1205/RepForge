const express = require('express');
const router = express.Router();
const Workout = require('../models/Workout');
const authMiddleware = require('../middleware/authMiddleware');

/**
 * Simple rule-based AI Coach: suggests next workout from history and answers basic fitness questions.
 * POST /api/ai/suggest
 * Body: { message?: string }
 * Uses workout history as context. Protected route.
 */
router.post('/suggest', authMiddleware.protect, async (req, res) => {
  try {
    const userMessage = (req.body?.message || '').trim().toLowerCase();
    const userId = req.user._id;

    const workouts = await Workout.find({ user: userId })
      .sort({ date: -1 })
      .limit(30)
      .lean();

    let suggestion = '';

    if (userMessage) {
      if (/rest|recovery|day off|sleep/.test(userMessage)) {
        suggestion =
          'Rest days are important for muscle growth. Aim for 1–2 rest days between heavy sessions for the same muscle group. Stay hydrated and sleep 7–9 hours.';
      } else if (/protein|nutrition|eat|diet/.test(userMessage)) {
        suggestion =
          'Aim for about 1.6–2.2 g protein per kg body weight daily for muscle gain. Spread intake across meals and include carbs around workouts for energy.';
      } else if (/reps|sets|volume/.test(userMessage)) {
        suggestion =
          'For strength: 3–6 reps, heavy. For hypertrophy: 6–12 reps. For endurance: 12+. Start with 3–4 sets per exercise and progress gradually.';
      } else if (/progressive overload|progress/.test(userMessage)) {
        suggestion =
          'Progressive overload means doing more over time: add weight, add reps, or add sets. Track your workouts in RepForge and aim to beat previous sessions when you can.';
      } else if (/hiit|cardio|warmup/.test(userMessage)) {
        suggestion =
          'Warm up 5–10 min before lifting. Add 2–3 cardio sessions per week if you like; keep them separate from heavy leg days if possible.';
      } else {
        suggestion = buildSuggestionFromWorkouts(workouts);
        if (suggestion) {
          suggestion = `You asked: "${req.body.message}"\n\n${suggestion}`;
        } else {
          suggestion = "I'm your RepForge AI Coach. Ask about rest, nutrition, reps/sets, or progressive overload. Or add more workouts and I'll suggest what to do next based on your history.";
        }
      }
    } else {
      suggestion = buildSuggestionFromWorkouts(workouts);
      if (!suggestion) {
        suggestion =
          "You don't have any workouts yet. Add your first session (e.g. Bench Press, Squat) and I'll suggest what to do next based on your history.";
      }
    }

    res.json({ suggestion });
  } catch (error) {
    console.error('AI suggest error:', error);
    res.status(500).json({
      message: 'Failed to get suggestion',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined,
    });
  }
});

function buildSuggestionFromWorkouts(workouts) {
  if (!workouts.length) return '';

  const byExercise = {};
  for (const w of workouts) {
    const name = (w.exerciseName || '').trim() || 'Unknown';
    if (!byExercise[name]) byExercise[name] = [];
    byExercise[name].push(w);
  }

  const exercises = Object.keys(byExercise);
  const lastWorkout = workouts[0];
  const lastExercise = (lastWorkout?.exerciseName || '').trim() || 'your last exercise';
  const lastWeight = lastWorkout?.weight ?? 0;
  const lastReps = lastWorkout?.reps ?? 0;

  let text = `Based on your last session (${lastExercise}: ${lastWeight} kg × ${lastReps} reps), `;

  if (exercises.length <= 2) {
    const suggested = ['Squat', 'Bench Press', 'Deadlift', 'Overhead Press', 'Row'].find(
      (e) => !exercises.some((ex) => ex.toLowerCase().includes(e.toLowerCase()))
    );
    if (suggested) {
      text += `try adding ${suggested} to balance your routine. `;
    }
  }

  text += `Consider aiming for slightly more weight or 1–2 extra reps on ${lastExercise} next time for progressive overload.`;
  return text;
}

module.exports = router;
