import { useState, useRef } from 'react';
import { ChevronLeft, Send, Scissors, Sparkles, MapPin, Phone, Star, Database } from 'lucide-react';

const CONFETTI_COLORS = ['#c9a227', '#e8c96a', '#fff', '#d4a0c8', '#f0e0a0'];

function Confetti({ active }) {
  const pieces = useRef(
    Array.from({ length: 40 }, (_, i) => ({
      id: i,
      left: Math.random() * 100,
      delay: Math.random() * 1.5,
      duration: 2 + Math.random() * 2,
      size: 5 + Math.random() * 8,
      color: CONFETTI_COLORS[Math.floor(Math.random() * CONFETTI_COLORS.length)],
      shape: Math.random() > 0.5 ? 'circle' : 'rect',
    }))
  );

  if (!active) return null;

  return (
    <div className="fixed inset-0 pointer-events-none overflow-hidden z-50">
      {pieces.current.map((p) => (
        <div
          key={p.id}
          className="absolute"
          style={{
            left: `${p.left}%`,
            top: '-20px',
            width: p.size,
            height: p.shape === 'circle' ? p.size : p.size * 0.6,
            backgroundColor: p.color,
            borderRadius: p.shape === 'circle' ? '50%' : '2px',
            animation: `confettiFall ${p.duration}s ease-in ${p.delay}s both`,
          }}
        />
      ))}
    </div>
  );
}

