import { Link } from 'react-router-dom';
import Navbar from '../components/Navbar';
import { useAuth } from '../context/AuthContext';
import { blogPosts } from '../data/blogPosts';

export default function BlogList() {
  const { user } = useAuth();

  return (
    <>
      {user ? <Navbar /> : (
        <header className="sticky top-0 z-40 border-b border-slate-700/80 bg-slate-900/95 backdrop-blur-md px-4 sm:px-6 py-3">
          <div className="max-w-4xl mx-auto flex items-center justify-between">
            <Link to="/" className="text-lg font-bold text-amber-400 hover:text-amber-300">RepForge</Link>
            <div className="flex gap-3">
              <Link to="/login" className="text-sm text-slate-400 hover:text-slate-100">Log in</Link>
              <Link to="/register" className="text-sm font-medium text-amber-400 hover:text-amber-300">Register</Link>
            </div>
          </div>
        </header>
      )}
      <main className="max-w-4xl mx-auto px-4 sm:px-6 py-6 sm:py-8 page-transition">
        <h1 className="text-xl sm:text-2xl font-bold text-amber-400 mb-2">Blog</h1>
        <p className="text-slate-400 text-sm mb-6 sm:mb-8">
          Exercise guides, form tips, and common mistakes.
        </p>
        <ul className="grid gap-4 sm:gap-5 sm:grid-cols-2" role="list">
          {blogPosts.map((post) => (
            <li key={post.id}>
              <Link
                to={`/blog/${post.id}`}
                className="block rounded-xl border border-slate-700/80 bg-slate-800/90 p-5 sm:p-6 shadow-lg transition-all duration-200 hover:shadow-xl hover:border-amber-500/30 hover:scale-[1.02] focus:outline-none focus-visible:ring-2 focus-visible:ring-amber-500/50"
              >
                <span className="text-xs font-medium text-amber-400/90 uppercase tracking-wider">
                  {post.muscleGroup}
                </span>
                <h2 className="mt-2 text-lg font-semibold text-slate-100 line-clamp-2">
                  {post.title}
                </h2>
                <p className="mt-2 text-sm text-slate-400 line-clamp-2">
                  {post.description}
                </p>
                <span className="mt-3 inline-block text-sm text-amber-400 font-medium">
                  Read more →
                </span>
              </Link>
            </li>
          ))}
        </ul>
      </main>
    </>
  );
}
