import { useState } from 'react';
import { Database, ChevronDown, ChevronUp, Zap, CheckCircle2, AlertTriangle, Copy, RotateCcw } from 'lucide-react';

const EXAMPLE_JSON = `{
  "businessName": "Pops Barbershop",
  "type": "barbershop",
  "address": "123 Atlantic Ave, Brooklyn, NY 11201",
  "phone": "(718) 555-0182",
  "rating": 4.9,
  "reviewCount": 312
}`;

const FIELD_MAP = [
  { key: 'businessName', label: 'Business Name', fills: 'Hero text & identity' },
  { key: 'type',         label: 'Type',          fills: 'Auto-selects Barbershop / Salon' },
  { key: 'address',      label: 'Address',        fills: 'Shown on review screen' },
  { key: 'phone',        label: 'Phone',          fills: 'Shown on review screen' },
  { key: 'rating',       label: 'Rating',         fills: 'Shown on review screen' },
  { key: 'reviewCount',  label: 'Review count',   fills: 'Shown on review screen' },
];

export default function DiscoveryPanel({ onApply }) {
  const [open, setOpen]       = useState(false);
  const [raw, setRaw]         = useState('');
  const [error, setError]     = useState(null);
  const [applied, setApplied] = useState(false);
  const [parsed, setParsed]   = useState(null);

  const validate = (json) => {
    const allowed = new Set(['businessName', 'type', 'address', 'phone', 'rating', 'reviewCount']);
    const type = (json.type || '').toLowerCase();
    if (json.type && type !== 'barbershop' && type !== 'salon') {
      return '"type" must be "barbershop" or "salon"';
    }
    return null;
  };

  const handleParse = () => {
    setError(null);
    try {
      const obj = JSON.parse(raw.trim());
      const err = validate(obj);
      if (err) { setError(err); return; }
      setParsed(obj);
      setError(null);
    } catch {
      setError('Invalid JSON — check for missing brackets, quotes, or commas.');
    }
  };

  const handleApply = () => {
    if (!parsed) return;
    onApply(parsed);
    setApplied(true);
    setTimeout(() => setOpen(false), 900);
  };

  const handleReset = () => {
    setRaw('');
    setParsed(null);
    setError(null);
    setApplied(false);
  };

  const pasteExample = () => {
    setRaw(EXAMPLE_JSON);
    setParsed(null);
    setError(null);
    setApplied(false);
  };

  return (
    <div className="w-full max-w-md animate-fade-up delay-500">
      {/* Toggle button */}
      <button
        onClick={() => setOpen((o) => !o)}
        className={`w-full flex items-center justify-between gap-3 px-4 py-3 rounded-xl border transition-all duration-200 text-left ${
          open
            ? 'border-[#c9a227]/30 bg-[#c9a227]/5'
            : 'border-[#1e1e1e] bg-[#0d0d0d] hover:border-[#2a2a2a]'
        }`}
      >
        <div className="flex items-center gap-2.5">
          <div className={`w-7 h-7 rounded-lg flex items-center justify-center transition-colors ${
            open ? 'bg-[#c9a227]/15 text-[#c9a227]' : 'bg-[#161616] text-[#444]'
          }`}>
            <Database className="w-3.5 h-3.5" />
          </div>
          <div>
            <p className={`text-xs font-semibold transition-colors ${open ? 'text-[#c9a227]' : 'text-[#888]'}`}>
              Discovery Mode
            </p>
            <p className="text-[10px] text-[#444]">Paste business JSON to auto-fill the walkthrough</p>
          </div>
        </div>
        {open ? (
          <ChevronUp className="w-4 h-4 text-[#c9a227] flex-shrink-0" />
        ) : (
          <ChevronDown className="w-4 h-4 text-[#555] flex-shrink-0" />
        )}
      </button>

      {/* Panel body */}
      {open && (
        <div className="mt-2 rounded-xl border border-[#1e1e1e] bg-[#0d0d0d] overflow-hidden animate-fade-up">
          {/* Field map legend */}
          <div className="px-4 pt-4 pb-3 border-b border-[#161616]">
            <p className="text-[10px] text-[#555] uppercase tracking-widest font-semibold mb-2.5">Supported fields</p>
            <div className="grid grid-cols-2 gap-x-4 gap-y-1.5">
              {FIELD_MAP.map((f) => (
                <div key={f.key} className="flex items-start gap-1.5">
                  <div className="w-1 h-1 rounded-full bg-[#c9a227]/60 mt-1.5 flex-shrink-0" />
                  <div>
                    <span className="text-[11px] text-[#888] font-mono">{f.key}</span>
                    <span className="text-[10px] text-[#444] block leading-tight">{f.fills}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Textarea */}
          <div className="px-4 pt-3 pb-2">
            <div className="flex items-center justify-between mb-1.5">
              <label className="text-[10px] text-[#555] uppercase tracking-widest font-semibold">Paste JSON</label>
              <button
                onClick={pasteExample}
                className="text-[10px] text-[#555] hover:text-[#c9a227] transition-colors flex items-center gap-1"
              >
                <Copy className="w-2.5 h-2.5" />
                Load example
              </button>
            </div>
            <div className={`relative rounded-lg border transition-all duration-200 ${
              error
                ? 'border-red-500/50'
                : parsed
                ? 'border-emerald-500/40'
                : 'border-[#1e1e1e] focus-within:border-[#c9a227]/40'
            } bg-[#080808]`}>
              <textarea
                value={raw}
                onChange={(e) => { setRaw(e.target.value); setParsed(null); setError(null); setApplied(false); }}
                rows={7}
                spellCheck={false}
                className="w-full bg-transparent text-[#aaa] text-xs font-mono leading-relaxed p-3 resize-none outline-none rounded-lg placeholder-[#2a2a2a]"
                placeholder={`{\n  "businessName": "...",\n  "type": "barbershop"\n}`}
              />
            </div>
          </div>

          {/* Error message */}
          {error && (
            <div className="mx-4 mb-2 flex items-start gap-2 bg-red-500/8 border border-red-500/20 rounded-lg px-3 py-2">
              <AlertTriangle className="w-3.5 h-3.5 text-red-400 flex-shrink-0 mt-0.5" />
              <p className="text-[11px] text-red-400 leading-snug">{error}</p>
            </div>
          )}

          {/* Parsed preview */}
          {parsed && !applied && (
            <div className="mx-4 mb-2 bg-emerald-500/5 border border-emerald-500/20 rounded-lg px-3 py-2.5">
              <p className="text-[10px] text-emerald-400 uppercase tracking-widest font-semibold mb-2">Ready to apply</p>
              <div className="flex flex-col gap-1">
                {Object.entries(parsed).map(([k, v]) => (
                  <div key={k} className="flex items-center gap-2">
                    <span className="text-[10px] text-[#555] font-mono w-24 flex-shrink-0">{k}</span>
                    <span className="text-[11px] text-[#999] truncate">{String(v)}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Success state */}
          {applied && (
            <div className="mx-4 mb-2 flex items-center gap-2 bg-[#c9a227]/8 border border-[#c9a227]/25 rounded-lg px-3 py-2.5">
              <CheckCircle2 className="w-4 h-4 text-[#c9a227] flex-shrink-0" />
              <p className="text-[11px] text-[#c9a227] font-medium">Data applied — walkthrough pre-filled!</p>
            </div>
          )}

          {/* Actions */}
          <div className="px-4 pb-4 flex gap-2">
            {!parsed ? (
              <button
                onClick={handleParse}
                disabled={!raw.trim()}
                className={`flex-1 flex items-center justify-center gap-2 py-2.5 rounded-lg text-xs font-semibold transition-all active:scale-95 ${
                  raw.trim()
                    ? 'bg-[#c9a227]/10 border border-[#c9a227]/30 text-[#c9a227] hover:bg-[#c9a227]/15'
                    : 'bg-[#111] border border-[#1e1e1e] text-[#444] cursor-not-allowed'
                }`}
              >
                <Zap className="w-3.5 h-3.5" />
                Validate JSON
              </button>
            ) : (
              <>
                <button
                  onClick={handleReset}
                  className="flex items-center gap-1.5 px-3 py-2.5 rounded-lg text-xs text-[#555] border border-[#1e1e1e] hover:text-[#888] hover:border-[#2a2a2a] transition-all active:scale-95"
                >
                  <RotateCcw className="w-3 h-3" />
                  Reset
                </button>
                <button
                  onClick={handleApply}
                  disabled={applied}
                  className={`flex-1 flex items-center justify-center gap-2 py-2.5 rounded-lg text-xs font-semibold transition-all active:scale-95 text-black ${
                    applied ? 'opacity-50 cursor-not-allowed' : 'hover:opacity-90'
                  }`}
                  style={{ background: 'linear-gradient(135deg, #c9a227, #e8c96a)' }}
                >
                  <Zap className="w-3.5 h-3.5" />
                  Apply to Walkthrough
                </button>
              </>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