export default function Step5Finalize({ onBack, data }) {
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading]     = useState(false);
  const [confetti, setConfetti]   = useState(false);

  const businessType = data.businessType || 'barbershop';
  const isBarber     = businessType === 'barbershop';
  const accent       = isBarber ? '#c9a227' : '#d4a0c8';

  // Flatten service categories → [{name, price}] for the summary grid
  const allServices = (data.serviceCategories || []).flatMap((cat) => cat.services);

  const heroPreview = (data.heroText || '').slice(0, 90) + ((data.heroText || '').length > 90 ? '…' : '');

  // Discovery fields
  const hasDiscovery = data.businessName || data.address || data.phone || data.rating != null;

  const handleSubmit = async () => {
    setLoading(true);
    await new Promise((r) => setTimeout(r, 1800));
    setLoading(false);
    setSubmitted(true);
    setTimeout(() => setConfetti(true), 100);
    setTimeout(() => setConfetti(false), 4500);
  };

  return (
    <div className="px-5 py-8 max-w-lg mx-auto w-full">
      <Confetti active={confetti} />

      {!submitted ? (
        <>
          {/* Header */}
          <div className="animate-fade-up mb-6">
            <div className="flex items-center gap-2 mb-1">
              <div className="w-5 h-5 rounded-full bg-[#c9a227]/10 border border-[#c9a227]/30 flex items-center justify-center">
                <span className="text-[9px] font-bold text-[#c9a227]">05</span>
              </div>
              <span className="text-[11px] text-[#666] tracking-widest uppercase font-medium">Finalize</span>
            </div>
            <h2 className="text-2xl font-bold text-white tracking-tight">Review & Submit</h2>
            <p className="text-[#666] text-sm mt-1 leading-relaxed">
              Here's a summary of what you've provided. When you're ready, hit submit.
            </p>
          </div>

          {/* Summary card */}
          <div className="animate-fade-up delay-100 rounded-2xl border border-[#1e1e1e] bg-[#0d0d0d] overflow-hidden mb-5">

            {/* Card header */}
            <div className="px-5 py-3.5 border-b border-[#1a1a1a] bg-[#0a0a0a] flex items-center justify-between">
              <span className="text-xs text-[#666] uppercase tracking-widest font-semibold">
                {data.businessName || 'Your Submission'}
              </span>
              <div
                className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-semibold border"
                style={{
                  borderColor: `${accent}40`,
                  background: `${accent}0d`,
                  color: accent,
                }}
              >
                {isBarber ? <Scissors className="w-2.5 h-2.5" /> : <Sparkles className="w-2.5 h-2.5" />}
                {isBarber ? 'Barbershop' : 'Beauty Salon'}
              </div>
            </div>

            {/* Discovery business info — only shown if data came from Discovery Mode */}
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
              <p className="text-[#777] text-xs leading-relaxed">
                {heroPreview || <span className="text-[#444] italic">No hero text provided</span>}
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
                <span className="text-[11px] text-[#444] italic ml-auto">Using stock photo</span>
              )}
            </div>

            {/* Services — grouped by category */}
            <div className="px-5 py-4">
              <p className="text-[10px] text-[#555] uppercase tracking-widest mb-3 font-semibold">
                Services ({allServices.length})
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
                      <div className="grid grid-cols-2 gap-1">
                        {cat.services.map((s) => (
                          <div key={s.id} className="flex items-center justify-between bg-[#0a0a0a] border border-[#161616] rounded-lg px-2.5 py-1.5">
                            <span className="text-[11px] text-[#777] truncate">{s.name || 'Unnamed'}</span>
                            <span className="text-[11px] font-mono ml-2 flex-shrink-0" style={{ color: accent }}>
                              ${s.price || '—'}
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-[11px] text-[#444] italic">No services added</p>
              )}
            </div>
          </div>

          {/* Submit */}
          <div className="animate-fade-up delay-200 mb-6">
            <div className="rounded-xl border border-[#1a1a1a] bg-[#0d0d0d] p-4 mb-4">
              <p className="text-[12px] text-[#555] leading-relaxed text-center">
                By submitting, you're sending this information to{' '}
                <span className="text-[#888] font-medium">CBA Solutions</span> to finalise your website build. You'll receive a confirmation shortly.
              </p>
            </div>

            <button
              onClick={handleSubmit}
              disabled={loading}
              className="w-full flex items-center justify-center gap-3 py-4 rounded-full font-bold text-base text-black transition-all duration-200 hover:scale-[1.02] active:scale-95 shadow-lg hover:shadow-[#c9a227]/30 disabled:opacity-70 disabled:cursor-not-allowed disabled:hover:scale-100"
              style={{ background: 'linear-gradient(135deg, #c9a227 0%, #e8c96a 50%, #c9a227 100%)' }}
            >
              {loading ? (
                <>
                  <svg className="animate-spin w-5 h-5" viewBox="0 0 24 24" fill="none">
                    <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="3" strokeDasharray="60" strokeDashoffset="20" />
                  </svg>
                  Submitting…
                </>
              ) : (
                <>
                  <Send className="w-5 h-5" />
                  Submit to Pops
                </>
              )}
            </button>
          </div>

          <div className="animate-fade-up delay-300">
            <button
              onClick={onBack}
              className="flex items-center gap-2 px-5 py-3 rounded-full border border-[#222] text-[#666] text-sm font-medium hover:border-[#333] hover:text-[#888] transition-all active:scale-95"
            >
              <ChevronLeft className="w-4 h-4" />
              Back
            </button>
          </div>
        </>
      ) : (
        /* ── Success state ────────────────────────────────────────────── */
        <div className="flex flex-col items-center justify-center min-h-[60vh] text-center animate-scale-in">
          {/* Success ring */}
          <div
            className="relative w-28 h-28 rounded-full flex items-center justify-center mb-8"
            style={{
              background: 'radial-gradient(circle, rgba(201,162,39,0.15) 0%, transparent 70%)',
              animation: 'successRing 0.6s ease both',
            }}
          >
            <div className="absolute inset-0 rounded-full border-4 border-[#c9a227]/20" />
            <div className="absolute inset-2 rounded-full border-2 border-[#c9a227]/40" />
            <svg width="56" height="56" viewBox="0 0 56 56" fill="none" className="relative z-10">
              <circle cx="28" cy="28" r="26" stroke="#c9a227" strokeWidth="2.5" fill="rgba(201,162,39,0.1)" />
              <path
                d="M16 28L24 36L40 20"
                stroke="#c9a227"
                strokeWidth="3"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeDasharray="100"
                style={{ animation: 'checkDraw 0.5s ease 0.3s both' }}
              />
            </svg>
          </div>

          <div className="animate-fade-up delay-200 mb-2">
            <h2 className="text-3xl font-bold text-white tracking-tight">You're all set! 🎉</h2>
          </div>

          <p className="animate-fade-up delay-300 text-[#888] text-base max-w-[280px] leading-relaxed mb-8">
            Your information has been submitted to{' '}
            <span className="text-[#c9a227] font-medium">CBA Solutions</span>. We'll get your website live shortly.
          </p>

          <div className="animate-fade-up delay-400 w-full max-w-sm rounded-2xl border border-[#c9a227]/20 bg-[#c9a227]/5 p-5 mb-8">
            <p className="text-[11px] text-[#c9a227] uppercase tracking-widest font-semibold mb-3">What happens next</p>
            <div className="flex flex-col gap-2.5 text-left">
              {[
                'Our team reviews your submission',
                'Your content is placed into your spec build',
                'You receive a preview link for final approval',
                'Site goes live on your domain!',
              ].map((item, i) => (
                <div key={i} className="flex items-start gap-2.5">
                  <div
                    className="w-5 h-5 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5 text-[10px] font-bold text-black"
                    style={{ background: '#c9a227' }}
                  >
                    {i + 1}
                  </div>
                  <p className="text-[#888] text-xs leading-relaxed">{item}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="animate-fade-up delay-500 flex items-center gap-2">
            <div className="w-1 h-1 rounded-full bg-[#c9a227]" />
            <p className="text-[11px] text-[#555] tracking-widest uppercase">CBA Solutions</p>
            <div className="w-1 h-1 rounded-full bg-[#c9a227]" />
          </div>
        </div>
      )}
    </div>
  );
}
