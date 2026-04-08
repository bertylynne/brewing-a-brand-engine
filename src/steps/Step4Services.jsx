import { useState } from 'react';
import { ChevronRight, ChevronLeft, Plus, Trash2, DollarSign, Scissors, Sparkles, ChevronDown, Clock } from 'lucide-react';

let nextId = 200;

const DURATION_OPTIONS = ['15', '30', '45', '60', '75', '90', '120'];

const DEFAULT_CATEGORIES = {
  barbershop: [
    {
      id: 'cat-b1', category: 'Cuts & Fades',
      services: [
        { id: 1, name: 'Classic Haircut',      price: '25', duration: '30' },
        { id: 2, name: 'Skin Fade',             price: '30', duration: '45' },
        { id: 3, name: 'Taper Fade',            price: '28', duration: '45' },
        { id: 4, name: 'Kids Cut (12 & Under)', price: '20', duration: '20' },
      ],
    },
    {
      id: 'cat-b2', category: 'Beard & Shave',
      services: [
        { id: 5, name: 'Beard Trim & Shape', price: '15', duration: '20' },
        { id: 6, name: 'Hot Towel Shave',    price: '35', duration: '30' },
        { id: 7, name: 'Line-Up / Edge-Up',  price: '15', duration: '15' },
      ],
    },
    {
      id: 'cat-b3', category: 'Extras',
      services: [
        { id: 8, name: 'Full Service (Cut + Beard)', price: '40', duration: '60' },
        { id: 9, name: 'Hair Wash & Style',          price: '20', duration: '20' },
      ],
    },
  ],
  salon: [
    {
      id: 'cat-s1', category: 'Color',
      services: [
        { id: 10, name: 'Full Color',            price: '80',  duration: '90'  },
        { id: 11, name: 'Balayage / Highlights', price: '120', duration: '120' },
        { id: 12, name: 'Gloss & Toner',          price: '50',  duration: '45'  },
      ],
    },
    {
      id: 'cat-s2', category: 'Styling',
      services: [
        { id: 13, name: 'Blowout',                price: '45', duration: '45' },
        { id: 14, name: 'Trim & Style',            price: '40', duration: '30' },
        { id: 15, name: 'Updo / Special Occasion', price: '75', duration: '75' },
      ],
    },
    {
      id: 'cat-s3', category: 'Treatments',
      services: [
        { id: 16, name: 'Deep Conditioning',    price: '30',  duration: '30'  },
        { id: 17, name: 'Hair Extensions (Set)', price: '200', duration: '120' },
        { id: 18, name: 'Facial',                price: '65',  duration: '60'  },
        { id: 19, name: 'Scalp Treatment',       price: '45',  duration: '45'  },
      ],
    },
  ],
};

function DurationSelect({ value, onChange, accent }) {
  const [open, setOpen] = useState(false);
  const display = value ? `${value}m` : '—';

  return (
    <div className="relative flex-shrink-0">
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        title="Appointment duration"
        className="flex items-center gap-1 h-[30px] px-2 rounded-md text-xs font-mono transition-all w-[52px] justify-between border"
        style={{ borderColor: 'var(--border)', background: 'var(--bg-surface)', color: 'var(--text-secondary)' }}
      >
        <Clock className="w-2.5 h-2.5 flex-shrink-0" style={{ color: value ? accent : 'var(--text-faint)' }} />
        <span className="text-xs font-mono" style={{ color: value ? 'var(--text-primary)' : 'var(--text-faint)' }}>{display}</span>
      </button>

      {open && (
        <>
          <div className="fixed inset-0 z-10" onClick={() => setOpen(false)} />
          <div className="absolute right-0 top-full mt-1 z-20 rounded-xl shadow-2xl overflow-hidden min-w-[80px] border" style={{ borderColor: 'var(--border)', background: 'var(--bg-card)' }}>
            <div className="p-1 flex flex-col gap-0.5">
              <div className="flex items-center gap-1.5 px-2 py-1.5 border-b mb-0.5" style={{ borderColor: 'var(--border-sub)' }}>
                <input
                  type="text" inputMode="numeric" placeholder="Custom"
                  value={value && !DURATION_OPTIONS.includes(value) ? value : ''}
                  onChange={(e) => onChange(e.target.value.replace(/[^0-9]/g, ''))}
                  onKeyDown={(e) => { if (e.key === 'Enter') setOpen(false); }}
                  className="w-full bg-transparent text-xs outline-none"
                  style={{ color: 'var(--text-primary)' }}
                />
                <span className="text-[10px]" style={{ color: 'var(--text-faint)' }}>min</span>
              </div>
              {DURATION_OPTIONS.map((opt) => (
                <button
                  key={opt} type="button"
                  onClick={() => { onChange(opt); setOpen(false); }}
                  className="text-left px-2.5 py-1.5 rounded-lg text-xs transition-colors"
                  style={value === opt
                    ? { color: accent, background: `${accent}15`, fontWeight: 600 }
                    : { color: 'var(--text-secondary)' }
                  }
                  onMouseEnter={(e) => { if (value !== opt) e.currentTarget.style.color = 'var(--text-primary)'; }}
                  onMouseLeave={(e) => { if (value !== opt) e.currentTarget.style.color = 'var(--text-secondary)'; }}
                >
                  {opt} min
                </button>
              ))}
              {value && (
                <button
                  type="button"
                  onClick={() => { onChange(''); setOpen(false); }}
                  className="text-left px-2.5 py-1.5 rounded-lg text-[10px] transition-colors border-t mt-0.5"
                  style={{ borderColor: 'var(--border-sub)', color: 'var(--text-faint)' }}
                  onMouseEnter={(e) => { e.currentTarget.style.color = '#f87171'; }}
                  onMouseLeave={(e) => { e.currentTarget.style.color = 'var(--text-faint)'; }}
                >
                  Clear
                </button>
              )}
            </div>
          </div>
        </>
      )}
    </div>
  );
}

