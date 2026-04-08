import { ChevronRight, ChevronLeft, Check } from 'lucide-react';

const OPTIONS = [
  {
    id: 'barbershop',
    label: 'Barbershop',
    tagline: 'Fades, cuts & classic grooming',
    description: 'Classic fades, beard trims, hot towel shaves, and precision cuts for the modern gentleman.',
    emoji: '✂️',
    accent: 'var(--gold)',
    accentRaw: '#c9a227',
    pattern: 'barbershop',
    services: ['Haircut', 'Fade', 'Beard Trim', 'Hot Towel Shave', 'Line-Up', 'Kids Cut'],
  },
  {
    id: 'salon',
    label: 'Beauty Salon',
    tagline: 'Color, styling & treatments',
    description: 'Hair coloring, blowouts, extensions, facials, and full beauty treatments for every look.',
    emoji: '💇',
    accent: '#d4a0c8',
    accentRaw: '#d4a0c8',
    pattern: 'salon',
    services: ['Blowout', 'Color Treatment', 'Hair Extensions', 'Deep Conditioning', 'Trim & Style', 'Facial'],
  },
];

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

export default function Step3Branch({ onNext, onBack, data, setData }) {
  const selected = data.businessType || null;

  return (
    <div className="px-5 py-8 max-w-lg mx-auto w-full">
      {/* Header */}
      <div className="animate-fade-up mb-7 text-center">
        <p className="text-[11px] tracking-[0.2em] uppercase font-semibold mb-2" style={{ color: 'var(--coral)' }}>
          — Step 03 —
        </p>
        <h2 className="font-serif-display text-2xl font-bold tracking-tight" style={{ color: 'var(--text-primary)' }}>
          Business Category
        </h2>
        <div className="flex items-center justify-center gap-3 my-3">
          <div className="h-px w-8" style={{ background: 'var(--gold)' }} />
          <div className="w-1 h-1 rounded-full" style={{ background: 'var(--gold)' }} />
          <div className="h-px w-8" style={{ background: 'var(--gold)' }} />
        </div>
        <p className="text-sm" style={{ color: 'var(--text-secondary)' }}>
          This determines the service architecture and content strategy our team will apply to your build.
        </p>
      </div>

      {/* Option cards */}
      <div className="animate-fade-up delay-100 flex flex-col gap-4 mb-8">
        {OPTIONS.map((opt) => {
          const isSelected = selected === opt.id;
          return (
            <button
              key={opt.id}
              onClick={() => setData({ ...data, businessType: opt.id })}
              className="relative text-left rounded-2xl border-2 overflow-hidden transition-all duration-300 active:scale-[0.98] focus:outline-none"
              style={
                isSelected
                  ? { borderColor: opt.accentRaw, background: `${opt.accentRaw}0d`, boxShadow: `0 0 30px ${opt.accentRaw}20` }
                  : { borderColor: 'var(--border)', background: 'var(--bg-raised)' }
              }
            >
              {/* Background pattern */}
              <div className="absolute inset-0 pointer-events-none">
                {opt.id === 'barbershop' ? <BarberPattern /> : <SalonPattern />}
              </div>

              <div className="relative p-5 flex items-start gap-4">
                {/* Icon */}
                <div
                  className="w-14 h-14 rounded-xl flex items-center justify-center text-2xl flex-shrink-0 border transition-all duration-300"
                  style={
                    isSelected
                      ? { borderColor: `${opt.accentRaw}50`, background: `${opt.accentRaw}15` }
                      : { borderColor: 'var(--border)', background: 'var(--bg-surface)' }
                  }
                >
                  {opt.emoji}
                </div>

                {/* Text */}
                <div className="flex-1 min-w-0 pt-0.5">
                  <h3
                    className="text-lg font-bold font-serif-display transition-colors mb-0.5"
                    style={{ color: isSelected ? opt.accentRaw : 'var(--text-primary)' }}
                  >
                    {opt.label}
                  </h3>
                  <p className="text-xs font-medium mb-2" style={{ color: 'var(--text-secondary)' }}>{opt.tagline}</p>
                  <p className="text-xs leading-relaxed" style={{ color: 'var(--text-muted)' }}>{opt.description}</p>

                  {/* Service tags */}
                  <div className="flex flex-wrap gap-1.5 mt-3">
                    {opt.services.slice(0, 4).map((s) => (
                      <span
                        key={s}
                        className="text-[10px] px-2 py-0.5 rounded-full border font-medium transition-all duration-300"
                        style={
                          isSelected
                            ? { borderColor: `${opt.accentRaw}35`, background: `${opt.accentRaw}12`, color: opt.accentRaw }
                            : { borderColor: 'var(--border)', background: 'var(--bg-surface)', color: 'var(--text-muted)' }
                        }
                      >
                        {s}
                      </span>
                    ))}
                    <span className="text-[10px] font-medium self-center" style={{ color: 'var(--text-faint)' }}>
                      +{opt.services.length - 4} more
                    </span>
                  </div>
                </div>

                {/* Check circle */}
                <div
                  className="w-6 h-6 rounded-full border-2 flex-shrink-0 flex items-center justify-center transition-all duration-300 mt-1"
                  style={
                    isSelected
                      ? { borderColor: opt.accentRaw, background: opt.accentRaw }
                      : { borderColor: 'var(--border)', background: 'transparent' }
                  }
                >
                  {isSelected && <Check className="w-3.5 h-3.5 text-white" strokeWidth={3} />}
                </div>
              </div>
            </button>
          );
        })}
      </div>

      {/* Navigation */}
      <div className="animate-fade-up delay-200 flex gap-3">
        <button
          onClick={onBack}
          className="flex items-center gap-2 px-5 py-3.5 rounded-full border text-sm font-medium transition-all active:scale-95"
          style={{ borderColor: 'var(--border)', color: 'var(--text-muted)' }}
          onMouseEnter={(e) => { e.currentTarget.style.borderColor = 'var(--border)'; e.currentTarget.style.color = 'var(--text-secondary)'; }}
          onMouseLeave={(e) => { e.currentTarget.style.borderColor = 'var(--border)'; e.currentTarget.style.color = 'var(--text-muted)'; }}
        >
          <ChevronLeft className="w-4 h-4" />
          Back
        </button>
        <button
          onClick={onNext}
          disabled={!selected}
          className="flex-1 flex items-center justify-center gap-2 px-6 py-3.5 rounded-full font-bold text-sm uppercase tracking-wider text-white transition-all duration-200 active:scale-95"
          style={
            selected
              ? { background: 'var(--coral)', boxShadow: '0 4px 16px rgba(232,112,90,0.3)' }
              : { background: 'var(--bg-raised)', color: 'var(--text-faint)', cursor: 'not-allowed' }
          }
          onMouseEnter={(e) => { if (selected) e.currentTarget.style.background = 'var(--coral-light)'; }}
          onMouseLeave={(e) => { if (selected) e.currentTarget.style.background = 'var(--coral)'; }}
        >
          Continue
          <ChevronRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}
