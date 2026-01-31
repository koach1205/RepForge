import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { workoutsAPI } from '../api/axios';
import WorkoutCard from '../components/WorkoutCard';
import Navbar from '../components/Navbar';
import ConfirmModal from '../components/ConfirmModal';
import ErrorBanner from '../components/ErrorBanner';
import Spinner from '../components/Spinner';
import { getPreviousWorkout, getProgressiveOverloadComparison } from '../utils/progressiveOverload';

function LoadingSkeleton() {
  return (
    <div className="space-y-4" aria-hidden="true">
      {[1, 2, 3].map((i) => (
        <div
          key={i}
          className="h-32 rounded-xl bg-slate-800/80 border border-slate-700/80 animate-pulse"
        />
      ))}
    </div>
  );
}

export default function Dashboard() {
  const [workouts, setWorkouts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [deleteTarget, setDeleteTarget] = useState(null);

  useEffect(() => {
    const fetchWorkouts = async () => {
      try {
        setError('');
        const { data } = await workoutsAPI.getAll();
        setWorkouts(data);
      } catch (err) {
        setError(err.response?.data?.message ?? 'Failed to load workouts');
      } finally {
        setLoading(false);
      }
    };
    fetchWorkouts();
  }, []);

  const handleDelete = async (id) => {
    const previous = workouts;
    setWorkouts((prev) => prev.filter((w) => w._id !== id));
    setDeleteTarget(null);
    try {
      await workoutsAPI.delete(id);
      setError('');
    } catch (err) {
      setWorkouts(previous);
      setError(err.response?.data?.message ?? 'Failed to delete');
    }
  };

  const openDeleteModal = (id) => setDeleteTarget(id);

  return (
    <>
      <Navbar />
      <main className="max-w-4xl mx-auto px-4 sm:px-6 py-6 sm:py-8 page-transition">
        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4 mb-6">
          <h1 className="text-xl sm:text-2xl font-bold text-amber-400">My Workouts</h1>
          <Link
            to="/workouts/new"
            className="inline-flex justify-center items-center px-4 py-2.5 rounded-lg bg-amber-500 text-slate-900 font-semibold hover:bg-amber-400 transition-colors"
          >
            Add Workout
          </Link>
        </div>

        {error && (
          <div className="mb-4">
            <ErrorBanner message={error} onDismiss={() => setError('')} />
          </div>
        )}

        {loading ? (
          <div className="flex flex-col items-center gap-4 py-8">
            <Spinner />
            <p className="text-sm text-slate-500">Loading workouts…</p>
            <div className="w-full max-w-2xl mt-4">
              <LoadingSkeleton />
            </div>
          </div>
        ) : workouts.length === 0 ? (
          <div className="rounded-xl border border-slate-700/80 bg-slate-800/50 p-8 sm:p-12 text-center">
            <p className="text-slate-400 text-lg font-medium">No workouts yet</p>
            <p className="text-slate-500 text-sm mt-2 max-w-sm mx-auto">
              Log your first session to track progress and progressive overload.
            </p>
            <Link
              to="/workouts/new"
              className="inline-flex items-center justify-center mt-6 px-5 py-2.5 rounded-lg bg-amber-500 text-slate-900 font-semibold hover:bg-amber-400 transition-colors"
            >
              Add your first workout
            </Link>
          </div>
        ) : (
          <ul className="space-y-4" role="list">
            {workouts.map((workout) => {
              const previous = getPreviousWorkout(workout, workouts);
              const comparison = getProgressiveOverloadComparison(workout, previous);
              return (
                <WorkoutCard
                  key={workout._id}
                  workout={workout}
                  comparison={comparison}
                  onDelete={openDeleteModal}
                />
              );
            })}
          </ul>
        )}
      </main>

      <ConfirmModal
        open={!!deleteTarget}
        onClose={() => setDeleteTarget(null)}
        title="Delete workout"
        message="This workout will be permanently removed. This cannot be undone."
        confirmLabel="Delete"
        variant="danger"
        onConfirm={() => deleteTarget && handleDelete(deleteTarget)}
      />
    </>
  );
}
