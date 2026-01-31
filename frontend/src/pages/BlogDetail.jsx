import { useParams, Link } from 'react-router-dom';
import Navbar from '../components/Navbar';
import { useAuth } from '../context/AuthContext';
import { getPostById } from '../data/blogPosts';

export default function BlogDetail() {
  const { id } = useParams();
  const { user } = useAuth();
  const post = getPostById(id);

  if (!post) {
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
        <main className="max-w-2xl mx-auto px-4 sm:px-6 py-8 page-transition">
          <p className="text-slate-400">Post not found.</p>
          <Link to="/blog" className="mt-4 inline-block text-amber-400 hover:underline">
            ← Back to Blog
          </Link>
        </main>
      </>
    );
  }

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
      <main className="max-w-2xl mx-auto px-4 sm:px-6 py-6 sm:py-8 page-transition">
        <Link
          to="/blog"
          className="inline-flex items-center gap-1 text-sm text-slate-400 hover:text-amber-400 transition-colors mb-6"
        >
          ← Back to Blog
        </Link>
        <article className="rounded-xl border border-slate-700/80 bg-slate-800/90 p-6 sm:p-8 shadow-lg">
          <span className="text-xs font-medium text-amber-400/90 uppercase tracking-wider">
            {post.muscleGroup}
          </span>
          <h1 className="mt-2 text-2xl sm:text-3xl font-bold text-slate-100">
            {post.title}
          </h1>
          <p className="mt-4 text-slate-300 leading-relaxed">
            {post.description}
          </p>
          {post.image && (
            <div className="mt-6 rounded-lg overflow-hidden border border-slate-700">
              <img
                src={post.image}
                alt=""
                className="w-full h-auto object-cover"
              />
            </div>
          )}
          <section className="mt-8">
            <h2 className="text-lg font-semibold text-amber-400">Tips</h2>
            <ul className="mt-3 space-y-2">
              {post.tips.map((tip, i) => (
                <li key={i} className="flex gap-2 text-sm text-slate-300">
                  <span className="text-amber-400 shrink-0">•</span>
                  <span>{tip}</span>
                </li>
              ))}
            </ul>
          </section>
          <section className="mt-6">
            <h2 className="text-lg font-semibold text-amber-400">Common mistakes</h2>
            <ul className="mt-3 space-y-2">
              {post.commonMistakes.map((mistake, i) => (
                <li key={i} className="flex gap-2 text-sm text-slate-300">
                  <span className="text-red-400/80 shrink-0">×</span>
                  <span>{mistake}</span>
                </li>
              ))}
            </ul>
          </section>
        </article>
      </main>
    </>
  );
}
