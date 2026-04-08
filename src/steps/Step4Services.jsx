import { useState } from 'react';
import { ChevronRight, ChevronLeft, Plus, Trash2, DollarSign, Scissors, Sparkles, ChevronDown, Clock } from 'lucide-react';

let nextId = 200;

// Preset duration options (minutes) for the quick-select dropdown
const DURATION_OPTIONS = ['15', '30', '45', '60', '75', '90', '120'];

// ─── Default categorised menus ────────────────────────────────────────────────
const DEFAULT_CATEGORIES = {
  barbershop: [
    {
      id: 'cat-b1',
      category: 'Cuts & Fades',
      services: [
        { id: 1, name: 'Classic Haircut',      price: '25', duration: '30' },
        { id: 2, name: 'Skin Fade',             price: '30', duration: '45' },
        { id: 3, name: 'Taper Fade',            price: '28', duration: '45' },
        { id: 4, name: 'Kids Cut (12 & Under)', price: '20', duration: '20' },
      ],
    },
    {
      id: 'cat-b2',
      category: 'Beard & Shave',
      services: [
        { id: 5, name: 'Beard Trim & Shape', price: '15', duration: '20' },
        { id: 6, name: 'Hot Towel Shave',    price: '35', duration: '30' },
        { id: 7, name: 'Line-Up / Edge-Up',  price: '15', duration: '15' },
      ],
    },
    {
      id: 'cat-b3',
      category: 'Extras',
      services: [
        { id: 8, name: 'Full Service (Cut + Beard)', price: '40', duration: '60' },
        { id: 9, name: 'Hair Wash & Style',          price: '20', duration: '20' },
      ],
    },
  ],
  salon: [
    {
      id: 'cat-s1',
      category: 'Color',
      services: [
        { id: 10, name: 'Full Color',            price: '80',  duration: '90'  },
        { id: 11, name: 'Balayage / Highlights', price: '120', duration: '120' },
        { id: 12, name: 'Gloss & Toner',          price: '50',  duration: '45'  },
      ],
    },
    {
      id: 'cat-s2',
      category: 'Styling',
      services: [
        { id: 13, name: 'Blowout',                price: '45', duration: '45' },
        { id: 14, name: 'Trim & Style',            price: '40', duration: '30' },
        { id: 15, name: 'Updo / Special Occasion', price: '75', duration: '75' },
      ],
    },
    {
      id: 'cat-s3',
      category: 'Treatments',
      services: [
        { id: 16, name: 'Deep Conditioning',    price: '30',  duration: '30'  },
        { id: 17, name: 'Hair Extensions (Set)', price: '200', duration: '120' },
        { id: 18, name: 'Facial',                price: '65',  duration: '60'  },
        { id: 19, name: 'Scalp Treatment',       price: '45',  duration: '45'  },
      ],
    },
  ],
};

