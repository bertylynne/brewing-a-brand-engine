import { ChevronRight, ChevronLeft, Check, Palette, Type, ShieldCheck, Sparkles, Feather } from 'lucide-react';

// ── Business category options (from Step3Branch) ──────────────────────────────
const BUSINESS_OPTIONS = [
  {
    id: 'barbershop',
    label: 'Barbershop',
    tagline: 'Fades, cuts & classic grooming',
    description: 'Classic fades, beard trims, hot towel shaves, and precision cuts for the modern gentleman.',
    emoji: '✂️',
    accentRaw: '#c9a227',
    services: ['Haircut', 'Fade', 'Beard Trim', 'Hot Towel Shave', 'Line-Up', 'Kids Cut'],
  },
  {
    id: 'salon',
    label: 'Beauty Salon',
    tagline: 'Color, styling & treatments',
    description: 'Hair coloring, blowouts, extensions, facials, and full beauty treatments for every look.',
    emoji: '💇',
    accentRaw: '#d4a0c8',
    services: ['Blowout', 'Color Treatment', 'Hair Extensions', 'Deep Conditioning', 'Trim & Style', 'Facial'],
  },
];

// ── Vibes (map to fontKit IDs) ────────────────────────────────────────────────
const VIBES = [
  {
    id: 'heritage',
    name: 'Heritage',
    tagline: 'Timeless · Classic · Authoritative',
    description: 'Rooted in tradition. Serif-forward design language for the discerning clientele.',
    accent: '#C0A060',
    symbol: '𝕳',
  },
  {
    id: 'architect',
    name: 'Modernist',
    tagline: 'Precise · Urban · Forward-thinking',
    description: 'Geometric clarity and technical edge. Built for the modern professional.',
    accent: '#E8705A',
    symbol: 'M',
  },
  {
    id: 'serenity',
    name: 'Serenity',
    tagline: 'Organic · Calm · Welcoming',
    description: 'Soft, approachable aesthetics that communicate care and craft in equal measure.',
    accent: '#8FAF6A',
    symbol: 'S',
  },
  {
    id: 'technical',
    name: 'Universal',
    tagline: 'Structured · Inclusive · Versatile',
    description: 'Broad appeal with clean execution. Efficient, bold, and built for every client.',
    accent: '#E8C84A',
    symbol: 'U',
  },
];

// ── Design palettes ───────────────────────────────────────────────────────────
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

// ── Font kits ─────────────────────────────────────────────────────────────────
const FONT_KITS = [
  {
    id: 'architect',
    name: 'The Architect',
    tagline: 'Geometric sans-serif — clean and modern',
    display: 'DM Sans',
    body: 'Inter',
  },
  {
    id: 'heritage',
    name: 'The Heritage',
    tagline: 'Serif display — classic authority',
    display: 'Playfair Display',
    body: 'Lora',
  },
  {
    id: 'serenity',
    name: 'The Serenity',
    tagline: 'Rounded sans — soft and welcoming',
    display: 'Nunito',
    body: 'Nunito',
  },
  {
    id: 'technical',
    name: 'The Technical',
    tagline: 'Mono-influenced — precise and industrial',
    display: 'Space Grotesk',
    body: 'IBM Plex Sans',
  },
];

// ── Sub-components ────────────────────────────────────────────────────────────
function BarberPattern() {
  return (
    <svg width="100%" height="100%" viewBox="0 0 200 200" className="opacity-[0.06]">
      {[0, 60, 120].map((y) =>
        [0, 60, 120, 180].map((x) => (
          <g key={`${x}-${y}`} transform={`translate(${x + 10}, ${y + 10})`}>
            <circle cx="5" cy="5" r="8" fill="none" stroke="#c9a227" strokeWidth="1.5"/>
            <circle cx="25" cy="5" r="8" fill="none" stroke="#c9a227" strokeWidth="1.5"/>
            <line x1="5" y1="5" x2="25" y2="5" stroke="#c9a227" strokeWidth="1.5"/>
          </g>
        ))
      )}
    </svg>
  );
}

function SalonPattern() {
  return (
    <svg width="100%" height="100%" viewBox="0 0 200 200" className="opacity-[0.06]">
      {[0, 50, 100, 150].map((y) =>
        [0, 50, 100, 150].map((x) => (
          <g key={`${x}-${y}`} transform={`translate(${x + 25}, ${y + 25})`}>
            <path d="M0 10 Q5 0 10 10 Q15 20 20 10" fill="none" stroke="#d4a0c8" strokeWidth="1.5"/>
          </g>
        ))
      )}
    </svg>
  );
}

