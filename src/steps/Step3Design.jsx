import { ChevronRight, ChevronLeft, Palette, Type, Sparkles, ShieldCheck } from 'lucide-react';

// ── Brand Palette definitions ─────────────────────────────────────────────────
const PALETTES = [
  {
    id: 'slate',
    name: 'The Slate',
    tagline: 'Refined · Corporate · Trustworthy',
    colors: { primary: '#2C3E50', secondary: '#F5F5F0', accent: '#C0A060' },
  },
  {
    id: 'midnight',
    name: 'The Midnight',
    tagline: 'Bold · Luxurious · High-contrast',
    colors: { primary: '#0D0D0D', secondary: '#1A1A2E', accent: '#E8C84A' },
  },
  {
    id: 'studio',
    name: 'The Studio',
    tagline: 'Modern · Creative · Sharp',
    colors: { primary: '#1C1C1E', secondary: '#F2F2F7', accent: '#E8705A' },
  },
  {
    id: 'botanical',
    name: 'The Botanical',
    tagline: 'Organic · Calm · Premium',
    colors: { primary: '#2D4A3E', secondary: '#F0EDE6', accent: '#8FAF6A' },
  },
];

// ── Font Kit definitions ──────────────────────────────────────────────────────
const FONT_KITS = [
  {
    id: 'architect',
    name: 'The Architect',
    tagline: 'Geometric sans-serif — clean and modern',
    display: 'DM Sans',
    body: 'Inter',
    specimen: 'Aa',
  },
  {
    id: 'heritage',
    name: 'The Heritage',
    tagline: 'Serif display — classic barbershop authority',
    display: 'Playfair Display',
    body: 'Lora',
    specimen: 'Aa',
  },
  {
    id: 'serenity',
    name: 'The Serenity',
    tagline: 'Rounded sans — soft, welcoming, modern',
    display: 'Nunito',
    body: 'Nunito',
    specimen: 'Aa',
  },
  {
    id: 'technical',
    name: 'The Technical',
    tagline: 'Mono-influenced — precise and industrial',
    display: 'Space Grotesk',
    body: 'IBM Plex Sans',
    specimen: 'Aa',
  },
];

// ── Customer placeholder ──────────────────────────────────────────────────────
function CustomerPlaceholder() {
  return (
    <div className="animate-fade-up delay-100 rounded-2xl border overflow-hidden" style={{ borderColor: 'rgba(201,162,39,0.25)', background: 'var(--bg-card)' }}>
      {/* Top bar */}
      <div className="px-5 py-3.5 border-b flex items-center gap-2.5" style={{ borderColor: 'rgba(201,162,39,0.15)', background: 'rgba(201,162,39,0.06)' }}>
        <Sparkles className="w-3.5 h-3.5 flex-shrink-0" style={{ color: 'var(--gold)' }} />
        <p className="text-[10px] uppercase tracking-widest font-bold" style={{ color: 'var(--gold)' }}>
          Design Curation in Progress
        </p>
      </div>

      {/* Animated swatch strip */}
      <div className="h-2 flex overflow-hidden">
        {['#2C3E50','#C0A060','#0D0D0D','#E8C84A','#1C1C1E','#E8705A','#2D4A3E','#8FAF6A'].map((c, i) => (
          <div key={i} className="flex-1" style={{ background: c }} />
        ))}
      </div>

      <div className="px-5 py-8 flex flex-col items-center text-center gap-4">
        {/* Orbiting dot indicator */}
        <div className="relative w-14 h-14 flex items-center justify-center">
          <div className="w-10 h-10 rounded-full border-2 flex items-center justify-center" style={{ borderColor: 'rgba(201,162,39,0.3)', background: 'rgba(201,162,39,0.07)' }}>
            <Palette className="w-5 h-5" style={{ color: 'var(--gold)' }} />
          </div>
          {[0, 120, 240].map((deg, i) => (
            <div
              key={i}
              className="absolute w-2 h-2 rounded-full animate-pulse"
              style={{
                background: 'var(--gold)',
                opacity: 0.5,
                top: `${50 - 46 * Math.sin((deg * Math.PI) / 180)}%`,
                left: `${50 + 46 * Math.cos((deg * Math.PI) / 180)}%`,
                transform: 'translate(-50%, -50%)',
                animationDelay: `${i * 0.3}s`,
              }}
            />
          ))}
        </div>

        <div className="max-w-[280px]">
          <h3 className="font-serif-display text-base font-bold mb-2 leading-snug" style={{ color: 'var(--text-primary)' }}>
            Our design team is curating your custom brand palette and typography.
          </h3>
          <p className="text-[12px] leading-relaxed" style={{ color: 'var(--text-secondary)' }}>
            Based on your business profile and market positioning, we'll select colours and typefaces that maximise your brand authority and conversion.
          </p>
        </div>

        <div className="flex items-center gap-2 mt-1">
          <div className="h-px w-10" style={{ background: 'var(--border)' }} />
          <p className="text-[10px] uppercase tracking-widest font-semibold" style={{ color: 'var(--text-faint)' }}>
            No action needed from you
          </p>
          <div className="h-px w-10" style={{ background: 'var(--border)' }} />
        </div>
      </div>
    </div>
  );
}

