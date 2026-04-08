import { useState, useRef } from 'react';
import { Upload, ImageIcon, ChevronRight, ChevronLeft, RefreshCw, AlertCircle, Type } from 'lucide-react';

const DEFAULT_HERO_TEXT = `Welcome to our premier barbershop and salon — where craftsmanship meets style. Our team of experienced professionals is dedicated to delivering exceptional cuts, styles, and grooming services tailored to you. Whether you're here for a classic fade, a fresh trim, or a full beauty treatment, we've got you covered. Walk in, sit back, and leave looking your absolute best.`;

const CHAR_LIMIT = 600;
const TAGLINE_LIMIT = 80;

function wordCount(str) {
  return str.trim() === '' ? 0 : str.trim().split(/\s+/).length;
}

export default function Step2Identity({ onNext, onBack, data, setData }) {
  const [heroDragging, setHeroDragging]   = useState(false);
  const [logoDragging, setLogoDragging]   = useState(false);
  const heroFileRef = useRef();
  const logoFileRef = useRef();

  const handleTextChange = (e) => {
    setData({ ...data, heroText: e.target.value });
  };

  const handleHeroFile = (file) => {
    if (!file || !file.type.startsWith('image/')) return;
    const url = URL.createObjectURL(file);
    setData({ ...data, heroImage: url, heroImageName: file.name });
  };

  const handleLogoFile = (file) => {
    if (!file || !file.type.startsWith('image/')) return;
    const url = URL.createObjectURL(file);
    setData({ ...data, logo: url, logoName: file.name });
  };

  const handleHeroDrop = (e) => {
    e.preventDefault();
    setHeroDragging(false);
    handleHeroFile(e.dataTransfer.files[0]);
  };

  const handleLogoDrop = (e) => {
    e.preventDefault();
    setLogoDragging(false);
    handleLogoFile(e.dataTransfer.files[0]);
  };

  const text      = data.heroText || DEFAULT_HERO_TEXT;
  const charCount = text.length;
  const words     = wordCount(text);
  const tagline   = data.tagline || '';
  const taglineLen = tagline.length;

  const nearLimit  = charCount >= 500;
  const overLimit  = charCount > CHAR_LIMIT;
  const counterColor = overLimit ? 'text-red-400' : nearLimit ? 'text-[#c9a227]' : 'text-[#555]';
  const barColor     = overLimit ? 'bg-red-500'   : nearLimit ? 'bg-[#c9a227]'   : 'bg-[#333]';
  const borderClass  = overLimit
    ? 'border-red-500/60 shadow-[0_0_0_3px_rgba(239,68,68,0.12)]'
    : 'border-[#222] focus-within:border-[#c9a227]/50';

  return (
    <div className="px-5 py-8 max-w-lg mx-auto w-full">
      {/* Section header */}
      <div className="animate-fade-up mb-6">
        <div className="flex items-center gap-2 mb-1">
          <div className="w-5 h-5 rounded-full bg-[#c9a227]/10 border border-[#c9a227]/30 flex items-center justify-center">
            <span className="text-[9px] font-bold text-[#c9a227]">02</span>
          </div>
          <span className="text-[11px] text-[#666] tracking-widest uppercase font-medium">Brand Identity</span>
        </div>
        <h2 className="text-2xl font-bold text-white tracking-tight">Confirm Your Message</h2>
        <p className="text-[#666] text-sm mt-1 leading-relaxed">
          Review the opening statement for your site. Supply your logo, tagline, and brand photo if you have them ready.
        </p>
      </div>

      {/* ── Logo + Tagline row ── */}
      <div className="animate-fade-up delay-100 mb-6">
        <div className="grid grid-cols-[auto_1fr] gap-4 items-start">

          {/* Logo upload — square */}
          <div>
            <label className="block text-xs text-[#888] uppercase tracking-wider font-semibold mb-2">
              Logo
            </label>
            <div
              onDragOver={(e) => { e.preventDefault(); setLogoDragging(true); }}
              onDragLeave={() => setLogoDragging(false)}
              onDrop={handleLogoDrop}
              onClick={() => logoFileRef.current?.click()}
              className={`relative w-[88px] h-[88px] rounded-xl border-2 border-dashed cursor-pointer transition-all duration-200 overflow-hidden flex items-center justify-center ${
                logoDragging
                  ? 'border-[#c9a227] bg-[#c9a227]/8'
                  : data.logo
                  ? 'border-[#c9a227]/40 bg-[#111]'
                  : 'border-[#222] bg-[#0e0e0e] hover:border-[#333] hover:bg-[#111]'
              }`}
            >
              {data.logo ? (
                <>
                  <img
                    src={data.logo}
                    alt="Logo"
                    className="w-full h-full object-contain p-2"
                  />
                  <div className="absolute inset-0 bg-black/60 flex flex-col items-center justify-center opacity-0 hover:opacity-100 transition-opacity gap-1">
                    <Upload className="w-4 h-4 text-white" />
                    <span className="text-[10px] text-white/80 font-medium">Replace</span>
                  </div>
                </>
              ) : (
                <div className="flex flex-col items-center gap-1.5 p-2 text-center">
                  {logoDragging ? (
                    <>
                      <Upload className="w-5 h-5 text-[#c9a227]" />
                      <span className="text-[9px] text-[#c9a227] font-medium leading-tight">Drop here</span>
                    </>
                  ) : (
                    <>
                      <div className="w-8 h-8 rounded-lg border border-[#2a2a2a] bg-[#161616] flex items-center justify-center">
                        <ImageIcon className="w-4 h-4 text-[#444]" />
                      </div>
                      <span className="text-[9px] text-[#555] leading-tight">Upload<br />logo</span>
                    </>
                  )}
                </div>
              )}
            </div>
            <input
              ref={logoFileRef}
              type="file"
              accept="image/*"
              className="hidden"
              onChange={(e) => handleLogoFile(e.target.files[0])}
            />
            {data.logo && (
              <button
                onClick={(e) => { e.stopPropagation(); setData({ ...data, logo: null, logoName: null }); }}
                className="mt-1.5 text-[10px] text-[#444] hover:text-red-400 transition-colors w-full text-center"
              >
                Remove
              </button>
            )}
          </div>

          {/* Tagline */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <label className="text-xs text-[#888] uppercase tracking-wider font-semibold">
                Tagline
              </label>
              <span className={`text-[11px] font-mono tabular-nums transition-colors ${
                taglineLen > TAGLINE_LIMIT ? 'text-red-400' : taglineLen > 60 ? 'text-[#c9a227]' : 'text-[#444]'
              }`}>
                {taglineLen}<span className="text-[#333]">/{TAGLINE_LIMIT}</span>
              </span>
            </div>
            <div className="relative bg-[#0e0e0e] border border-[#222] rounded-xl focus-within:border-[#c9a227]/50 transition-all duration-200">
              <div className="flex items-start gap-2.5 px-3 pt-3 pb-2">
                <Type className="w-3.5 h-3.5 text-[#444] flex-shrink-0 mt-0.5" />
                <textarea
                  value={tagline}
                  onChange={(e) => setData({ ...data, tagline: e.target.value })}
                  rows={3}
                  maxLength={TAGLINE_LIMIT + 10}
                  placeholder={`e.g. "Where Every Cut Tells a Story"`}
                  className="flex-1 bg-transparent text-[#ccc] text-sm leading-relaxed resize-none outline-none placeholder-[#333] min-w-0"
                />
              </div>
              {/* Progress bar */}
              <div className="h-[2px] rounded-b-xl overflow-hidden bg-[#1a1a1a]">
                <div
                  className={`h-full transition-all duration-300 ${
                    taglineLen > TAGLINE_LIMIT ? 'bg-red-500' : taglineLen > 60 ? 'bg-[#c9a227]' : 'bg-[#333]'
                  }`}
                  style={{ width: `${Math.min((taglineLen / TAGLINE_LIMIT) * 100, 100)}%` }}
                />
              </div>
            </div>
            <p className="text-[11px] text-[#444] mt-1.5 leading-relaxed">
              A short phrase that captures your brand. Leave blank if you don't have one yet.
            </p>
          </div>
        </div>
      </div>

      {/* Hero text editor */}
      <div className="animate-fade-up delay-200 mb-6">
        <div className="flex justify-between items-center mb-2">
          <label className="text-xs text-[#888] uppercase tracking-wider font-semibold">Opening Statement</label>
          <div className="flex items-center gap-2">
            <span className="text-[11px] text-[#444] font-mono hidden sm:inline">
              {words} words
            </span>
            <span className="text-[#333]">·</span>
            <div className="flex items-center gap-1">
              {(nearLimit || overLimit) && (
                <AlertCircle className={`w-3.5 h-3.5 flex-shrink-0 ${overLimit ? 'text-red-400' : 'text-[#c9a227]'}`} />
              )}
              <span className={`text-xs font-mono tabular-nums transition-colors duration-200 ${counterColor}`}>
                {charCount}
                <span className="text-[#444]">/{CHAR_LIMIT}</span>
              </span>
            </div>
          </div>
        </div>

        <div className={`relative rounded-xl border transition-all duration-200 ${borderClass} bg-[#0e0e0e]`}>
          <textarea
            value={text}
            onChange={handleTextChange}
            rows={6}
            className="w-full bg-transparent text-[#ccc] text-sm leading-relaxed p-4 pb-5 resize-none outline-none rounded-xl placeholder-[#444]"
            placeholder="Write your hero section copy here..."
          />
          <div className="absolute bottom-0 inset-x-0 h-[3px] rounded-b-xl overflow-hidden bg-[#1a1a1a]">
            <div
              className={`h-full transition-all duration-300 ${barColor}`}
              style={{ width: `${Math.min((charCount / CHAR_LIMIT) * 100, 100)}%` }}
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
          className="mt-2 flex items-center gap-1.5 text-[11px] text-[#555] hover:text-[#c9a227] transition-colors"
        >
          <RefreshCw className="w-3 h-3" />
          Reset to default
        </button>
      </div>

      {/* Hero photo upload */}
      <div className="animate-fade-up delay-300 mb-8">
        <label className="block text-xs text-[#888] uppercase tracking-wider font-semibold mb-2">
          Brand Photo
        </label>

        <div
          onDragOver={(e) => { e.preventDefault(); setHeroDragging(true); }}
          onDragLeave={() => setHeroDragging(false)}
          onDrop={handleHeroDrop}
          onClick={() => heroFileRef.current?.click()}
          className={`relative rounded-xl border-2 border-dashed cursor-pointer transition-all duration-200 overflow-hidden ${
            heroDragging
              ? 'border-[#c9a227] bg-[#c9a227]/5'
              : data.heroImage
              ? 'border-[#c9a227]/40 bg-[#111]'
              : 'border-[#222] bg-[#0e0e0e] hover:border-[#333] hover:bg-[#111]'
          }`}
        >
          {data.heroImage ? (
            <div className="relative aspect-video">
              <img
                src={data.heroImage}
                alt="Hero"
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-black/50 flex flex-col items-center justify-center opacity-0 hover:opacity-100 transition-opacity">
                <Upload className="w-6 h-6 text-white mb-1" />
                <span className="text-white text-xs">Replace image</span>
              </div>
              <div className="absolute bottom-2 left-2 right-2">
                <div className="bg-black/60 backdrop-blur rounded-lg px-3 py-1.5 flex items-center gap-2">
                  <ImageIcon className="w-3 h-3 text-[#c9a227]" />
                  <span className="text-[11px] text-white/80 truncate">{data.heroImageName}</span>
                </div>
              </div>
            </div>
          ) : (
            <div className="aspect-video flex flex-col items-center justify-center gap-3 p-8">
              <div className={`w-14 h-14 rounded-full flex items-center justify-center border-2 transition-all duration-200 ${
                heroDragging ? 'border-[#c9a227] bg-[#c9a227]/10' : 'border-[#2a2a2a] bg-[#161616]'
              }`}>
                <Upload className={`w-6 h-6 transition-colors ${heroDragging ? 'text-[#c9a227]' : 'text-[#444]'}`} />
              </div>
              <div className="text-center">
                <p className="text-[#888] text-sm font-medium">
                  {heroDragging ? 'Drop your image here' : 'Upload hero photo'}
                </p>
                <p className="text-[#444] text-xs mt-0.5">
                  Drag & drop or click to browse · JPG, PNG, WebP
                </p>
              </div>
            </div>
          )}
        </div>

        <input
          ref={heroFileRef}
          type="file"
          accept="image/*"
          className="hidden"
          onChange={(e) => handleHeroFile(e.target.files[0])}
        />

        {!data.heroImage && (
          <p className="text-[11px] text-[#444] mt-2 text-center">
            No photo yet? Our team will source a professional placeholder — you can supply yours before launch.
          </p>
        )}
      </div>

      {/* Navigation */}
      <div className="animate-fade-up delay-400 flex gap-3">
        <button
          onClick={onBack}
          className="flex items-center gap-2 px-5 py-3.5 rounded-full border border-[#222] text-[#666] text-sm font-medium hover:border-[#333] hover:text-[#888] transition-all active:scale-95"
        >
          <ChevronLeft className="w-4 h-4" />
          Back
        </button>
        <button
          onClick={onNext}
          disabled={overLimit}
          title={overLimit ? 'Trim your copy to under 600 characters to continue' : undefined}
          className={`flex-1 flex items-center justify-center gap-2 px-6 py-3.5 rounded-full text-black font-semibold text-sm transition-all duration-200 shadow-md ${
            overLimit
              ? 'opacity-40 cursor-not-allowed bg-[#444]'
              : 'hover:scale-[1.02] active:scale-95 hover:shadow-[#c9a227]/20'
          }`}
          style={overLimit ? {} : { background: 'linear-gradient(135deg, #c9a227 0%, #e8c96a 60%, #c9a227 100%)' }}
        >
          Continue
          <ChevronRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}