function ServiceRow({ service, onUpdate, onDelete, accent }) {
  return (
    <div className="group flex items-center gap-1.5 rounded-lg px-2.5 py-2 transition-all duration-150 border" style={{ borderColor: 'var(--border-sub)', background: 'var(--bg-surface)' }}>
      <input
        type="text" value={service.name}
        onChange={(e) => onUpdate(service.id, 'name', e.target.value)}
        placeholder="Service name…"
        className="flex-1 bg-transparent text-sm outline-none min-w-0"
        style={{ color: 'var(--text-primary)' }}
      />
      <div className="flex items-center gap-1 w-[76px] border rounded-md px-2 py-1 transition-colors flex-shrink-0" style={{ borderColor: 'var(--border)', background: 'var(--bg-card)' }}>
        <DollarSign className="w-3 h-3 flex-shrink-0" style={{ color: 'var(--text-faint)' }} />
        <input
          type="text" inputMode="decimal" value={service.price}
          onChange={(e) => onUpdate(service.id, 'price', e.target.value.replace(/[^0-9.]/g, ''))}
          placeholder="0"
          className="w-full bg-transparent text-sm outline-none text-right"
          style={{ color: 'var(--text-primary)' }}
        />
      </div>
      <DurationSelect value={service.duration || ''} onChange={(v) => onUpdate(service.id, 'duration', v)} accent={accent} />
      <button
        onClick={() => onDelete(service.id)}
        className="w-6 h-6 rounded flex items-center justify-center transition-all opacity-0 group-hover:opacity-100 flex-shrink-0"
        style={{ color: 'var(--text-faint)' }}
        onMouseEnter={(e) => { e.currentTarget.style.color = '#f87171'; }}
        onMouseLeave={(e) => { e.currentTarget.style.color = 'var(--text-faint)'; }}
      >
        <Trash2 className="w-3 h-3" />
      </button>
    </div>
  );
}