// ─── Duration pill selector ───────────────────────────────────────────────────
function DurationSelect({ value, onChange, accent }) {
  const [open, setOpen] = useState(false);

  const display = value ? `${value}m` : '—';

  return (
    <div className="relative flex-shrink-0">
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        title="Appointment duration"
        className="flex items-center gap-1 h-[30px] px-2 rounded-md border border-[#1e1e1e] bg-[#111] text-[#888] text-xs font-mono hover:border-[#2a2a2a] hover:text-[#aaa] transition-all w-[52px] justify-between"
      >
        <Clock className="w-2.5 h-2.5 flex-shrink-0" style={{ color: value ? accent : '#444' }} />
        <span className={`text-xs font-mono ${value ? 'text-[#ccc]' : 'text-[#444]'}`}>{display}</span>
      </button>

      {open && (
        <>
          {/* Backdrop */}
          <div className="fixed inset-0 z-10" onClick={() => setOpen(false)} />
          {/* Dropdown */}
          <div className="absolute right-0 top-full mt-1 z-20 rounded-xl border border-[#222] bg-[#0e0e0e] shadow-2xl shadow-black/60 overflow-hidden min-w-[80px]">
            <div className="p-1 flex flex-col gap-0.5">
              {/* Custom input row */}
              <div className="flex items-center gap-1.5 px-2 py-1.5 border-b border-[#1a1a1a] mb-0.5">
                <input
                  type="text"
                  inputMode="numeric"
                  placeholder="Custom"
                  value={value && !DURATION_OPTIONS.includes(value) ? value : ''}
                  onChange={(e) => {
                    const v = e.target.value.replace(/[^0-9]/g, '');
                    onChange(v);
                  }}
                  onKeyDown={(e) => { if (e.key === 'Enter') setOpen(false); }}
                  className="w-full bg-transparent text-[#ccc] text-xs outline-none placeholder-[#333]"
                />
                <span className="text-[10px] text-[#444]">min</span>
              </div>
              {DURATION_OPTIONS.map((opt) => (
                <button
                  key={opt}
                  type="button"
                  onClick={() => { onChange(opt); setOpen(false); }}
                  className={`text-left px-2.5 py-1.5 rounded-lg text-xs transition-colors ${
                    value === opt
                      ? 'font-semibold'
                      : 'text-[#888] hover:text-[#ccc] hover:bg-[#161616]'
                  }`}
                  style={value === opt ? { color: accent, background: `${accent}15` } : {}}
                >
                  {opt} min
                </button>
              ))}
              {/* Clear */}
              {value && (
                <button
                  type="button"
                  onClick={() => { onChange(''); setOpen(false); }}
                  className="text-left px-2.5 py-1.5 rounded-lg text-[10px] text-[#444] hover:text-red-400 hover:bg-red-400/10 transition-colors border-t border-[#1a1a1a] mt-0.5"
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

// ─── Service row ─────────────────────────────────────────────────────────────
function ServiceRow({ service, onUpdate, onDelete, accent }) {
  return (
    <div className="group flex items-center gap-1.5 rounded-lg border border-[#161616] bg-[#0a0a0a] px-2.5 py-2 transition-all duration-150 hover:border-[#222] hover:bg-[#0d0d0d]">
      {/* Service name */}
      <input
        type="text"
        value={service.name}
        onChange={(e) => onUpdate(service.id, 'name', e.target.value)}
        placeholder="Service name…"
        className="flex-1 bg-transparent text-[#ccc] text-sm outline-none placeholder-[#2e2e2e] min-w-0"
      />

      {/* Price */}
      <div
        className="flex items-center gap-1 w-[76px] border rounded-md px-2 py-1 focus-within:border-opacity-60 transition-colors flex-shrink-0"
        style={{ borderColor: '#1e1e1e', background: '#111' }}
      >
        <DollarSign className="w-3 h-3 text-[#444] flex-shrink-0" />
        <input
          type="text"
          inputMode="decimal"
          value={service.price}
          onChange={(e) => {
            const v = e.target.value.replace(/[^0-9.]/g, '');
            onUpdate(service.id, 'price', v);
          }}
          placeholder="0"
          className="w-full bg-transparent text-[#ccc] text-sm outline-none text-right placeholder-[#2e2e2e]"
        />
      </div>

      {/* Duration */}
      <DurationSelect
        value={service.duration || ''}
        onChange={(v) => onUpdate(service.id, 'duration', v)}
        accent={accent}
      />

      {/* Delete */}
      <button
        onClick={() => onDelete(service.id)}
        className="w-6 h-6 rounded flex items-center justify-center text-[#2a2a2a] hover:text-red-400 hover:bg-red-400/10 transition-all opacity-0 group-hover:opacity-100 flex-shrink-0"
      >
        <Trash2 className="w-3 h-3" />
      </button>
    </div>
  );
}

// ─── Category block ───────────────────────────────────────────────────────────
function CategoryBlock({ cat, onUpdateService, onDeleteService, onAddService, onDeleteCategory, accent, defaultOpen }) {
  const [open, setOpen] = useState(defaultOpen ?? true);

  return (
    <div className="rounded-xl border border-[#1a1a1a] overflow-hidden">
      {/* Header */}
      <button
        onClick={() => setOpen((o) => !o)}
        className="w-full flex items-center justify-between px-3.5 py-2.5 bg-[#0e0e0e] hover:bg-[#111] transition-colors text-left"
      >
        <div className="flex items-center gap-2">
          <div
            className="w-1.5 h-4 rounded-full flex-shrink-0"
            style={{ background: `linear-gradient(180deg, ${accent}, ${accent}66)` }}
          />
          <span className="text-sm font-semibold text-[#ddd]">{cat.category}</span>
          <span
            className="text-[10px] font-medium px-1.5 py-0.5 rounded-full"
            style={{ background: `${accent}15`, color: accent }}
          >
            {cat.services.length}
          </span>
        </div>
        <div className="flex items-center gap-1">
          <button
            onClick={(e) => { e.stopPropagation(); onDeleteCategory(cat.id); }}
            className="w-5 h-5 rounded flex items-center justify-center text-[#2a2a2a] hover:text-red-400/70 transition-colors mr-1"
          >
            <Trash2 className="w-3 h-3" />
          </button>
          <ChevronDown
            className={`w-4 h-4 text-[#444] transition-transform duration-200 ${open ? 'rotate-180' : ''}`}
          />
        </div>
      </button>

      {/* Rows */}
      {open && (
        <div className="p-2.5 flex flex-col gap-1.5">
          {/* Column labels */}
          <div className="flex items-center gap-1.5 px-2.5 mb-0.5">
            <span className="flex-1 text-[9px] text-[#333] uppercase tracking-widest font-semibold">Name</span>
            <span className="w-[76px] text-[9px] text-[#333] uppercase tracking-widest font-semibold text-right">Price</span>
            <span className="w-[52px] flex items-center justify-center gap-1 text-[9px] text-[#333] uppercase tracking-widest font-semibold">
              <Clock className="w-2.5 h-2.5" />
              Time
            </span>
            <span className="w-6" />
          </div>

          {cat.services.length === 0 && (
            <p className="text-[11px] text-[#333] text-center py-2 italic">No services yet</p>
          )}

          {cat.services.map((svc) => (
            <ServiceRow
              key={svc.id}
              service={svc}
              onUpdate={onUpdateService}
              onDelete={onDeleteService}
              accent={accent}
            />
          ))}

          <button
            onClick={() => onAddService(cat.id)}
            className="flex items-center gap-1.5 py-1.5 px-2 text-[11px] transition-colors rounded-md hover:bg-[#111]"
            style={{ color: `${accent}80` }}
            onMouseEnter={(e) => (e.currentTarget.style.color = accent)}
            onMouseLeave={(e) => (e.currentTarget.style.color = `${accent}80`)}
          >
            <Plus className="w-3.5 h-3.5" />
            Add service to {cat.category}
          </button>
        </div>
      )}
    </div>
  );
}

// ─── Main component ───────────────────────────────────────────────────────────
export default function Step4Services({ onNext, onBack, data, setData }) {
  const businessType = data.businessType || 'barbershop';
  const isBarber     = businessType === 'barbershop';
  const accent       = isBarber ? '#c9a227' : '#d4a0c8';

  const categories    = data.serviceCategories || DEFAULT_CATEGORIES[businessType];
  const setCategories = (cats) => setData({ ...data, serviceCategories: cats });

  const updateService = (catId, svcId, field, value) => {
    setCategories(categories.map((cat) =>
      cat.id !== catId ? cat : {
        ...cat,
        services: cat.services.map((s) => s.id === svcId ? { ...s, [field]: value } : s),
      }
    ));
  };

  const deleteService = (catId, svcId) => {
    setCategories(categories.map((cat) =>
      cat.id !== catId ? cat : { ...cat, services: cat.services.filter((s) => s.id !== svcId) }
    ));
  };

  const addServiceToCategory = (catId) => {
    setCategories(categories.map((cat) =>
      cat.id !== catId ? cat : {
        ...cat,
        services: [...cat.services, { id: nextId++, name: '', price: '', duration: '' }],
      }
    ));
  };

  const deleteCategory = (catId) => {
    setCategories(categories.filter((c) => c.id !== catId));
  };

  const addCategory = () => {
    const newCat = {
      id: `cat-new-${nextId++}`,
      category: 'New Category',
      services: [{ id: nextId++, name: '', price: '', duration: '' }],
    };
    setCategories([...categories, newCat]);
  };

  const resetCategories = () => {
    setData({ ...data, serviceCategories: DEFAULT_CATEGORIES[businessType] });
  };

  const totalServices = categories.reduce((sum, c) => sum + c.services.length, 0);

  return (
    <div className="px-5 py-8 max-w-lg mx-auto w-full">
      {/* Header */}
      <div className="animate-fade-up mb-5">
        <div className="flex items-center gap-2 mb-1">
          <div
            className="w-5 h-5 rounded-full flex items-center justify-center border"
            style={{ borderColor: `${accent}50`, background: `${accent}10` }}
          >
            <span className="text-[9px] font-bold" style={{ color: accent }}>04</span>
          </div>
          <span className="text-[11px] text-[#666] tracking-widest uppercase font-medium">Service Check</span>
        </div>
        <h2 className="text-2xl font-bold text-white tracking-tight">Services, Pricing & Duration</h2>
        <p className="text-[#666] text-sm mt-1 leading-relaxed">
          Set each service's name, price, and appointment length — we'll use the timing to build your booking calendar.
        </p>
      </div>

      {/* Business type + count */}
      <div className="animate-fade-up delay-100 flex items-center justify-between mb-4">
        <div
          className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full border text-xs font-semibold"
          style={{ borderColor: `${accent}30`, background: `${accent}08`, color: accent }}
        >
          {isBarber ? <Scissors className="w-3.5 h-3.5" /> : <Sparkles className="w-3.5 h-3.5" />}
          {isBarber ? 'Barbershop' : 'Beauty Salon'} Menu
        </div>
        <span className="text-[11px] text-[#555]">
          {totalServices} service{totalServices !== 1 ? 's' : ''} · {categories.length} categories
        </span>
      </div>

      {/* Calendar context callout */}
      <div className="animate-fade-up delay-100 mb-5 flex items-start gap-2.5 bg-[#c9a227]/5 border border-[#c9a227]/15 rounded-xl px-3.5 py-3">
        <Clock className="w-4 h-4 text-[#c9a227] flex-shrink-0 mt-0.5" />
        <p className="text-[11px] text-[#888] leading-relaxed">
          Duration sets how long each slot is blocked on your booking calendar. Click the clock icon on any row to choose or type a custom time in minutes.
        </p>
      </div>

      {/* Category blocks */}
      <div className="animate-fade-up delay-200 flex flex-col gap-3 mb-4">
        {categories.map((cat, i) => (
          <CategoryBlock
            key={cat.id}
            cat={cat}
            accent={accent}
            defaultOpen={i < 2}
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
          className="flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl border border-dashed text-sm transition-all active:scale-[0.98] hover:bg-[#c9a227]/5"
          style={{ borderColor: `${accent}30`, color: `${accent}aa` }}
          onMouseEnter={(e) => { e.currentTarget.style.borderColor = accent; e.currentTarget.style.color = accent; }}
          onMouseLeave={(e) => { e.currentTarget.style.borderColor = `${accent}30`; e.currentTarget.style.color = `${accent}aa`; }}
        >
          <Plus className="w-4 h-4" />
          Add Category
        </button>
        <button
          onClick={resetCategories}
          className="text-[11px] text-[#444] hover:text-[#666] transition-colors px-3 py-2.5 whitespace-nowrap"
        >
          Reset defaults
        </button>
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
          disabled={totalServices === 0}
          className={`flex-1 flex items-center justify-center gap-2 px-6 py-3.5 rounded-full text-black font-semibold text-sm transition-all duration-200 active:scale-95 shadow-md ${
            totalServices > 0 ? 'hover:scale-[1.02] hover:shadow-[#c9a227]/20' : 'opacity-40 cursor-not-allowed'
          }`}
          style={{ background: totalServices > 0 ? 'linear-gradient(135deg, #c9a227 0%, #e8c96a 60%, #c9a227 100%)' : '#333' }}
        >
          Continue
          <ChevronRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}