// ── Palette card ──────────────────────────────────────────────────────────────
function PaletteCard({ palette, selected, onSelect }) {
  const { primary, secondary, accent } = palette.colors;
  return (
    <button
      type="button"
      onClick={() => onSelect(palette)}
      className="w-full text-left rounded-2xl border overflow-hidden transition-all duration-200 active:scale-[0.98]"
      style={
        selected
          ? { borderColor: 'rgba(201,162,39,0.6)', boxShadow: '0 0 0 2px rgba(201,162,39,0.2)', background: 'var(--bg-card)' }
          : { borderColor: 'var(--border)', background: 'var(--bg-card)' }
      }
    >
      {/* Colour strip */}
      <div className="h-10 flex">
        <div className="flex-1" style={{ background: primary }} />
        <div className="flex-1" style={{ background: secondary }} />
        <div className="w-10 flex-shrink-0" style={{ background: accent }} />
      </div>

      <div className="px-3.5 py-3 flex items-center justify-between gap-2">
        <div>
          <p className="text-xs font-bold leading-tight" style={{ color: selected ? 'var(--gold)' : 'var(--text-primary)' }}>
            {palette.name}
          </p>
          <p className="text-[10px] mt-0.5 leading-tight" style={{ color: 'var(--text-faint)' }}>{palette.tagline}</p>
        </div>

        <div className="flex items-center gap-1.5 flex-shrink-0">
          {[primary, secondary, accent].map((c, i) => (
            <div key={i} className="w-4 h-4 rounded-full border" style={{ background: c, borderColor: 'rgba(255,255,255,0.12)' }} />
          ))}
          {selected && (
            <div className="w-4 h-4 rounded-full flex items-center justify-center ml-1" style={{ background: 'var(--gold)' }}>
              <svg viewBox="0 0 10 10" className="w-2.5 h-2.5" fill="none" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                <polyline points="1.5,5.5 4,8 8.5,2" />
              </svg>
            </div>
          )}
        </div>
      </div>
    </button>
  );
}

// ── Font kit card ─────────────────────────────────────────────────────────────
function FontKitCard({ kit, selected, onSelect }) {
  return (
    <button
      type="button"
      onClick={() => onSelect(kit)}
      className="w-full text-left rounded-2xl border overflow-hidden transition-all duration-200 active:scale-[0.98]"
      style={
        selected
          ? { borderColor: 'rgba(201,162,39,0.6)', boxShadow: '0 0 0 2px rgba(201,162,39,0.2)', background: 'var(--bg-card)' }
          : { borderColor: 'var(--border)', background: 'var(--bg-card)' }
      }
    >
      <div className="px-4 py-3.5 flex items-center gap-4">
        {/* Specimen */}
        <div
          className="w-14 h-14 rounded-xl flex items-center justify-center flex-shrink-0 border"
          style={{
            background: selected ? 'rgba(201,162,39,0.08)' : 'var(--bg-raised)',
            borderColor: selected ? 'rgba(201,162,39,0.3)' : 'var(--border)',
          }}
        >
          <span
            className="text-2xl font-bold leading-none select-none"
            style={{ color: selected ? 'var(--gold)' : 'var(--text-secondary)', fontFamily: `'${kit.display}', serif` }}
          >
            {kit.specimen}
          </span>
        </div>

        <div className="flex-1 min-w-0">
          <p className="text-xs font-bold leading-tight" style={{ color: selected ? 'var(--gold)' : 'var(--text-primary)' }}>
            {kit.name}
          </p>
          <p className="text-[10px] mt-0.5 leading-snug" style={{ color: 'var(--text-faint)' }}>{kit.tagline}</p>
          <div className="flex items-center gap-1.5 mt-1.5">
            <span className="text-[9px] font-mono px-1.5 py-0.5 rounded border" style={{ borderColor: 'var(--border)', color: 'var(--text-muted)', background: 'var(--bg-surface)' }}>
              {kit.display}
            </span>
            <span className="text-[9px]" style={{ color: 'var(--text-faint)' }}>+</span>
            <span className="text-[9px] font-mono px-1.5 py-0.5 rounded border" style={{ borderColor: 'var(--border)', color: 'var(--text-muted)', background: 'var(--bg-surface)' }}>
              {kit.body}
            </span>
          </div>
        </div>

        {selected && (
          <div className="w-5 h-5 rounded-full flex items-center justify-center flex-shrink-0" style={{ background: 'var(--gold)' }}>
            <svg viewBox="0 0 10 10" className="w-3 h-3" fill="none" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
              <polyline points="1.5,5.5 4,8 8.5,2" />
            </svg>
          </div>
        )}
      </div>
    </button>
  );
}