function PaletteCard({ palette, selected, onSelect }) {
  const { primary, secondary, accent } = palette.colors;
  return (
    <button
      type="button"
      onClick={() => onSelect(palette)}
      className="w-full text-left rounded-2xl border overflow-hidden transition-all duration-200 active:scale-[0.98]"
      style={
        selected
          ? { borderColor: 'rgba(201,162,39,0.6)', boxShadow: '0 0 0 2px rgba(201,162,39,0.15)', background: 'var(--bg-card)' }
          : { borderColor: 'var(--border)', background: 'var(--bg-card)' }
      }
    >
      <div className="h-8 flex">
        <div className="flex-1" style={{ background: primary }} />
        <div className="flex-1" style={{ background: secondary }} />
        <div className="w-8 flex-shrink-0" style={{ background: accent }} />
      </div>
      <div className="px-3.5 py-2.5 flex items-center justify-between gap-2">
        <div>
          <p className="text-xs font-bold leading-tight" style={{ color: selected ? 'var(--gold)' : 'var(--text-primary)' }}>
            {palette.name}
          </p>
          <p className="text-[10px] mt-0.5" style={{ color: 'var(--text-faint)' }}>{palette.tagline}</p>
        </div>
        <div className="flex items-center gap-1.5 flex-shrink-0">
          {[primary, secondary, accent].map((c, i) => (
            <div key={i} className="w-3.5 h-3.5 rounded-full border" style={{ background: c, borderColor: 'rgba(255,255,255,0.12)' }} />
          ))}
          {selected && (
            <div className="w-4 h-4 rounded-full flex items-center justify-center ml-1" style={{ background: 'var(--gold)' }}>
              <svg viewBox="0 0 10 10" className="w-2.5 h-2.5" fill="none" stroke="white" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                <polyline points="1.5,5.5 4,8 8.5,2" />
              </svg>
            </div>
          )}
        </div>
      </div>
    </button>
  );
}

function FontKitCard({ kit, selected, onSelect }) {
  return (
    <button
      type="button"
      onClick={() => onSelect(kit)}
      className="w-full text-left rounded-2xl border overflow-hidden transition-all duration-200 active:scale-[0.98]"
      style={
        selected
          ? { borderColor: 'rgba(201,162,39,0.6)', boxShadow: '0 0 0 2px rgba(201,162,39,0.15)', background: 'var(--bg-card)' }
          : { borderColor: 'var(--border)', background: 'var(--bg-card)' }
      }
    >
      <div className="px-4 py-3 flex items-center gap-3">
        <div
          className="w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0 border"
          style={{
            background: selected ? 'rgba(201,162,39,0.08)' : 'var(--bg-raised)',
            borderColor: selected ? 'rgba(201,162,39,0.3)' : 'var(--border)',
          }}
        >
          <span className="text-xl font-bold leading-none select-none"
            style={{ color: selected ? 'var(--gold)' : 'var(--text-secondary)', fontFamily: `'${kit.display}', serif` }}>
            Aa
          </span>
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-xs font-bold leading-tight" style={{ color: selected ? 'var(--gold)' : 'var(--text-primary)' }}>
            {kit.name}
          </p>
          <p className="text-[10px] mt-0.5" style={{ color: 'var(--text-faint)' }}>{kit.tagline}</p>
          <div className="flex items-center gap-1.5 mt-1.5">
            <span className="text-[9px] font-mono px-1.5 py-0.5 rounded border"
              style={{ borderColor: 'var(--border)', color: 'var(--text-muted)', background: 'var(--bg-surface)' }}>
              {kit.display}
            </span>
            <span className="text-[9px]" style={{ color: 'var(--text-faint)' }}>+</span>
            <span className="text-[9px] font-mono px-1.5 py-0.5 rounded border"
              style={{ borderColor: 'var(--border)', color: 'var(--text-muted)', background: 'var(--bg-surface)' }}>
              {kit.body}
            </span>
          </div>
        </div>
        {selected && (
          <div className="w-5 h-5 rounded-full flex items-center justify-center flex-shrink-0" style={{ background: 'var(--gold)' }}>
            <svg viewBox="0 0 10 10" className="w-3 h-3" fill="none" stroke="white" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
              <polyline points="1.5,5.5 4,8 8.5,2" />
            </svg>
          </div>
        )}
      </div>
    </button>
  );
}

