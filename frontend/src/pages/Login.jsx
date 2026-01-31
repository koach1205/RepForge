import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { authAPI } from '../api/axios';
import ErrorBanner from '../components/ErrorBanner';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSubmitting(true);
    try {
      const { data } = await authAPI.login({ email, password });
      const userData = {
        id: data.user?.id ?? data.user?._id,
        username: data.user?.username,
        email: data.user?.email,
        profilePic: data.user?.profilePic ?? null,
      };
      login(userData, data.token);
      navigate('/');
    } catch (err) {
      setError(err.response?.data?.message ?? 'Login failed');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4 py-8 bg-slate-950">
      <div className="w-full max-w-md">
        <h1 className="text-xl sm:text-2xl font-bold text-center text-amber-400 mb-6">Log in</h1>
        <form onSubmit={handleSubmit} className="space-y-4 rounded-xl border border-slate-700/80 bg-slate-800/80 p-6 shadow-xl">
          {error && (
            <ErrorBanner message={error} onDismiss={() => setError('')} />
          )}
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-slate-300 mb-1">
              Email
            </label>
            <input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="w-full px-3 py-2 rounded-lg bg-slate-700 border border-slate-600 text-slate-100 focus:ring-2 focus:ring-amber-500 focus:border-transparent"
              placeholder="you@example.com"
            />
          </div>
          <div>
            <label htmlFor="password" className="block text-sm font-medium text-slate-300 mb-1">
              Password
            </label>
            <input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="w-full px-3 py-2 rounded-lg bg-slate-700 border border-slate-600 text-slate-100 focus:ring-2 focus:ring-amber-500 focus:border-transparent"
            />
          </div>
          <button
            type="submit"
            disabled={submitting}
            className="w-full py-2.5 rounded-lg bg-amber-500 text-slate-900 font-semibold hover:bg-amber-400 disabled:opacity-50 transition-colors"
          >
            {submitting ? 'Logging in…' : 'Log in'}
          </button>
          <p className="text-center text-slate-400 text-sm">
            No account?{' '}
            <Link to="/register" className="text-amber-400 hover:underline">
              Register
            </Link>
          </p>
        </form>
      </div>
    </div>
  );
}
