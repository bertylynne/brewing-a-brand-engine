import { useState } from 'react';
import { ChevronRight, ChevronLeft, Plus, Trash2, DollarSign, Scissors, Sparkles } from 'lucide-react';

const DEFAULT_SERVICES = {
  barbershop: [
    { id: 1, name: 'Haircut', price: '25' },
    { id: 2, name: 'Fade', price: '30' },
    { id: 3, name: 'Beard Trim', price: '15' },
    { id: 4, name: 'Hot Towel Shave', price: '35' },
    { id: 5, name: 'Line-Up / Edge-Up', price: '15' },
    { id: 6, name: 'Kids Cut (12 & Under)', price: '20' },
    { id: 7, name: 'Full Service (Cut + Beard)', price: '40' },
  ],
  salon: [
    { id: 1, name: 'Blowout', price: '45' },
    { id: 2, name: 'Color Treatment', price: '80' },
    { id: 3, name: 'Balayage / Highlights', price: '120' },
    { id: 4, name: 'Deep Conditioning', price: '30' },
    { id: 5, name: 'Trim & Style', price: '40' },
    { id: 6, name: 'Facial', price: '65' },
    { id: 7, name: 'Hair Extensions (Set)', price: '200' },
  ],
};

let nextId = 100;

export default function Step4Services({ onNext, onBack, data, setData }) {
  const businessType = data.businessType || 'barbershop';
  const isBarber = businessType === 'barbershop';
  const accent = isBarber ? '#c9a227' : '#d4a0c8';

  // Initialize services from data or defaults
  const services = data.services || DEFAULT_SERVICES[businessType];

  const updateService = (id, field, value) => {
    const updated = services.map((s) => (s.id === id ? { ...s, [field]: value } : s));
    setData({ ...data, services: updated });
  };

  const deleteService = (id) => {
    const updated = services.filter((s) => s.id !== id);
    setData({ ...data, services: updated });
  };

  const addService = () => {
    const newService = { id: nextId++, name: '', price: '' };
    setData({ ...data, services: [...services, newService] });
  };

  const resetServices = () => {
    setData({ ...data, services: DEFAULT_SERVICES[businessType] });
  };

  return (
    <div className="px-5 py-8 max-w-lg mx-auto w-full">
      {/* Header */}
      <div className="animate-fade-up mb-6">
        <div className="flex items-center gap-2 mb-1">
          <div
            className="w-5 h-5 rounded-full flex items-center justify-center border"
            style={{ borderColor: `${accent}50`, background: `${accent}10` }}
          >
            <span className="text-[9px] font-bold" style={{ color: accent }}>04</span>
          </div>
          <span className="text-[11px] text-[#666] tracking-widest uppercase font-medium">Service Check</span>
        </div>
        <h2 className="text-2xl font-bold text-white tracking-tight">Your Services & Pricing</h2>
        <p className="text-[#666] text-sm mt-1 leading-relaxed">
          Edit service names and prices to match what you actually offer.
        </p>
      </div>

      {/* Business type indicator */}
      <div className="animate-fade-up delay-100 mb-5">
        <div
          className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full border text-xs font-semibold"
          style={{ borderColor: `${accent}30`, background: `${accent}08`, color: accent }}
        >
          {isBarber ? <Scissors className="w-3.5 h-3.5" /> : <Sparkles className="w-3.5 h-3.5" />}
          {isBarber ? 'Barbershop' : 'Beauty Salon'} — Standard Menu
        </div>
      </div>

      {/* Column headers */}
      <div className="animate-fade-up delay-100 flex items-center gap-2 mb-2 px-1">
        <span className="flex-1 text-[10px] text-[#555] uppercase tracking-widest font-semibold">Service Name</span>
        <div className="w-24 text-[10px] text-[#555] uppercase tracking-widest font-semibold text-right pr-2">Price ($)</div>
        <div className="w-8" />
      </div>

      {/* Service rows */}
      <div className="animate-fade-up delay-200 flex flex-col gap-2 mb-5">
        {services.map((service, idx) => (
          <div
            key={service.id}
            className="group flex items-center gap-2 rounded-xl border border-[#1a1a1a] bg-[#0e0e0e] p-2.5 transition-all duration-200 hover:border-[#252525] hover:bg-[#111] animate-fade-up"
            style={{ animationDelay: `${idx * 0.04}s` }}
          >
            {/* Row number */}
            <div className="w-5 h-5 rounded flex items-center justify-center flex-shrink-0">
              <span className="text-[10px] text-[#444] font-mono">{idx + 1}</span>
            </div>

            {/* Service name input */}
            <input
              type="text"
              value={service.name}
              onChange={(e) => updateService(service.id, 'name', e.target.value)}
              placeholder="Service name…"
              className="flex-1 bg-transparent text-[#ddd] text-sm outline-none placeholder-[#333] min-w-0"
            />

            {/* Price input */}
            <div className="flex items-center gap-1 w-24 border border-[#1e1e1e] bg-[#161616] rounded-lg px-2.5 py-1.5 focus-within:border-[#c9a227]/40 transition-colors">
              <DollarSign className="w-3 h-3 text-[#555] flex-shrink-0" />
              <input
                type="text"
                inputMode="decimal"
                value={service.price}
                onChange={(e) => {
                  const v = e.target.value.replace(/[^0-9.]/g, '');
                  updateService(service.id, 'price', v);
                }}
                placeholder="0.00"
                className="w-full bg-transparent text-[#ddd] text-sm outline-none text-right placeholder-[#333]"
              />
            </div>

            {/* Delete button */}
            <button
              onClick={() => deleteService(service.id)}
              className="w-7 h-7 rounded-lg flex items-center justify-center text-[#333] hover:text-red-400 hover:bg-red-400/10 transition-all opacity-0 group-hover:opacity-100 flex-shrink-0"
            >
              <Trash2 className="w-3.5 h-3.5" />
            </button>
          </div>
        ))}
      </div>

      {/* Add service + reset */}
      <div className="animate-fade-up delay-300 flex items-center gap-3 mb-8">
        <button
          onClick={addService}
          className="flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl border border-dashed border-[#2a2a2a] text-[#555] text-sm hover:border-[#c9a227]/40 hover:text-[#c9a227] hover:bg-[#c9a227]/5 transition-all active:scale-98"
        >
          <Plus className="w-4 h-4" />
          Add Service
        </button>
        <button
          onClick={resetServices}
          className="text-[11px] text-[#444] hover:text-[#666] transition-colors px-3 py-2.5"
        >
          Reset to defaults
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
          disabled={services.length === 0}
          className={`flex-1 flex items-center justify-center gap-2 px-6 py-3.5 rounded-full text-black font-semibold text-sm transition-all duration-200 active:scale-95 shadow-md ${
            services.length > 0 ? 'hover:scale-[1.02] hover:shadow-[#c9a227]/20' : 'opacity-40 cursor-not-allowed'
          }`}
          style={{ background: services.length > 0 ? 'linear-gradient(135deg, #c9a227 0%, #e8c96a 60%, #c9a227 100%)' : '#333' }}
        >
          Continue
          <ChevronRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}
