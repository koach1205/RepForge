import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { workoutsAPI } from '../api/axios';
import Navbar from '../components/Navbar';
import ErrorBanner from '../components/ErrorBanner';

export default function AddWorkout() {
  const [exerciseName, setExerciseName] = useState('');
  const [weight, setWeight] = useState('');
  const [reps, setReps] = useState('');
  const [sets, setSets] = useState('');
  const [date, setDate] = useState(new Date().toISOString().slice(0, 10));
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSubmitting(true);
    try {
      await workoutsAPI.create({
        exerciseName: exerciseName.trim(),
        weight: Number(weight),
        reps: Number(reps),
        sets: Number(sets),
        date: date ? new Date(date) : undefined,
      });
      navigate('/');
    } catch (err) {
      setError(err.response?.data?.message ?? 'Failed to add workout');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <>
      <Navbar />
      <main className="max-w-md mx-auto px-4 sm:px-6 py-6 sm:py-8 page-transition">
        <h1 className="text-xl sm:text-2xl font-bold text-amber-400 mb-6">Add Workout</h1>
        <form onSubmit={handleSubmit} className="space-y-4 rounded-xl border border-slate-700/80 bg-slate-800/80 p-6 shadow-xl">
          {error && (
            <ErrorBanner message={error} onDismiss={() => setError('')} />
          )}
          <div>
            <label htmlFor="exerciseName" className="block text-sm font-medium text-slate-300 mb-1">
              Exercise
            </label>
            <input
              id="exerciseName"
              type="text"
              value={exerciseName}
              onChange={(e) => setExerciseName(e.target.value)}
              required
              className="w-full px-3 py-2 rounded-lg bg-slate-700 border border-slate-600 text-slate-100 focus:ring-2 focus:ring-amber-500 focus:border-transparent"
              placeholder="e.g. Bench Press"
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label htmlFor="weight" className="block text-sm font-medium text-slate-300 mb-1">
                Weight (kg)
              </label>
              <input
                id="weight"
                type="number"
                min="0"
                step="0.5"
                value={weight}
                onChange={(e) => setWeight(e.target.value)}
                required
                className="w-full px-3 py-2 rounded-lg bg-slate-700 border border-slate-600 text-slate-100 focus:ring-2 focus:ring-amber-500 focus:border-transparent"
              />
            </div>
            <div>
              <label htmlFor="reps" className="block text-sm font-medium text-slate-300 mb-1">
                Reps
              </label>
              <input
                id="reps"
                type="number"
                min="1"
                value={reps}
                onChange={(e) => setReps(e.target.value)}
                required
                className="w-full px-3 py-2 rounded-lg bg-slate-700 border border-slate-600 text-slate-100 focus:ring-2 focus:ring-amber-500 focus:border-transparent"
              />
            </div>
          </div>
          <div>
            <label htmlFor="sets" className="block text-sm font-medium text-slate-300 mb-1">
              Sets
            </label>
            <input
              id="sets"
              type="number"
              min="1"
              value={sets}
              onChange={(e) => setSets(e.target.value)}
              required
              className="w-full px-3 py-2 rounded-lg bg-slate-700 border border-slate-600 text-slate-100 focus:ring-2 focus:ring-amber-500 focus:border-transparent"
            />
          </div>
          <div>
            <label htmlFor="date" className="block text-sm font-medium text-slate-300 mb-1">
              Date
            </label>
            <input
              id="date"
              type="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              className="w-full px-3 py-2 rounded-lg bg-slate-700 border border-slate-600 text-slate-100 focus:ring-2 focus:ring-amber-500 focus:border-transparent"
            />
          </div>
          <div className="flex gap-3 pt-2">
            <button
              type="button"
              onClick={() => navigate('/')}
              className="flex-1 py-2 rounded-lg border border-slate-600 text-slate-300 hover:bg-slate-700"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={submitting}
              className="flex-1 py-2.5 rounded-lg bg-amber-500 text-slate-900 font-semibold hover:bg-amber-400 disabled:opacity-50 transition-colors"
            >
              {submitting ? 'Saving…' : 'Save'}
            </button>
          </div>
        </form>
      </main>
    </>
  );
}
