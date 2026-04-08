import { useState, useRef, useEffect } from 'react';
import { ChevronLeft, Send, Scissors, Sparkles, MapPin, Phone, Star, Database, Clock, Shield, CheckCircle, Users, UserCircle } from 'lucide-react';

// ─── CBA Lab post-submission page ─────────────────────────────────────────────
function CBALabPage({ data }) {
  const [tick, setTick] = useState(0);
  const businessName = data.businessName || 'Your Business';

  // Animate the audit progress bar slowly to ~72% and hold
  useEffect(() => {
    const interval = setInterval(() => {
      setTick((t) => (t < 72 ? t + 1 : t));
    }, 28);
    return () => clearInterval(interval);
  }, []);

  const auditItems = [
    { label: 'Brand Identity',         done: true  },
    { label: 'Conversion Copy',        done: true  },
    { label: 'Service Architecture',   done: true  },
    { label: 'Competitor Positioning', done: false },
    { label: 'SEO Signal Mapping',     done: false },
  ];

  return (
    <div className="min-h-svh bg-[#050505] flex flex-col items-center justify-center px-5 py-14 text-center relative overflow-hidden">

      {/* Ambient glow */}
      <div
        className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[300px] rounded-full pointer-events-none"
        style={{
          background: 'radial-gradient(ellipse, rgba(201,162,39,0.07) 0%, transparent 70%)',
          filter: 'blur(40px)',
        }}
      />

      {/* Subtle grid */}
      <div
        className="absolute inset-0 pointer-events-none opacity-[0.025]"
        style={{
          backgroundImage:
            'linear-gradient(#c9a227 1px, transparent 1px), linear-gradient(90deg, #c9a227 1px, transparent 1px)',
          backgroundSize: '60px 60px',
        }}
      />

      {/* Corner marks */}
      {[
        'top-5 left-5 border-t border-l',
        'top-5 right-5 border-t border-r',
        'bottom-5 left-5 border-b border-l',
        'bottom-5 right-5 border-b border-r',
      ].map((cls) => (
        <div
          key={cls}
          className={`absolute w-6 h-6 ${cls} border-[#c9a227]/20`}
        />
      ))}

      {/* Lab wordmark */}
      <div className="relative z-10 animate-fade-up mb-10">
        <div className="inline-flex items-center gap-3 px-5 py-2 rounded-full border border-[#c9a227]/20 bg-[#c9a227]/5">
          <div className="flex gap-1">
            <div className="w-1.5 h-1.5 rounded-full bg-[#c9a227] animate-pulse" />
            <div className="w-1.5 h-1.5 rounded-full bg-[#c9a227] animate-pulse [animation-delay:0.2s]" />
            <div className="w-1.5 h-1.5 rounded-full bg-[#c9a227] animate-pulse [animation-delay:0.4s]" />
          </div>
          <span className="text-[11px] tracking-[0.25em] uppercase text-[#c9a227] font-bold">CBA Lab</span>
        </div>
      </div>

      {/* Main headline */}
      <div className="relative z-10 animate-fade-up delay-100 mb-4 max-w-sm">
        <p className="text-[11px] text-[#555] tracking-[0.2em] uppercase font-semibold mb-3">
          Information Received
        </p>
        <h1 className="text-3xl sm:text-4xl font-bold leading-tight tracking-tight"
          style={{
            background: 'linear-gradient(160deg, #ffffff 30%, #888888 100%)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
          }}
        >
          Pops is now auditing<br />your brand brief.
        </h1>
      </div>

      {/* Sub-copy */}
      <p className="relative z-10 animate-fade-up delay-200 text-[#555] text-sm max-w-[300px] leading-relaxed mb-10">
        We're analysing your inputs to ensure{' '}
        <span className="text-[#888]">maximum conversion</span>. You will be contacted within{' '}
        <span className="text-[#c9a227] font-semibold">24–48 hours</span> with your proof.
      </p>

      {/* Audit progress card */}
      <div className="relative z-10 animate-fade-up delay-300 w-full max-w-sm rounded-2xl border border-[#1a1a1a] bg-[#080808] overflow-hidden mb-8">

        {/* Card header */}
        <div className="px-5 py-3.5 border-b border-[#111] flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Shield className="w-3.5 h-3.5 text-[#c9a227]" />
            <span className="text-[10px] text-[#c9a227] tracking-widest uppercase font-bold">Brand Audit</span>
          </div>
          <span className="text-[11px] font-mono text-[#555]">{tick}%</span>
        </div>

        {/* Progress bar */}
        <div className="h-[2px] bg-[#111]">
          <div
            className="h-full transition-all duration-100 ease-linear"
            style={{
              width: `${tick}%`,
              background: 'linear-gradient(90deg, #c9a227, #e8c96a)',
            }}
          />
        </div>

        {/* Audit checklist */}
        <div className="px-5 py-4 flex flex-col gap-3">
          {auditItems.map((item, i) => (
            <div
              key={i}
              className="flex items-center justify-between animate-fade-up"
              style={{ animationDelay: `${0.4 + i * 0.1}s` }}
            >
              <span className={`text-xs ${item.done ? 'text-[#888]' : 'text-[#333]'}`}>
                {item.label}
              </span>
              {item.done ? (
                <CheckCircle className="w-3.5 h-3.5 text-[#c9a227]" />
              ) : (
                <div className="flex items-center gap-1">
                  <div className="w-1 h-1 rounded-full bg-[#2a2a2a] animate-pulse" />
                  <div className="w-1 h-1 rounded-full bg-[#2a2a2a] animate-pulse [animation-delay:0.15s]" />
                  <div className="w-1 h-1 rounded-full bg-[#2a2a2a] animate-pulse [animation-delay:0.3s]" />
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Business name footer */}
        <div className="px-5 pb-4">
          <div className="rounded-xl border border-[#111] bg-[#0a0a0a] px-4 py-3 flex items-center justify-between">
            <span className="text-[10px] text-[#444] uppercase tracking-widest">Brief filed for</span>
            <span className="text-[11px] text-[#888] font-semibold truncate max-w-[160px]">{businessName}</span>
          </div>
        </div>
      </div>

      {/* Divider line with label */}
      <div className="relative z-10 animate-fade-up delay-500 w-full max-w-sm flex items-center gap-3 mb-7">
        <div className="flex-1 h-px bg-[#161616]" />
        <span className="text-[10px] text-[#333] uppercase tracking-widest">What to expect</span>
        <div className="flex-1 h-px bg-[#161616]" />
      </div>

      {/* Timeline */}
      <div className="relative z-10 animate-fade-up delay-600 w-full max-w-sm flex flex-col gap-0 mb-10">
        {[
          {
            window: '0–4 hrs',
            title:  'Brief received & logged',
            body:   'Your brand data is securely filed in our client system.',
          },
          {
            window: '4–24 hrs',
            title:  'Strategic audit underway',
            body:   'Pops reviews your copy, services, and market positioning.',
          },
          {
            window: '24–48 hrs',
            title:  'Proof delivered to you',
            body:   'You receive a live preview link for final sign-off.',
          },
        ].map((item, i, arr) => (
          <div key={i} className="flex gap-4">
            {/* Timeline spine */}
            <div className="flex flex-col items-center">
              <div
                className="w-2 h-2 rounded-full border-2 mt-0.5 flex-shrink-0"
                style={{ borderColor: '#c9a227', background: i === 0 ? '#c9a227' : '#050505' }}
              />
              {i < arr.length - 1 && (
                <div className="w-px flex-1 my-1" style={{ background: 'linear-gradient(#c9a22740, transparent)' }} />
              )}
            </div>
            {/* Content */}
            <div className={`text-left pb-5 ${i === arr.length - 1 ? 'pb-0' : ''}`}>
              <p className="text-[10px] text-[#c9a227]/60 font-mono mb-0.5">{item.window}</p>
              <p className="text-xs text-[#bbb] font-semibold mb-0.5">{item.title}</p>
              <p className="text-[11px] text-[#555] leading-relaxed">{item.body}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Footer wordmark */}
      <div className="relative z-10 animate-fade-up delay-600 flex items-center gap-3">
        <div className="h-px w-8 bg-[#1e1e1e]" />
        <div className="flex items-center gap-1.5">
          <div className="w-1 h-1 rounded-full bg-[#c9a227]/40" />
          <p className="text-[10px] text-[#333] tracking-[0.25em] uppercase font-semibold">
            CBA Solutions
          </p>
          <div className="w-1 h-1 rounded-full bg-[#c9a227]/40" />
        </div>
        <div className="h-px w-8 bg-[#1e1e1e]" />
      </div>
    </div>
  );
}

// ─── Main Step 5 component ────────────────────────────────────────────────────
export default function Step5Finalize({ onBack, data }) {
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading]     = useState(false);

  const businessType = data.businessType || 'barbershop';
  const isBarber     = businessType === 'barbershop';
  const accent       = isBarber ? '#c9a227' : '#d4a0c8';

  const allServices  = (data.serviceCategories || []).flatMap((cat) => cat.services);
  const heroPreview  = (data.heroText || '').slice(0, 90) + ((data.heroText || '').length > 90 ? '…' : '');
  const hasDiscovery = data.businessName || data.address || data.phone || data.rating != null;

  const handleSubmit = async () => {
    setLoading(true);
    await new Promise((r) => setTimeout(r, 2200));
    setLoading(false);
    setSubmitted(true);
  };

  if (submitted) return <CBALabPage data={data} />;

  return (
    <div className="px-5 py-8 max-w-lg mx-auto w-full">

      {/* Header */}
      <div className="animate-fade-up mb-6">
        <div className="flex items-center gap-2 mb-1">
          <div className="w-5 h-5 rounded-full bg-[#c9a227]/10 border border-[#c9a227]/30 flex items-center justify-center">
            <span className="text-[9px] font-bold text-[#c9a227]">06</span>
          </div>
          <span className="text-[11px] text-[#666] tracking-widest uppercase font-medium">Brand Brief</span>
        </div>
        <h2 className="text-2xl font-bold text-white tracking-tight">Review Your Brief</h2>
        <p className="text-[#666] text-sm mt-1 leading-relaxed">
          Confirm the details below before submitting to the CBA team for professional review.
        </p>
      </div>

      {/* Summary card */}
      <div className="animate-fade-up delay-100 rounded-2xl border border-[#1e1e1e] bg-[#0d0d0d] overflow-hidden mb-5">

        {/* Card header */}
        <div className="px-5 py-3.5 border-b border-[#1a1a1a] bg-[#0a0a0a] flex items-center justify-between">
          <span className="text-xs text-[#666] uppercase tracking-widest font-semibold">
            {data.businessName || 'Brand Brief'}
          </span>
          <div
            className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-semibold border"
            style={{ borderColor: `${accent}40`, background: `${accent}0d`, color: accent }}
          >
            {isBarber ? <Scissors className="w-2.5 h-2.5" /> : <Sparkles className="w-2.5 h-2.5" />}
            {isBarber ? 'Barbershop' : 'Beauty Salon'}
          </div>
        </div>

        {/* Discovery fields */}
        {hasDiscovery && (
          <div className="px-5 py-3.5 border-b border-[#1a1a1a] bg-[#0a0a0a]">
            <div className="flex items-center gap-1.5 mb-2.5">
              <Database className="w-3 h-3 text-[#c9a227]" />
              <p className="text-[10px] text-[#c9a227] uppercase tracking-widest font-semibold">Discovery Data</p>
            </div>
            <div className="flex flex-col gap-1.5">
              {data.address && (
                <div className="flex items-center gap-2">
                  <MapPin className="w-3 h-3 text-[#555] flex-shrink-0" />
                  <span className="text-[11px] text-[#888]">{data.address}</span>
                </div>
              )}
              {data.phone && (
                <div className="flex items-center gap-2">
                  <Phone className="w-3 h-3 text-[#555] flex-shrink-0" />
                  <span className="text-[11px] text-[#888]">{data.phone}</span>
                </div>
              )}
              {data.rating != null && (
                <div className="flex items-center gap-2">
                  <Star className="w-3 h-3 text-[#555] flex-shrink-0" />
                  <span className="text-[11px] text-[#888]">
                    {data.rating} stars
                    {data.reviewCount != null && ` · ${data.reviewCount.toLocaleString()} reviews`}
                  </span>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Hero copy */}
        <div className="px-5 py-4 border-b border-[#1a1a1a]">
          <p className="text-[10px] text-[#555] uppercase tracking-widest mb-1.5 font-semibold">Hero Copy</p>
          <p className="text-[#777] text-xs leading-relaxed italic">
            "{heroPreview || <span className="not-italic text-[#444]">No copy provided</span>}"
          </p>
        </div>

        {/* Hero photo */}
        <div className="px-5 py-3.5 border-b border-[#1a1a1a] flex items-center gap-3">
          <p className="text-[10px] text-[#555] uppercase tracking-widest font-semibold">Hero Photo</p>
          {data.heroImage ? (
            <div className="flex items-center gap-2 ml-auto">
              <img src={data.heroImage} alt="" className="w-8 h-8 rounded object-cover" />
              <span className="text-[11px] text-[#888] truncate max-w-[160px]">{data.heroImageName}</span>
            </div>
          ) : (
            <span className="text-[11px] text-[#444] italic ml-auto">Stock photo placeholder</span>
          )}
        </div>

        {/* Services by category */}
        <div className="px-5 py-4">
          <p className="text-[10px] text-[#555] uppercase tracking-widest mb-3 font-semibold">
            Service Menu ({allServices.length})
          </p>
          {data.serviceCategories ? (
            <div className="flex flex-col gap-3">
              {data.serviceCategories.map((cat) => (
                <div key={cat.id}>
                  <div className="flex items-center gap-1.5 mb-1.5">
                    <div className="w-1 h-3 rounded-full" style={{ background: accent }} />
                    <p className="text-[10px] font-semibold uppercase tracking-wider" style={{ color: `${accent}cc` }}>
                      {cat.category}
                    </p>
                  </div>
                  <div className="flex flex-col gap-1">
                    {cat.services.map((s) => (
                      <div key={s.id} className="flex items-center bg-[#0a0a0a] border border-[#161616] rounded-lg px-2.5 py-1.5 gap-2">
                        <span className="text-[11px] text-[#777] truncate flex-1">{s.name || 'Unnamed'}</span>
                        {s.duration && (
                          <span className="flex items-center gap-1 text-[10px] text-[#555] font-mono flex-shrink-0">
                            <Clock className="w-2.5 h-2.5" />
                            {s.duration}m
                          </span>
                        )}
                        <span className="text-[11px] font-mono flex-shrink-0" style={{ color: accent }}>
                          ${s.price || '—'}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-[11px] text-[#444] italic">No services provided</p>
          )}
        </div>

        {/* Team roster */}
        <div className="px-5 py-4 border-t border-[#1a1a1a]">
          <div className="flex items-center gap-1.5 mb-3">
            <Users className="w-3 h-3" style={{ color: `${accent}99` }} />
            <p className="text-[10px] text-[#555] uppercase tracking-widest font-semibold">
              Team Roster ({(data.staff || []).length})
            </p>
          </div>
          {(data.staff || []).length > 0 ? (
            <div className="flex flex-col gap-2">
              {data.staff.map((member) => (
                <div key={member.id} className="flex items-center gap-3 bg-[#0a0a0a] border border-[#161616] rounded-xl px-3 py-2.5">
                  {/* Avatar */}
                  <div className="w-8 h-8 rounded-lg overflow-hidden flex-shrink-0 border border-[#1e1e1e] bg-[#111] flex items-center justify-center">
                    {member.photo ? (
                      <img src={member.photo} alt={member.name} className="w-full h-full object-cover" />
                    ) : (
                      <UserCircle className="w-5 h-5 text-[#333]" />
                    )}
                  </div>
                  {/* Name + position */}
                  <div className="flex-1 min-w-0">
                    <p className="text-[12px] text-[#ccc] font-medium truncate leading-tight">
                      {member.name || <span className="text-[#444] italic font-normal">No name</span>}
                    </p>
                    <p className="text-[10px] truncate leading-tight mt-0.5" style={{ color: `${accent}99` }}>
                      {member.position || <span className="text-[#444] italic">No position</span>}
                    </p>
                  </div>
                  {/* Photo status dot */}
                  <div
                    className="w-1.5 h-1.5 rounded-full flex-shrink-0"
                    style={{ background: member.photo ? accent : '#2a2a2a' }}
                    title={member.photo ? 'Photo provided' : 'No photo'}
                  />
                </div>
              ))}
            </div>
          ) : (
            <p className="text-[11px] text-[#444] italic">Skipped — our team will follow up on headshots</p>
          )}
        </div>
      </div>

      {/* Consent note */}
      <div className="animate-fade-up delay-200 mb-5">
        <div className="rounded-xl border border-[#1a1a1a] bg-[#0a0a0a] px-4 py-3.5 flex items-start gap-3">
          <Shield className="w-4 h-4 text-[#444] flex-shrink-0 mt-0.5" />
          <p className="text-[11px] text-[#555] leading-relaxed">
            By submitting this brief, you authorise{' '}
            <span className="text-[#777] font-medium">CBA Solutions</span> to review your brand data and prepare a professional website proof on your behalf.
          </p>
        </div>
      </div>

      {/* Submit button */}
      <div className="animate-fade-up delay-300 mb-5">
        <button
          onClick={handleSubmit}
          disabled={loading}
          className="w-full flex items-center justify-center gap-3 py-4 rounded-full font-bold text-sm text-black transition-all duration-200 hover:scale-[1.015] active:scale-95 shadow-lg hover:shadow-[#c9a227]/25 disabled:opacity-60 disabled:cursor-not-allowed disabled:hover:scale-100 tracking-wide"
          style={{ background: 'linear-gradient(135deg, #c9a227 0%, #e8c96a 50%, #c9a227 100%)' }}
        >
          {loading ? (
            <>
              <svg className="animate-spin w-4 h-4" viewBox="0 0 24 24" fill="none">
                <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="3" strokeDasharray="60" strokeDashoffset="20" />
              </svg>
              Transmitting Brief…
            </>
          ) : (
            <>
              <Send className="w-4 h-4" />
              Submit Brand Brief for Professional Review
            </>
          )}
        </button>
      </div>

      {/* Back */}
      <div className="animate-fade-up delay-400">
        <button
          onClick={onBack}
          className="flex items-center gap-2 px-5 py-3 rounded-full border border-[#1e1e1e] text-[#555] text-sm font-medium hover:border-[#2a2a2a] hover:text-[#777] transition-all active:scale-95"
        >
          <ChevronLeft className="w-4 h-4" />
          Back
        </button>
      </div>
    </div>
  );
}
