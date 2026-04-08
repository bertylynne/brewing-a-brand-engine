import { Play, ChevronRight } from 'lucide-react';
import DiscoveryPanel from '../components/DiscoveryPanel';

export default function Step1Welcome({ onNext, onDiscovery }) {
  return (
    <div className="flex flex-col items-center justify-center min-h-svh px-5 py-10 text-center relative overflow-hidden">

      {/* Background texture grid */}
      <div
        className="absolute inset-0 opacity-[0.03] pointer-events-none"
        style={{
          backgroundImage: 'linear-gradient(var(--border) 1px, transparent 1px), linear-gradient(90deg, var(--border) 1px, transparent 1px)',
          backgroundSize: '48px 48px',
        }}
      />

      {/* Logo + Client Portal */}
      <div className="animate-fade-up mb-6 relative flex flex-col items-center gap-3">
        <img
          src="/cba-logo.png"
          alt="CBA Solutions"
          className="h-12 w-auto object-contain"
          style={{ filter: 'brightness(0) invert(1)' }}
        />
        {/* Divider */}
        <div className="flex items-center gap-3">
          <div className="h-px w-10" style={{ background: 'var(--border)' }} />
          <span className="text-[10px] tracking-[0.22em] uppercase font-semibold" style={{ color: 'var(--text-muted)' }}>
            Client Portal
          </span>
          <div className="h-px w-10" style={{ background: 'var(--border)' }} />
        </div>
      </div>

      {/* Heading */}
      <div className="animate-fade-up delay-100 mb-4 relative">
        <h1 className="font-serif-display text-4xl sm:text-5xl font-bold leading-tight tracking-tight">
          <span style={{ color: 'var(--text-primary)' }}>Your Brand Brief &amp;</span>
          <br />
          <span style={{ color: 'var(--text-primary)' }}>Website </span>
          <span style={{ color: 'var(--gold)' }}>Consultation</span>
        </h1>
        {/* Decorative rule */}
        <div className="flex items-center justify-center gap-3 mt-4">
          <div className="h-px w-12" style={{ background: 'var(--gold)' }} />
          <div className="w-1.5 h-1.5 rounded-full" style={{ background: 'var(--gold)' }} />
          <div className="h-px w-12" style={{ background: 'var(--gold)' }} />
        </div>
      </div>

      {/* Subtext */}
      <p className="animate-fade-up delay-200 text-base max-w-[320px] leading-relaxed mb-10 italic" style={{ color: 'var(--text-secondary)' }}>
        We'll collect your brand information so our team can build your website <span style={{ color: 'var(--text-primary)' }}>professionally and precisely</span>.
      </p>

      {/* Video Placeholder */}
      <div className="animate-fade-up delay-300 w-full max-w-md mb-10">
        <div
          className="relative rounded-2xl overflow-hidden aspect-video shadow-2xl group border"
          style={{ background: 'var(--bg-raised)', borderColor: 'var(--border)' }}
        >
          <div
            className="absolute inset-0 opacity-[0.04]"
            style={{
              backgroundImage: 'linear-gradient(var(--gold) 1px, transparent 1px), linear-gradient(90deg, var(--gold) 1px, transparent 1px)',
              backgroundSize: '40px 40px',
            }}
          />
          <div className="absolute top-3 left-3 w-5 h-5 border-t-2 border-l-2 rounded-tl" style={{ borderColor: 'rgba(201,162,39,0.45)' }} />
          <div className="absolute top-3 right-3 w-5 h-5 border-t-2 border-r-2 rounded-tr" style={{ borderColor: 'rgba(201,162,39,0.45)' }} />
          <div className="absolute bottom-3 left-3 w-5 h-5 border-b-2 border-l-2 rounded-bl" style={{ borderColor: 'rgba(201,162,39,0.45)' }} />
          <div className="absolute bottom-3 right-3 w-5 h-5 border-b-2 border-r-2 rounded-br" style={{ borderColor: 'rgba(201,162,39,0.45)' }} />
          <div className="absolute inset-0 flex flex-col items-center justify-center gap-3">
            <div
              className="w-16 h-16 rounded-full border-2 flex items-center justify-center transition-all duration-300 group-hover:scale-110 animate-pulse-gold"
              style={{ background: 'rgba(201,162,39,0.1)', borderColor: 'rgba(201,162,39,0.45)' }}
            >
              <Play className="w-6 h-6 ml-1" style={{ color: 'var(--gold)' }} fill="currentColor" />
            </div>
            <span className="text-xs tracking-widest uppercase" style={{ color: 'var(--text-faint)' }}>Intro Video</span>
          </div>
          <div className="absolute bottom-0 inset-x-0 py-3 px-4" style={{ background: 'linear-gradient(to top, rgba(21,34,50,0.8), transparent)' }}>
            <p className="text-[10px] text-left tracking-wider uppercase" style={{ color: 'var(--text-faint)' }}>
              Client onboarding overview · Approx. 2 min
            </p>
          </div>
        </div>
      </div>

      {/* CTA Button */}
      <div className="animate-fade-up delay-400">
        <button
          onClick={onNext}
          className="group relative inline-flex items-center gap-3 px-8 py-4 rounded-full font-bold text-base uppercase tracking-wider text-white transition-all duration-300 hover:scale-105 active:scale-95 shadow-lg focus:outline-none"
          style={{ background: 'var(--coral)', boxShadow: '0 4px 24px rgba(232,112,90,0.35)' }}
          onMouseEnter={(e) => { e.currentTarget.style.background = 'var(--coral-light)'; }}
          onMouseLeave={(e) => { e.currentTarget.style.background = 'var(--coral)'; }}
        >
          <span>Begin Your Consultation</span>
          <ChevronRight className="w-5 h-5 transition-transform duration-200 group-hover:translate-x-1" />
        </button>
      </div>

      {/* Footer note */}
      <p className="animate-fade-up delay-500 text-xs mt-6 mb-6 tracking-wide" style={{ color: 'var(--text-faint)' }}>
        5 steps · Under 5 minutes · Handled by our team
      </p>

      {/* Discovery Mode panel */}
      <DiscoveryPanel onApply={onDiscovery} />
    </div>
  );
}
