// ── Homepage Command Center ────────────────────────────────────────────────────
import { Newspaper, Users, BarChart2, ArrowRight, Coffee } from 'lucide-react';

const SLATE      = '#2C3E50';
const SLATE2     = '#3D5166';
const SLATE_MUTED= '#7A8FA6';
const SLATE_FAINT= '#B0BEC9';
const PARCHMENT  = '#F5F0E8';
const PARCHMENT2 = '#EDE8DC';
const SIGNAL     = '#64CCF1';
const SIGNAL_DIM = '#3DBDE8';
const BRASS      = '#C5A059';
const BRASS_DIM  = '#A8864A';
const WHITE      = '#FFFFFF';
const BORDER     = 'rgba(44,62,80,0.10)';

const CARDS = [
  {
    id:       'newsroom',
    href:     '?page=newsroom',
    icon:     Newspaper,
    iconBg:   `${SIGNAL}15`,
    iconColor: SIGNAL,
    accentBar: SIGNAL,
    label:    'Newsroom & Content',
    desc:     'Manage blog posts, import articles, upload hero images, and publish to the Resources feed.',
    cta:      'Open Newsroom',
    ctaBg:    SIGNAL,
    ctaShadow:`0 4px 14px ${SIGNAL}40`,
    ctaHover: SIGNAL_DIM,
    badge:    null,
    disabled: false,
  },
  {
    id:       'onboarding',
    href:     '?page=onboarding',
    icon:     Users,
    iconBg:   `${BRASS}18`,
    iconColor: BRASS,
    accentBar: BRASS,
    label:    'Brand Onboarding',
    desc:     'Walk through the full brand brief — identity, services, team, and finalize for handoff.',
    cta:      'Open Onboarding',
    ctaBg:    BRASS,
    ctaShadow:`0 4px 14px ${BRASS}40`,
    ctaHover: BRASS_DIM,
    badge:    null,
    disabled: false,
  },
  {
    id:       'analytics',
    href:     null,
    icon:     BarChart2,
    iconBg:   'rgba(167,139,250,0.12)',
    iconColor: '#A78BFA',
    accentBar: '#A78BFA',
    label:    'Analytics',
    desc:     'Traffic insights, post performance, and lead tracking. Dashboard coming soon.',
    cta:      'Coming Soon',
    ctaBg:    PARCHMENT2,
    ctaShadow:'none',
    ctaHover: null,
    badge:    'Soon',
    disabled: true,
  },
];

