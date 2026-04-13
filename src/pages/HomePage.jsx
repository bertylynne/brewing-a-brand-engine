// ── Homepage Dashboard ─────────────────────────────────────────────────────────
import { Newspaper, Users, ArrowRight, Coffee } from 'lucide-react';

const SLATE      = '#2C3E50';
const SLATE_MUTED= '#7A8FA6';
const SLATE_FAINT= '#B0BEC9';
const PARCHMENT  = '#F5F0E8';
const SIGNAL     = '#64CCF1';
const SIGNAL_DIM = '#3DBDE8';
const BRASS      = '#C5A059';
const BRASS_DIM  = '#A8864A';
const WHITE      = '#FFFFFF';
const BORDER     = 'rgba(44,62,80,0.10)';

const CARDS = [
  {
    id:        'newsroom',
    href:      '?page=newsroom',
    icon:      Newspaper,
    iconBg:    `${SIGNAL}15`,
    iconColor: SIGNAL,
    accent:    SIGNAL,
    accentDim: SIGNAL_DIM,
    label:     'Manage The Gazette',
    desc:      'Write, import, and publish posts. Manage hero images and keep the content library current.',
  },
  {
    id:        'onboarding',
    href:      '?page=onboarding',
    icon:      Users,
    iconBg:    `${BRASS}18`,
    iconColor: BRASS,
    accent:    BRASS,
    accentDim: BRASS_DIM,
    label:     'Brand Discovery',
    desc:      'Run the full brand brief — identity, services, team roster, and final handoff package.',
  },
];

export default function HomePage() {
  return (
    <div
      className="min-h-screen flex flex-col"
      style={{ background: PARCHMENT, fontFamily: "'Inter', sans-serif" }}
    >
      {/* ── Slim top bar ───────────────────────────────────────────────────── */}
      <div
        className="flex items-center gap-2.5 px-8 py-4 border-b"
        style={{ background: WHITE, borderColor: BORDER }}
      >
        <div
          className="w-7 h-7 rounded-lg flex items-center justify-center flex-shrink-0"
          style={{ background: `${SIGNAL}15` }}
        >
          <Coffee className="w-4 h-4" style={{ color: SIGNAL }} />
        </div>
        <span
          className="text-[10px] font-bold uppercase tracking-[0.22em]"
          style={{ color: SIGNAL }}
        >
          CBA Solutions
        </span>
      </div>

      {/* ── Centred body ───────────────────────────────────────────────────── */}
      <main className="flex-1 flex flex-col items-center justify-center px-6 py-16">

        {/* Header */}
        <div className="text-center mb-14 max-w-lg">
          <p
            className="text-[10px] font-bold uppercase tracking-[0.28em] mb-4"
            style={{ color: SLATE_FAINT }}
          >
            Command Center
          </p>
          <h1
            className="text-3xl font-black tracking-tight leading-tight mb-3"
            style={{ color: SLATE, fontFamily: "'Montserrat', sans-serif" }}
          >
            Welcome back.
          </h1>
          <p
            className="text-base font-medium"
            style={{ color: SLATE_MUTED }}
          >
            What are we brewing today?
          </p>
        </div>

        {/* Two cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 w-full max-w-2xl">
          {CARDS.map((card) => {
            const Icon = card.icon;
            return (
              <a
                key={card.id}
                href={card.href}
                className="group flex flex-col rounded-2xl border overflow-hidden transition-all duration-200 active:scale-[0.98]"
                style={{
                  background:     WHITE,
                  borderColor:    BORDER,
                  boxShadow:      '0 2px 10px rgba(44,62,80,0.07)',
                  textDecoration: 'none',
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.boxShadow    = '0 12px 36px rgba(44,62,80,0.14)';
                  e.currentTarget.style.transform    = 'translateY(-3px)';
                  e.currentTarget.style.borderColor  = `${card.accent}40`;
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.boxShadow   = '0 2px 10px rgba(44,62,80,0.07)';
                  e.currentTarget.style.transform   = 'translateY(0)';
                  e.currentTarget.style.borderColor = BORDER;
                }}
              >
                {/* Accent bar */}
                <div className="h-1 w-full flex-shrink-0" style={{ background: card.accent }} />

                {/* Card body */}
                <div className="flex flex-col gap-5 p-7">
                  {/* Icon */}
                  <div
                    className="w-12 h-12 rounded-2xl flex items-center justify-center"
                    style={{ background: card.iconBg }}
                  >
                    <Icon className="w-6 h-6" style={{ color: card.iconColor }} />
                  </div>

                  {/* Text */}
                  <div className="flex flex-col gap-2">
                    <h2
                      className="text-lg font-black leading-tight"
                      style={{ color: SLATE, fontFamily: "'Montserrat', sans-serif" }}
                    >
                      {card.label}
                    </h2>
                    <p
                      className="text-xs leading-relaxed"
                      style={{ color: SLATE_MUTED }}
                    >
                      {card.desc}
                    </p>
                  </div>

                  {/* CTA row */}
                  <div
                    className="flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider mt-1 transition-all duration-150"
                    style={{ color: card.accent }}
                  >
                    Go
                    <ArrowRight
                      className="w-3.5 h-3.5 transition-transform duration-150 group-hover:translate-x-1"
                    />
                  </div>
                </div>
              </a>
            );
          })}
        </div>
      </main>

      {/* ── Footer ─────────────────────────────────────────────────────────── */}
      <footer
        className="py-5 border-t text-center"
        style={{ borderColor: 'rgba(44,62,80,0.07)' }}
      >
        <p
          className="text-[10px] uppercase tracking-widest font-medium"
          style={{ color: SLATE_FAINT }}
        >
          CBA Solutions · Internal Portal
        </p>
      </footer>
    </div>
  );
}
