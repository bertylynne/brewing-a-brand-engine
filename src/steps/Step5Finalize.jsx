import { useState, useEffect } from 'react';
import { ChevronLeft, Send, Scissors, Sparkles, MapPin, Phone, Star, Database, Clock, Shield, CheckCircle, Users, UserCircle, ImageIcon, Type, Briefcase, Check, AlertCircle, Palette, Link as LinkIcon, CreditCard, CalendarDays, Wand2 } from 'lucide-react';
import { submitBrief } from '../lib/submitBrief';

const DAYS_ORDER = ['monday','tuesday','wednesday','thursday','friday','saturday','sunday'];
const DAY_LABEL  = { monday:'Mon', tuesday:'Tue', wednesday:'Wed', thursday:'Thu', friday:'Fri', saturday:'Sat', sunday:'Sun' };

function fmt12(time24) {
  if (!time24) return '';
  const [h, m] = time24.split(':').map(Number);
  const period = h < 12 ? 'AM' : 'PM';
  const h12    = h === 0 ? 12 : h > 12 ? h - 12 : h;
  return `${h12}:${String(m).padStart(2,'0')} ${period}`;
}

// ─── CBA Lab post-submission page ─────────────────────────────────────────────
function CBALabPage({ data }) {
  const [tick, setTick] = useState(0);
  const businessName = data.businessName || 'Your Business';

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
    <div className="min-h-svh flex flex-col items-center justify-center px-5 py-14 text-center relative overflow-hidden" style={{ background: '#0e1a26' }}>

      {/* Ambient glow */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[300px] rounded-full pointer-events-none" style={{ background: 'radial-gradient(ellipse, rgba(201,162,39,0.1) 0%, transparent 70%)', filter: 'blur(40px)' }} />

      {/* Grid */}
      <div className="absolute inset-0 pointer-events-none opacity-[0.03]" style={{ backgroundImage: 'linear-gradient(var(--border) 1px, transparent 1px), linear-gradient(90deg, var(--border) 1px, transparent 1px)', backgroundSize: '60px 60px' }} />

      {/* Corner marks */}
      {['top-5 left-5 border-t border-l', 'top-5 right-5 border-t border-r', 'bottom-5 left-5 border-b border-l', 'bottom-5 right-5 border-b border-r'].map((cls) => (
        <div key={cls} className={`absolute w-6 h-6 ${cls}`} style={{ borderColor: 'rgba(201,162,39,0.25)' }} />
      ))}

      {/* Lab wordmark */}
      <div className="relative z-10 animate-fade-up mb-10">
        <div className="inline-flex items-center gap-3 px-5 py-2 rounded-full border" style={{ borderColor: 'rgba(201,162,39,0.25)', background: 'rgba(201,162,39,0.07)' }}>
          <div className="flex gap-1">
            <div className="w-1.5 h-1.5 rounded-full animate-pulse" style={{ background: 'var(--gold)' }} />
            <div className="w-1.5 h-1.5 rounded-full animate-pulse [animation-delay:0.2s]" style={{ background: 'var(--gold)' }} />
            <div className="w-1.5 h-1.5 rounded-full animate-pulse [animation-delay:0.4s]" style={{ background: 'var(--gold)' }} />
          </div>
          <span className="text-[11px] tracking-[0.25em] uppercase font-bold" style={{ color: 'var(--gold)' }}>CBA Lab</span>
        </div>
      </div>

      {/* Main headline */}
      <div className="relative z-10 animate-fade-up delay-100 mb-4 max-w-sm">
        <p className="text-[11px] tracking-[0.2em] uppercase font-semibold mb-3" style={{ color: 'var(--coral)' }}>
          Information Received
        </p>
        <h1 className="font-serif-display text-3xl sm:text-4xl font-bold leading-tight tracking-tight" style={{ color: 'var(--text-primary)' }}>
          We're now auditing<br />your brand brief.
        </h1>
        <div className="flex items-center justify-center gap-3 mt-4">
          <div className="h-px w-10" style={{ background: 'var(--gold)' }} />
          <div className="w-1.5 h-1.5 rounded-full" style={{ background: 'var(--gold)' }} />
          <div className="h-px w-10" style={{ background: 'var(--gold)' }} />
        </div>
      </div>

      {/* Sub-copy */}
      <p className="relative z-10 animate-fade-up delay-200 text-sm max-w-[300px] leading-relaxed mb-10 italic" style={{ color: 'var(--text-secondary)' }}>
        We're analysing your inputs to ensure{' '}
        <span style={{ color: 'var(--text-primary)' }}>maximum conversion</span>. You will be contacted within{' '}
        <span className="font-semibold" style={{ color: 'var(--gold)' }}>24–48 hours</span> with your proof.
      </p>

      {/* Audit progress card */}
      <div className="relative z-10 animate-fade-up delay-300 w-full max-w-sm rounded-2xl border overflow-hidden mb-8" style={{ borderColor: 'var(--border)', background: 'var(--bg-surface)' }}>
        <div className="px-5 py-3.5 border-b flex items-center justify-between" style={{ borderColor: 'var(--border-sub)', background: 'var(--bg-raised)' }}>
          <div className="flex items-center gap-2">
            <Shield className="w-3.5 h-3.5" style={{ color: 'var(--gold)' }} />
            <span className="text-[10px] tracking-widest uppercase font-bold" style={{ color: 'var(--gold)' }}>Brand Audit</span>
          </div>
          <span className="text-[11px] font-mono" style={{ color: 'var(--text-muted)' }}>{tick}%</span>
        </div>

        <div className="h-[2px]" style={{ background: 'var(--border)' }}>
          <div className="h-full transition-all duration-100 ease-linear" style={{ width: `${tick}%`, background: 'linear-gradient(90deg, var(--coral), var(--gold))' }} />
        </div>

        <div className="px-5 py-4 flex flex-col gap-3" style={{ background: 'var(--bg-card)' }}>
          {auditItems.map((item, i) => (
            <div key={i} className="flex items-center justify-between animate-fade-up" style={{ animationDelay: `${0.4 + i * 0.1}s` }}>
              <span className="text-xs" style={{ color: item.done ? 'var(--text-secondary)' : 'var(--text-faint)' }}>{item.label}</span>
              {item.done ? (
                <CheckCircle className="w-3.5 h-3.5" style={{ color: 'var(--gold)' }} />
              ) : (
                <div className="flex items-center gap-1">
                  {[0, 0.15, 0.3].map((d, j) => (
                    <div key={j} className="w-1 h-1 rounded-full animate-pulse" style={{ background: 'var(--border)', animationDelay: `${d}s` }} />
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>

        <div className="px-5 pb-4" style={{ background: 'var(--bg-card)' }}>
          <div className="rounded-xl border px-4 py-3 flex items-center justify-between" style={{ borderColor: 'var(--border-sub)', background: 'var(--bg-surface)' }}>
            <span className="text-[10px] uppercase tracking-widest" style={{ color: 'var(--text-faint)' }}>Brief filed for</span>
            <span className="text-[11px] font-semibold truncate max-w-[160px]" style={{ color: 'var(--text-secondary)' }}>{businessName}</span>
          </div>
        </div>
      </div>

      {/* What to expect divider */}
      <div className="relative z-10 animate-fade-up delay-500 w-full max-w-sm flex items-center gap-3 mb-7">
        <div className="flex-1 h-px" style={{ background: 'var(--border-sub)' }} />
        <span className="text-[10px] uppercase tracking-widest" style={{ color: 'var(--text-faint)' }}>What to expect</span>
        <div className="flex-1 h-px" style={{ background: 'var(--border-sub)' }} />
      </div>

      {/* Timeline */}
      <div className="relative z-10 animate-fade-up delay-600 w-full max-w-sm flex flex-col gap-0 mb-10">
        {[
          { window: '0–4 hrs',   title: 'Brief received & logged',   body: 'Your brand data is securely filed in our client system.' },
          { window: '4–24 hrs',  title: 'Strategic audit underway',  body: 'Our team reviews your copy, services, and market positioning.' },
          { window: '24–48 hrs', title: 'Proof delivered to you',    body: 'You receive a live preview link for final sign-off.' },
        ].map((item, i, arr) => (
          <div key={i} className="flex gap-4">
            <div className="flex flex-col items-center">
              <div className="w-2 h-2 rounded-full border-2 mt-0.5 flex-shrink-0" style={{ borderColor: 'var(--gold)', background: i === 0 ? 'var(--gold)' : 'var(--bg-base)' }} />
              {i < arr.length - 1 && <div className="w-px flex-1 my-1" style={{ background: 'linear-gradient(rgba(201,162,39,0.4), transparent)' }} />}
            </div>
            <div className={`text-left ${i === arr.length - 1 ? '' : 'pb-5'}`}>
              <p className="text-[10px] font-mono mb-0.5" style={{ color: 'rgba(201,162,39,0.6)' }}>{item.window}</p>
              <p className="text-xs font-semibold mb-0.5" style={{ color: 'var(--text-primary)' }}>{item.title}</p>
              <p className="text-[11px] leading-relaxed" style={{ color: 'var(--text-muted)' }}>{item.body}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Footer wordmark */}
      <div className="relative z-10 animate-fade-up delay-600 flex items-center gap-3">
        <div className="h-px w-8" style={{ background: 'var(--border)' }} />
        <div className="flex items-center gap-1.5">
          <div className="w-1 h-1 rounded-full" style={{ background: 'rgba(201,162,39,0.4)' }} />
          <p className="text-[10px] tracking-[0.25em] uppercase font-semibold" style={{ color: 'var(--text-faint)' }}>CBA Solutions</p>
          <div className="w-1 h-1 rounded-full" style={{ background: 'rgba(201,162,39,0.4)' }} />
        </div>
        <div className="h-px w-8" style={{ background: 'var(--border)' }} />
      </div>
    </div>
  );
}

// ─── Main Step 6 component ────────────────────────────────────────────────────
export default function Step5Finalize({ onBack, data }) {
  const [submitted, setSubmitted]     = useState(false);
  const [loading, setLoading]         = useState(false);
  const [progressMsg, setProgressMsg] = useState('');
  const [submitError, setSubmitError] = useState(null);

  const businessType = data.businessType || 'barbershop';
  const isBarber     = businessType === 'barbershop';
  const accent       = isBarber ? '#c9a227' : '#d4a0c8';

  // Step 4 saves a flat array under `selectedServices`; group by category for display
  const selectedServices = data.selectedServices || [];
  const serviceCategories = selectedServices.reduce((acc, svc) => {
    const catName = svc.category || 'Other';
    let cat = acc.find((c) => c.category === catName);
    if (!cat) { cat = { category: catName, services: [] }; acc.push(cat); }
    cat.services.push(svc);
    return acc;
  }, []);
  const allServices = selectedServices;
  const heroPreview  = (data.heroText || '').slice(0, 90) + ((data.heroText || '').length > 90 ? '…' : '');
  const hasDiscovery = data.businessName || data.address || data.phone || data.rating != null;

  const handleSubmit = async () => {
    setLoading(true);
    setSubmitError(null);
    setProgressMsg('Connecting to CBA Database…');
    try {
      await submitBrief(data, (msg) => setProgressMsg(msg));
      setLoading(false);
      setSubmitted(true);
    } catch (err) {
      setLoading(false);
      setSubmitError(err.message || 'An unexpected error occurred. Please try again.');
      setProgressMsg('');
    }
  };

  if (submitted) return <CBALabPage data={data} />;

  return (
    <div className="px-5 py-8 max-w-lg mx-auto w-full">

      {/* Header */}
      <div className="animate-fade-up mb-6">
        <p className="text-[11px] tracking-[0.2em] uppercase font-semibold mb-2" style={{ color: 'var(--coral)' }}>
          — Step 08 —
        </p>
        <h2 className="font-serif-display text-2xl font-bold tracking-tight" style={{ color: 'var(--text-primary)' }}>
          Review Your Brief
        </h2>
        <div className="flex items-center gap-3 my-3">
          <div className="h-px w-8" style={{ background: 'var(--gold)' }} />
          <div className="w-1 h-1 rounded-full" style={{ background: 'var(--gold)' }} />
          <div className="h-px w-8" style={{ background: 'var(--gold)' }} />
        </div>
        <p className="text-sm leading-relaxed" style={{ color: 'var(--text-secondary)' }}>
          Confirm the details below before submitting to the CBA team for professional review.
        </p>
      </div>

      {/* Summary card */}
      <div className="animate-fade-up delay-100 rounded-2xl border overflow-hidden mb-5" style={{ borderColor: 'var(--border)', background: 'var(--bg-card)' }}>

        {/* Card header */}
        <div className="px-5 py-3.5 border-b flex items-center justify-between" style={{ borderColor: 'var(--border-sub)', background: 'var(--bg-raised)' }}>
          <span className="text-xs uppercase tracking-widest font-semibold" style={{ color: 'var(--text-muted)' }}>
            {data.businessName || 'Brand Brief'}
          </span>
          <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-semibold border" style={{ borderColor: `${accent}40`, background: `${accent}0d`, color: accent }}>
            {isBarber ? <Scissors className="w-2.5 h-2.5" /> : <Sparkles className="w-2.5 h-2.5" />}
            {isBarber ? 'Barbershop' : 'Beauty Salon'}
          </div>
        </div>

        {/* Logo + Tagline */}
        {(data.logo || data.tagline) && (
          <div className="px-5 py-3.5 border-b" style={{ borderColor: 'var(--border-sub)', background: 'var(--bg-surface)' }}>
            <div className="flex items-center gap-1.5 mb-2.5">
              <ImageIcon className="w-3 h-3" style={{ color: 'var(--gold)' }} />
              <p className="text-[10px] uppercase tracking-widest font-semibold" style={{ color: 'var(--gold)' }}>Brand Assets</p>
            </div>
            <div className="flex items-center gap-4">
              {data.logo && (
                <div className="w-14 h-14 rounded-xl border flex items-center justify-center overflow-hidden flex-shrink-0" style={{ borderColor: 'var(--border)', background: 'var(--bg-raised)' }}>
                  <img src={data.logo} alt="Logo" className="w-full h-full object-contain p-1.5" />
                </div>
              )}
              {data.tagline && (
                <div className="flex items-start gap-1.5 min-w-0">
                  <Type className="w-3 h-3 flex-shrink-0 mt-0.5" style={{ color: 'var(--text-muted)' }} />
                  <span className="text-[11px] italic leading-relaxed" style={{ color: 'var(--text-secondary)' }}>"{data.tagline}"</span>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Brand Photos */}
        {(data.brandPhotos || []).length > 0 && (
          <div className="px-5 py-3.5 border-b" style={{ borderColor: 'var(--border-sub)', background: 'var(--bg-surface)' }}>
            <div className="flex items-center justify-between mb-2.5">
              <div className="flex items-center gap-1.5">
                <ImageIcon className="w-3 h-3" style={{ color: 'var(--gold)' }} />
                <p className="text-[10px] uppercase tracking-widest font-semibold" style={{ color: 'var(--gold)' }}>Brand Photos</p>
              </div>
              <span className="text-[10px] font-mono" style={{ color: 'var(--text-faint)' }}>{data.brandPhotos.length} uploaded</span>
            </div>
            <div className="grid grid-cols-4 gap-1.5">
              {data.brandPhotos.map((photo) => (
                <div key={photo.id} className="relative rounded-lg overflow-hidden border" style={{ aspectRatio: '4/3', borderColor: 'var(--border)', background: 'var(--bg-raised)' }}>
                  <img src={photo.url} alt={photo.name} className="w-full h-full object-cover" />
                  {photo.category && (
                    <div className="absolute bottom-0 left-0 right-0 px-1 py-0.5 text-center" style={{ background: 'rgba(0,0,0,0.55)', backdropFilter: 'blur(4px)' }}>
                      <span className="text-[8px] uppercase tracking-wider font-semibold text-white/70">{photo.category}</span>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Brand Colours */}
        {data.brandColors && (
          <div className="px-5 py-3.5 border-b" style={{ borderColor: 'var(--border-sub)', background: 'var(--bg-surface)' }}>
            <div className="flex items-center gap-1.5 mb-2.5">
              <Palette className="w-3 h-3" style={{ color: 'var(--gold)' }} />
              <p className="text-[10px] uppercase tracking-widest font-semibold" style={{ color: 'var(--gold)' }}>Brand Colours</p>
            </div>
            <div className="flex items-center gap-2 flex-wrap">
              {[
                { label: 'Primary',   val: data.brandColors.primary   },
                { label: 'Secondary', val: data.brandColors.secondary },
                { label: 'Accent',    val: data.brandColors.accent    },
              ].map(({ label, val }) => val && (
                <div key={label} className="flex items-center gap-1.5 rounded-lg px-2.5 py-1.5 border" style={{ background: 'var(--bg-raised)', borderColor: 'var(--border)' }}>
                  <div className="w-3.5 h-3.5 rounded-full flex-shrink-0 border" style={{ background: val, borderColor: 'rgba(255,255,255,0.15)' }} />
                  <span className="text-[10px] font-mono" style={{ color: 'var(--text-secondary)' }}>{val.toUpperCase()}</span>
                  <span className="text-[9px] uppercase tracking-wider" style={{ color: 'var(--text-faint)' }}>{label}</span>
                </div>
              ))}
            </div>
            {/* Custom build */}
            {data.customDesign?.enabled && (
              <div className="mt-3 rounded-xl border overflow-hidden" style={{ borderColor: 'rgba(201,162,39,0.3)', background: 'rgba(201,162,39,0.05)' }}>
                <div className="flex items-center gap-2 px-3 py-2 border-b" style={{ borderColor: 'rgba(201,162,39,0.2)' }}>
                  <Wand2 className="w-3 h-3 flex-shrink-0" style={{ color: 'var(--gold)' }} />
                  <span className="text-[10px] uppercase tracking-widest font-bold" style={{ color: 'var(--gold)' }}>Custom Build Requested</span>
                </div>
                {/* Inspiration URLs */}
                {(data.customDesign.urls || []).filter(u => u?.trim()).length > 0 && (
                  <div className="px-3 py-2 border-b flex flex-col gap-1.5" style={{ borderColor: 'rgba(201,162,39,0.2)' }}>
                    <p className="text-[9px] uppercase tracking-widest mb-0.5" style={{ color: 'var(--text-faint)' }}>Inspiration Links</p>
                    {(data.customDesign.urls || []).filter(u => u?.trim()).map((url, i) => (
                      <div key={i} className="flex items-center gap-1.5">
                        <LinkIcon className="w-2.5 h-2.5 flex-shrink-0" style={{ color: 'var(--text-muted)' }} />
                        <span className="text-[10px] truncate" style={{ color: 'var(--text-secondary)' }}>{url}</span>
                      </div>
                    ))}
                  </div>
                )}
                {/* Vibe notes */}
                {data.customDesign.vibeNotes && (
                  <div className="px-3 py-2">
                    <p className="text-[9px] uppercase tracking-widest mb-1" style={{ color: 'var(--text-faint)' }}>Vibe Notes</p>
                    <p className="text-[11px] italic leading-relaxed" style={{ color: 'var(--text-muted)' }}>"{data.customDesign.vibeNotes.slice(0, 200)}{data.customDesign.vibeNotes.length > 200 ? '…' : ''}"</p>
                  </div>
                )}
              </div>
            )}
          </div>
        )}

        {/* Social Links */}
        {(data.socialLinks?.facebook || data.socialLinks?.instagram || data.socialLinks?.others?.length > 0) && (
          <div className="px-5 py-3.5 border-b" style={{ borderColor: 'var(--border-sub)', background: 'var(--bg-surface)' }}>
            <div className="flex items-center gap-1.5 mb-2.5">
              <LinkIcon className="w-3 h-3" style={{ color: 'var(--gold)' }} />
              <p className="text-[10px] uppercase tracking-widest font-semibold" style={{ color: 'var(--gold)' }}>Social Media</p>
            </div>
            <div className="flex flex-col gap-1.5">
              {data.socialLinks.facebook && (
                <div className="flex items-center gap-2">
                  <span className="text-[10px] font-semibold w-16 flex-shrink-0" style={{ color: 'var(--text-muted)' }}>Facebook</span>
                  <span className="text-[11px] truncate" style={{ color: 'var(--text-secondary)' }}>{data.socialLinks.facebook}</span>
                </div>
              )}
              {data.socialLinks.instagram && (
                <div className="flex items-center gap-2">
                  <span className="text-[10px] font-semibold w-16 flex-shrink-0" style={{ color: 'var(--text-muted)' }}>Instagram</span>
                  <span className="text-[11px] truncate" style={{ color: 'var(--text-secondary)' }}>{data.socialLinks.instagram}</span>
                </div>
              )}
              {(data.socialLinks.others || []).filter(o => o.url).map((o) => (
                <div key={o.id} className="flex items-center gap-2">
                  <span className="text-[10px] font-semibold w-16 flex-shrink-0 truncate" style={{ color: 'var(--text-muted)' }}>{o.label || 'Other'}</span>
                  <span className="text-[11px] truncate" style={{ color: 'var(--text-secondary)' }}>{o.url}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Payment Methods */}
        {(data.paymentMethods || []).length > 0 && (
          <div className="px-5 py-3.5 border-b" style={{ borderColor: 'var(--border-sub)', background: 'var(--bg-surface)' }}>
            <div className="flex items-center gap-1.5 mb-2.5">
              <CreditCard className="w-3 h-3" style={{ color: 'var(--gold)' }} />
              <p className="text-[10px] uppercase tracking-widest font-semibold" style={{ color: 'var(--gold)' }}>Payment Methods</p>
            </div>
            <div className="flex flex-wrap gap-1.5">
              {data.paymentMethods.map((p) => (
                <span key={p} className="px-2.5 py-1 rounded-full text-[10px] font-semibold border"
                  style={{ borderColor: `${accent}35`, background: `${accent}0d`, color: accent }}>
                  {p.replace('_', ' ').replace(/\b\w/g, c => c.toUpperCase())}
                </span>
              ))}
            </div>
          </div>
        )}

        {/* Business Hours */}
        {data.businessHours && (
          <div className="px-5 py-3.5 border-b" style={{ borderColor: 'var(--border-sub)', background: 'var(--bg-surface)' }}>
            <div className="flex items-center gap-1.5 mb-2.5">
              <CalendarDays className="w-3 h-3" style={{ color: 'var(--gold)' }} />
              <p className="text-[10px] uppercase tracking-widest font-semibold" style={{ color: 'var(--gold)' }}>Business Hours</p>
            </div>
            <div className="grid grid-cols-2 gap-x-4 gap-y-1">
              {DAYS_ORDER.map((day) => {
                const d = data.businessHours[day];
                if (!d) return null;
                return (
                  <div key={day} className="flex items-center justify-between">
                    <span className="text-[10px] font-semibold w-8" style={{ color: 'var(--text-muted)' }}>{DAY_LABEL[day]}</span>
                    {d.closed
                      ? <span className="text-[10px]" style={{ color: 'var(--text-faint)' }}>Closed</span>
                      : <span className="text-[10px] font-mono" style={{ color: 'var(--text-secondary)' }}>{fmt12(d.open)} – {fmt12(d.close)}</span>
                    }
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* Discovery fields */}
        {hasDiscovery && (
          <div className="px-5 py-3.5 border-b" style={{ borderColor: 'var(--border-sub)', background: 'var(--bg-surface)' }}>
            <div className="flex items-center gap-1.5 mb-2.5">
              <Database className="w-3 h-3" style={{ color: 'var(--gold)' }} />
              <p className="text-[10px] uppercase tracking-widest font-semibold" style={{ color: 'var(--gold)' }}>Discovery Data</p>
            </div>
            <div className="flex flex-col gap-1.5">
              {data.address && (
                <div className="flex items-center gap-2">
                  <MapPin className="w-3 h-3 flex-shrink-0" style={{ color: 'var(--text-muted)' }} />
                  <span className="text-[11px]" style={{ color: 'var(--text-secondary)' }}>{data.address}</span>
                </div>
              )}
              {data.phone && (
                <div className="flex items-center gap-2">
                  <Phone className="w-3 h-3 flex-shrink-0" style={{ color: 'var(--text-muted)' }} />
                  <span className="text-[11px]" style={{ color: 'var(--text-secondary)' }}>{data.phone}</span>
                </div>
              )}
              {data.rating != null && (
                <div className="flex items-center gap-2">
                  <Star className="w-3 h-3 flex-shrink-0" style={{ color: 'var(--text-muted)' }} />
                  <span className="text-[11px]" style={{ color: 'var(--text-secondary)' }}>
                    {data.rating} stars{data.reviewCount != null && ` · ${data.reviewCount.toLocaleString()} reviews`}
                  </span>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Hero copy */}
        <div className="px-5 py-4 border-b" style={{ borderColor: 'var(--border-sub)' }}>
          <p className="text-[10px] uppercase tracking-widest mb-1.5 font-semibold" style={{ color: 'var(--text-muted)' }}>Hero Copy</p>
          <p className="text-xs leading-relaxed italic" style={{ color: 'var(--text-secondary)' }}>
            "{heroPreview || <span className="not-italic" style={{ color: 'var(--text-faint)' }}>No copy provided</span>}"
          </p>
        </div>

        {/* Hero photo */}
        <div className="px-5 py-3.5 border-b flex items-center gap-3" style={{ borderColor: 'var(--border-sub)' }}>
          <p className="text-[10px] uppercase tracking-widest font-semibold" style={{ color: 'var(--text-muted)' }}>Hero Photo</p>
          {data.heroImage ? (
            <div className="flex items-center gap-2 ml-auto">
              <img src={data.heroImage} alt="" className="w-8 h-8 rounded object-cover" />
              <span className="text-[11px] truncate max-w-[160px]" style={{ color: 'var(--text-secondary)' }}>{data.heroImageName}</span>
            </div>
          ) : (
            <span className="text-[11px] italic ml-auto" style={{ color: 'var(--text-faint)' }}>Stock photo placeholder</span>
          )}
        </div>

        {/* Services */}
        <div className="px-5 py-4">
          <p className="text-[10px] uppercase tracking-widest mb-3 font-semibold" style={{ color: 'var(--text-muted)' }}>
            Service Menu ({allServices.length})
          </p>
          {serviceCategories.length > 0 ? (
            <div className="flex flex-col gap-3">
              {serviceCategories.map((cat) => (
                <div key={cat.category}>
                  <div className="flex items-center gap-1.5 mb-1.5">
                    <div className="w-1 h-3 rounded-full" style={{ background: accent }} />
                    <p className="text-[10px] font-semibold uppercase tracking-wider" style={{ color: `${accent}cc` }}>{cat.category}</p>
                  </div>
                  <div className="flex flex-col gap-1">
                    {cat.services.map((s) => (
                      <div key={s.id} className="flex items-center rounded-lg px-2.5 py-1.5 gap-2 border" style={{ background: 'var(--bg-surface)', borderColor: 'var(--border-sub)' }}>
                        <span className="text-[11px] truncate flex-1" style={{ color: 'var(--text-secondary)' }}>{s.name || 'Unnamed'}</span>
                        {s.duration && (
                          <span className="flex items-center gap-1 text-[10px] font-mono flex-shrink-0" style={{ color: 'var(--text-muted)' }}>
                            <Clock className="w-2.5 h-2.5" />{s.duration}m
                          </span>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-[11px] italic" style={{ color: 'var(--text-faint)' }}>No services provided</p>
          )}
        </div>

        {/* Team roster */}
        <div className="px-5 py-4 border-t" style={{ borderColor: 'var(--border-sub)' }}>
          <div className="flex items-center gap-1.5 mb-3">
            <Users className="w-3 h-3" style={{ color: `${accent}99` }} />
            <p className="text-[10px] uppercase tracking-widest font-semibold" style={{ color: 'var(--text-muted)' }}>
              Team Roster ({(data.staff || []).length})
            </p>
          </div>
          {(data.staff || []).length > 0 ? (
            <div className="flex flex-col gap-2">
              {data.staff.map((member) => (
                <div key={member.id} className="rounded-xl overflow-hidden border" style={{ background: 'var(--bg-surface)', borderColor: 'var(--border-sub)' }}>
                  <div className="flex items-center gap-3 px-3 py-2.5">
                    <div className="w-14 flex-shrink-0 rounded-lg overflow-hidden border flex items-center justify-center" style={{ aspectRatio: '16/9', borderColor: 'var(--border)', background: 'var(--bg-raised)' }}>
                      {member.photo
                        ? <img src={member.photo} alt={member.name} className="w-full h-full object-cover" />
                        : <UserCircle className="w-4 h-4" style={{ color: 'var(--text-faint)' }} />
                      }
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-[12px] font-semibold truncate leading-tight" style={{ color: 'var(--text-primary)' }}>
                        {member.name || <span className="italic font-normal" style={{ color: 'var(--text-faint)' }}>No name</span>}
                      </p>
                      <p className="text-[10px] truncate leading-tight mt-0.5" style={{ color: `${accent}99` }}>
                        {member.title || <span className="italic" style={{ color: 'var(--text-faint)' }}>No title</span>}
                      </p>
                    </div>
                    <div className="flex items-center gap-1.5 flex-shrink-0">
                      <div className="w-1.5 h-1.5 rounded-full" style={{ background: member.photo ? accent : 'var(--border)' }} />
                      <div className="w-1.5 h-1.5 rounded-full" style={{ background: member.bookingLink ? accent : 'var(--border)' }} />
                      <div className="w-1.5 h-1.5 rounded-full" style={{ background: member.contactEmail ? 'var(--text-muted)' : 'var(--border)' }} />
                    </div>
                  </div>
                  {/* Bio */}
                  {member.bio && (
                    <div className="px-3 pb-1">
                      <p className="text-[10px] leading-relaxed italic" style={{ color: 'var(--text-muted)' }}>"{member.bio.slice(0,120)}{member.bio.length > 120 ? '…' : ''}"</p>
                    </div>
                  )}
                  {/* Instagram */}
                  {member.instagram && (
                    <div className="px-3 pb-1.5 flex items-center gap-1.5">
                      <span className="text-[10px]" style={{ color: '#E1306C' }}>@{member.instagram}</span>
                    </div>
                  )}
                  {/* Booking */}
                  {(() => {
                    const status = member.bookingStatus || 'none';
                    if (status === 'create') return (
                      <div className="px-3 pb-2.5 flex items-center gap-1.5">
                        <div className="w-1.5 h-1.5 rounded-full flex-shrink-0" style={{ background: accent }} />
                        <span className="text-[10px] font-medium" style={{ color: `${accent}cc` }}>CBA to build booking page</span>
                      </div>
                    );
                    if (status === 'has' && member.bookingLink) return (
                      <div className="px-3 pb-2.5 flex items-center gap-1.5">
                        <div className="w-1.5 h-1.5 rounded-full flex-shrink-0" style={{ background: accent }} />
                        <span className="text-[10px] truncate" style={{ color: 'var(--text-muted)' }}>{member.bookingLink}</span>
                      </div>
                    );
                    return null;
                  })()}
                </div>
              ))}
            </div>
          ) : (
            <p className="text-[11px] italic" style={{ color: 'var(--text-faint)' }}>Skipped — our team will follow up on headshots</p>
          )}
        </div>
      </div>

      {/* Hiring */}
      {data.hiring?.active && (
        <div className="animate-fade-up delay-200 mb-4">
          <div className="rounded-2xl border overflow-hidden" style={{ borderColor: 'var(--border)', background: 'var(--bg-card)' }}>
            <div className="flex items-center gap-2 px-4 py-3 border-b" style={{ borderColor: 'var(--border-sub)', background: 'var(--bg-raised)' }}>
              <Briefcase className="w-3 h-3" style={{ color: `${accent}90` }} />
              <p className="text-[10px] uppercase tracking-widest font-semibold" style={{ color: 'var(--text-muted)' }}>Now Hiring</p>
            </div>
            <div className="px-4 py-3 flex flex-col gap-2.5">
              {data.hiring.roles.length > 0 && (
                <div className="flex flex-wrap gap-1.5">
                  {data.hiring.roles.map((role) => (
                    <span key={role} className="px-2.5 py-1 rounded-full text-[10px] font-medium border" style={{ borderColor: `${accent}40`, background: `${accent}0d`, color: `${accent}cc` }}>
                      {role}
                    </span>
                  ))}
                </div>
              )}
              {data.hiring.description && (
                <p className="text-[11px] leading-relaxed italic" style={{ color: 'var(--text-secondary)' }}>"{data.hiring.description}"</p>
              )}
              {!data.hiring.roles.length && !data.hiring.description && (
                <p className="text-[11px] italic" style={{ color: 'var(--text-faint)' }}>Hiring flag set — no details added yet</p>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Consent note */}
      <div className="animate-fade-up delay-200 mb-5">
        <div className="rounded-xl border px-4 py-3.5 flex items-start gap-3" style={{ borderColor: 'var(--border)', background: 'var(--bg-raised)' }}>
          <Shield className="w-4 h-4 flex-shrink-0 mt-0.5" style={{ color: 'var(--text-muted)' }} />
          <p className="text-[11px] leading-relaxed" style={{ color: 'var(--text-secondary)' }}>
            By submitting this brief, you authorise{' '}
            <span className="font-medium" style={{ color: 'var(--text-primary)' }}>CBA Solutions</span> to review your brand data and prepare a professional website proof on your behalf.
          </p>
        </div>
      </div>

      {/* Submit button */}
      <div className="animate-fade-up delay-300 mb-5">
        <button
          onClick={handleSubmit}
          disabled={loading}
          className="w-full flex items-center justify-center gap-3 py-4 rounded-full font-bold text-sm text-white uppercase tracking-wider transition-all duration-200 hover:scale-[1.015] active:scale-95 disabled:opacity-60 disabled:cursor-not-allowed disabled:hover:scale-100"
          style={{ background: 'var(--coral)', boxShadow: '0 4px 24px rgba(232,112,90,0.35)' }}
          onMouseEnter={(e) => { if (!loading) e.currentTarget.style.background = 'var(--coral-light)'; }}
          onMouseLeave={(e) => { if (!loading) e.currentTarget.style.background = 'var(--coral)'; }}
        >
          {loading ? (
            <>
              <svg className="animate-spin w-4 h-4" viewBox="0 0 24 24" fill="none">
                <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="3" strokeDasharray="60" strokeDashoffset="20" />
              </svg>
              Sending to CBA Database…
            </>
          ) : (
            <>
              <Send className="w-4 h-4" />
              Submit Brand Brief for Professional Review
            </>
          )}
        </button>

        {/* Live progress message */}
        {loading && progressMsg && (
          <p className="text-center text-[11px] mt-3 animate-fade-up" style={{ color: 'var(--text-muted)' }}>
            {progressMsg}
          </p>
        )}

        {/* Error message */}
        {submitError && !loading && (
          <div className="mt-4 flex items-start gap-2.5 rounded-xl border px-4 py-3 animate-fade-up" style={{ borderColor: 'rgba(248,113,113,0.35)', background: 'rgba(248,113,113,0.07)' }}>
            <AlertCircle className="w-4 h-4 flex-shrink-0 mt-0.5 text-red-400" />
            <div>
              <p className="text-xs font-semibold text-red-400 mb-0.5">Submission Failed</p>
              <p className="text-[11px] leading-relaxed" style={{ color: 'var(--text-secondary)' }}>{submitError}</p>
            </div>
          </div>
        )}
      </div>

      {/* Back */}
      <div className="animate-fade-up delay-400">
        <button
          onClick={onBack}
          className="flex items-center gap-2 px-5 py-3 rounded-full border text-sm font-medium transition-all active:scale-95"
          style={{ borderColor: 'var(--border)', color: 'var(--text-muted)' }}
        >
          <ChevronLeft className="w-4 h-4" />
          Back
        </button>
      </div>
    </div>
  );
}
