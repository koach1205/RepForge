import { useState, useRef, useEffect } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const APP_NAME = 'RepForge';

function getInitials(username) {
  if (!username || !username.trim()) return '?';
  const parts = username.trim().split(/\s+/);
  if (parts.length >= 2) {
    return (parts[0][0] + parts[1][0]).toUpperCase().slice(0, 2);
  }
  return username.slice(0, 2).toUpperCase();
}

export default function Navbar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [menuOpen, setMenuOpen] = useState(false);
  const [avatarOpen, setAvatarOpen] = useState(false);
  const avatarRef = useRef(null);

  useEffect(() => {
    if (!avatarOpen) return;
    const close = (e) => {
      if (avatarRef.current && !avatarRef.current.contains(e.target)) {
        setAvatarOpen(false);
      }
    };
    document.addEventListener('click', close);
    return () => document.removeEventListener('click', close);
  }, [avatarOpen]);

  const handleLogout = () => {
    setMenuOpen(false);
    setAvatarOpen(false);
    logout();
    navigate('/login');
  };

  const linkClass = ({ isActive }) =>
    `px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
      isActive
        ? 'bg-amber-500/20 text-amber-400'
        : 'text-slate-300 hover:text-slate-100 hover:bg-slate-700/50'
    }`;

  return (
    <nav className="sticky top-0 z-40 border-b border-slate-700/80 bg-slate-900/95 backdrop-blur-md shadow-lg shadow-black/10">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 py-3 flex items-center justify-between gap-4">
        <NavLink
          to="/"
          className="text-lg sm:text-xl font-bold tracking-tight text-amber-400 hover:text-amber-300 transition-colors shrink-0"
        >
          {APP_NAME}
        </NavLink>

        {user && (
          <>
            {/* Desktop nav + avatar */}
            <div className="hidden sm:flex items-center gap-1">
              <NavLink to="/" end className={linkClass}>
                Dashboard
              </NavLink>
              <NavLink to="/workouts/new" className={linkClass}>
                Add Workout
              </NavLink>
              <NavLink to="/blog" className={linkClass}>
                Blog
              </NavLink>
              <div className="relative ml-2" ref={avatarRef}>
                <button
                  type="button"
                  onClick={() => setAvatarOpen((o) => !o)}
                  className="flex items-center justify-center w-9 h-9 rounded-full bg-slate-700 text-amber-400 font-semibold text-sm border border-slate-600 hover:bg-slate-600 transition-all duration-200 hover:scale-105 focus:outline-none focus-visible:ring-2 focus-visible:ring-amber-500/50 overflow-hidden shrink-0"
                  aria-expanded={avatarOpen}
                  aria-haspopup="true"
                  aria-label="User menu"
                >
                  {user.profilePic ? (
                    <img src={user.profilePic} alt="" className="w-full h-full object-cover" />
                  ) : (
                    getInitials(user.username)
                  )}
                </button>
                {avatarOpen && (
                  <div className="absolute right-0 mt-2 w-52 rounded-xl border border-slate-700 bg-slate-800 py-1 shadow-xl">
                    <div className="px-4 py-3 border-b border-slate-700">
                      <p className="text-sm font-medium text-slate-200 truncate">{user.username}</p>
                      <p className="text-xs text-slate-500 truncate">{user.email}</p>
                    </div>
                    <NavLink
                      to="/profile"
                      className="block px-4 py-2 text-sm text-slate-300 hover:bg-slate-700/80 transition-colors"
                      onClick={() => setAvatarOpen(false)}
                    >
                      Profile
                    </NavLink>
                    <button
                      type="button"
                      onClick={handleLogout}
                      className="w-full px-4 py-2 text-left text-sm text-red-400 hover:bg-slate-700/80 transition-colors"
                    >
                      Log out
                    </button>
                  </div>
                )}
              </div>
            </div>

            {/* Mobile menu button */}
            <button
              type="button"
              onClick={() => setMenuOpen((o) => !o)}
              className="sm:hidden p-2.5 rounded-lg text-slate-400 hover:text-slate-100 hover:bg-slate-700/50 transition-colors"
              aria-expanded={menuOpen}
              aria-label="Toggle menu"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                {menuOpen ? (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                ) : (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                )}
              </svg>
            </button>
          </>
        )}
      </div>

      {/* Mobile dropdown */}
      {user && menuOpen && (
        <div className="sm:hidden border-t border-slate-700/80 px-4 py-3 flex flex-col gap-1 bg-slate-900/98">
          <NavLink to="/" end className={linkClass} onClick={() => setMenuOpen(false)}>
            Dashboard
          </NavLink>
          <NavLink to="/workouts/new" className={linkClass} onClick={() => setMenuOpen(false)}>
            Add Workout
          </NavLink>
          <NavLink to="/blog" className={linkClass} onClick={() => setMenuOpen(false)}>
            Blog
          </NavLink>
          <NavLink to="/profile" className={linkClass} onClick={() => setMenuOpen(false)}>
            Profile
          </NavLink>
          <div className="flex items-center gap-2 pt-2 mt-2 border-t border-slate-700">
            {user.profilePic ? (
              <img src={user.profilePic} alt="" className="w-8 h-8 rounded-full object-cover border border-slate-600" />
            ) : (
              <span className="flex items-center justify-center w-8 h-8 rounded-full bg-slate-700 text-amber-400 text-sm font-semibold">
                {getInitials(user.username)}
              </span>
            )}
            <span className="text-sm text-slate-400 truncate flex-1">{user.username}</span>
            <button
              type="button"
              onClick={handleLogout}
              className="text-sm text-red-400 hover:text-red-300 font-medium"
            >
              Log out
            </button>
          </div>
        </div>
      )}
    </nav>
  );
}
