const STEPS = [
  { label: 'Welcome' },
  { label: 'Identity' },
  { label: 'Branch' },
  { label: 'Services' },
  { label: 'Finalize' },
];

export default function Stepper({ current }) {
  return (
    <div className="w-full px-4 pt-5 pb-4 bg-[#111111] border-b border-[#1e1e1e]">
      <div className="max-w-md mx-auto">
        {/* Step labels row */}
        <div className="flex justify-between mb-2.5">
          {STEPS.map((step, i) => (
            <div key={i} className="flex flex-col items-center flex-1">
              <span
                className={`text-[10px] font-semibold tracking-widest uppercase transition-all duration-300 ${
                  i + 1 === current
                    ? 'text-[#c9a227]'
                    : i + 1 < current
                    ? 'text-[#888]'
                    : 'text-[#444]'
                }`}
              >
                {step.label}
              </span>
            </div>
          ))}
        </div>

        {/* Progress track */}
        <div className="relative flex items-center">
          {/* Background track */}
          <div className="absolute inset-x-0 top-1/2 -translate-y-1/2 h-[2px] bg-[#1e1e1e]" />

          {/* Gold fill */}
          <div
            className="absolute top-1/2 -translate-y-1/2 h-[2px] bg-gradient-to-r from-[#c9a227] to-[#e8c96a] transition-all duration-500 ease-out"
            style={{
              left: 0,
              width: `${((current - 1) / (STEPS.length - 1)) * 100}%`,
            }}
          />

          {/* Step dots */}
          <div className="relative flex justify-between w-full">
            {STEPS.map((_, i) => {
              const stepNum = i + 1;
              const isDone = stepNum < current;
              const isActive = stepNum === current;
              return (
                <div
                  key={i}
                  className={`w-6 h-6 rounded-full flex items-center justify-center text-[10px] font-bold transition-all duration-300 border-2 ${
                    isDone
                      ? 'bg-[#c9a227] border-[#c9a227] text-black'
                      : isActive
                      ? 'bg-[#111111] border-[#c9a227] text-[#c9a227]'
                      : 'bg-[#111111] border-[#2a2a2a] text-[#444]'
                  } ${isActive ? 'animate-pulse-gold' : ''}`}
                >
                  {isDone ? (
                    <svg width="10" height="10" viewBox="0 0 10 10" fill="none">
                      <path d="M1.5 5L3.8 7.5L8.5 2.5" stroke="black" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                  ) : (
                    stepNum
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