// ── Vibe card ─────────────────────────────────────────────────────────────────
function VibeCard({ vibe, selected, onSelect }) {
  return (
    <button
      type="button"
      onClick={() => onSelect(vibe)}
      className="w-full text-left rounded-2xl border-2 overflow-hidden transition-all duration-200 active:scale-[0.98]"
      style={
        selected
          ? { borderColor: vibe.accent, boxShadow: `0 0 0 2px ${vibe.accent}25`, background: `${vibe.accent}08` }
          : { borderColor: 'var(--border)', background: 'var(--bg-card)' }
      }
    >
      <div className="p-4 flex items-center gap-4">
        {/* Symbol */}
        <div
          className="w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0 text-xl font-bold border transition-all"
          style={{
            fontFamily: vibe.id === 'heritage' ? "'Playfair Display', serif" : vibe.id === 'serenity' ? "'Nunito', sans-serif" : 'system-ui',
            background: selected ? `${vibe.accent}15` : 'var(--bg-raised)',
            borderColor: selected ? `${vibe.accent}50` : 'var(--border)',
            color: selected ? vibe.accent : 'var(--text-secondary)',
          }}
        >
          {vibe.symbol}
        </div>

        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-0.5">
            <p className="text-sm font-bold" style={{ color: selected ? vibe.accent : 'var(--text-primary)' }}>
              {vibe.name}
            </p>
            <span className="text-[9px] uppercase tracking-widest font-semibold px-1.5 py-0.5 rounded"
              style={{ background: selected ? `${vibe.accent}15` : 'var(--bg-surface)', color: selected ? vibe.accent : 'var(--text-faint)' }}>
              {vibe.tagline.split(' · ')[0]}
            </span>
          </div>
          <p className="text-[11px] leading-snug" style={{ color: 'var(--text-muted)' }}>{vibe.description}</p>
        </div>

        <div
          className="w-5 h-5 rounded-full border-2 flex-shrink-0 flex items-center justify-center transition-all"
          style={
            selected
              ? { borderColor: vibe.accent, background: vibe.accent }
              : { borderColor: 'var(--border)', background: 'transparent' }
          }
        >
          {selected && (
            <svg viewBox="0 0 10 10" className="w-3 h-3" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <polyline points="1.5,5.5 4,8 8.5,2" />
            </svg>
          )}
        </div>
      </div>
    </button>
  );
}

