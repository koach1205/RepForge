import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { workoutsAPI } from '../api/axios';
import Navbar from '../components/Navbar';
import ErrorBanner from '../components/ErrorBanner';
import Spinner from '../components/Spinner';

export default function EditWorkout() {
  const { id } = useParams();
  const [exerciseName, setExerciseName] = useState('');
  const [weight, setWeight] = useState('');
  const [reps, setReps] = useState('');
  const [sets, setSets] = useState('');
  const [date, setDate] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchWorkout = async () => {
      try {
        const { data } = await workoutsAPI.getById(id);
        setExerciseName(data.exerciseName ?? '');
        setWeight(data.weight ?? '');
        setReps(data.reps ?? '');
        setSets(data.sets ?? '');
        setDate(data.date ? new Date(data.date).toISOString().slice(0, 10) : '');
      } catch (err) {
        setError(err.response?.data?.message ?? 'Workout not found');
      } finally {
        setLoading(false);
      }
    };
    fetchWorkout();
  }, [id]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSubmitting(true);
    try {
      await workoutsAPI.update(id, {
        exerciseName: exerciseName.trim(),
        weight: Number(weight),
        reps: Number(reps),
        sets: Number(sets),
        date: date ? new Date(date) : undefined,
      });
      navigate('/');
    } catch (err) {
      setError(err.response?.data?.message ?? 'Failed to update workout');
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <>
        <Navbar />
        <main className="max-w-md mx-auto px-4 sm:px-6 py-8 flex flex-col items-center gap-4">
          <Spinner />
          <p className="text-sm text-slate-500">Loading workout…</p>
        </main>
      </>
    );
  }

  return (
    <>
      <Navbar />
      <main className="max-w-md mx-auto px-4 sm:px-6 py-6 sm:py-8 page-transition">
        <h1 className="text-xl sm:text-2xl font-bold text-amber-400 mb-6">Edit Workout</h1>
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
