import { useState } from 'react';
import { ChevronRight, ChevronLeft, Palette, Wand2, Link as LinkIcon, FileText, X } from 'lucide-react';

const COLOR_PRESETS = {
  primary:   ['#c9a227','#1a1a2e','#2d6a4f','#c1121f','#023e8a','#6d2b8e'],
  secondary: ['#152232','#f5f0e8','#1b4332','#f8edeb','#03045e','#f3e5f5'],
  accent:    ['#e8705a','#f4a261','#52b788','#e63946','#4361ee','#b5179e'],
};

function ColorPicker({ label, colorKey, value, onChange }) {
  const [hex, setHex] = useState(value);
  const [inputVal, setInputVal] = useState(value);

  const commit = (val) => {
    const clean = val.startsWith('#') ? val : `#${val}`;
    if (/^#[0-9a-fA-F]{6}$/.test(clean)) {
      setHex(clean);
      setInputVal(clean);
      onChange(clean);
    }
  };

  const handleNative = (e) => {
    setHex(e.target.value);
    setInputVal(e.target.value);
    onChange(e.target.value);
  };

  return (
    <div className="rounded-2xl border overflow-hidden" style={{ borderColor: 'var(--border)', background: 'var(--bg-card)' }}>
      {/* Swatch header */}
      <div className="h-16 w-full relative" style={{ background: hex }}>
        {/* Native colour input covers the swatch for easy picking */}
        <input
          type="color"
          value={hex}
          onChange={handleNative}
          className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
          title="Pick a colour"
        />
        <div className="absolute bottom-2 right-2 px-2 py-0.5 rounded text-[10px] font-mono font-bold"
          style={{ background: 'rgba(0,0,0,0.4)', color: '#fff', backdropFilter: 'blur(4px)' }}>
          {hex.toUpperCase()}
        </div>
      </div>

      <div className="p-3">
        <p className="text-[10px] uppercase tracking-widest font-semibold mb-2.5" style={{ color: 'var(--text-muted)' }}>{label}</p>

        {/* Preset swatches */}
        <div className="flex gap-1.5 mb-2.5">
          {COLOR_PRESETS[colorKey].map((preset) => (
            <button
              key={preset}
              onClick={() => { setHex(preset); setInputVal(preset); onChange(preset); }}
              className="w-6 h-6 rounded-full border-2 transition-transform hover:scale-110 active:scale-95 flex-shrink-0"
              style={{
                background: preset,
                borderColor: hex === preset ? '#fff' : 'transparent',
                boxShadow: hex === preset ? `0 0 0 2px ${preset}` : 'none',
              }}
              title={preset}
            />
          ))}
        </div>

        {/* Hex text input */}
        <div className="flex items-center gap-2 rounded-lg border px-2.5 py-1.5" style={{ background: 'var(--bg-surface)', borderColor: 'var(--border)' }}>
          <div className="w-3.5 h-3.5 rounded-full flex-shrink-0 border" style={{ background: hex, borderColor: 'var(--border)' }} />
          <input
            type="text"
            value={inputVal}
            onChange={(e) => setInputVal(e.target.value)}
            onBlur={() => commit(inputVal)}
            onKeyDown={(e) => e.key === 'Enter' && commit(inputVal)}
            maxLength={7}
            placeholder="#000000"
            className="flex-1 bg-transparent text-xs font-mono outline-none"
            style={{ color: 'var(--text-primary)' }}
          />
        </div>
      </div>
    </div>
  );
}