// ── Main component ────────────────────────────────────────────────────────────
export default function Step3Design({ onNext, onBack, data, setData, isAdmin }) {
  const selectedPaletteId = PALETTES.find(p => p.colors.primary === data.brandColors?.primary)?.id ?? null;
  const selectedFontKitId = data.fontKit ?? null;

  const handlePalette = (palette) => {
    setData({ ...data, brandColors: palette.colors });
  };

  const handleFontKit = (kit) => {
    setData({ ...data, fontKit: kit.id });
  };

  return (
    <div className="px-5 py-8 max-w-lg mx-auto w-full">

      {/* Header */}
      <div className="animate-fade-up mb-6">
        <p className="text-[11px] tracking-[0.2em] uppercase font-semibold mb-2" style={{ color: 'var(--coral)' }}>
          — Step 03 —
        </p>
        <h2 className="font-serif-display text-2xl font-bold tracking-tight" style={{ color: 'var(--text-primary)' }}>
          Brand Design
        </h2>
        <div className="flex items-center gap-3 my-3">
          <div className="h-px w-8" style={{ background: 'var(--gold)' }} />
          <div className="w-1 h-1 rounded-full" style={{ background: 'var(--gold)' }} />
          <div className="h-px w-8" style={{ background: 'var(--gold)' }} />
        </div>
        <p className="text-sm leading-relaxed" style={{ color: 'var(--text-secondary)' }}>
          {isAdmin
            ? 'Select a brand palette and font kit for this client.'
            : 'Your visual identity is being prepared by our team.'}
        </p>
      </div>

      {/* ── Customer view ─────────────────────────────────────── */}
      {!isAdmin && <CustomerPlaceholder />}

      {/* ── Admin view ────────────────────────────────────────── */}
      {isAdmin && (
        <>
          {/* Admin badge */}
          <div className="animate-fade-up mb-5 flex items-center gap-2">
            <ShieldCheck className="w-3.5 h-3.5" style={{ color: 'var(--gold)' }} />
            <span className="text-[10px] uppercase tracking-widest font-bold" style={{ color: 'var(--gold)' }}>
              Master Mode — Admin Curation
            </span>
          </div>

          {/* Palette selection */}
          <div className="animate-fade-up delay-100 mb-7">
            <div className="flex items-center gap-2 mb-4">
              <Palette className="w-3.5 h-3.5" style={{ color: 'var(--gold)' }} />
              <p className="text-xs uppercase tracking-wider font-semibold" style={{ color: 'var(--text-muted)' }}>
                Brand Palette
              </p>
            </div>
            <div className="flex flex-col gap-3">
              {PALETTES.map((p) => (
                <PaletteCard
                  key={p.id}
                  palette={p}
                  selected={selectedPaletteId === p.id}
                  onSelect={handlePalette}
                />
              ))}
            </div>

            {/* Live preview strip */}
            {data.brandColors && (
              <div className="mt-4 rounded-xl overflow-hidden h-8 flex" style={{ border: '1px solid var(--border)' }}>
                {[data.brandColors.primary, data.brandColors.secondary, data.brandColors.accent].map((c, i) => (
                  <div key={i} className="flex-1 flex items-center justify-center text-[9px] font-mono font-bold"
                    style={{ background: c, color: '#fff', textShadow: '0 1px 2px rgba(0,0,0,0.6)' }}>
                    {c.toUpperCase()}
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Font kit selection */}
          <div className="animate-fade-up delay-200 mb-8">
            <div className="flex items-center gap-2 mb-4">
              <Type className="w-3.5 h-3.5" style={{ color: 'var(--gold)' }} />
              <p className="text-xs uppercase tracking-wider font-semibold" style={{ color: 'var(--text-muted)' }}>
                Font Kit
              </p>
            </div>
            <div className="flex flex-col gap-3">
              {FONT_KITS.map((kit) => (
                <FontKitCard
                  key={kit.id}
                  kit={kit}
                  selected={selectedFontKitId === kit.id}
                  onSelect={handleFontKit}
                />
              ))}
            </div>
          </div>
        </>
      )}

      {/* Navigation */}
      <div className="animate-fade-up delay-300 flex gap-3 mt-2">
        <button onClick={onBack}
          className="flex items-center gap-2 px-5 py-3.5 rounded-full border text-sm font-medium transition-all active:scale-95"
          style={{ borderColor: 'var(--border)', color: 'var(--text-muted)' }}>
          <ChevronLeft className="w-4 h-4" /> Back
        </button>
        <button onClick={onNext}
          className="flex-1 flex items-center justify-center gap-2 px-6 py-3.5 rounded-full font-bold text-sm uppercase tracking-wider text-white transition-all duration-200 hover:scale-[1.02] active:scale-95"
          style={{ background: 'var(--coral)', boxShadow: '0 4px 16px rgba(232,112,90,0.3)' }}
          onMouseEnter={(e) => { e.currentTarget.style.background = 'var(--coral-light)'; }}
          onMouseLeave={(e) => { e.currentTarget.style.background = 'var(--coral)'; }}>
          Continue <ChevronRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}
