import { ChevronRight, ChevronLeft, Clock } from 'lucide-react';

const DAYS = [
  { key: 'monday',    label: 'Monday'    },
  { key: 'tuesday',   label: 'Tuesday'   },
  { key: 'wednesday', label: 'Wednesday' },
  { key: 'thursday',  label: 'Thursday'  },
  { key: 'friday',    label: 'Friday'    },
  { key: 'saturday',  label: 'Saturday'  },
  { key: 'sunday',    label: 'Sunday'    },
];

const TIME_OPTIONS = [];
for (let h = 0; h < 24; h++) {
  for (let m = 0; m < 60; m += 30) {
    const hh  = String(h).padStart(2, '0');
    const mm  = String(m).padStart(2, '0');
    const val = `${hh}:${mm}`;
    const period = h < 12 ? 'AM' : 'PM';
    const h12    = h === 0 ? 12 : h > 12 ? h - 12 : h;
    TIME_OPTIONS.push({ value: val, label: `${h12}:${mm} ${period}` });
  }
}

function TimeSelect({ value, onChange, disabled }) {
  return (
    <select
      value={value}
      onChange={(e) => onChange(e.target.value)}
      disabled={disabled}
      className="rounded-lg px-2.5 py-2 text-xs outline-none border appearance-none cursor-pointer transition-colors"
      style={{
        background:  'var(--bg-surface)',
        borderColor: 'var(--border)',
        color:       disabled ? 'var(--text-faint)' : 'var(--text-primary)',
        minWidth:    '100px',
      }}
    >
      {TIME_OPTIONS.map((t) => (
        <option key={t.value} value={t.value}>{t.label}</option>
      ))}
    </select>
  );
}

export default function Step4Operations({ onNext, onBack, data, setData }) {
  const hours = data.businessHours || {};

  const updateDay = (dayKey, field, value) =>
    setData({
      ...data,
      businessHours: {
        ...hours,
        [dayKey]: { ...hours[dayKey], [field]: value },
      },
    });

  const applyWeekdaysToAll = () => {
    const weekday = hours['monday'] || { open: '09:00', close: '18:00', closed: false };
    const updated = {};
    DAYS.forEach(({ key }) => { updated[key] = { ...weekday }; });
    setData({ ...data, businessHours: updated });
  };

  const openDays = DAYS.filter(({ key }) => !hours[key]?.closed).length;

  return (
    <div className="px-5 py-8 max-w-lg mx-auto w-full">

      {/* Header */}
      <div className="animate-fade-up mb-6">
        <p className="text-[11px] tracking-[0.2em] uppercase font-semibold mb-2" style={{ color: 'var(--coral)' }}>
          — Step 04 —
        </p>
        <h2 className="font-serif-display text-2xl font-bold tracking-tight" style={{ color: 'var(--text-primary)' }}>
          Business Hours
        </h2>
        <div className="flex items-center gap-3 my-3">
          <div className="h-px w-8" style={{ background: 'var(--gold)' }} />
          <div className="w-1 h-1 rounded-full" style={{ background: 'var(--gold)' }} />
          <div className="h-px w-8" style={{ background: 'var(--gold)' }} />
        </div>
        <p className="text-sm leading-relaxed" style={{ color: 'var(--text-secondary)' }}>
          Set your opening hours for each day. These will appear on your website and Google listing.
        </p>
      </div>

      {/* Summary pill + quick action */}
      <div className="animate-fade-up delay-100 flex items-center justify-between mb-4">
        <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full border text-xs font-semibold"
          style={{ borderColor: 'rgba(201,162,39,0.35)', background: 'rgba(201,162,39,0.08)', color: 'var(--gold)' }}>
          <Clock className="w-3.5 h-3.5" />
          {openDays} day{openDays !== 1 ? 's' : ''} open
        </div>
        <button
          onClick={applyWeekdaysToAll}
          className="text-[11px] transition-colors"
          style={{ color: 'var(--text-faint)' }}
          onMouseEnter={(e) => { e.currentTarget.style.color = 'var(--gold)'; }}
          onMouseLeave={(e) => { e.currentTarget.style.color = 'var(--text-faint)'; }}
        >
          Copy Monday to all days
        </button>
      </div>

      {/* Hours table */}
      <div className="animate-fade-up delay-200 rounded-2xl border overflow-hidden mb-8" style={{ borderColor: 'var(--border)', background: 'var(--bg-card)' }}>
        {/* Column headers */}
        <div className="grid grid-cols-[100px_1fr_1fr_52px] gap-2 px-4 py-2.5 border-b"
          style={{ borderColor: 'var(--border-sub)', background: 'var(--bg-raised)' }}>
          <span className="text-[10px] uppercase tracking-widest font-semibold" style={{ color: 'var(--text-faint)' }}>Day</span>
          <span className="text-[10px] uppercase tracking-widest font-semibold" style={{ color: 'var(--text-faint)' }}>Open</span>
          <span className="text-[10px] uppercase tracking-widest font-semibold" style={{ color: 'var(--text-faint)' }}>Close</span>
          <span className="text-[10px] uppercase tracking-widest font-semibold text-center" style={{ color: 'var(--text-faint)' }}>Closed</span>
        </div>

        {DAYS.map(({ key, label }, i) => {
          const day    = hours[key] || { open: '09:00', close: '18:00', closed: false };
          const isLast = i === DAYS.length - 1;
          const isWeekend = key === 'saturday' || key === 'sunday';
          return (
            <div
              key={key}
              className={`grid grid-cols-[100px_1fr_1fr_52px] gap-2 items-center px-4 py-3 ${!isLast ? 'border-b' : ''}`}
              style={{
                borderColor: 'var(--border-sub)',
                background: day.closed ? 'transparent' : isWeekend ? 'rgba(201,162,39,0.03)' : 'transparent',
                opacity: day.closed ? 0.5 : 1,
                transition: 'opacity 0.2s',
              }}
            >
              {/* Day name */}
              <span className="text-xs font-semibold" style={{ color: day.closed ? 'var(--text-faint)' : 'var(--text-primary)' }}>
                {label}
              </span>

              {/* Open time */}
              <TimeSelect
                value={day.open || '09:00'}
                onChange={(v) => updateDay(key, 'open', v)}
                disabled={day.closed}
              />

              {/* Close time */}
              <TimeSelect
                value={day.close || '18:00'}
                onChange={(v) => updateDay(key, 'close', v)}
                disabled={day.closed}
              />

              {/* Closed toggle */}
              <div className="flex justify-center">
                <button
                  type="button"
                  onClick={() => updateDay(key, 'closed', !day.closed)}
                  className="relative rounded-full transition-all duration-200"
                  style={{ background: day.closed ? 'var(--coral)' : 'var(--border)', width: '36px', height: '20px' }}
                >
                  <span className="absolute top-[2px] w-4 h-4 rounded-full bg-white shadow transition-all duration-200"
                    style={{ left: day.closed ? '16px' : '2px' }} />
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* Navigation */}
      <div className="animate-fade-up delay-300 flex gap-3">
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
