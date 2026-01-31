import { useState, useRef } from 'react';
import Navbar from '../components/Navbar';
import ErrorBanner from '../components/ErrorBanner';
import { useAuth } from '../context/AuthContext';
import { usersAPI } from '../api/axios';

const MAX_FILE_SIZE_MB = 2;
const MAX_FILE_BYTES = MAX_FILE_SIZE_MB * 1024 * 1024;
const ACCEPT_IMAGE = 'image/jpeg,image/png,image/webp';

export default function Profile() {
  const { user, updateUser } = useAuth();
  const [username, setUsername] = useState(user?.username ?? '');
  const [email, setEmail] = useState(user?.email ?? '');
  const [profilePic, setProfilePic] = useState(user?.profilePic ?? '');
  const [preview, setPreview] = useState(user?.profilePic ?? '');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const fileInputRef = useRef(null);

  const handleFileChange = (e) => {
    setError('');
    setSuccess('');
    const file = e.target.files?.[0];
    if (!file) return;
    if (!file.type.startsWith('image/')) {
      setError('Please choose a JPEG, PNG, or WebP image.');
      return;
    }
    if (file.size > MAX_FILE_BYTES) {
      setError(`Image must be under ${MAX_FILE_SIZE_MB} MB.`);
      return;
    }
    const reader = new FileReader();
    reader.onload = () => {
      const dataUrl = reader.result;
      setPreview(dataUrl);
      setProfilePic(dataUrl);
    };
    reader.readAsDataURL(file);
  };

  const clearPhoto = () => {
    setPreview('');
    setProfilePic('');
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    setSubmitting(true);
    try {
      const { data } = await usersAPI.updateProfile({
        username: username.trim(),
        email: email.trim(),
        profilePic: profilePic || null,
      });
      updateUser({
        username: data.username,
        email: data.email,
        profilePic: data.profilePic ?? null,
      });
      setSuccess('Profile updated. Changes are visible in the navbar.');
      setPreview(data.profilePic ?? '');
      setProfilePic(data.profilePic ?? '');
    } catch (err) {
      setError(err.response?.data?.message ?? 'Failed to update profile');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <>
      <Navbar />
      <main className="max-w-md mx-auto px-4 sm:px-6 py-6 sm:py-8 page-transition">
        <h1 className="text-xl sm:text-2xl font-bold text-amber-400 mb-6">Profile</h1>

        <form onSubmit={handleSubmit} className="space-y-5 rounded-xl border border-slate-700/80 bg-slate-800/90 p-6 shadow-xl transition-shadow hover:shadow-2xl">
          {error && (
            <ErrorBanner message={error} onDismiss={() => setError('')} />
          )}
          {success && (
            <div className="rounded-lg bg-emerald-500/20 border border-emerald-500/40 px-4 py-3 text-sm text-emerald-400 flex items-center justify-between gap-2">
              <span>{success}</span>
              <button type="button" onClick={() => setSuccess('')} className="p-1 rounded hover:bg-emerald-500/20" aria-label="Dismiss">×</button>
            </div>
          )}

          {/* Profile picture */}
          <div className="flex flex-col sm:flex-row items-center gap-4">
            <div className="relative shrink-0">
              {preview ? (
                <img
                  src={preview}
                  alt="Profile preview"
                  className="w-24 h-24 rounded-full object-cover border-2 border-slate-600"
                />
              ) : (
                <div className="w-24 h-24 rounded-full bg-slate-700 border-2 border-slate-600 flex items-center justify-center text-2xl font-bold text-amber-400">
                  {(user?.username || '?').slice(0, 2).toUpperCase()}
                </div>
              )}
            </div>
            <div className="flex flex-col gap-2 w-full sm:w-auto">
              <input
                ref={fileInputRef}
                type="file"
                accept={ACCEPT_IMAGE}
                onChange={handleFileChange}
                className="hidden"
                aria-label="Upload profile picture"
              />
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className="px-4 py-2 rounded-lg border border-slate-600 text-slate-300 text-sm font-medium hover:bg-slate-700 transition-colors"
              >
                {preview ? 'Change photo' : 'Upload photo'}
              </button>
              {preview && (
                <button type="button" onClick={clearPhoto} className="text-sm text-slate-500 hover:text-red-400">
                  Remove photo
                </button>
              )}
            </div>
          </div>

          <div>
            <label htmlFor="profile-username" className="block text-sm font-medium text-slate-300 mb-1">
              Username
            </label>
            <input
              id="profile-username"
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
              className="w-full px-3 py-2 rounded-lg bg-slate-700 border border-slate-600 text-slate-100 focus:ring-2 focus:ring-amber-500 focus:border-transparent"
              placeholder="Username"
            />
          </div>
          <div>
            <label htmlFor="profile-email" className="block text-sm font-medium text-slate-300 mb-1">
              Email
            </label>
            <input
              id="profile-email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="w-full px-3 py-2 rounded-lg bg-slate-700 border border-slate-600 text-slate-100 focus:ring-2 focus:ring-amber-500 focus:border-transparent"
              placeholder="you@example.com"
            />
          </div>
          <div className="flex gap-3 pt-2">
            <button
              type="submit"
              disabled={submitting}
              className="flex-1 py-2.5 rounded-lg bg-amber-500 text-slate-900 font-semibold hover:bg-amber-400 disabled:opacity-50 transition-colors"
            >
              {submitting ? 'Saving…' : 'Save changes'}
            </button>
          </div>
        </form>
      </main>
    </>
  );
}
