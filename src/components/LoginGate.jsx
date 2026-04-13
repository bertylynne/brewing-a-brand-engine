// ── LoginGate — site-wide password protection ──────────────────────────────────
// Change SITE_PASSWORD to update the access key.
import { useState, useEffect, useCallback } from 'react';
import { Coffee, Eye, EyeOff, Lock } from 'lucide-react';

const SITE_PASSWORD  = 'BrewingaBrand2026';
const SESSION_KEY    = 'cba_auth';

const SLATE       = '#2C3E50';
const SLATE_MUTED = '#7A8FA6';
const SLATE_FAINT = '#B0BEC9';
const PARCHMENT   = '#F5F0E8';
const PARCHMENT2  = '#EDE8DC';
const SIGNAL      = '#64CCF1';
const SIGNAL_DIM  = '#3DBDE8';
const BORDER      = 'rgba(44,62,80,0.12)';
const ERROR_RED   = '#E57373';

// ── Auth helpers ───────────────────────────────────────────────────────────────
// localStorage persists across page navigations, new tabs, and browser restarts.
// Call clearAuth() to force a logout (e.g. future logout button).
export function isAuthed() {
  try { return localStorage.getItem(SESSION_KEY) === 'true'; } catch { return false; }
}

function grantAuth() {
  try { localStorage.setItem(SESSION_KEY, 'true'); } catch { /* incognito storage blocked */ }
}

export function clearAuth() {
  try { localStorage.removeItem(SESSION_KEY); } catch { /* noop */ }
}

