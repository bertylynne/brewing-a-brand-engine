const STEPS = [
  { label: 'Start'     },
  { label: 'Blueprint' },
  { label: 'Identity'  },
  { label: 'Hours'     },
  { label: 'Services'  },
  { label: 'Team'      },
  { label: 'Brief'     },
];

/**
 * @param {number}   current      1-based current step
 * @param {function} onNavigate   Called with the 1-based step number when a completed dot is clicked
 */
export default function Stepper({ current, onNavigate }) {
  return (
    <div className="w-full px-4 pt-5 pb-4 border-b" style={{ background: 'var(--bg-surface)', borderColor: 'var(--border-sub)' }}>
      <div className="max-w-lg mx-auto">

        {/* Step labels */}
        <div className="flex justify-between mb-2.5">
          {STEPS.map((step, i) => {
            const stepNum    = i + 1;
            const isActive   = stepNum === current;
            const isComplete = stepNum < current;
            const isClickable = isComplete && !!onNavigate;
            return (
              <div key={i} className="flex flex-col items-center flex-1">
                <span
                  onClick={() => isClickable && onNavigate(stepNum)}
                  className={`text-[9px] font-semibold tracking-widest uppercase transition-all duration-300 hidden sm:block select-none ${isClickable ? 'cursor-pointer hover:opacity-80' : ''}`}
                  style={{
                    color: isActive
                      ? 'var(--gold)'
                      : isComplete
                      ? 'var(--text-secondary)'
                      : 'var(--text-faint)',
                  }}
                >
                  {step.label}
                </span>
              </div>
            );
          })}
        </div>

        {/* Progress track */}
        <div className="relative flex items-center">
          <div className="absolute inset-x-0 top-1/2 -translate-y-1/2 h-[2px]" style={{ background: 'var(--border)' }} />
          <div
            className="absolute top-1/2 -translate-y-1/2 h-[2px] transition-all duration-500 ease-out"
            style={{
              left: 0,
              width: `${((current - 1) / (STEPS.length - 1)) * 100}%`,
              background: 'linear-gradient(90deg, var(--coral) 0%, var(--gold) 100%)',
            }}
          />
          <div className="relative flex justify-between w-full">
            {STEPS.map((_, i) => {
              const stepNum    = i + 1;
              const isDone     = stepNum < current;
              const isActive   = stepNum === current;
              const isClickable = isDone && !!onNavigate;
              return (
                <button
                  key={i}
                  type="button"
                  onClick={() => isClickable && onNavigate(stepNum)}
                  disabled={!isClickable && !isActive}
                  title={isDone ? `Back to step ${stepNum}` : undefined}
                  className={`w-5 h-5 rounded-full flex items-center justify-center text-[9px] font-bold transition-all duration-300 border-2 ${isActive ? 'animate-pulse-coral' : ''} ${isClickable ? 'cursor-pointer hover:scale-110 hover:shadow-md' : 'cursor-default'}`}
                  style={
                    isDone
                      ? { background: 'var(--coral)', borderColor: 'var(--coral)', color: '#fff' }
                      : isActive
                      ? { background: 'var(--bg-surface)', borderColor: 'var(--coral)', color: 'var(--coral)' }
                      : { background: 'var(--bg-surface)', borderColor: 'var(--border)', color: 'var(--text-faint)' }
                  }
                >
                  {isDone ? (
                    <svg width="9" height="9" viewBox="0 0 10 10" fill="none">
                      <path d="M1.5 5L3.8 7.5L8.5 2.5" stroke="white" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                  ) : stepNum}
                </button>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
