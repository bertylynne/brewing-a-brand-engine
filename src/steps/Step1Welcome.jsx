import { Play, ChevronRight } from 'lucide-react';
import DiscoveryPanel from '../components/DiscoveryPanel';

export default function Step1Welcome({ onNext, onDiscovery }) {
  return (
    <div className="flex flex-col items-center justify-center min-h-svh px-5 py-10 text-center">
      {/* Agency badge */}
      <div className="animate-fade-up mb-8">
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full border border-[#c9a227]/30 bg-[#c9a227]/5">
          <div className="w-1.5 h-1.5 rounded-full bg-[#c9a227] animate-pulse" />
          <span className="text-[11px] tracking-[0.18em] uppercase text-[#c9a227] font-semibold">
            CBA Solutions — Client Portal
          </span>
        </div>
      </div>

      {/* Heading */}
      <div className="animate-fade-up delay-100 mb-3">
        <h1 className="text-3xl sm:text-4xl font-bold text-white leading-tight tracking-tight">
          Welcome to Your
          <br />
          <span
            className="inline-block"
            style={{
              background: 'linear-gradient(135deg, #c9a227 0%, #e8c96a 50%, #c9a227 100%)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              backgroundSize: '200% auto',
            }}
          >
            Spec Build Walkthrough
          </span>
        </h1>
      </div>

      {/* Subtext */}
      <p className="animate-fade-up delay-200 text-[#888] text-base max-w-[320px] leading-relaxed mb-10">
        Let's review your website together and make it <span className="text-[#bbb]">uniquely yours</span> in just a few steps.
      </p>

      {/* Video Placeholder */}
      <div className="animate-fade-up delay-300 w-full max-w-md mb-10">
        <div className="relative rounded-2xl overflow-hidden border border-[#222] bg-[#111] aspect-video shadow-2xl group">
          {/* Noise texture */}
          <div
            className="absolute inset-0 opacity-[0.03]"
            style={{
              backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E")`,
            }}
          />
          {/* Grid lines */}
          <div
            className="absolute inset-0 opacity-[0.04]"
            style={{
              backgroundImage:
                'linear-gradient(#c9a227 1px, transparent 1px), linear-gradient(90deg, #c9a227 1px, transparent 1px)',
              backgroundSize: '40px 40px',
            }}
          />
          {/* Corner accents */}
          <div className="absolute top-3 left-3 w-5 h-5 border-t-2 border-l-2 border-[#c9a227]/40 rounded-tl" />
          <div className="absolute top-3 right-3 w-5 h-5 border-t-2 border-r-2 border-[#c9a227]/40 rounded-tr" />
          <div className="absolute bottom-3 left-3 w-5 h-5 border-b-2 border-l-2 border-[#c9a227]/40 rounded-bl" />
          <div className="absolute bottom-3 right-3 w-5 h-5 border-b-2 border-r-2 border-[#c9a227]/40 rounded-br" />
          {/* Play button */}
          <div className="absolute inset-0 flex flex-col items-center justify-center gap-3">
            <div className="w-16 h-16 rounded-full bg-[#c9a227]/10 border-2 border-[#c9a227]/40 flex items-center justify-center transition-all duration-300 group-hover:bg-[#c9a227]/20 group-hover:border-[#c9a227]/70 group-hover:scale-110 animate-pulse-gold">
              <Play className="w-6 h-6 text-[#c9a227] ml-1" fill="currentColor" />
            </div>
            <span className="text-[#555] text-xs tracking-widest uppercase">Intro Video</span>
          </div>
          {/* Bottom label */}
          <div className="absolute bottom-0 inset-x-0 bg-gradient-to-t from-black/60 to-transparent py-3 px-4">
            <p className="text-[10px] text-[#666] text-left tracking-wider uppercase">
              Your walkthrough preview • Approx. 2 min
            </p>
          </div>
        </div>
      </div>

      {/* CTA Button */}
      <div className="animate-fade-up delay-400">
        <button
          onClick={onNext}
          className="group relative inline-flex items-center gap-3 px-8 py-4 rounded-full font-semibold text-base text-black transition-all duration-300 hover:scale-105 active:scale-95 shadow-lg hover:shadow-[#c9a227]/30 focus:outline-none focus:ring-2 focus:ring-[#c9a227]/50"
          style={{
            background: 'linear-gradient(135deg, #c9a227 0%, #e8c96a 50%, #c9a227 100%)',
            backgroundSize: '200% auto',
          }}
        >
          <span>Start Your Walkthrough</span>
          <ChevronRight className="w-5 h-5 transition-transform duration-200 group-hover:translate-x-1" />
        </button>
      </div>

      {/* Footer note */}
      <p className="animate-fade-up delay-500 text-[#444] text-xs mt-6 mb-6 tracking-wide">
        5 quick steps · Takes about 5 minutes
      </p>

      {/* Discovery Mode panel */}
      <DiscoveryPanel onApply={onDiscovery} />
    </div>
  );
}