// ── LoginGate ──────────────────────────────────────────────────────────────────
// Renders `children` when authed; login screen otherwise.
export default function LoginGate({ children }) {
  const [authed,  setAuthed]  = useState(isAuthed);
  const [value,   setValue]   = useState('');
  const [error,   setError]   = useState('');
  const [reveal,  setReveal]  = useState(false);
  const [shaking, setShaking] = useState(false);
  const [loading, setLoading] = useState(false);

  const shake = useCallback(() => {
    setShaking(true);
    setTimeout(() => setShaking(false), 500);
  }, []);

  const handleSubmit = useCallback((e) => {
    e.preventDefault();
    setLoading(true);
    // tiny artificial delay for polish
    setTimeout(() => {
      if (value === SITE_PASSWORD) {
        grantAuth();
        setAuthed(true);
      } else {
        setError('Incorrect Key. Please try again.');
        setValue('');
        shake();
      }
      setLoading(false);
    }, 350);
  }, [value, shake]);

  const handleChange = useCallback((e) => {
    setValue(e.target.value);
    if (error) setError('');
  }, [error]);

  if (authed) return children;

  return (
    <div
      className="min-h-screen flex flex-col items-center justify-center px-6"
      style={{ background: SLATE, fontFamily: "'Inter', sans-serif" }}
    >
      {/* Card */}
      <div
        className="w-full max-w-sm"
        style={{
          transform: shaking ? undefined : 'translateX(0)',
          animation: shaking ? 'cba-shake 0.45s ease' : 'none',
        }}
      >
        {/* Brand mark */}
        <div className="flex flex-col items-center mb-10 gap-3">
          <div
            className="w-14 h-14 rounded-2xl flex items-center justify-center mb-1"
            style={{ background: `${SIGNAL}15`, border: `1px solid ${SIGNAL}25` }}
          >
            <Coffee className="w-7 h-7" style={{ color: SIGNAL }} />
          </div>
          <p
            className="text-[10px] font-bold uppercase tracking-[0.28em]"
            style={{ color: SIGNAL }}
          >
            CBA Solutions
          </p>
          <h1
            className="text-2xl font-black tracking-tight text-center"
            style={{ color: PARCHMENT, fontFamily: "'Montserrat', sans-serif" }}
          >
            Brewing a Brand
          </h1>
          <p
            className="text-xs text-center leading-relaxed"
            style={{ color: SLATE_MUTED }}
          >
            Internal portal. Enter your access key to continue.
          </p>
        </div>

        {/* Login form */}
        <div
          className="rounded-2xl p-7"
          style={{
            background:  PARCHMENT,
            border:      `1px solid ${BORDER}`,
            boxShadow:   '0 24px 60px rgba(0,0,0,0.35)',
          }}
        >
          <form onSubmit={handleSubmit} className="flex flex-col gap-5">
            {/* Label */}
            <div className="flex items-center gap-2">
              <Lock className="w-3.5 h-3.5 flex-shrink-0" style={{ color: SLATE_MUTED }} />
              <label
                className="text-[10px] font-bold uppercase tracking-[0.2em]"
                style={{ color: SLATE_MUTED }}
                htmlFor="site-key"
              >
                Access Key
              </label>
            </div>

            {/* Input */}
            <div className="relative">
              <input
                id="site-key"
                type={reveal ? 'text' : 'password'}
                value={value}
                onChange={handleChange}
                placeholder="Enter your key…"
                autoComplete="current-password"
                autoFocus
                className="w-full rounded-xl px-4 py-3.5 pr-11 text-sm outline-none transition-all duration-150"
                style={{
                  background:  '#FFFFFF',
                  border:      `1.5px solid ${error ? ERROR_RED : BORDER}`,
                  color:       SLATE,
                  boxShadow:   error
                    ? `0 0 0 3px ${ERROR_RED}20`
                    : undefined,
                }}
                onFocus={(e) => {
                  if (!error) e.target.style.borderColor = SIGNAL;
                  e.target.style.boxShadow = error
                    ? `0 0 0 3px ${ERROR_RED}20`
                    : `0 0 0 3px ${SIGNAL}20`;
                }}
                onBlur={(e) => {
                  e.target.style.borderColor = error ? ERROR_RED : BORDER;
                  e.target.style.boxShadow   = error ? `0 0 0 3px ${ERROR_RED}20` : 'none';
                }}
              />
              {/* Reveal toggle */}
              <button
                type="button"
                tabIndex={-1}
                onClick={() => setReveal((r) => !r)}
                className="absolute right-3 top-1/2 -translate-y-1/2 transition-colors"
                style={{ color: SLATE_FAINT }}
                onMouseEnter={(e) => { e.currentTarget.style.color = SLATE_MUTED; }}
                onMouseLeave={(e) => { e.currentTarget.style.color = SLATE_FAINT; }}
              >
                {reveal
                  ? <EyeOff className="w-4 h-4" />
                  : <Eye    className="w-4 h-4" />
                }
              </button>
            </div>

            {/* Error */}
            <div
              className="text-xs text-center font-medium transition-all duration-200"
              style={{
                color:   ERROR_RED,
                opacity: error ? 1 : 0,
                height:  error ? 'auto' : '0',
              }}
            >
              {error || ' '}
            </div>

            {/* Submit */}
            <button
              type="submit"
              disabled={!value.trim() || loading}
              className="w-full py-3.5 rounded-xl text-xs font-bold uppercase tracking-wider transition-all duration-150 active:scale-[0.98]"
              style={{
                background:  (!value.trim() || loading) ? PARCHMENT2 : SIGNAL,
                color:       (!value.trim() || loading) ? SLATE_FAINT : '#FFFFFF',
                border:      `1px solid ${(!value.trim() || loading) ? BORDER : 'transparent'}`,
                boxShadow:   (!value.trim() || loading) ? 'none' : `0 4px 14px ${SIGNAL}45`,
                cursor:      (!value.trim() || loading) ? 'not-allowed' : 'pointer',
              }}
              onMouseEnter={(e) => {
                if (value.trim() && !loading) e.currentTarget.style.background = SIGNAL_DIM;
              }}
              onMouseLeave={(e) => {
                if (value.trim() && !loading) e.currentTarget.style.background = SIGNAL;
              }}
            >
              {loading ? 'Checking…' : 'Enter'}
            </button>
          </form>
        </div>

        {/* Footer */}
        <p
          className="text-center mt-8 text-[10px] uppercase tracking-widest"
          style={{ color: `${SLATE_MUTED}60` }}
        >
          CBA Solutions · Secure Portal
        </p>
      </div>

      {/* Shake keyframe */}
      <style>{`
        @keyframes cba-shake {
          0%,100% { transform: translateX(0); }
          15%      { transform: translateX(-8px); }
          30%      { transform: translateX(8px); }
          45%      { transform: translateX(-6px); }
          60%      { transform: translateX(6px); }
          75%      { transform: translateX(-4px); }
          90%      { transform: translateX(4px); }
        }
      `}</style>
    </div>
  );
}