export default function HomePage() {
  const now = new Date();
  const hour = now.getHours();
  const greeting = hour < 12 ? 'Good morning' : hour < 17 ? 'Good afternoon' : 'Good evening';

  return (
    <div
      className="min-h-screen"
      style={{ background: PARCHMENT, fontFamily: "'Inter', sans-serif" }}
    >
      {/* ── Header ──────────────────────────────────────────────────────────── */}
      <header style={{ background: SLATE }}>
        <div className="max-w-5xl mx-auto px-8 py-14">
          {/* Brand mark */}
          <div className="flex items-center gap-3 mb-8">
            <div
              className="w-9 h-9 rounded-xl flex items-center justify-center"
              style={{ background: `${SIGNAL}18` }}
            >
              <Coffee className="w-5 h-5" style={{ color: SIGNAL }} />
            </div>
            <span
              className="text-[10px] font-bold uppercase tracking-[0.25em]"
              style={{ color: SIGNAL }}
            >
              CBA Solutions · Command Center
            </span>
          </div>

          {/* Greeting */}
          <p
            className="text-sm font-semibold mb-1"
            style={{ color: SLATE_MUTED }}
          >
            {greeting},
          </p>
          <h1
            className="text-4xl font-black tracking-tight leading-none mb-4"
            style={{ color: PARCHMENT, fontFamily: "'Montserrat', sans-serif" }}
          >
            Welcome back, Pops.
          </h1>
          <p
            className="text-sm max-w-lg leading-relaxed"
            style={{ color: SLATE_MUTED }}
          >
            Your brand‑building tools are ready. Pick up where you left off.
          </p>
        </div>
      </header>

      {/* ── Cards ───────────────────────────────────────────────────────────── */}
      <main className="max-w-5xl mx-auto px-8 py-14">
        <p
          className="text-[10px] font-bold uppercase tracking-[0.22em] mb-8"
          style={{ color: SLATE_FAINT }}
        >
          Tools
        </p>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {CARDS.map((card) => {
            const Icon = card.icon;
            return (
              <div
                key={card.id}
                className="rounded-2xl border flex flex-col overflow-hidden transition-all duration-200"
                style={{
                  background:   WHITE,
                  borderColor:  BORDER,
                  boxShadow:    '0 2px 8px rgba(44,62,80,0.06)',
                  opacity:      card.disabled ? 0.7 : 1,
                }}
                onMouseEnter={(e) => {
                  if (!card.disabled) {
                    e.currentTarget.style.boxShadow = '0 8px 28px rgba(44,62,80,0.13)';
                    e.currentTarget.style.transform = 'translateY(-2px)';
                  }
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.boxShadow = '0 2px 8px rgba(44,62,80,0.06)';
                  e.currentTarget.style.transform = 'translateY(0)';
                }}
              >
                {/* Accent bar */}
                <div
                  className="h-1 w-full flex-shrink-0"
                  style={{ background: card.accentBar }}
                />

                {/* Body */}
                <div className="flex flex-col flex-1 p-6 gap-5">
                  {/* Icon + badge */}
                  <div className="flex items-start justify-between">
                    <div
                      className="w-11 h-11 rounded-xl flex items-center justify-center"
                      style={{ background: card.iconBg }}
                    >
                      <Icon className="w-5 h-5" style={{ color: card.iconColor }} />
                    </div>
                    {card.badge && (
                      <span
                        className="text-[9px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-full"
                        style={{
                          background: 'rgba(167,139,250,0.12)',
                          color:      '#A78BFA',
                          border:     '1px solid rgba(167,139,250,0.25)',
                        }}
                      >
                        {card.badge}
                      </span>
                    )}
                  </div>

                  {/* Text */}
                  <div className="flex flex-col gap-2 flex-1">
                    <h2
                      className="text-base font-black leading-tight"
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

                  {/* CTA */}
                  {card.disabled ? (
                    <div
                      className="flex items-center justify-center gap-2 w-full py-3 rounded-xl text-xs font-bold uppercase tracking-wider"
                      style={{
                        background:  PARCHMENT2,
                        color:       SLATE_FAINT,
                        border:      `1px solid ${BORDER}`,
                      }}
                    >
                      {card.cta}
                    </div>
                  ) : (
                    <a
                      href={card.href}
                      className="flex items-center justify-center gap-2 w-full py-3 rounded-xl text-xs font-bold uppercase tracking-wider text-white transition-all duration-150 active:scale-[0.98]"
                      style={{
                        background: card.ctaBg,
                        boxShadow:  card.ctaShadow,
                        textDecoration: 'none',
                      }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.background = card.ctaHover;
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.background = card.ctaBg;
                      }}
                    >
                      {card.cta}
                      <ArrowRight className="w-3.5 h-3.5" />
                    </a>
                  )}
                </div>
              </div>
            );
          })}
        </div>

        {/* ── Quick links ─────────────────────────────────────────────────── */}
        <div
          className="mt-10 pt-8 border-t flex items-center gap-6 flex-wrap"
          style={{ borderColor: 'rgba(44,62,80,0.08)' }}
        >
          <span
            className="text-[10px] font-bold uppercase tracking-[0.2em]"
            style={{ color: SLATE_FAINT }}
          >
            Quick links
          </span>
          {[
            { label: 'Resources Feed',   href: '?page=resources' },
            { label: 'Start Onboarding', href: '?page=onboarding' },
          ].map((link) => (
            <a
              key={link.href}
              href={link.href}
              className="flex items-center gap-1.5 text-xs font-semibold transition-colors"
              style={{ color: SLATE2, textDecoration: 'none' }}
              onMouseEnter={(e) => { e.currentTarget.style.color = SIGNAL_DIM; }}
              onMouseLeave={(e) => { e.currentTarget.style.color = SLATE2; }}
            >
              {link.label}
              <ArrowRight className="w-3 h-3" />
            </a>
          ))}
        </div>
      </main>

      {/* ── Footer ──────────────────────────────────────────────────────────── */}
      <footer
        className="border-t py-6"
        style={{ borderColor: 'rgba(44,62,80,0.08)' }}
      >
        <p
          className="text-center text-[10px] uppercase tracking-widest font-medium"
          style={{ color: SLATE_FAINT }}
        >
          CBA Solutions · Internal Portal
        </p>
      </footer>
    </div>
  );
}
