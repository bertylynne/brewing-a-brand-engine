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

  const handleReset = () => { setRaw(''); setParsed(null); setError(null); setApplied(false); };
  const pasteExample = () => { setRaw(EXAMPLE_JSON); setParsed(null); setError(null); setApplied(false); };

  return (
    <div className="w-full max-w-md animate-fade-up delay-500">
      {/* Toggle */}
      <button
        onClick={() => setOpen((o) => !o)}
        className="w-full flex items-center justify-between gap-3 px-4 py-3 rounded-xl border transition-all duration-200 text-left"
        style={
          open
            ? { borderColor: 'rgba(201,162,39,0.35)', background: 'rgba(201,162,39,0.07)' }
            : { borderColor: 'var(--border)', background: 'var(--bg-raised)' }
        }
      >
        <div className="flex items-center gap-2.5">
          <div
            className="w-7 h-7 rounded-lg flex items-center justify-center transition-colors"
            style={open ? { background: 'rgba(201,162,39,0.18)', color: 'var(--gold)' } : { background: 'var(--bg-surface)', color: 'var(--text-faint)' }}
          >
            <Database className="w-3.5 h-3.5" />
          </div>
          <div>
            <p className="text-xs font-semibold transition-colors" style={{ color: open ? 'var(--gold)' : 'var(--text-secondary)' }}>
              Discovery Mode
            </p>
            <p className="text-[10px]" style={{ color: 'var(--text-faint)' }}>Paste business JSON to auto-fill the walkthrough</p>
          </div>
        </div>
        {open
          ? <ChevronUp className="w-4 h-4 flex-shrink-0" style={{ color: 'var(--gold)' }} />
          : <ChevronDown className="w-4 h-4 flex-shrink-0" style={{ color: 'var(--text-muted)' }} />
        }
      </button>

      {open && (
        <div className="mt-2 rounded-xl border overflow-hidden animate-fade-up" style={{ borderColor: 'var(--border)', background: 'var(--bg-raised)' }}>
          {/* Field map */}
          <div className="px-4 pt-4 pb-3 border-b" style={{ borderColor: 'var(--border-sub)' }}>
            <p className="text-[10px] uppercase tracking-widest font-semibold mb-2.5" style={{ color: 'var(--text-muted)' }}>Supported fields</p>
            <div className="grid grid-cols-2 gap-x-4 gap-y-1.5">
              {FIELD_MAP.map((f) => (
                <div key={f.key} className="flex items-start gap-1.5">
                  <div className="w-1 h-1 rounded-full mt-1.5 flex-shrink-0" style={{ background: 'rgba(201,162,39,0.6)' }} />
                  <div>
                    <span className="text-[11px] font-mono" style={{ color: 'var(--text-secondary)' }}>{f.key}</span>
                    <span className="text-[10px] block leading-tight" style={{ color: 'var(--text-faint)' }}>{f.fills}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Textarea */}
          <div className="px-4 pt-3 pb-2">
            <div className="flex items-center justify-between mb-1.5">
              <label className="text-[10px] uppercase tracking-widest font-semibold" style={{ color: 'var(--text-muted)' }}>Paste JSON</label>
              <button
                onClick={pasteExample}
                className="text-[10px] flex items-center gap-1 transition-colors"
                style={{ color: 'var(--text-muted)' }}
                onMouseEnter={(e) => { e.currentTarget.style.color = 'var(--gold)'; }}
                onMouseLeave={(e) => { e.currentTarget.style.color = 'var(--text-muted)'; }}
              >
                <Copy className="w-2.5 h-2.5" />
                Load example
              </button>
            </div>
            <div
              className="relative rounded-lg border transition-all duration-200"
              style={{
                borderColor: error ? 'rgba(239,68,68,0.5)' : parsed ? 'rgba(52,211,153,0.4)' : 'var(--border)',
                background: 'var(--bg-surface)',
              }}
            >
              <textarea
                value={raw}
                onChange={(e) => { setRaw(e.target.value); setParsed(null); setError(null); setApplied(false); }}
                rows={7}
                spellCheck={false}
                className="w-full bg-transparent text-xs font-mono leading-relaxed p-3 resize-none outline-none rounded-lg"
                style={{ color: 'var(--text-secondary)' }}
                placeholder={`{\n  "businessName": "...",\n  "type": "barbershop"\n}`}
              />
            </div>
          </div>

          {error && (
            <div className="mx-4 mb-2 flex items-start gap-2 rounded-lg px-3 py-2 border" style={{ background: 'rgba(239,68,68,0.06)', borderColor: 'rgba(239,68,68,0.2)' }}>
              <AlertTriangle className="w-3.5 h-3.5 text-red-400 flex-shrink-0 mt-0.5" />
              <p className="text-[11px] text-red-400 leading-snug">{error}</p>
            </div>
          )}

          {parsed && !applied && (
            <div className="mx-4 mb-2 rounded-lg px-3 py-2.5 border" style={{ background: 'rgba(52,211,153,0.05)', borderColor: 'rgba(52,211,153,0.2)' }}>
              <p className="text-[10px] text-emerald-400 uppercase tracking-widest font-semibold mb-2">Ready to apply</p>
              <div className="flex flex-col gap-1">
                {Object.entries(parsed).map(([k, v]) => (
                  <div key={k} className="flex items-center gap-2">
                    <span className="text-[10px] font-mono w-24 flex-shrink-0" style={{ color: 'var(--text-muted)' }}>{k}</span>
                    <span className="text-[11px] truncate" style={{ color: 'var(--text-secondary)' }}>{String(v)}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {applied && (
            <div className="mx-4 mb-2 flex items-center gap-2 rounded-lg px-3 py-2.5 border" style={{ background: 'rgba(201,162,39,0.07)', borderColor: 'rgba(201,162,39,0.25)' }}>
              <CheckCircle2 className="w-4 h-4 flex-shrink-0" style={{ color: 'var(--gold)' }} />
              <p className="text-[11px] font-medium" style={{ color: 'var(--gold)' }}>Data applied — walkthrough pre-filled!</p>
            </div>
          )}

          <div className="px-4 pb-4 flex gap-2">
            {!parsed ? (
              <button
                onClick={handleParse}
                disabled={!raw.trim()}
                className="flex-1 flex items-center justify-center gap-2 py-2.5 rounded-lg text-xs font-semibold transition-all active:scale-95 border"
                style={
                  raw.trim()
                    ? { background: 'rgba(201,162,39,0.1)', borderColor: 'rgba(201,162,39,0.3)', color: 'var(--gold)' }
                    : { background: 'var(--bg-surface)', borderColor: 'var(--border)', color: 'var(--text-faint)', cursor: 'not-allowed' }
                }
              >
                <Zap className="w-3.5 h-3.5" />
                Validate JSON
              </button>
            ) : (
              <>
                <button
                  onClick={handleReset}
                  className="flex items-center gap-1.5 px-3 py-2.5 rounded-lg text-xs border transition-all active:scale-95"
                  style={{ borderColor: 'var(--border)', color: 'var(--text-muted)' }}
                >
                  <RotateCcw className="w-3 h-3" />
                  Reset
                </button>
                <button
                  onClick={handleApply}
                  disabled={applied}
                  className="flex-1 flex items-center justify-center gap-2 py-2.5 rounded-lg text-xs font-bold uppercase tracking-wider text-white transition-all active:scale-95"
                  style={
                    applied
                      ? { background: 'var(--bg-surface)', color: 'var(--text-faint)', cursor: 'not-allowed' }
                      : { background: 'var(--coral)' }
                  }
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
