import { useState, useRef } from 'react';
import { Upload, ImageIcon, ChevronRight, ChevronLeft, RefreshCw, AlertCircle } from 'lucide-react';

const DEFAULT_HERO_TEXT = `Welcome to our premier barbershop and salon — where craftsmanship meets style. Our team of experienced professionals is dedicated to delivering exceptional cuts, styles, and grooming services tailored to you. Whether you're here for a classic fade, a fresh trim, or a full beauty treatment, we've got you covered. Walk in, sit back, and leave looking your absolute best.`;

function wordCount(str) {
  return str.trim() === '' ? 0 : str.trim().split(/\s+/).length;
}

export default function Step2Identity({ onNext, onBack, data, setData }) {
  const [dragging, setDragging] = useState(false);
  const fileRef = useRef();

  const handleTextChange = (e) => {
    const val = e.target.value;
    if (wordCount(val) <= 120) {
      setData({ ...data, heroText: val });
    }
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

  const words = wordCount(data.heroText || '');
  const nearLimit = words >= 100;
  const atLimit = words >= 120;

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
          <div className="flex items-center gap-1.5">
            {nearLimit && (
              <AlertCircle className={`w-3.5 h-3.5 ${atLimit ? 'text-red-400' : 'text-[#c9a227]'}`} />
            )}
            <span className={`text-xs font-mono transition-colors ${atLimit ? 'text-red-400' : nearLimit ? 'text-[#c9a227]' : 'text-[#555]'}`}>
              {words}/120 words
            </span>
          </div>
        </div>

        <div className={`relative rounded-xl border transition-all duration-200 ${
          atLimit ? 'border-red-500/40' : 'border-[#222] focus-within:border-[#c9a227]/50'
        } bg-[#0e0e0e]`}>
          <textarea
            value={data.heroText || DEFAULT_HERO_TEXT}
            onChange={handleTextChange}
            rows={6}
            className="w-full bg-transparent text-[#ccc] text-sm leading-relaxed p-4 resize-none outline-none rounded-xl placeholder-[#444]"
            placeholder="Write your hero section copy here..."
          />
          {/* Word count bar */}
          <div className="absolute bottom-0 inset-x-0 h-[2px] rounded-b-xl overflow-hidden">
            <div
              className={`h-full transition-all duration-300 ${atLimit ? 'bg-red-500' : nearLimit ? 'bg-[#c9a227]' : 'bg-[#333]'}`}
              style={{ width: `${Math.min((words / 120) * 100, 100)}%` }}
            />
          </div>
        </div>

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
          className="flex-1 flex items-center justify-center gap-2 px-6 py-3.5 rounded-full text-black font-semibold text-sm transition-all duration-200 hover:scale-[1.02] active:scale-95 shadow-md hover:shadow-[#c9a227]/20"
          style={{ background: 'linear-gradient(135deg, #c9a227 0%, #e8c96a 60%, #c9a227 100%)' }}
        >
          Continue
          <ChevronRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}
