import { useState, useRef, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { aiAPI } from '../api/axios';

const BOT_LABEL = 'AI Coach';
const PLACEHOLDER = 'Ask a fitness question or request a suggestion…';

export default function AICoachWidget() {
  const { user } = useAuth();
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState([
    { role: 'bot', text: "Hi! I'm your RepForge AI Coach. Ask for a workout suggestion or about rest, nutrition, reps, or progressive overload." },
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const panelRef = useRef(null);
  const bottomRef = useRef(null);

  useEffect(() => {
    if (open && bottomRef.current) {
      bottomRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [open, messages]);

  useEffect(() => {
    if (!open) return;
    const close = (e) => {
      if (panelRef.current && !panelRef.current.contains(e.target)) {
        const btn = document.querySelector('[data-ai-coach-toggle]');
        if (btn && btn.contains(e.target)) return;
        setOpen(false);
      }
    };
    document.addEventListener('click', close);
    return () => document.removeEventListener('click', close);
  }, [open]);

  const send = async () => {
    const text = input.trim();
    if (!text || loading) return;
    setInput('');
    setMessages((prev) => [...prev, { role: 'user', text }]);
    setLoading(true);
    try {
      const { data } = await aiAPI.suggest({ message: text });
      setMessages((prev) => [...prev, { role: 'bot', text: data.suggestion || 'No suggestion right now.' }]);
    } catch (err) {
      setMessages((prev) => [
        ...prev,
        { role: 'bot', text: err.response?.data?.message || 'Something went wrong. Try again.' },
      ]);
    } finally {
      setLoading(false);
    }
  };

  const requestSuggestion = async () => {
    if (loading) return;
    setMessages((prev) => [...prev, { role: 'user', text: 'Suggest my next workout' }]);
    setLoading(true);
    try {
      const { data } = await aiAPI.suggest({});
      setMessages((prev) => [...prev, { role: 'bot', text: data.suggestion || 'Add some workouts and I’ll suggest what to do next.' }]);
    } catch (err) {
      setMessages((prev) => [
        ...prev,
        { role: 'bot', text: err.response?.data?.message || 'Something went wrong. Try again.' },
      ]);
    } finally {
      setLoading(false);
    }
  };

  if (!user) return null;

  return (
    <>
      {/* Floating button */}
      <button
        type="button"
        data-ai-coach-toggle
        onClick={() => setOpen((o) => !o)}
        className="fixed bottom-6 right-6 z-50 flex items-center justify-center w-14 h-14 rounded-full bg-amber-500 text-slate-900 shadow-lg hover:bg-amber-400 transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-amber-400 focus-visible:ring-offset-2 focus-visible:ring-offset-slate-900"
        aria-label="Open AI Coach"
      >
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
        </svg>
      </button>

      {/* Chat panel */}
      {open && (
        <div
          ref={panelRef}
          className="fixed bottom-24 right-6 z-50 w-full max-w-sm rounded-xl border border-slate-700 bg-slate-800 shadow-2xl flex flex-col overflow-hidden"
          role="dialog"
          aria-label="AI Coach chat"
        >
          <div className="px-4 py-3 border-b border-slate-700 bg-slate-800/95">
            <h2 className="text-sm font-semibold text-amber-400">{BOT_LABEL}</h2>
            <p className="text-xs text-slate-500 mt-0.5">Workout suggestions & fitness Q&A</p>
          </div>
          <div className="flex-1 overflow-y-auto min-h-[200px] max-h-[320px] p-4 space-y-3">
            {messages.map((m, i) => (
              <div
                key={i}
                className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                <div
                  className={`max-w-[85%] rounded-lg px-3 py-2 text-sm ${
                    m.role === 'user'
                      ? 'bg-amber-500/20 text-slate-100'
                      : 'bg-slate-700 text-slate-200'
                  }`}
                >
                  {m.text}
                </div>
              </div>
            ))}
            {loading && (
              <div className="flex justify-start">
                <div className="rounded-lg px-3 py-2 text-sm bg-slate-700 text-slate-400">
                  Thinking…
                </div>
              </div>
            )}
            <div ref={bottomRef} />
          </div>
          <div className="p-3 border-t border-slate-700 flex flex-col gap-2">
            <button
              type="button"
              onClick={requestSuggestion}
              disabled={loading}
              className="w-full py-2 rounded-lg bg-slate-700 text-slate-200 text-sm font-medium hover:bg-slate-600 disabled:opacity-50"
            >
              Suggest next workout
            </button>
            <div className="flex gap-2">
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && send()}
                placeholder={PLACEHOLDER}
                className="flex-1 rounded-lg border border-slate-600 bg-slate-700 px-3 py-2 text-sm text-slate-100 placeholder-slate-500 focus:border-amber-500 focus:ring-1 focus:ring-amber-500"
                aria-label="Message"
              />
              <button
                type="button"
                onClick={send}
                disabled={loading || !input.trim()}
                className="px-4 py-2 rounded-lg bg-amber-500 text-slate-900 text-sm font-semibold hover:bg-amber-400 disabled:opacity-50"
              >
                Send
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
