import { useState, useRef } from 'react';
import { Play, ChevronRight, CheckCircle2, Lock, ShieldCheck, Eye, EyeOff, FolderOpen, Loader2, AlertCircle } from 'lucide-react';
import DiscoveryPanel from '../components/DiscoveryPanel';
import { loadProject } from '../lib/loadProject';

const MASTER_PASSWORD = 'POPS2026';

// ── Master Mode gate ──────────────────────────────────────────────────────────
function MasterModeGate({ isAdmin, onUnlock }) {
  const [open, setOpen]           = useState(false);
  const [pw, setPw]               = useState('');
  const [showPw, setShowPw]       = useState(false);
  const [shaking, setShaking]     = useState(false);
  const [attempted, setAttempted] = useState(false);
  const inputRef = useRef();

  const handleSubmit = (e) => {
    e.preventDefault();
    if (pw === MASTER_PASSWORD) {
      onUnlock();
      setOpen(false);
      setPw('');
    } else {
      setAttempted(true);
      setShaking(true);
      setTimeout(() => setShaking(false), 500);
      setPw('');
      inputRef.current?.focus();
    }
  };

  if (isAdmin) {
    return (
      <div className="w-full max-w-md animate-fade-up">
        <div className="flex items-center justify-between px-4 py-3 rounded-xl border"
          style={{ borderColor: 'rgba(201,162,39,0.4)', background: 'rgba(201,162,39,0.07)' }}>
          <div className="flex items-center gap-2.5">
            <div className="w-7 h-7 rounded-lg flex items-center justify-center" style={{ background: 'rgba(201,162,39,0.18)' }}>
              <ShieldCheck className="w-3.5 h-3.5" style={{ color: 'var(--gold)' }} />
            </div>
            <div>
              <p className="text-xs font-bold tracking-wide" style={{ color: 'var(--gold)' }}>Master Mode Active</p>
              <p className="text-[10px]" style={{ color: 'var(--text-faint)' }}>Back-office controls are now visible</p>
            </div>
          </div>
          <div className="flex gap-1">
            {[0, 0.15, 0.3].map((d, i) => (
              <div key={i} className="w-1.5 h-1.5 rounded-full animate-pulse" style={{ background: 'var(--gold)', animationDelay: `${d}s` }} />
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full max-w-md animate-fade-up">
      <button
        onClick={() => { setOpen((o) => !o); setAttempted(false); setPw(''); }}
        className="w-full flex items-center justify-between gap-3 px-4 py-3 rounded-xl border transition-all duration-200 text-left"
        style={
          open
            ? { borderColor: 'rgba(201,162,39,0.3)', background: 'rgba(201,162,39,0.06)' }
            : { borderColor: 'var(--border)', background: 'var(--bg-raised)' }
        }
      >
        <div className="flex items-center gap-2.5">
          <div className="w-7 h-7 rounded-lg flex items-center justify-center transition-colors"
            style={open ? { background: 'rgba(201,162,39,0.15)', color: 'var(--gold)' } : { background: 'var(--bg-surface)', color: 'var(--text-faint)' }}>
            <Lock className="w-3.5 h-3.5" />
          </div>
          <div>
            <p className="text-xs font-semibold transition-colors" style={{ color: open ? 'var(--gold)' : 'var(--text-secondary)' }}>
              Admin Access
            </p>
            <p className="text-[10px]" style={{ color: 'var(--text-faint)' }}>Enter password to unlock Master Mode</p>
          </div>
        </div>
        <Lock className="w-3.5 h-3.5 flex-shrink-0" style={{ color: open ? 'var(--gold)' : 'var(--border)' }} />
      </button>

      {open && (
        <div className="mt-2 rounded-xl border overflow-hidden animate-fade-up" style={{ borderColor: 'var(--border)', background: 'var(--bg-raised)' }}>
          <div className="px-4 pt-4 pb-4">
            <p className="text-[10px] uppercase tracking-widest font-semibold mb-3" style={{ color: 'var(--text-muted)' }}>
              Master Password
            </p>
            <form onSubmit={handleSubmit} className="flex flex-col gap-3">
              <div
                className={`flex items-center gap-2 rounded-lg border px-3 py-2.5 transition-all duration-200 ${shaking ? 'animate-shake' : ''}`}
                style={{
                  background: 'var(--bg-surface)',
                  borderColor: attempted && !shaking ? 'rgba(239,68,68,0.5)' : 'var(--border)',
                }}
              >
                <Lock className="w-3.5 h-3.5 flex-shrink-0" style={{ color: 'var(--text-faint)' }} />
                <input
                  ref={inputRef}
                  type={showPw ? 'text' : 'password'}
                  value={pw}
                  onChange={(e) => { setPw(e.target.value); setAttempted(false); }}
                  placeholder="Enter password"
                  autoFocus
                  className="flex-1 bg-transparent text-sm outline-none font-mono tracking-widest"
                  style={{ color: 'var(--text-primary)' }}
                />
                <button type="button" onClick={() => setShowPw((s) => !s)}
                  className="flex-shrink-0 transition-colors" style={{ color: 'var(--text-faint)' }}
                  onMouseEnter={(e) => { e.currentTarget.style.color = 'var(--gold)'; }}
                  onMouseLeave={(e) => { e.currentTarget.style.color = 'var(--text-faint)'; }}>
                  {showPw ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                </button>
              </div>
              {attempted && !shaking && (
                <p className="text-[11px] text-red-400 flex items-center gap-1.5 animate-fade-up">
                  <Lock className="w-3 h-3 flex-shrink-0" />
                  Incorrect password — access denied.
                </p>
              )}
              <button
                type="submit"
                disabled={!pw.trim()}
                className="w-full flex items-center justify-center gap-2 py-2.5 rounded-lg text-xs font-bold uppercase tracking-wider text-white transition-all active:scale-95 disabled:opacity-40 disabled:cursor-not-allowed"
                style={{ background: pw.trim() ? 'var(--coral)' : 'var(--bg-surface)' }}
              >
                <ShieldCheck className="w-3.5 h-3.5" />
                Unlock Master Mode
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

// ── Project Loader ─────────────────────────────────────────────────────────────
function ProjectLoader({ onLoad }) {
  const [open, setOpen]       = useState(false);
  const [bizId, setBizId]     = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError]     = useState(null);
  const [success, setSuccess] = useState(false);
  const inputRef = useRef();

  const attemptLoad = async (id) => {
    const trimmed = (id || '').trim();
    if (!trimmed) return;
    setLoading(true);
    setError(null);
    setSuccess(false);
    try {
      const projectData = await loadProject(trimmed);
      setSuccess(true);
      // Short green-flash then hand off to parent (which shows the toast)
      setTimeout(() => {
        onLoad(projectData);
        setOpen(false);
        setSuccess(false);
        setBizId('');
      }, 600);
    } catch (err) {
      setError(err.message);
      setLoading(false);
    }
  };

  const handleSubmit = (e) => { e.preventDefault(); attemptLoad(bizId); };
  // Fetch on blur if the field has a value and hasn't already loaded
  const handleBlur  = () => { if (bizId.trim() && !loading && !success) attemptLoad(bizId); };

  return (
    <div className="w-full max-w-md animate-fade-up">
      <button
        onClick={() => { setOpen((o) => !o); setError(null); setBizId(''); setSuccess(false); }}
        className="w-full flex items-center justify-between gap-3 px-4 py-3 rounded-xl border transition-all duration-200 text-left"
        style={
          open
            ? { borderColor: 'rgba(99,179,237,0.3)', background: 'rgba(99,179,237,0.06)' }
            : { borderColor: 'var(--border)', background: 'var(--bg-raised)' }
        }
      >
        <div className="flex items-center gap-2.5">
          <div className="w-7 h-7 rounded-lg flex items-center justify-center transition-colors"
            style={open ? { background: 'rgba(99,179,237,0.15)', color: '#63b3ed' } : { background: 'var(--bg-surface)', color: 'var(--text-faint)' }}>
            <FolderOpen className="w-3.5 h-3.5" />
          </div>
          <div>
            <p className="text-xs font-semibold transition-colors" style={{ color: open ? '#63b3ed' : 'var(--text-secondary)' }}>
              Resume Existing Project
            </p>
            <p className="text-[10px]" style={{ color: 'var(--text-faint)' }}>Enter a Business ID to reload saved data</p>
          </div>
        </div>
        <FolderOpen className="w-3.5 h-3.5 flex-shrink-0" style={{ color: open ? '#63b3ed' : 'var(--border)' }} />
      </button>

      {open && (
        <div className="mt-2 rounded-xl border overflow-hidden animate-fade-up" style={{ borderColor: 'var(--border)', background: 'var(--bg-raised)' }}>
          <div className="px-4 pt-4 pb-4">
            <p className="text-[10px] uppercase tracking-widest font-semibold mb-1" style={{ color: 'var(--text-muted)' }}>
              Business ID
            </p>
            <p className="text-[10px] mb-3" style={{ color: 'var(--text-faint)' }}>
              Press Enter or tab away to fetch automatically
            </p>
            <form onSubmit={handleSubmit} className="flex flex-col gap-3">
              <div
                className="flex items-center gap-2 rounded-lg border px-3 py-2.5 transition-all duration-200"
                style={{
                  background: 'var(--bg-surface)',
                  borderColor: error   ? 'rgba(239,68,68,0.5)'
                             : success ? 'rgba(74,222,128,0.5)'
                             : 'var(--border)',
                }}
              >
                <FolderOpen className="w-3.5 h-3.5 flex-shrink-0" style={{ color: success ? '#4ade80' : 'var(--text-faint)' }} />
                <input
                  ref={inputRef}
                  type="text"
                  value={bizId}
                  onChange={(e) => { setBizId(e.target.value); setError(null); setSuccess(false); }}
                  onBlur={handleBlur}
                  placeholder="e.g. pops-barbershop"
                  autoFocus
                  autoCapitalize="none"
                  autoComplete="off"
                  spellCheck={false}
                  disabled={loading || success}
                  className="flex-1 bg-transparent text-sm outline-none font-mono disabled:opacity-60"
                  style={{ color: 'var(--text-primary)' }}
                />
                {loading && <Loader2 className="w-3.5 h-3.5 animate-spin flex-shrink-0" style={{ color: '#63b3ed' }} />}
                {success && <CheckCircle2 className="w-3.5 h-3.5 flex-shrink-0" style={{ color: '#4ade80' }} />}
              </div>

              {error && (
                <p className="text-[11px] text-red-400 flex items-start gap-1.5 animate-fade-up">
                  <AlertCircle className="w-3 h-3 flex-shrink-0 mt-0.5" />
                  {error}
                </p>
              )}

              <button
                type="submit"
                disabled={!bizId.trim() || loading || success}
                className="w-full flex items-center justify-center gap-2 py-2.5 rounded-lg text-xs font-bold uppercase tracking-wider transition-all active:scale-95 disabled:opacity-40 disabled:cursor-not-allowed"
                style={{
                  background: success ? 'rgba(74,222,128,0.15)' : bizId.trim() && !loading ? '#63b3ed' : 'var(--bg-surface)',
                  color:      success ? '#4ade80' : '#fff',
                }}
              >
                {loading ? (
                  <><Loader2 className="w-3.5 h-3.5 animate-spin" /> Loading Project…</>
                ) : success ? (
                  <><CheckCircle2 className="w-3.5 h-3.5" /> Project Found — Loading…</>
                ) : (
                  <><FolderOpen className="w-3.5 h-3.5" /> Load Project</>
                )}
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

// ── Main Step 1 ───────────────────────────────────────────────────────────────
export default function Step1Welcome({ onNext, onDiscovery, onAdminUnlock, onProjectLoad, data, isAdmin }) {
  return (
    <div className="flex flex-col items-center justify-center min-h-svh px-5 py-10 text-center relative overflow-hidden">

      {/* Background texture grid */}
      <div
        className="absolute inset-0 opacity-[0.03] pointer-events-none"
        style={{
          backgroundImage: 'linear-gradient(var(--border) 1px, transparent 1px), linear-gradient(90deg, var(--border) 1px, transparent 1px)',
          backgroundSize: '48px 48px',
        }}
      />

      {/* biz_id welcome banner */}
      {data?.bizId && (
        <div className="animate-fade-up mb-5 w-full max-w-md relative z-10">
          <div className="flex items-start gap-3 px-4 py-3.5 rounded-2xl border"
            style={{ background: 'rgba(201,162,39,0.07)', borderColor: 'rgba(201,162,39,0.3)' }}>
            <CheckCircle2 className="w-4 h-4 flex-shrink-0 mt-0.5" style={{ color: 'var(--gold)' }} />
            <div className="text-left">
              <p className="text-xs font-semibold leading-snug" style={{ color: 'var(--gold)' }}>
                Draft started{data.businessName ? ` for ${data.businessName}` : ''}
              </p>
              <p className="text-[11px] leading-relaxed mt-0.5" style={{ color: 'var(--text-secondary)' }}>
                We've pre-loaded your account. Complete the steps below and your brief will be filed automatically.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Logo + Client Portal */}
      <div className="animate-fade-up mb-6 relative flex flex-col items-center gap-3">
        <img
          src="/cba-logo.png"
          alt="CBA Solutions"
          className="h-12 w-auto object-contain"
          style={{ filter: 'brightness(0) invert(1)' }}
        />
        <div className="flex items-center gap-3">
          <div className="h-px w-10" style={{ background: 'var(--border)' }} />
          <span className="text-[10px] tracking-[0.22em] uppercase font-semibold" style={{ color: 'var(--text-muted)' }}>
            Client Portal
          </span>
          <div className="h-px w-10" style={{ background: 'var(--border)' }} />
        </div>
      </div>

      {/* Heading */}
      <div className="animate-fade-up delay-100 mb-4 relative">
        <h1 className="font-serif-display text-4xl sm:text-5xl font-bold leading-tight tracking-tight">
          <span style={{ color: 'var(--text-primary)' }}>Your Brand Brief &amp;</span>
          <br />
          <span style={{ color: 'var(--gold)' }}>Website Consultation</span>
        </h1>
        <div className="flex items-center justify-center gap-3 mt-4">
          <div className="h-px w-12" style={{ background: 'var(--gold)' }} />
          <div className="w-1.5 h-1.5 rounded-full" style={{ background: 'var(--gold)' }} />
          <div className="h-px w-12" style={{ background: 'var(--gold)' }} />
        </div>
      </div>

      {/* Subtext */}
      <p className="animate-fade-up delay-200 text-base max-w-[320px] leading-relaxed mb-10 italic" style={{ color: 'var(--text-secondary)' }}>
        We'll collect your brand information so our team can build your website <span style={{ color: 'var(--text-primary)' }}>professionally and precisely</span>.
      </p>

      {/* Video Placeholder */}
      <div className="animate-fade-up delay-300 w-full max-w-md mb-10">
        <div className="relative rounded-2xl overflow-hidden aspect-video shadow-2xl group border"
          style={{ background: 'var(--bg-raised)', borderColor: 'var(--border)' }}>
          <div className="absolute inset-0 opacity-[0.04]"
            style={{
              backgroundImage: 'linear-gradient(var(--gold) 1px, transparent 1px), linear-gradient(90deg, var(--gold) 1px, transparent 1px)',
              backgroundSize: '40px 40px',
            }}
          />
          <div className="absolute top-3 left-3 w-5 h-5 border-t-2 border-l-2 rounded-tl" style={{ borderColor: 'rgba(201,162,39,0.45)' }} />
          <div className="absolute top-3 right-3 w-5 h-5 border-t-2 border-r-2 rounded-tr" style={{ borderColor: 'rgba(201,162,39,0.45)' }} />
          <div className="absolute bottom-3 left-3 w-5 h-5 border-b-2 border-l-2 rounded-bl" style={{ borderColor: 'rgba(201,162,39,0.45)' }} />
          <div className="absolute bottom-3 right-3 w-5 h-5 border-b-2 border-r-2 rounded-br" style={{ borderColor: 'rgba(201,162,39,0.45)' }} />
          <div className="absolute inset-0 flex flex-col items-center justify-center gap-3">
            <div className="w-16 h-16 rounded-full border-2 flex items-center justify-center transition-all duration-300 group-hover:scale-110 animate-pulse-gold"
              style={{ background: 'rgba(201,162,39,0.1)', borderColor: 'rgba(201,162,39,0.45)' }}>
              <Play className="w-6 h-6 ml-1" style={{ color: 'var(--gold)' }} fill="currentColor" />
            </div>
            <span className="text-xs tracking-widest uppercase" style={{ color: 'var(--text-faint)' }}>Intro Video</span>
          </div>
          <div className="absolute bottom-0 inset-x-0 py-3 px-4" style={{ background: 'linear-gradient(to top, rgba(21,34,50,0.8), transparent)' }}>
            <p className="text-[10px] text-left tracking-wider uppercase" style={{ color: 'var(--text-faint)' }}>
              Client onboarding overview · Approx. 2 min
            </p>
          </div>
        </div>
      </div>

      {/* CTA Button */}
      <div className="animate-fade-up delay-400">
        <button
          onClick={onNext}
          className="group relative inline-flex items-center gap-3 px-8 py-4 rounded-full font-bold text-base uppercase tracking-wider text-white transition-all duration-300 hover:scale-105 active:scale-95 shadow-lg focus:outline-none"
          style={{ background: 'var(--coral)', boxShadow: '0 4px 24px rgba(232,112,90,0.35)' }}
          onMouseEnter={(e) => { e.currentTarget.style.background = 'var(--coral-light)'; }}
          onMouseLeave={(e) => { e.currentTarget.style.background = 'var(--coral)'; }}
        >
          <span>Begin Your Consultation</span>
          <ChevronRight className="w-5 h-5 transition-transform duration-200 group-hover:translate-x-1" />
        </button>
      </div>

      {/* Footer note */}
      <p className="animate-fade-up delay-500 text-xs mt-6 mb-8 tracking-wide" style={{ color: 'var(--text-faint)' }}>
        7 steps · Under 10 minutes · Handled by our team
      </p>

      {/* ── Admin & Loader Zone ──────────────────────────────────── */}
      <div className="w-full max-w-md flex flex-col gap-3 relative z-10">

        {/* Divider */}
        <div className="flex items-center gap-3">
          <div className="flex-1 h-px" style={{ background: 'var(--border-sub)' }} />
          <span className="text-[9px] uppercase tracking-[0.2em] font-semibold" style={{ color: 'var(--text-faint)' }}>
            Tools
          </span>
          <div className="flex-1 h-px" style={{ background: 'var(--border-sub)' }} />
        </div>

        {/* Project Loader — always visible */}
        <ProjectLoader onLoad={onProjectLoad} />

        {/* Master Mode gate */}
        <MasterModeGate isAdmin={isAdmin} onUnlock={onAdminUnlock} />

        {/* Discovery Panel — only after unlock */}
        {isAdmin && (
          <div className="animate-fade-up">
            <DiscoveryPanel onApply={onDiscovery} />
          </div>
        )}
      </div>

    </div>
  );
}
