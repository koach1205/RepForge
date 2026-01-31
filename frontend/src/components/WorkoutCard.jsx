import { Link } from 'react-router-dom';

const statusConfig = {
  progressed: {
    label: 'Progressed',
    className: 'bg-emerald-500/20 text-emerald-400 border-emerald-500/40',
  },
  same: {
    label: 'Same',
    className: 'bg-slate-600/30 text-slate-400 border-slate-500/40',
  },
  regressed: {
    label: 'Regressed',
    className: 'bg-red-500/20 text-red-400 border-red-500/40',
  },
  first: {
    label: 'First',
    className: 'bg-amber-500/20 text-amber-400 border-amber-500/40',
  },
};

function changeClass(change) {
  if (change > 0) return 'text-emerald-400 font-semibold';
  if (change < 0) return 'text-red-400 font-semibold';
  return 'text-slate-300';
}

export default function WorkoutCard({ workout, comparison, onDelete }) {
  const dateStr = workout.date
    ? new Date(workout.date).toLocaleDateString(undefined, {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
      })
    : '—';

  const config = statusConfig[comparison?.status ?? 'first'];

  return (
    <li className="rounded-xl border border-slate-700/80 bg-slate-800/90 p-4 sm:p-5 shadow-lg flex flex-col sm:flex-row sm:flex-wrap sm:items-center sm:justify-between gap-4 transition-all duration-200 hover:shadow-xl hover:border-slate-600">
      <div className="flex-1 min-w-0">
        <div className="flex flex-wrap items-center gap-2 gap-y-1">
          <h2 className="font-semibold text-lg text-amber-400 truncate">
            {workout.exerciseName}
          </h2>
          {config && (
            <span
              className={`inline-flex items-center px-2.5 py-0.5 rounded-md text-xs font-medium border ${config.className}`}
            >
              {config.label}
            </span>
          )}
        </div>
        <dl className="mt-2 grid grid-cols-3 gap-x-4 gap-y-1 text-sm">
          <span className="col-span-3 sm:col-span-1 text-slate-500">
            Sets: <span className="text-slate-300">{workout.sets}</span>
          </span>
          <span className="col-span-3 sm:col-span-1 text-slate-500">
            Reps:{' '}
            <span className={changeClass(comparison?.repsChange ?? 0)}>
              {workout.reps}
            </span>
          </span>
          <span className="col-span-3 sm:col-span-1 text-slate-500">
            Weight:{' '}
            <span className={changeClass(comparison?.weightChange ?? 0)}>
              {workout.weight} kg
            </span>
          </span>
        </dl>
        {comparison?.previous && (
          <p className="text-slate-500 text-xs mt-1">
            Previous: {comparison.previous.weight} kg × {comparison.previous.reps} reps
          </p>
        )}
        <p className="text-slate-500 text-xs mt-2">{dateStr}</p>
      </div>
      <div className="flex items-center gap-2 shrink-0 flex-wrap sm:flex-nowrap">
        <Link
          to={`/workouts/${workout._id}/edit`}
          className="px-4 py-2 rounded-lg border border-slate-600 text-slate-200 text-sm font-medium hover:bg-slate-700 transition-colors"
        >
          Edit
        </Link>
        <button
          type="button"
          onClick={() => onDelete(workout._id)}
          className="px-4 py-2 rounded-lg bg-red-900/30 text-red-400 text-sm font-medium hover:bg-red-900/50 border border-red-800/50 transition-colors"
        >
          Delete
        </button>
      </div>
    </li>
  );
}
