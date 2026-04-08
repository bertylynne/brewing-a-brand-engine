import { useState, useRef } from 'react';
import { Upload, ImageIcon, ChevronRight, ChevronLeft, RefreshCw, AlertCircle, Type } from 'lucide-react';

const DEFAULT_HERO_TEXT = `Welcome to our premier barbershop and salon — where craftsmanship meets style. Our team of experienced professionals is dedicated to delivering exceptional cuts, styles, and grooming services tailored to you. Whether you're here for a classic fade, a fresh trim, or a full beauty treatment, we've got you covered. Walk in, sit back, and leave looking your absolute best.`;

const CHAR_LIMIT = 600;
const TAGLINE_LIMIT = 80;

function wordCount(str) {
  return str.trim() === '' ? 0 : str.trim().split(/\s+/).length;
}

export default function Step2Identity({ onNext, onBack, data, setData }) {
  const [heroDragging, setHeroDragging] = useState(false);
  const [logoDragging, setLogoDragging] = useState(false);
  const heroFileRef = useRef();
  const logoFileRef = useRef();

  const handleTextChange = (e) => setData({ ...data, heroText: e.target.value });

  const handleHeroFile = (file) => {
    if (!file || !file.type.startsWith('image/')) return;
    setData({ ...data, heroImage: URL.createObjectURL(file), heroImageName: file.name });
  };

  const handleLogoFile = (file) => {
    if (!file || !file.type.startsWith('image/')) return;
    setData({ ...data, logo: URL.createObjectURL(file), logoName: file.name });
  };

  const text       = data.heroText || DEFAULT_HERO_TEXT;
  const charCount  = text.length;
  const words      = wordCount(text);
  const tagline    = data.tagline || '';
  const taglineLen = tagline.length;

  const nearLimit = charCount >= 500;
  const overLimit = charCount > CHAR_LIMIT;

  const textareaBorder = overLimit
    ? '2px solid rgba(239,68,68,0.6)'
    : 'none';

  return (
    <div className="px-5 py-8 max-w-lg mx-auto w-full">
      {/* Header */}
      <div className="animate-fade-up mb-6">
        <p className="text-[11px] tracking-[0.2em] uppercase font-semibold mb-2" style={{ color: 'var(--coral)' }}>
          — Step 02 —
        </p>
        <h2 className="font-serif-display text-2xl font-bold tracking-tight" style={{ color: 'var(--text-primary)' }}>
          Brand Identity
        </h2>
        <div className="flex items-center gap-3 my-3">
          <div className="h-px w-8" style={{ background: 'var(--gold)' }} />
          <div className="w-1 h-1 rounded-full" style={{ background: 'var(--gold)' }} />
          <div className="h-px w-8" style={{ background: 'var(--gold)' }} />
        </div>
        <p className="text-sm leading-relaxed" style={{ color: 'var(--text-secondary)' }}>
          Review the opening statement for your site. Supply your logo, tagline, and brand photo if you have them ready.
        </p>
      </div>

      {/* Opening Statement */}
      <div className="animate-fade-up delay-100 mb-6">
        <div className="flex justify-between items-center mb-2">
          <label className="text-xs uppercase tracking-wider font-semibold" style={{ color: 'var(--text-muted)' }}>
            Opening Statement
          </label>
          <div className="flex items-center gap-2">
            <span className="text-[11px] font-mono hidden sm:inline" style={{ color: 'var(--text-faint)' }}>
              {words} words
            </span>
            <span style={{ color: 'var(--border)' }}>·</span>
            <div className="flex items-center gap-1">
              {(nearLimit || overLimit) && (
                <AlertCircle className={`w-3.5 h-3.5 flex-shrink-0 ${overLimit ? 'text-red-400' : ''}`}
                  style={overLimit ? {} : { color: 'var(--gold)' }} />
              )}
              <span
                className="text-xs font-mono tabular-nums transition-colors duration-200"
                style={{ color: overLimit ? '#f87171' : nearLimit ? 'var(--gold)' : 'var(--text-faint)' }}
              >
                {charCount}
                <span style={{ color: 'var(--border)' }}>/{CHAR_LIMIT}</span>
              </span>
            </div>
          </div>
        </div>

        <div
          className="relative rounded-xl transition-all duration-200"
          style={{ background: 'var(--bg-raised)', border: overLimit ? textareaBorder : `1px solid var(--border)` }}
        >
          <textarea
            value={text}
            onChange={handleTextChange}
            rows={6}
            className="w-full bg-transparent text-sm leading-relaxed p-4 pb-5 resize-none outline-none rounded-xl"
            style={{ color: 'var(--text-primary)', '::placeholder': { color: 'var(--text-faint)' } }}
            placeholder="Write your hero section copy here..."
          />
          <div className="absolute bottom-0 inset-x-0 h-[3px] rounded-b-xl overflow-hidden" style={{ background: 'var(--bg-surface)' }}>
            <div
              className="h-full transition-all duration-300"
              style={{
                width: `${Math.min((charCount / CHAR_LIMIT) * 100, 100)}%`,
                background: overLimit ? '#ef4444' : nearLimit ? 'var(--gold)' : 'var(--border)',
              }}
            />
          </div>
        </div>

        {overLimit && (
          <p className="mt-2 text-xs text-red-400 flex items-center gap-1.5 animate-fade-up">
            <AlertCircle className="w-3.5 h-3.5 flex-shrink-0" />
            {charCount - CHAR_LIMIT} character{charCount - CHAR_LIMIT !== 1 ? 's' : ''} over the limit — trim your copy to continue.
          </p>
        )}

        <button
          onClick={() => setData({ ...data, heroText: DEFAULT_HERO_TEXT })}
          className="mt-2 flex items-center gap-1.5 text-[11px] transition-colors"
          style={{ color: 'var(--text-faint)' }}
          onMouseEnter={(e) => { e.currentTarget.style.color = 'var(--gold)'; }}
          onMouseLeave={(e) => { e.currentTarget.style.color = 'var(--text-faint)'; }}
        >
          <RefreshCw className="w-3 h-3" />
          Reset to default
        </button>
      </div>

      {/* Logo + Tagline */}
      <div className="animate-fade-up delay-200 mb-6">
        <div className="grid grid-cols-[auto_1fr] gap-4 items-start">

          {/* Logo upload */}
          <div>
            <label className="block text-xs uppercase tracking-wider font-semibold mb-2" style={{ color: 'var(--text-muted)' }}>
              Logo
            </label>
            <div
              onDragOver={(e) => { e.preventDefault(); setLogoDragging(true); }}
              onDragLeave={() => setLogoDragging(false)}
              onDrop={(e) => { e.preventDefault(); setLogoDragging(false); handleLogoFile(e.dataTransfer.files[0]); }}
              onClick={() => logoFileRef.current?.click()}
              className="relative w-[88px] h-[88px] rounded-xl border-2 border-dashed cursor-pointer transition-all duration-200 overflow-hidden flex items-center justify-center"
              style={
                logoDragging
                  ? { borderColor: 'var(--gold)', background: 'rgba(201,162,39,0.08)' }
                  : data.logo
                  ? { borderColor: 'rgba(201,162,39,0.4)', background: 'var(--bg-raised)' }
                  : { borderColor: 'var(--border)', background: 'var(--bg-raised)' }
              }
            >
              {data.logo ? (
                <>
                  <img src={data.logo} alt="Logo" className="w-full h-full object-contain p-2" />
                  <div className="absolute inset-0 bg-black/60 flex flex-col items-center justify-center opacity-0 hover:opacity-100 transition-opacity gap-1">
                    <Upload className="w-4 h-4 text-white" />
                    <span className="text-[10px] text-white/80 font-medium">Replace</span>
                  </div>
                </>
              ) : (
                <div className="flex flex-col items-center gap-1.5 p-2 text-center">
                  {logoDragging ? (
                    <>
                      <Upload className="w-5 h-5" style={{ color: 'var(--gold)' }} />
                      <span className="text-[9px] font-medium leading-tight" style={{ color: 'var(--gold)' }}>Drop here</span>
                    </>
                  ) : (
                    <>
                      <div className="w-8 h-8 rounded-lg border flex items-center justify-center" style={{ borderColor: 'var(--border)', background: 'var(--bg-surface)' }}>
                        <ImageIcon className="w-4 h-4" style={{ color: 'var(--text-faint)' }} />
                      </div>
                      <span className="text-[9px] leading-tight" style={{ color: 'var(--text-faint)' }}>Upload<br />logo</span>
                    </>
                  )}
                </div>
              )}
            </div>
            <input ref={logoFileRef} type="file" accept="image/*" className="hidden" onChange={(e) => handleLogoFile(e.target.files[0])} />
            {data.logo && (
              <button
                onClick={(e) => { e.stopPropagation(); setData({ ...data, logo: null, logoName: null }); }}
                className="mt-1.5 text-[10px] transition-colors w-full text-center"
                style={{ color: 'var(--text-faint)' }}
                onMouseEnter={(e) => { e.currentTarget.style.color = '#f87171'; }}
                onMouseLeave={(e) => { e.currentTarget.style.color = 'var(--text-faint)'; }}
              >
                Remove
              </button>
            )}
          </div>

          {/* Tagline */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <label className="text-xs uppercase tracking-wider font-semibold" style={{ color: 'var(--text-muted)' }}>
                Tagline
              </label>
              <span
                className="text-[11px] font-mono tabular-nums transition-colors"
                style={{ color: taglineLen > TAGLINE_LIMIT ? '#f87171' : taglineLen > 60 ? 'var(--gold)' : 'var(--text-faint)' }}
              >
                {taglineLen}<span style={{ color: 'var(--border)' }}>/{TAGLINE_LIMIT}</span>
              </span>
            </div>
            <div
              className="relative rounded-xl transition-all duration-200"
              style={{ background: 'var(--bg-raised)', border: `1px solid var(--border)` }}
            >
              <div className="flex items-start gap-2.5 px-3 pt-3 pb-2">
                <Type className="w-3.5 h-3.5 flex-shrink-0 mt-0.5" style={{ color: 'var(--text-faint)' }} />
                <textarea
                  value={tagline}
                  onChange={(e) => setData({ ...data, tagline: e.target.value })}
                  rows={3}
                  maxLength={TAGLINE_LIMIT + 10}
                  placeholder={`e.g. "Where Every Cut Tells a Story"`}
                  className="flex-1 bg-transparent text-sm leading-relaxed resize-none outline-none min-w-0"
                  style={{ color: 'var(--text-primary)' }}
                />
              </div>
              <div className="h-[2px] rounded-b-xl overflow-hidden" style={{ background: 'var(--bg-surface)' }}>
                <div
                  className="h-full transition-all duration-300"
                  style={{
                    width: `${Math.min((taglineLen / TAGLINE_LIMIT) * 100, 100)}%`,
                    background: taglineLen > TAGLINE_LIMIT ? '#ef4444' : taglineLen > 60 ? 'var(--gold)' : 'var(--border)',
                  }}
                />
              </div>
            </div>
            <p className="text-[11px] mt-1.5 leading-relaxed" style={{ color: 'var(--text-faint)' }}>
              A short phrase that captures your brand. Leave blank if you don't have one yet.
            </p>
          </div>
        </div>
      </div>

      {/* Brand Photo */}
      <div className="animate-fade-up delay-300 mb-8">
        <label className="block text-xs uppercase tracking-wider font-semibold mb-2" style={{ color: 'var(--text-muted)' }}>
          Brand Photo
        </label>

        <div
          onDragOver={(e) => { e.preventDefault(); setHeroDragging(true); }}
          onDragLeave={() => setHeroDragging(false)}
          onDrop={(e) => { e.preventDefault(); setHeroDragging(false); handleHeroFile(e.dataTransfer.files[0]); }}
          onClick={() => heroFileRef.current?.click()}
          className="relative rounded-xl border-2 border-dashed cursor-pointer transition-all duration-200 overflow-hidden"
          style={
            heroDragging
              ? { borderColor: 'var(--gold)', background: 'rgba(201,162,39,0.05)' }
              : data.heroImage
              ? { borderColor: 'rgba(201,162,39,0.4)', background: 'var(--bg-raised)' }
              : { borderColor: 'var(--border)', background: 'var(--bg-raised)' }
          }
        >
          {data.heroImage ? (
            <div className="relative aspect-video">
              <img src={data.heroImage} alt="Hero" className="w-full h-full object-cover" />
              <div className="absolute inset-0 bg-black/50 flex flex-col items-center justify-center opacity-0 hover:opacity-100 transition-opacity">
                <Upload className="w-6 h-6 text-white mb-1" />
                <span className="text-white text-xs">Replace image</span>
              </div>
              <div className="absolute bottom-2 left-2 right-2">
                <div className="bg-black/60 backdrop-blur rounded-lg px-3 py-1.5 flex items-center gap-2">
                  <ImageIcon className="w-3 h-3" style={{ color: 'var(--gold)' }} />
                  <span className="text-[11px] text-white/80 truncate">{data.heroImageName}</span>
                </div>
              </div>
            </div>
          ) : (
            <div className="aspect-video flex flex-col items-center justify-center gap-3 p-8">
              <div
                className="w-14 h-14 rounded-full flex items-center justify-center border-2 transition-all duration-200"
                style={
                  heroDragging
                    ? { borderColor: 'var(--gold)', background: 'rgba(201,162,39,0.1)' }
                    : { borderColor: 'var(--border)', background: 'var(--bg-surface)' }
                }
              >
                <Upload className="w-6 h-6 transition-colors" style={{ color: heroDragging ? 'var(--gold)' : 'var(--text-faint)' }} />
              </div>
              <div className="text-center">
                <p className="text-sm font-medium" style={{ color: 'var(--text-secondary)' }}>
                  {heroDragging ? 'Drop your image here' : 'Upload hero photo'}
                </p>
                <p className="text-xs mt-0.5" style={{ color: 'var(--text-faint)' }}>
                  Drag & drop or click to browse · JPG, PNG, WebP
                </p>
              </div>
            </div>
          )}
        </div>

        <input ref={heroFileRef} type="file" accept="image/*" className="hidden" onChange={(e) => handleHeroFile(e.target.files[0])} />

        {!data.heroImage && (
          <p className="text-[11px] mt-2 text-center" style={{ color: 'var(--text-faint)' }}>
            No photo yet? Our team will source a professional placeholder — you can supply yours before launch.
          </p>
        )}
      </div>

      {/* Navigation */}
      <div className="animate-fade-up delay-400 flex gap-3">
        <button
          onClick={onBack}
          className="flex items-center gap-2 px-5 py-3.5 rounded-full border text-sm font-medium transition-all active:scale-95"
          style={{ borderColor: 'var(--border)', color: 'var(--text-muted)' }}
        >
          <ChevronLeft className="w-4 h-4" />
          Back
        </button>
        <button
          onClick={onNext}
          disabled={overLimit}
          title={overLimit ? 'Trim your copy to under 600 characters to continue' : undefined}
          className="flex-1 flex items-center justify-center gap-2 px-6 py-3.5 rounded-full font-bold text-sm uppercase tracking-wider text-white transition-all duration-200 active:scale-95"
          style={
            overLimit
              ? { background: 'var(--bg-raised)', color: 'var(--text-faint)', cursor: 'not-allowed' }
              : { background: 'var(--coral)', boxShadow: '0 4px 16px rgba(232,112,90,0.3)' }
          }
          onMouseEnter={(e) => { if (!overLimit) e.currentTarget.style.background = 'var(--coral-light)'; }}
          onMouseLeave={(e) => { if (!overLimit) e.currentTarget.style.background = 'var(--coral)'; }}
        >
          Continue
          <ChevronRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}
