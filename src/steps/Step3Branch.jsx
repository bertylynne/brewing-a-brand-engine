import { ChevronRight, ChevronLeft, Check } from 'lucide-react';

const OPTIONS = [
  {
    id: 'barbershop',
    label: 'Barbershop',
    tagline: 'Fades, cuts & classic grooming',
    description: 'Classic fades, beard trims, hot towel shaves, and precision cuts for the modern gentleman.',
    emoji: '✂️',
    accent: '#c9a227',
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
    pattern: 'salon',
    services: ['Blowout', 'Color Treatment', 'Hair Extensions', 'Deep Conditioning', 'Trim & Style', 'Facial'],
  },
];

function BarberPattern() {
  return (
    <svg width="100%" height="100%" viewBox="0 0 200 200" className="opacity-[0.07]">
      {/* Scissors pattern */}
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
    <svg width="100%" height="100%" viewBox="0 0 200 200" className="opacity-[0.07]">
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

  const handleSelect = (id) => {
    setData({ ...data, businessType: id });
  };

  return (
    <div className="px-5 py-8 max-w-lg mx-auto w-full">
      {/* Header */}
      <div className="animate-fade-up mb-7 text-center">
        <div className="flex items-center justify-center gap-2 mb-1">
          <div className="w-5 h-5 rounded-full bg-[#c9a227]/10 border border-[#c9a227]/30 flex items-center justify-center">
            <span className="text-[9px] font-bold text-[#c9a227]">03</span>
          </div>
          <span className="text-[11px] text-[#666] tracking-widest uppercase font-medium">The Branch</span>
        </div>
        <h2 className="text-2xl font-bold text-white tracking-tight">What type of business is this?</h2>
        <p className="text-[#666] text-sm mt-1.5">
          This helps us tailor your service list and content to fit your business.
        </p>
      </div>

      {/* Option cards */}
      <div className="animate-fade-up delay-100 flex flex-col gap-4 mb-8">
        {OPTIONS.map((opt) => {
          const isSelected = selected === opt.id;
          return (
            <button
              key={opt.id}
              onClick={() => handleSelect(opt.id)}
              className={`relative text-left rounded-2xl border-2 overflow-hidden transition-all duration-300 active:scale-[0.98] focus:outline-none ${
                isSelected
                  ? opt.id === 'barbershop'
                    ? 'border-[#c9a227] bg-[#c9a227]/5 shadow-[0_0_30px_rgba(201,162,39,0.12)]'
                    : 'border-[#d4a0c8] bg-[#d4a0c8]/5 shadow-[0_0_30px_rgba(212,160,200,0.12)]'
                  : 'border-[#1e1e1e] bg-[#0e0e0e] hover:border-[#2a2a2a] hover:bg-[#111]'
              }`}
            >
              {/* Background pattern */}
              <div className="absolute inset-0 pointer-events-none">
                {opt.id === 'barbershop' ? <BarberPattern /> : <SalonPattern />}
              </div>

              <div className="relative p-5 flex items-start gap-4">
                {/* Emoji icon */}
                <div
                  className={`w-14 h-14 rounded-xl flex items-center justify-center text-2xl flex-shrink-0 border transition-all duration-300 ${
                    isSelected
                      ? opt.id === 'barbershop'
                        ? 'border-[#c9a227]/40 bg-[#c9a227]/10'
                        : 'border-[#d4a0c8]/40 bg-[#d4a0c8]/10'
                      : 'border-[#1e1e1e] bg-[#161616]'
                  }`}
                >
                  {opt.emoji}
                </div>

                {/* Text content */}
                <div className="flex-1 min-w-0 pt-0.5">
                  <div className="flex items-center gap-2 mb-0.5">
                    <h3 className={`text-lg font-bold transition-colors ${
                      isSelected
                        ? opt.id === 'barbershop' ? 'text-[#c9a227]' : 'text-[#d4a0c8]'
                        : 'text-white'
                    }`}>
                      {opt.label}
                    </h3>
                  </div>
                  <p className="text-[#888] text-xs mb-2 font-medium">{opt.tagline}</p>
                  <p className="text-[#555] text-xs leading-relaxed">{opt.description}</p>

                  {/* Service preview tags */}
                  <div className="flex flex-wrap gap-1.5 mt-3">
                    {opt.services.slice(0, 4).map((s) => (
                      <span
                        key={s}
                        className={`text-[10px] px-2 py-0.5 rounded-full border font-medium transition-all duration-300 ${
                          isSelected
                            ? opt.id === 'barbershop'
                              ? 'border-[#c9a227]/30 bg-[#c9a227]/10 text-[#c9a227]'
                              : 'border-[#d4a0c8]/30 bg-[#d4a0c8]/10 text-[#d4a0c8]'
                            : 'border-[#222] bg-[#161616] text-[#555]'
                        }`}
                      >
                        {s}
                      </span>
                    ))}
                    <span className="text-[10px] text-[#444] font-medium self-center">
                      +{opt.services.length - 4} more
                    </span>
                  </div>
                </div>

                {/* Selection indicator */}
                <div
                  className={`w-6 h-6 rounded-full border-2 flex-shrink-0 flex items-center justify-center transition-all duration-300 mt-1 ${
                    isSelected
                      ? opt.id === 'barbershop'
                        ? 'border-[#c9a227] bg-[#c9a227]'
                        : 'border-[#d4a0c8] bg-[#d4a0c8]'
                      : 'border-[#333] bg-transparent'
                  }`}
                >
                  {isSelected && <Check className="w-3.5 h-3.5 text-black" strokeWidth={3} />}
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
          className="flex items-center gap-2 px-5 py-3.5 rounded-full border border-[#222] text-[#666] text-sm font-medium hover:border-[#333] hover:text-[#888] transition-all active:scale-95"
        >
          <ChevronLeft className="w-4 h-4" />
          Back
        </button>
        <button
          onClick={onNext}
          disabled={!selected}
          className={`flex-1 flex items-center justify-center gap-2 px-6 py-3.5 rounded-full text-black font-semibold text-sm transition-all duration-200 active:scale-95 shadow-md ${
            selected
              ? 'hover:scale-[1.02] hover:shadow-[#c9a227]/20'
              : 'opacity-40 cursor-not-allowed'
          }`}
          style={{ background: selected ? 'linear-gradient(135deg, #c9a227 0%, #e8c96a 60%, #c9a227 100%)' : '#333' }}
        >
          Continue
          <ChevronRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}