function CategoryBlock({ cat, onUpdateService, onDeleteService, onAddService, onDeleteCategory, accent, defaultOpen }) {
  const [open, setOpen] = useState(defaultOpen ?? true);

  return (
    <div className="rounded-xl border overflow-hidden" style={{ borderColor: 'var(--border)' }}>
      <button
        onClick={() => setOpen((o) => !o)}
        className="w-full flex items-center justify-between px-3.5 py-2.5 transition-colors text-left"
        style={{ background: 'var(--bg-raised)' }}
        onMouseEnter={(e) => { e.currentTarget.style.background = 'var(--bg-card)'; }}
        onMouseLeave={(e) => { e.currentTarget.style.background = 'var(--bg-raised)'; }}
      >
        <div className="flex items-center gap-2">
          <div className="w-1.5 h-4 rounded-full flex-shrink-0" style={{ background: `linear-gradient(180deg, ${accent}, ${accent}66)` }} />
          <span className="text-sm font-semibold" style={{ color: 'var(--text-primary)' }}>{cat.category}</span>
          <span className="text-[10px] font-medium px-1.5 py-0.5 rounded-full" style={{ background: `${accent}18`, color: accent }}>
            {cat.services.length}
          </span>
        </div>
        <div className="flex items-center gap-1">
          <button
            onClick={(e) => { e.stopPropagation(); onDeleteCategory(cat.id); }}
            className="w-5 h-5 rounded flex items-center justify-center transition-colors mr-1"
            style={{ color: 'var(--text-faint)' }}
            onMouseEnter={(e) => { e.currentTarget.style.color = '#f87171'; }}
            onMouseLeave={(e) => { e.currentTarget.style.color = 'var(--text-faint)'; }}
          >
            <Trash2 className="w-3 h-3" />
          </button>
          <ChevronDown className={`w-4 h-4 transition-transform duration-200 ${open ? 'rotate-180' : ''}`} style={{ color: 'var(--text-muted)' }} />
        </div>
      </button>

      {open && (
        <div className="p-2.5 flex flex-col gap-1.5" style={{ background: 'var(--bg-card)' }}>
          <div className="flex items-center gap-1.5 px-2.5 mb-0.5">
            <span className="flex-1 text-[9px] uppercase tracking-widest font-semibold" style={{ color: 'var(--text-faint)' }}>Name</span>
            <span className="w-[76px] text-[9px] uppercase tracking-widest font-semibold text-right" style={{ color: 'var(--text-faint)' }}>Price</span>
            <span className="w-[52px] flex items-center justify-center gap-1 text-[9px] uppercase tracking-widest font-semibold" style={{ color: 'var(--text-faint)' }}>
              <Clock className="w-2.5 h-2.5" />Time
            </span>
            <span className="w-6" />
          </div>

          {cat.services.length === 0 && (
            <p className="text-[11px] text-center py-2 italic" style={{ color: 'var(--text-faint)' }}>No services yet</p>
          )}

          {cat.services.map((svc) => (
            <ServiceRow key={svc.id} service={svc} onUpdate={onUpdateService} onDelete={onDeleteService} accent={accent} />
          ))}

          <button
            onClick={() => onAddService(cat.id)}
            className="flex items-center gap-1.5 py-1.5 px-2 text-[11px] transition-colors rounded-md"
            style={{ color: `${accent}80` }}
            onMouseEnter={(e) => { e.currentTarget.style.color = accent; e.currentTarget.style.background = `${accent}0a`; }}
            onMouseLeave={(e) => { e.currentTarget.style.color = `${accent}80`; e.currentTarget.style.background = 'transparent'; }}
          >
            <Plus className="w-3.5 h-3.5" />
            Add service to {cat.category}
          </button>
        </div>
      )}
    </div>
  );
}