// ── Main component ────────────────────────────────────────────────────────────
export default function StepBlueprint({ onNext, onBack, data, setData, isAdmin }) {
  const selected          = data.businessType || null;
  const selectedPaletteId = PALETTES.find(p => p.colors.primary === data.brandColors?.primary)?.id ?? null;
  const selectedFontKitId = data.fontKit ?? null;  // fontKit ID doubles as the vibe ID
  const selectedVibeId    = selectedFontKitId;     // same key — vibe selection sets fontKit

  const handleBusinessType = (id) => setData({ ...data, businessType: id });
  const handlePalette      = (p)  => setData({ ...data, brandColors: p.colors });
  const handleFontKit      = (k)  => setData({ ...data, fontKit: k.id });
  const handleVibe         = (v)  => setData({ ...data, fontKit: v.id });  // vibe → fontKit

  // Continue: client needs category; admin needs all three (vibe, palette, font)
  const canContinue = isAdmin
    ? !!selected && !!selectedPaletteId && !!selectedVibeId
    : !!selected;

  return (
    <div className="px-5 py-8 max-w-lg mx-auto w-full">

      {/* Header */}
      <div className="animate-fade-up mb-6">
        <p className="text-[11px] tracking-[0.2em] uppercase font-semibold mb-2" style={{ color: 'var(--coral)' }}>
          — Step 02 —
        </p>
        <h2 className="font-serif-display text-2xl font-bold tracking-tight" style={{ color: 'var(--text-primary)' }}>
          The Blueprint
        </h2>
        <div className="flex items-center gap-3 my-3">
          <div className="h-px w-8" style={{ background: 'var(--gold)' }} />
          <div className="w-1 h-1 rounded-full" style={{ background: 'var(--gold)' }} />
          <div className="h-px w-8" style={{ background: 'var(--gold)' }} />
        </div>
        <p className="text-sm leading-relaxed" style={{ color: 'var(--text-secondary)' }}>
          {isAdmin
            ? 'Set the business category and curate the full design vibe before identity details are entered.'
            : 'Select your business category so we can tailor the experience for your brand.'}
        </p>
      </div>

      {/* ── Business Category ─────────────────────────────────── */}
      <div className="animate-fade-up delay-100 mb-7">
        <p className="text-xs uppercase tracking-wider font-semibold mb-4" style={{ color: 'var(--text-muted)' }}>
          Business Category
        </p>
        <div className="flex flex-col gap-3">
          {BUSINESS_OPTIONS.map((opt) => {
            const isSelected = selected === opt.id;
            return (
              <button
                key={opt.id}
                onClick={() => handleBusinessType(opt.id)}
                className="relative text-left rounded-2xl border-2 overflow-hidden transition-all duration-300 active:scale-[0.98] focus:outline-none"
                style={
                  isSelected
                    ? { borderColor: opt.accentRaw, background: `${opt.accentRaw}0d`, boxShadow: `0 0 24px ${opt.accentRaw}18` }
                    : { borderColor: 'var(--border)', background: 'var(--bg-raised)' }
                }
              >
                <div className="absolute inset-0 pointer-events-none">
                  {opt.id === 'barbershop' ? <BarberPattern /> : <SalonPattern />}
                </div>
                <div className="relative p-4 flex items-start gap-4">
                  <div
                    className="w-12 h-12 rounded-xl flex items-center justify-center text-xl flex-shrink-0 border transition-all"
                    style={
                      isSelected
                        ? { borderColor: `${opt.accentRaw}50`, background: `${opt.accentRaw}15` }
                        : { borderColor: 'var(--border)', background: 'var(--bg-surface)' }
                    }
                  >
                    {opt.emoji}
                  </div>
                  <div className="flex-1 min-w-0 pt-0.5">
                    <h3 className="text-base font-bold font-serif-display transition-colors mb-0.5"
                      style={{ color: isSelected ? opt.accentRaw : 'var(--text-primary)' }}>
                      {opt.label}
                    </h3>
                    <p className="text-xs leading-relaxed" style={{ color: 'var(--text-muted)' }}>{opt.description}</p>
                    <div className="flex flex-wrap gap-1.5 mt-2.5">
                      {opt.services.slice(0, 4).map((s) => (
                        <span key={s} className="text-[10px] px-2 py-0.5 rounded-full border font-medium transition-all"
                          style={
                            isSelected
                              ? { borderColor: `${opt.accentRaw}35`, background: `${opt.accentRaw}12`, color: opt.accentRaw }
                              : { borderColor: 'var(--border)', background: 'var(--bg-surface)', color: 'var(--text-muted)' }
                          }>{s}</span>
                      ))}
                      <span className="text-[10px] font-medium self-center" style={{ color: 'var(--text-faint)' }}>
                        +{opt.services.length - 4} more
                      </span>
                    </div>
                  </div>
                  <div
                    className="w-5 h-5 rounded-full border-2 flex-shrink-0 flex items-center justify-center transition-all mt-1"
                    style={
                      isSelected
                        ? { borderColor: opt.accentRaw, background: opt.accentRaw }
                        : { borderColor: 'var(--border)', background: 'transparent' }
                    }
                  >
                    {isSelected && <Check className="w-3 h-3 text-white" strokeWidth={3} />}
                  </div>
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* ── Admin: Design Controls ────────────────────────────── */}
      {isAdmin && (
        <>
          {/* Admin badge */}
          <div className="animate-fade-up mb-5 flex items-center gap-2 py-2.5 px-3.5 rounded-xl border"
            style={{ borderColor: 'rgba(201,162,39,0.25)', background: 'rgba(201,162,39,0.05)' }}>
            <ShieldCheck className="w-3.5 h-3.5 flex-shrink-0" style={{ color: 'var(--gold)' }} />
            <span className="text-[10px] uppercase tracking-widest font-bold" style={{ color: 'var(--gold)' }}>
              Master Mode — Design Curation
            </span>
          </div>

          {/* Vibe selection */}
          <div className="animate-fade-up delay-100 mb-6">
            <div className="flex items-center gap-2 mb-3">
              <Feather className="w-3.5 h-3.5" style={{ color: 'var(--gold)' }} />
              <p className="text-xs uppercase tracking-wider font-semibold" style={{ color: 'var(--text-muted)' }}>
                Brand Vibe
              </p>
              {!selectedVibeId && (
                <span className="ml-auto text-[10px] font-semibold" style={{ color: 'var(--coral)' }}>Required</span>
              )}
            </div>
            <div className="flex flex-col gap-2.5">
              {VIBES.map((v) => (
                <VibeCard
                  key={v.id}
                  vibe={v}
                  selected={selectedVibeId === v.id}
                  onSelect={handleVibe}
                />
              ))}
            </div>
          </div>

          {/* Palette selection */}
          <div className="animate-fade-up delay-150 mb-6">
            <div className="flex items-center gap-2 mb-3">
              <Palette className="w-3.5 h-3.5" style={{ color: 'var(--gold)' }} />
              <p className="text-xs uppercase tracking-wider font-semibold" style={{ color: 'var(--text-muted)' }}>
                Brand Palette
              </p>
              {!selectedPaletteId && (
                <span className="ml-auto text-[10px] font-semibold" style={{ color: 'var(--coral)' }}>Required</span>
              )}
            </div>
            <div className="flex flex-col gap-2.5">
              {PALETTES.map((p) => (
                <PaletteCard
                  key={p.id}
                  palette={p}
                  selected={selectedPaletteId === p.id}
                  onSelect={handlePalette}
                />
              ))}
            </div>
            {data.brandColors && selectedPaletteId && (
              <div className="mt-3 rounded-xl overflow-hidden h-7 flex" style={{ border: '1px solid var(--border)' }}>
                {[data.brandColors.primary, data.brandColors.secondary, data.brandColors.accent].map((c, i) => (
                  <div key={i} className="flex-1 flex items-center justify-center text-[9px] font-mono font-bold"
                    style={{ background: c, color: '#fff', textShadow: '0 1px 2px rgba(0,0,0,0.6)' }}>
                    {c.toUpperCase()}
                  </div>
                ))}
              </div>
            )}
          </div>

        </>
      )}

      {/* Customer placeholder for design */}
      {!isAdmin && selected && (
        <div className="animate-fade-up mb-7 rounded-2xl border overflow-hidden" style={{ borderColor: 'rgba(201,162,39,0.2)', background: 'var(--bg-card)' }}>
          <div className="h-1.5 flex overflow-hidden">
            {['#2C3E50','#C0A060','#0D0D0D','#E8C84A','#1C1C1E','#E8705A','#2D4A3E','#8FAF6A'].map((c, i) => (
              <div key={i} className="flex-1" style={{ background: c }} />
            ))}
          </div>
          <div className="px-4 py-4 flex items-start gap-3">
            <Sparkles className="w-4 h-4 flex-shrink-0 mt-0.5" style={{ color: 'var(--gold)' }} />
            <div>
              <p className="text-xs font-semibold mb-1" style={{ color: 'var(--gold)' }}>Design Curation in Progress</p>
              <p className="text-[11px] leading-relaxed" style={{ color: 'var(--text-secondary)' }}>
                Our team is selecting your custom palette and typography based on your business profile. No action needed.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Navigation */}
      <div className="animate-fade-up delay-300 flex gap-3">
        <button onClick={onBack}
          className="flex items-center gap-2 px-5 py-3.5 rounded-full border text-sm font-medium transition-all active:scale-95"
          style={{ borderColor: 'var(--border)', color: 'var(--text-muted)' }}>
          <ChevronLeft className="w-4 h-4" /> Back
        </button>
        <button
          onClick={onNext}
          disabled={!canContinue}
          className="flex-1 flex items-center justify-center gap-2 px-6 py-3.5 rounded-full font-bold text-sm uppercase tracking-wider text-white transition-all duration-200 active:scale-95"
          style={
            canContinue
              ? { background: 'var(--coral)', boxShadow: '0 4px 16px rgba(232,112,90,0.3)' }
              : { background: 'var(--bg-raised)', color: 'var(--text-faint)', cursor: 'not-allowed' }
          }
          onMouseEnter={(e) => { if (canContinue) e.currentTarget.style.background = 'var(--coral-light)'; }}
          onMouseLeave={(e) => { if (canContinue) e.currentTarget.style.background = 'var(--coral)'; }}
          title={!selected ? 'Select a business category to continue' : isAdmin && !selectedVibeId ? 'Select a brand vibe to continue' : isAdmin && !selectedPaletteId ? 'Select a palette to continue' : undefined}
        >
          Continue <ChevronRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}
