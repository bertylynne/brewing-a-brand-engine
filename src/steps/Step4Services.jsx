import { useState } from 'react';
import { ChevronRight, ChevronLeft, ChevronDown, ChevronUp, Check, Plus, X, Clock, Scissors, Sparkles, AlertCircle } from 'lucide-react';

// ── Master Kit — Single Source of Truth ────────────────────────────────────────
const MASTER_KIT = {
  kit_name: 'Exhaustive Beauty & Grooming Master Kit',
  version: '3.0',
  categories: [
    {
      category_name: 'Barbering',
      services: [
        { id: 'b_01', name: 'Signature Skin Fade',      duration: 45, buffer: 15 },
        { id: 'b_02', name: 'Classic Clipper Cut',       duration: 30, buffer: 10 },
        { id: 'b_03', name: 'Beard Sculpt & Line-up',    duration: 30, buffer: 10 },
        { id: 'b_04', name: 'Straight Razor Head Shave', duration: 45, buffer: 15 },
        { id: 'b_05', name: 'Hot Towel Face Shave',      duration: 45, buffer: 15 },
      ],
    },
    {
      category_name: 'Hair (Styling & Cutting)',
      services: [
        { id: 'h_01', name: "Women's Precision Cut",      duration: 60, buffer: 15 },
        { id: 'h_02', name: 'Signature Blowout',           duration: 45, buffer: 15 },
        { id: 'h_03', name: 'Special Occasion / Updo',     duration: 75, buffer: 15 },
        { id: 'h_04', name: "Children's Cut",              duration: 30, buffer: 10 },
      ],
    },
    {
      category_name: 'Hair (Color & Chemical)',
      services: [
        { id: 'c_01', name: 'Full Balayage / Highlights', duration: 180, buffer: 30 },
        { id: 'c_02', name: 'Partial Highlights',          duration: 120, buffer: 20 },
        { id: 'c_03', name: 'Root Touch-up',               duration: 90,  buffer: 15 },
        { id: 'c_04', name: 'All-over Color',              duration: 120, buffer: 15 },
        { id: 'c_05', name: 'Toner / Gloss Refresh',       duration: 45,  buffer: 15 },
      ],
    },
    {
      category_name: 'Esthetics & Spa',
      services: [
        { id: 's_01', name: 'Customized Signature Facial', duration: 60, buffer: 15 },
        { id: 's_02', name: 'Chemical Peel',                duration: 45, buffer: 15 },
        { id: 's_03', name: 'Dermaplaning',                 duration: 45, buffer: 10 },
        { id: 's_04', name: 'Full Body Swedish Massage',    duration: 60, buffer: 15 },
        { id: 's_05', name: 'Deep Tissue Massage',          duration: 90, buffer: 15 },
      ],
    },
    {
      category_name: 'Nails',
      services: [
        { id: 'n_01', name: 'Gel Manicure',       duration: 45, buffer: 10 },
        { id: 'n_02', name: 'Luxury Pedicure',     duration: 60, buffer: 15 },
        { id: 'n_03', name: 'Acrylic Full Set',    duration: 90, buffer: 15 },
        { id: 'n_04', name: 'Gel / Acrylic Fill',  duration: 60, buffer: 10 },
      ],
    },
    {
      category_name: 'Waxing & Brows',
      services: [
        { id: 'w_01', name: 'Eyebrow Shaping (Wax/Thread)', duration: 20, buffer: 10 },
        { id: 'w_02', name: 'Lip or Chin Wax',               duration: 15, buffer: 5  },
        { id: 'w_03', name: 'Full Face Wax',                  duration: 40, buffer: 10 },
        { id: 'w_04', name: 'Bikini / Brazilian Wax',         duration: 45, buffer: 15 },
      ],
    },
  ],
};

let customIdSeq = 1;

function formatDuration(min) {
  if (min < 60) return `${min}m`;
  const h = Math.floor(min / 60);
  const m = min % 60;
  return m ? `${h}h ${m}m` : `${h}h`;
}

