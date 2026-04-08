import { useState, useRef } from 'react';
import { Upload, ImageIcon, ChevronRight, ChevronLeft, RefreshCw, AlertCircle } from 'lucide-react';

const DEFAULT_HERO_TEXT = `Welcome to our premier barbershop and salon — where craftsmanship meets style. Our team of experienced professionals is dedicated to delivering exceptional cuts, styles, and grooming services tailored to you. Whether you're here for a classic fade, a fresh trim, or a full beauty treatment, we've got you covered. Walk in, sit back, and leave looking your absolute best.`;

const CHAR_LIMIT = 600;

function wordCount(str) {
  return str.trim() === '' ? 0 : str.trim().split(/\s+/).length;
}

export default function Step2Identity({ onNext, onBack, data, setData }) {
  const [dragging, setDragging] = useState(false);
  const fileRef = useRef();

  const handleTextChange = (e) => {
    // Allow typing freely — validation is handled via disabled state
    setData({ ...data, heroText: e.target.value });
  };

  const handleFile = (file) => {
    if (!file || !file.type.startsWith('image/')) return;
    const url = URL.createObjectURL(file);
    setData({ ...data, heroImage: url, heroImageName: file.name });
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setDragging(false);
    handleFile(e.dataTransfer.files[0]);
  };

  const text = data.heroText || DEFAULT_HERO_TEXT;
  const charCount = text.length;
  const words = wordCount(text);

  const nearLimit = charCount >= 500;
  const overLimit = charCount > CHAR_LIMIT;
  // Colour ramp: neutral → gold warning → red over limit
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
          <span className="text-[11px] text-[#666] tracking-widest uppercase font-medium">The Identity</span>
        </div>
        <h2 className="text-2xl font-bold text-white tracking-tight">Your Hero Section</h2>
        <p className="text-[#666] text-sm mt-1 leading-relaxed">
          This is the first thing visitors read. Edit it to reflect your brand voice.
        </p>
      </div>

      {/* Hero text editor */}
      <div className="animate-fade-up delay-100 mb-6">
        <div className="flex justify-between items-center mb-2">
          <label className="text-xs text-[#888] uppercase tracking-wider font-semibold">Hero Copy</label>
          <div className="flex items-center gap-2">
            {/* Word count (secondary) */}
            <span className="text-[11px] text-[#444] font-mono hidden sm:inline">
              {words} words
            </span>
            <span className="text-[#333]">·</span>
            {/* Character counter (primary) */}
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
          {/* Progress bar */}
          <div className="absolute bottom-0 inset-x-0 h-[3px] rounded-b-xl overflow-hidden bg-[#1a1a1a]">
            <div
              className={`h-full transition-all duration-300 ${barColor}`}
              style={{ width: `${Math.min((charCount / CHAR_LIMIT) * 100, 100)}%` }}
            />
          </div>
        </div>

        {/* Over-limit warning message */}
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

      {/* Image upload */}
      <div className="animate-fade-up delay-200 mb-8">
        <label className="block text-xs text-[#888] uppercase tracking-wider font-semibold mb-2">
          Hero Photo
        </label>

        <div
          onDragOver={(e) => { e.preventDefault(); setDragging(true); }}
          onDragLeave={() => setDragging(false)}
          onDrop={handleDrop}
          onClick={() => fileRef.current?.click()}
          className={`relative rounded-xl border-2 border-dashed cursor-pointer transition-all duration-200 overflow-hidden ${
            dragging
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
                dragging ? 'border-[#c9a227] bg-[#c9a227]/10' : 'border-[#2a2a2a] bg-[#161616]'
              }`}>
                <Upload className={`w-6 h-6 transition-colors ${dragging ? 'text-[#c9a227]' : 'text-[#444]'}`} />
              </div>
              <div className="text-center">
                <p className="text-[#888] text-sm font-medium">
                  {dragging ? 'Drop your image here' : 'Upload hero photo'}
                </p>
                <p className="text-[#444] text-xs mt-0.5">
                  Drag & drop or click to browse · JPG, PNG, WebP
                </p>
              </div>
            </div>
          )}
        </div>

        <input
          ref={fileRef}
          type="file"
          accept="image/*"
          className="hidden"
          onChange={(e) => handleFile(e.target.files[0])}
        />

        {!data.heroImage && (
          <p className="text-[11px] text-[#444] mt-2 text-center">
            Don't have one yet? We'll use a stock photo for now — you can update it later.
          </p>
        )}
      </div>

      {/* Navigation */}
      <div className="animate-fade-up delay-300 flex gap-3">
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