export default function Step4Services({ onNext, onBack, data, setData }) {
  const businessType  = data.businessType || 'barbershop';
  const isBarber      = businessType === 'barbershop';
  const accent        = isBarber ? '#c9a227' : '#d4a0c8';
  const categories    = data.serviceCategories || DEFAULT_CATEGORIES[businessType];
  const setCategories = (cats) => setData({ ...data, serviceCategories: cats });

  const updateService = (catId, svcId, field, value) =>
    setCategories(categories.map((cat) => cat.id !== catId ? cat : {
      ...cat, services: cat.services.map((s) => s.id === svcId ? { ...s, [field]: value } : s),
    }));

  const deleteService = (catId, svcId) =>
    setCategories(categories.map((cat) => cat.id !== catId ? cat : { ...cat, services: cat.services.filter((s) => s.id !== svcId) }));

  const addServiceToCategory = (catId) =>
    setCategories(categories.map((cat) => cat.id !== catId ? cat : {
      ...cat, services: [...cat.services, { id: nextId++, name: '', price: '', duration: '' }],
    }));

  const deleteCategory = (catId) => setCategories(categories.filter((c) => c.id !== catId));

  const addCategory = () => setCategories([...categories, {
    id: `cat-new-${nextId++}`, category: 'New Category',
    services: [{ id: nextId++, name: '', price: '', duration: '' }],
  }]);

  const totalServices = categories.reduce((sum, c) => sum + c.services.length, 0);

  return (
    <div className="px-5 py-8 max-w-lg mx-auto w-full">
      {/* Header */}
      <div className="animate-fade-up mb-5">
        <p className="text-[11px] tracking-[0.2em] uppercase font-semibold mb-2" style={{ color: 'var(--coral)' }}>
          — Step 04 —
        </p>
        <h2 className="font-serif-display text-2xl font-bold tracking-tight" style={{ color: 'var(--text-primary)' }}>
          Services & Pricing
        </h2>
        <div className="flex items-center gap-3 my-3">
          <div className="h-px w-8" style={{ background: 'var(--gold)' }} />
          <div className="w-1 h-1 rounded-full" style={{ background: 'var(--gold)' }} />
          <div className="h-px w-8" style={{ background: 'var(--gold)' }} />
        </div>
        <p className="text-sm leading-relaxed" style={{ color: 'var(--text-secondary)' }}>
          Provide your service offering so we can build your menu and booking calendar accurately.
        </p>
      </div>

      {/* Type pill + count */}
      <div className="animate-fade-up delay-100 flex items-center justify-between mb-4">
        <div
          className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full border text-xs font-semibold"
          style={{ borderColor: `${accent}35`, background: `${accent}0d`, color: accent }}
        >
          {isBarber ? <Scissors className="w-3.5 h-3.5" /> : <Sparkles className="w-3.5 h-3.5" />}
          {isBarber ? 'Barbershop' : 'Beauty Salon'} Menu
        </div>
        <span className="text-[11px]" style={{ color: 'var(--text-muted)' }}>
          {totalServices} service{totalServices !== 1 ? 's' : ''} · {categories.length} categories
        </span>
      </div>

      {/* Calendar callout */}
      <div className="animate-fade-up delay-100 mb-5 flex items-start gap-2.5 rounded-xl px-3.5 py-3 border" style={{ background: 'rgba(201,162,39,0.06)', borderColor: 'rgba(201,162,39,0.18)' }}>
        <Clock className="w-4 h-4 flex-shrink-0 mt-0.5" style={{ color: 'var(--gold)' }} />
        <p className="text-[11px] leading-relaxed" style={{ color: 'var(--text-secondary)' }}>
          Duration tells our team how long to block each appointment slot on your booking calendar.
        </p>
      </div>

      {/* Category blocks */}
      <div className="animate-fade-up delay-200 flex flex-col gap-3 mb-4">
        {categories.map((cat, i) => (
          <CategoryBlock
            key={cat.id} cat={cat} accent={accent} defaultOpen={i < 2}
            onUpdateService={(svcId, field, value) => updateService(cat.id, svcId, field, value)}
            onDeleteService={(svcId) => deleteService(cat.id, svcId)}
            onAddService={addServiceToCategory}
            onDeleteCategory={deleteCategory}
          />
        ))}
      </div>

      {/* Bottom actions */}
      <div className="animate-fade-up delay-300 flex items-center gap-3 mb-8">
        <button
          onClick={addCategory}
          className="flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl border border-dashed text-sm transition-all active:scale-[0.98]"
          style={{ borderColor: `${accent}30`, color: `${accent}99` }}
          onMouseEnter={(e) => { e.currentTarget.style.borderColor = accent; e.currentTarget.style.color = accent; e.currentTarget.style.background = `${accent}08`; }}
          onMouseLeave={(e) => { e.currentTarget.style.borderColor = `${accent}30`; e.currentTarget.style.color = `${accent}99`; e.currentTarget.style.background = 'transparent'; }}
        >
          <Plus className="w-4 h-4" />
          Add Category
        </button>
        <button
          onClick={() => setData({ ...data, serviceCategories: DEFAULT_CATEGORIES[businessType] })}
          className="text-[11px] transition-colors px-3 py-2.5 whitespace-nowrap"
          style={{ color: 'var(--text-faint)' }}
          onMouseEnter={(e) => { e.currentTarget.style.color = 'var(--text-muted)'; }}
          onMouseLeave={(e) => { e.currentTarget.style.color = 'var(--text-faint)'; }}
        >
          Reset defaults
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
          disabled={totalServices === 0}
          className="flex-1 flex items-center justify-center gap-2 px-6 py-3.5 rounded-full font-bold text-sm uppercase tracking-wider text-white transition-all duration-200 active:scale-95"
          style={
            totalServices > 0
              ? { background: 'var(--coral)', boxShadow: '0 4px 16px rgba(232,112,90,0.3)' }
              : { background: 'var(--bg-raised)', color: 'var(--text-faint)', cursor: 'not-allowed' }
          }
          onMouseEnter={(e) => { if (totalServices > 0) e.currentTarget.style.background = 'var(--coral-light)'; }}
          onMouseLeave={(e) => { if (totalServices > 0) e.currentTarget.style.background = 'var(--coral)'; }}
        >
          Continue
          <ChevronRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}