// ── Custom Service Modal ───────────────────────────────────────────────────────
function CustomServiceModal({ onClose, onAdd, accent }) {
  const [name, setName]         = useState('');
  const [category, setCategory] = useState(MASTER_KIT.categories[0].category_name);
  const [duration, setDuration] = useState('30');
  const [error, setError]       = useState('');

  const handleSubmit = () => {
    if (!name.trim()) { setError('Please enter a service name.'); return; }
    const dur = parseInt(duration, 10);
    if (!dur || dur < 1) { setError('Please enter a valid duration in minutes.'); return; }
    onAdd({
      id:       `custom_${customIdSeq++}_${Date.now()}`,
      name:     name.trim(),
      category,
      duration: dur,
      buffer:   15,
      custom:   true,
    });
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-4" style={{ background: 'rgba(10,16,24,0.8)', backdropFilter: 'blur(4px)' }}>
      <div
        className="w-full max-w-md rounded-2xl border overflow-hidden animate-scale-in"
        style={{ background: 'var(--bg-card)', borderColor: 'var(--border)' }}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-4 border-b" style={{ borderColor: 'var(--border-sub)', background: 'var(--bg-raised)' }}>
          <div>
            <p className="text-[10px] uppercase tracking-widest font-semibold mb-0.5" style={{ color: 'var(--coral)' }}>Custom Service</p>
            <h3 className="font-serif-display text-base font-bold" style={{ color: 'var(--text-primary)' }}>Add a Service</h3>
          </div>
          <button onClick={onClose} className="w-8 h-8 rounded-full flex items-center justify-center transition-colors" style={{ background: 'var(--bg-surface)', color: 'var(--text-muted)' }}>
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Body */}
        <div className="p-5 flex flex-col gap-4">
          {/* Name */}
          <div>
            <label className="block text-[10px] uppercase tracking-widest font-semibold mb-1.5" style={{ color: 'var(--text-muted)' }}>Service Name *</label>
            <input
              autoFocus
              type="text"
              value={name}
              onChange={(e) => { setName(e.target.value); setError(''); }}
              placeholder="e.g. Keratin Treatment"
              className="w-full rounded-xl px-3.5 py-3 text-sm outline-none border transition-colors"
              style={{ background: 'var(--bg-surface)', borderColor: 'var(--border)', color: 'var(--text-primary)' }}
            />
          </div>

          {/* Category */}
          <div>
            <label className="block text-[10px] uppercase tracking-widest font-semibold mb-1.5" style={{ color: 'var(--text-muted)' }}>Category</label>
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="w-full rounded-xl px-3.5 py-3 text-sm outline-none border transition-colors appearance-none"
              style={{ background: 'var(--bg-surface)', borderColor: 'var(--border)', color: 'var(--text-primary)' }}
            >
              {MASTER_KIT.categories.map((c) => (
                <option key={c.category_name} value={c.category_name}>{c.category_name}</option>
              ))}
              <option value="Other">Other</option>
            </select>
          </div>

          {/* Duration */}
          <div>
            <label className="block text-[10px] uppercase tracking-widest font-semibold mb-1.5" style={{ color: 'var(--text-muted)' }}>Duration (minutes)</label>
            <div className="flex gap-2 flex-wrap mb-2">
              {[15, 30, 45, 60, 90, 120].map((d) => (
                <button
                  key={d}
                  type="button"
                  onClick={() => setDuration(String(d))}
                  className="px-3 py-1.5 rounded-full text-xs font-medium border transition-all"
                  style={
                    duration === String(d)
                      ? { borderColor: `${accent}60`, background: `${accent}15`, color: accent }
                      : { borderColor: 'var(--border)', background: 'var(--bg-surface)', color: 'var(--text-muted)' }
                  }
                >
                  {d}m
                </button>
              ))}
            </div>
            <div className="flex items-center gap-2 rounded-xl border px-3.5 py-3" style={{ background: 'var(--bg-surface)', borderColor: 'var(--border)' }}>
              <Clock className="w-3.5 h-3.5 flex-shrink-0" style={{ color: 'var(--text-faint)' }} />
              <input
                type="number"
                min="1"
                max="480"
                value={duration}
                onChange={(e) => { setDuration(e.target.value); setError(''); }}
                className="flex-1 bg-transparent text-sm outline-none"
                style={{ color: 'var(--text-primary)' }}
              />
              <span className="text-xs" style={{ color: 'var(--text-faint)' }}>min</span>
            </div>
          </div>

          {/* Buffer note */}
          <div className="flex items-start gap-2 rounded-xl px-3.5 py-3 border" style={{ background: 'rgba(201,162,39,0.05)', borderColor: 'rgba(201,162,39,0.2)' }}>
            <Clock className="w-3.5 h-3.5 flex-shrink-0 mt-0.5" style={{ color: 'var(--gold)' }} />
            <p className="text-[11px] leading-relaxed" style={{ color: 'var(--text-secondary)' }}>
              A <span className="font-semibold" style={{ color: 'var(--gold)' }}>15-minute buffer</span> will be automatically assigned to this service for booking calendar spacing.
            </p>
          </div>

          {error && (
            <div className="flex items-center gap-2">
              <AlertCircle className="w-3.5 h-3.5 text-red-400 flex-shrink-0" />
              <p className="text-xs text-red-400">{error}</p>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="flex gap-3 px-5 pb-5">
          <button
            onClick={onClose}
            className="flex-1 py-3 rounded-full border text-sm font-medium transition-all"
            style={{ borderColor: 'var(--border)', color: 'var(--text-muted)' }}
          >
            Cancel
          </button>
          <button
            onClick={handleSubmit}
            className="flex-1 py-3 rounded-full text-sm font-bold uppercase tracking-wider text-white transition-all hover:opacity-90 active:scale-95"
            style={{ background: 'var(--coral)' }}
          >
            Add Service
          </button>
        </div>
      </div>
    </div>
  );
}

// ── Category Accordion Block ───────────────────────────────────────────────────
function CategoryBlock({ category, selectedIds, onToggle, onSelectAll, accent, defaultOpen }) {
  const [open, setOpen] = useState(defaultOpen ?? false);

  const allSelected  = category.services.every((s) => selectedIds.has(s.id));
  const someSelected = category.services.some((s)  => selectedIds.has(s.id));
  const selectedCount = category.services.filter((s) => selectedIds.has(s.id)).length;

  return (
    <div className="rounded-xl border overflow-hidden transition-all duration-200" style={{ borderColor: open ? `${accent}40` : 'var(--border)', background: 'var(--bg-card)' }}>
      {/* Accordion header */}
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        className="w-full flex items-center justify-between px-4 py-3.5 text-left transition-colors"
        style={{ background: open ? 'var(--bg-raised)' : 'var(--bg-card)' }}
      >
        <div className="flex items-center gap-3 min-w-0">
          {/* Color bar */}
          <div className="w-1 h-5 rounded-full flex-shrink-0" style={{ background: someSelected ? accent : 'var(--border)' }} />
          <div className="min-w-0">
            <p className="text-sm font-semibold leading-tight" style={{ color: 'var(--text-primary)' }}>
              {category.category_name}
            </p>
            <p className="text-[10px] mt-0.5" style={{ color: 'var(--text-muted)' }}>
              {category.services.length} services
              {selectedCount > 0 && (
                <span className="ml-1.5 font-semibold" style={{ color: accent }}>· {selectedCount} selected</span>
              )}
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2 flex-shrink-0 ml-2">
          {someSelected && (
            <span
              className="text-[10px] font-bold px-2 py-0.5 rounded-full"
              style={{ background: `${accent}18`, color: accent }}
            >
              {selectedCount}/{category.services.length}
            </span>
          )}
          {open
            ? <ChevronUp className="w-4 h-4" style={{ color: 'var(--text-muted)' }} />
            : <ChevronDown className="w-4 h-4" style={{ color: 'var(--text-muted)' }} />
          }
        </div>
      </button>

      {/* Service list */}
      {open && (
        <div className="border-t" style={{ borderColor: 'var(--border-sub)' }}>
          {/* Select All row */}
          <div className="flex items-center justify-between px-4 py-2.5 border-b" style={{ borderColor: 'var(--border-sub)', background: 'var(--bg-surface)' }}>
            <span className="text-[11px] font-semibold uppercase tracking-wider" style={{ color: 'var(--text-faint)' }}>
              Services
            </span>
            <button
              type="button"
              onClick={() => onSelectAll(category, !allSelected)}
              className="flex items-center gap-1.5 text-[11px] font-semibold transition-colors px-2.5 py-1 rounded-lg"
              style={allSelected
                ? { color: accent, background: `${accent}12` }
                : { color: 'var(--text-muted)' }
              }
              onMouseEnter={(e) => { e.currentTarget.style.color = accent; }}
              onMouseLeave={(e) => { if (!allSelected) e.currentTarget.style.color = 'var(--text-muted)'; }}
            >
              {allSelected ? <Check className="w-3 h-3" /> : <Plus className="w-3 h-3" />}
              {allSelected ? 'Deselect All' : 'Select All'}
            </button>
          </div>

          {/* Individual service rows */}
          <div className="p-2 flex flex-col gap-1">
            {category.services.map((svc) => {
              const checked = selectedIds.has(svc.id);
              return (
                <button
                  key={svc.id}
                  type="button"
                  onClick={() => onToggle(svc)}
                  className="flex items-center gap-3 w-full text-left rounded-xl px-3 py-2.5 transition-all duration-150 active:scale-[0.99] border"
                  style={checked
                    ? { background: `${accent}0d`, borderColor: `${accent}35` }
                    : { background: 'transparent', borderColor: 'transparent' }
                  }
                  onMouseEnter={(e) => { if (!checked) { e.currentTarget.style.background = 'var(--bg-raised)'; e.currentTarget.style.borderColor = 'var(--border)'; } }}
                  onMouseLeave={(e) => { if (!checked) { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.borderColor = 'transparent'; } }}
                >
                  {/* Checkbox */}
                  <div
                    className="w-5 h-5 rounded-md border-2 flex items-center justify-center flex-shrink-0 transition-all duration-150"
                    style={checked
                      ? { background: accent, borderColor: accent }
                      : { background: 'transparent', borderColor: 'var(--border)' }
                    }
                  >
                    {checked && <Check className="w-3 h-3 text-white" strokeWidth={3} />}
                  </div>

                  {/* Name */}
                  <span className="flex-1 text-sm font-medium leading-snug" style={{ color: checked ? 'var(--text-primary)' : 'var(--text-secondary)' }}>
                    {svc.name}
                  </span>

                  {/* Duration + buffer chips */}
                  <div className="flex items-center gap-1.5 flex-shrink-0">
                    <span
                      className="flex items-center gap-1 text-[10px] font-mono px-2 py-0.5 rounded-full border"
                      style={checked
                        ? { color: accent, borderColor: `${accent}40`, background: `${accent}10` }
                        : { color: 'var(--text-faint)', borderColor: 'var(--border)', background: 'transparent' }
                      }
                    >
                      <Clock className="w-2.5 h-2.5" />
                      {formatDuration(svc.duration)}
                    </span>
                    <span
                      className="text-[9px] font-mono px-1.5 py-0.5 rounded-full"
                      style={{ color: 'var(--text-faint)', background: 'var(--bg-surface)' }}
                      title="Buffer time"
                    >
                      +{svc.buffer}m
                    </span>
                  </div>
                </button>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}

// ── Main component ─────────────────────────────────────────────────────────────
export default function Step4Services({ onNext, onBack, data, setData }) {
  const isBarber = (data.businessType || 'barbershop') === 'barbershop';
  const accent   = isBarber ? '#c9a227' : '#d4a0c8';

  // selectedServices: array of { id, name, category, duration, buffer, custom? }
  const selectedServices = data.selectedServices || [];
  const selectedIds      = new Set(selectedServices.map((s) => s.id));

  const setSelected = (services) => setData({ ...data, selectedServices: services });

  const [showModal, setShowModal] = useState(false);

  const toggleService = (svc) => {
    if (selectedIds.has(svc.id)) {
      setSelected(selectedServices.filter((s) => s.id !== svc.id));
    } else {
      setSelected([...selectedServices, {
        id:       svc.id,
        name:     svc.name,
        category: svc.category_name || svc.category,
        duration: svc.duration,
        buffer:   svc.buffer,
        custom:   svc.custom || false,
      }]);
    }
  };

  const selectAll = (category, select) => {
    if (select) {
      const toAdd = category.services
        .filter((s) => !selectedIds.has(s.id))
        .map((s) => ({ id: s.id, name: s.name, category: category.category_name, duration: s.duration, buffer: s.buffer, custom: false }));
      setSelected([...selectedServices, ...toAdd]);
    } else {
      const catIds = new Set(category.services.map((s) => s.id));
      setSelected(selectedServices.filter((s) => !catIds.has(s.id)));
    }
  };

  const addCustom = (svc) => {
    setSelected([...selectedServices, svc]);
  };

  const removeCustom = (id) => {
    setSelected(selectedServices.filter((s) => s.id !== id));
  };

  const customServices = selectedServices.filter((s) => s.custom);
  const totalSelected  = selectedServices.length;

  return (
    <div className="px-5 py-8 max-w-lg mx-auto w-full">
      {/* Header */}
      <div className="animate-fade-up mb-5">
        <p className="text-[11px] tracking-[0.2em] uppercase font-semibold mb-2" style={{ color: 'var(--coral)' }}>
          — Step 04 —
        </p>
        <h2 className="font-serif-display text-2xl font-bold tracking-tight" style={{ color: 'var(--text-primary)' }}>
          Services Offered
        </h2>
        <div className="flex items-center gap-3 my-3">
          <div className="h-px w-8" style={{ background: 'var(--gold)' }} />
          <div className="w-1 h-1 rounded-full" style={{ background: 'var(--gold)' }} />
          <div className="h-px w-8" style={{ background: 'var(--gold)' }} />
        </div>
        <p className="text-sm leading-relaxed" style={{ color: 'var(--text-secondary)' }}>
          Select every service you offer. This becomes the live menu on your website and populates your booking calendar automatically.
        </p>
      </div>

      {/* Selection summary pill */}
      <div className="animate-fade-up delay-100 flex items-center justify-between mb-5">
        <div
          className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full border text-xs font-semibold"
          style={totalSelected > 0
            ? { borderColor: `${accent}35`, background: `${accent}0d`, color: accent }
            : { borderColor: 'var(--border)', background: 'var(--bg-raised)', color: 'var(--text-muted)' }
          }
        >
          {isBarber ? <Scissors className="w-3.5 h-3.5" /> : <Sparkles className="w-3.5 h-3.5" />}
          {totalSelected === 0
            ? 'No services selected'
            : `${totalSelected} service${totalSelected !== 1 ? 's' : ''} selected`}
        </div>
        {totalSelected > 0 && (
          <button
            onClick={() => setSelected([])}
            className="text-[11px] transition-colors"
            style={{ color: 'var(--text-faint)' }}
            onMouseEnter={(e) => { e.currentTarget.style.color = '#f87171'; }}
            onMouseLeave={(e) => { e.currentTarget.style.color = 'var(--text-faint)'; }}
          >
            Clear all
          </button>
        )}
      </div>

      {/* Accordion categories */}
      <div className="animate-fade-up delay-200 flex flex-col gap-2 mb-5">
        {MASTER_KIT.categories.map((cat, i) => (
          <CategoryBlock
            key={cat.category_name}
            category={cat}
            selectedIds={selectedIds}
            onToggle={(svc) => toggleService({ ...svc, category_name: cat.category_name })}
            onSelectAll={selectAll}
            accent={accent}
            defaultOpen={i === 0}
          />
        ))}
      </div>

      {/* Custom services list */}
      {customServices.length > 0 && (
        <div className="animate-fade-up mb-4">
          <p className="text-[10px] uppercase tracking-widest font-semibold mb-2" style={{ color: 'var(--text-muted)' }}>Custom Services</p>
          <div className="flex flex-col gap-1.5">
            {customServices.map((svc) => (
              <div
                key={svc.id}
                className="flex items-center gap-3 rounded-xl px-3 py-2.5 border"
                style={{ background: `${accent}08`, borderColor: `${accent}30` }}
              >
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium truncate" style={{ color: 'var(--text-primary)' }}>{svc.name}</p>
                  <p className="text-[10px] mt-0.5" style={{ color: 'var(--text-muted)' }}>
                    {svc.category} · {formatDuration(svc.duration)} · +{svc.buffer}m buffer
                  </p>
                </div>
                <button
                  onClick={() => removeCustom(svc.id)}
                  className="w-6 h-6 rounded-full flex items-center justify-center flex-shrink-0 transition-colors"
                  style={{ color: 'var(--text-faint)' }}
                  onMouseEnter={(e) => { e.currentTarget.style.color = '#f87171'; e.currentTarget.style.background = 'rgba(248,113,113,0.1)'; }}
                  onMouseLeave={(e) => { e.currentTarget.style.color = 'var(--text-faint)'; e.currentTarget.style.background = 'transparent'; }}
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Add Custom Service button */}
      <div className="animate-fade-up delay-300 mb-8">
        <button
          onClick={() => setShowModal(true)}
          className="w-full flex items-center justify-center gap-2.5 py-3.5 rounded-xl border-2 border-dashed text-sm font-semibold transition-all duration-200 active:scale-[0.98]"
          style={{ borderColor: `${accent}30`, color: `${accent}90` }}
          onMouseEnter={(e) => { e.currentTarget.style.borderColor = accent; e.currentTarget.style.color = accent; e.currentTarget.style.background = `${accent}08`; }}
          onMouseLeave={(e) => { e.currentTarget.style.borderColor = `${accent}30`; e.currentTarget.style.color = `${accent}90`; e.currentTarget.style.background = 'transparent'; }}
        >
          <Plus className="w-4 h-4" />
          Add Custom Service
        </button>
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
          disabled={totalSelected === 0}
          className="flex-1 flex items-center justify-center gap-2 px-6 py-3.5 rounded-full font-bold text-sm uppercase tracking-wider text-white transition-all duration-200 active:scale-95"
          style={totalSelected > 0
            ? { background: 'var(--coral)', boxShadow: '0 4px 16px rgba(232,112,90,0.3)' }
            : { background: 'var(--bg-raised)', color: 'var(--text-faint)', cursor: 'not-allowed' }
          }
          onMouseEnter={(e) => { if (totalSelected > 0) e.currentTarget.style.background = 'var(--coral-light)'; }}
          onMouseLeave={(e) => { if (totalSelected > 0) e.currentTarget.style.background = 'var(--coral)'; }}
        >
          Continue
          <ChevronRight className="w-4 h-4" />
        </button>
      </div>

      {/* Custom Service Modal */}
      {showModal && (
        <CustomServiceModal
          accent={accent}
          onClose={() => setShowModal(false)}
          onAdd={addCustom}
        />
      )}
    </div>
  );
}