export default function Step3Design({ onNext, onBack, data, setData }) {
  const colors       = data.brandColors  || { primary: '#c9a227', secondary: '#152232', accent: '#e8705a' };
  const customDesign = data.customDesign || { enabled: false, urls: ['', '', ''], vibeNotes: '' };

  const setColor = (key, val) =>
    setData({ ...data, brandColors: { ...colors, [key]: val } });

  const setCustom = (patch) =>
    setData({ ...data, customDesign: { ...customDesign, ...patch } });

  const updateUrl = (i, val) => {
    const urls = [...(customDesign.urls || ['', '', ''])];
    urls[i] = val;
    setCustom({ urls });
  };

  return (
    <div className="px-5 py-8 max-w-lg mx-auto w-full">

      {/* Header */}
      <div className="animate-fade-up mb-6">
        <p className="text-[11px] tracking-[0.2em] uppercase font-semibold mb-2" style={{ color: 'var(--coral)' }}>
          — Step 03 —
        </p>
        <h2 className="font-serif-display text-2xl font-bold tracking-tight" style={{ color: 'var(--text-primary)' }}>
          Design Preferences
        </h2>
        <div className="flex items-center gap-3 my-3">
          <div className="h-px w-8" style={{ background: 'var(--gold)' }} />
          <div className="w-1 h-1 rounded-full" style={{ background: 'var(--gold)' }} />
          <div className="h-px w-8" style={{ background: 'var(--gold)' }} />
        </div>
        <p className="text-sm leading-relaxed" style={{ color: 'var(--text-secondary)' }}>
          Choose your brand colours and let us know if you'd like a fully custom build.
        </p>
      </div>

      {/* Brand Colours */}
      <div className="animate-fade-up delay-100 mb-7">
        <div className="flex items-center gap-2 mb-4">
          <Palette className="w-3.5 h-3.5" style={{ color: 'var(--gold)' }} />
          <p className="text-xs uppercase tracking-wider font-semibold" style={{ color: 'var(--text-muted)' }}>Brand Colours</p>
        </div>
        <div className="grid grid-cols-3 gap-3">
          <ColorPicker label="Primary"   colorKey="primary"   value={colors.primary}   onChange={(v) => setColor('primary', v)} />
          <ColorPicker label="Secondary" colorKey="secondary" value={colors.secondary} onChange={(v) => setColor('secondary', v)} />
          <ColorPicker label="Accent"    colorKey="accent"    value={colors.accent}    onChange={(v) => setColor('accent', v)} />
        </div>
        {/* Live preview strip */}
        <div className="mt-4 rounded-xl overflow-hidden h-10 flex" style={{ border: '1px solid var(--border)' }}>
          {[colors.primary, colors.secondary, colors.accent].map((c, i) => (
            <div key={i} className="flex-1 flex items-center justify-center text-[9px] font-mono font-bold"
              style={{ background: c, color: '#fff', textShadow: '0 1px 2px rgba(0,0,0,0.5)' }}>
              {c.toUpperCase()}
            </div>
          ))}
        </div>
      </div>

      {/* Custom Design Upgrade */}
      <div className="animate-fade-up delay-200 mb-8">
        <div className="rounded-2xl border overflow-hidden" style={{ borderColor: 'var(--border)', background: 'var(--bg-card)' }}>
          {/* Toggle row */}
          <div className="flex items-center justify-between px-4 py-4 border-b" style={{ borderColor: 'var(--border-sub)', background: 'var(--bg-raised)' }}>
            <div className="flex items-start gap-3">
              <Wand2 className="w-4 h-4 flex-shrink-0 mt-0.5" style={{ color: customDesign.enabled ? 'var(--gold)' : 'var(--text-muted)' }} />
              <div>
                <p className="text-sm font-semibold leading-tight" style={{ color: 'var(--text-primary)' }}>
                  I want a fully custom build
                </p>
                <p className="text-[11px] mt-0.5 leading-relaxed" style={{ color: 'var(--text-secondary)' }}>
                  Share inspiration links and notes — our team will create a bespoke design from scratch.
                </p>
              </div>
            </div>
            <button
              type="button"
              onClick={() => setCustom({ enabled: !customDesign.enabled })}
              className="relative rounded-full transition-all duration-200 flex-shrink-0 ml-3"
              style={{ background: customDesign.enabled ? 'var(--gold)' : 'var(--border)', width: '40px', height: '22px' }}
            >
              <span className="absolute top-[3px] w-4 h-4 rounded-full bg-white shadow transition-all duration-200"
                style={{ left: customDesign.enabled ? '20px' : '3px' }} />
            </button>
          </div>

          {/* Expanded fields */}
          {customDesign.enabled && (
            <div className="p-4 flex flex-col gap-4 animate-fade-up">
              {/* Inspiration URLs */}
              <div>
                <p className="text-[10px] uppercase tracking-widest font-semibold mb-2.5" style={{ color: 'var(--text-muted)' }}>
                  Inspiration Links (up to 3)
                </p>
                <div className="flex flex-col gap-2">
                  {[0, 1, 2].map((i) => (
                    <div key={i} className="flex items-center gap-2.5 rounded-xl border px-3.5 py-2.5"
                      style={{ background: 'var(--bg-surface)', borderColor: 'var(--border)' }}>
                      <LinkIcon className="w-3.5 h-3.5 flex-shrink-0" style={{ color: 'var(--text-faint)' }} />
                      <input
                        type="url"
                        value={(customDesign.urls || ['', '', ''])[i] || ''}
                        onChange={(e) => updateUrl(i, e.target.value)}
                        placeholder={`https://example.com (link ${i + 1})`}
                        className="flex-1 bg-transparent text-sm outline-none"
                        style={{ color: 'var(--text-primary)' }}
                      />
                      {(customDesign.urls || [])[i] && (
                        <button onClick={() => updateUrl(i, '')} className="flex-shrink-0" style={{ color: 'var(--text-faint)' }}>
                          <X className="w-3 h-3" />
                        </button>
                      )}
                    </div>
                  ))}
                </div>
              </div>

              {/* Vibe Notes */}
              <div>
                <div className="flex items-center justify-between mb-2">
                  <p className="text-[10px] uppercase tracking-widest font-semibold" style={{ color: 'var(--text-muted)' }}>
                    Vibe Notes
                  </p>
                  <span className="text-[11px] font-mono tabular-nums"
                    style={{ color: (customDesign.vibeNotes || '').length > 450 ? '#f87171' : 'var(--text-faint)' }}>
                    {(customDesign.vibeNotes || '').length}<span style={{ color: 'var(--border)' }}>/500</span>
                  </span>
                </div>
                <div className="rounded-xl border" style={{ background: 'var(--bg-surface)', borderColor: 'var(--border)' }}>
                  <div className="flex items-start gap-2.5 p-3">
                    <FileText className="w-3.5 h-3.5 flex-shrink-0 mt-0.5" style={{ color: 'var(--text-faint)' }} />
                    <textarea
                      value={customDesign.vibeNotes || ''}
                      onChange={(e) => setCustom({ vibeNotes: e.target.value })}
                      rows={4}
                      maxLength={520}
                      placeholder={`Describe the feel you're going for — luxurious, minimal, bold, retro... anything that captures your vision.`}
                      className="flex-1 bg-transparent text-sm leading-relaxed resize-none outline-none"
                      style={{ color: 'var(--text-primary)' }}
                    />
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Navigation */}
      <div className="animate-fade-up delay-300 flex gap-3">
        <button onClick={onBack}
          className="flex items-center gap-2 px-5 py-3.5 rounded-full border text-sm font-medium transition-all active:scale-95"
          style={{ borderColor: 'var(--border)', color: 'var(--text-muted)' }}>
          <ChevronLeft className="w-4 h-4" /> Back
        </button>
        <button onClick={onNext}
          className="flex-1 flex items-center justify-center gap-2 px-6 py-3.5 rounded-full font-bold text-sm uppercase tracking-wider text-white transition-all duration-200 hover:scale-[1.02] active:scale-95"
          style={{ background: 'var(--coral)', boxShadow: '0 4px 16px rgba(232,112,90,0.3)' }}
          onMouseEnter={(e) => { e.currentTarget.style.background = 'var(--coral-light)'; }}
          onMouseLeave={(e) => { e.currentTarget.style.background = 'var(--coral)'; }}>
          Continue <ChevronRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}
