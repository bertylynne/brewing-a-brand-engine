import { useState, useRef } from 'react';
import { ChevronRight, ChevronLeft, Upload, UserCircle, Trash2, Plus, User } from 'lucide-react';

let nextMemberId = 300;

// Position presets keyed by business type
const POSITION_PRESETS = {
  barbershop: [
    'Master Barber',
    'Senior Barber',
    'Barber',
    'Apprentice Barber',
    'Shop Manager',
  ],
  salon: [
    'Senior Stylist',
    'Stylist',
    'Colorist',
    'Aesthetician',
    'Nail Technician',
    'Salon Manager',
  ],
  default: [
    'Owner',
    'Manager',
    'Senior Specialist',
    'Specialist',
    'Apprentice',
  ],
};

function PositionInput({ value, onChange, businessType }) {
  const [open, setOpen] = useState(false);
  const presets = POSITION_PRESETS[businessType] || POSITION_PRESETS.default;

  return (
    <div className="relative">
      <input
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        onFocus={() => setOpen(true)}
        onBlur={() => setTimeout(() => setOpen(false), 150)}
        placeholder="Position / Title"
        className="w-full bg-[#111] border border-[#1e1e1e] rounded-lg px-3 py-2 text-sm text-[#ccc] outline-none placeholder-[#333] focus:border-[#c9a227]/40 transition-colors"
      />
      {open && (
        <div className="absolute top-full left-0 right-0 mt-1 z-20 rounded-xl border border-[#222] bg-[#0e0e0e] shadow-2xl shadow-black/60 overflow-hidden">
          <div className="p-1 flex flex-col gap-0.5">
            <p className="text-[9px] text-[#444] uppercase tracking-widest px-2.5 pt-1.5 pb-1 font-semibold">
              Suggested titles
            </p>
            {presets
              .filter((p) => p.toLowerCase().includes(value.toLowerCase()) || value === '')
              .map((preset) => (
                <button
                  key={preset}
                  type="button"
                  onMouseDown={() => onChange(preset)}
                  className="text-left px-2.5 py-1.5 rounded-lg text-xs text-[#888] hover:text-[#ccc] hover:bg-[#161616] transition-colors"
                >
                  {preset}
                </button>
              ))}
          </div>
        </div>
      )}
    </div>
  );
}

function MemberCard({ member, index, businessType, onUpdate, onDelete }) {
  const fileRef = useRef();
  const [dragging, setDragging] = useState(false);

  const handleFile = (file) => {
    if (!file || !file.type.startsWith('image/')) return;
    const url = URL.createObjectURL(file);
    onUpdate(member.id, 'photo', url);
    onUpdate(member.id, 'photoName', file.name);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setDragging(false);
    handleFile(e.dataTransfer.files[0]);
  };

  return (
    <div
      className="group rounded-2xl border border-[#1a1a1a] bg-[#0d0d0d] overflow-hidden transition-all duration-200 hover:border-[#252525] animate-fade-up"
      style={{ animationDelay: `${index * 0.06}s` }}
    >
      <div className="p-4 flex items-start gap-4">

        {/* Photo upload square */}
        <div
          onDragOver={(e) => { e.preventDefault(); setDragging(true); }}
          onDragLeave={() => setDragging(false)}
          onDrop={handleDrop}
          onClick={() => fileRef.current?.click()}
          className={`w-20 h-20 rounded-xl flex-shrink-0 cursor-pointer overflow-hidden border-2 border-dashed transition-all duration-200 flex items-center justify-center relative ${
            dragging
              ? 'border-[#c9a227] bg-[#c9a227]/10'
              : member.photo
              ? 'border-[#c9a227]/30 bg-[#111]'
              : 'border-[#1e1e1e] bg-[#111] hover:border-[#2a2a2a]'
          }`}
        >
          {member.photo ? (
            <>
              <img
                src={member.photo}
                alt={member.name || 'Staff'}
                className="w-full h-full object-cover"
              />
              {/* Replace overlay */}
              <div className="absolute inset-0 bg-black/60 flex flex-col items-center justify-center opacity-0 hover:opacity-100 transition-opacity">
                <Upload className="w-4 h-4 text-white mb-0.5" />
                <span className="text-[9px] text-white/80 tracking-wide">Replace</span>
              </div>
            </>
          ) : (
            <div className="flex flex-col items-center gap-1.5">
              {dragging ? (
                <Upload className="w-5 h-5 text-[#c9a227]" />
              ) : (
                <UserCircle className="w-7 h-7 text-[#333]" />
              )}
              <span className="text-[9px] text-[#3a3a3a] tracking-wide text-center leading-tight">
                {dragging ? 'Drop photo' : 'Add photo'}
              </span>
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

        {/* Name + position */}
        <div className="flex-1 flex flex-col gap-2 min-w-0">
          {/* Member number badge */}
          <div className="flex items-center justify-between mb-0.5">
            <span className="text-[10px] text-[#444] font-mono uppercase tracking-widest">
              Team member {index + 1}
            </span>
            <button
              onClick={() => onDelete(member.id)}
              className="w-6 h-6 rounded-lg flex items-center justify-center text-[#2a2a2a] hover:text-red-400 hover:bg-red-400/10 transition-all opacity-0 group-hover:opacity-100"
            >
              <Trash2 className="w-3 h-3" />
            </button>
          </div>

          {/* Name */}
          <input
            type="text"
            value={member.name}
            onChange={(e) => onUpdate(member.id, 'name', e.target.value)}
            placeholder="Full name"
            className="w-full bg-[#111] border border-[#1e1e1e] rounded-lg px-3 py-2 text-sm text-[#ccc] font-medium outline-none placeholder-[#333] focus:border-[#c9a227]/40 transition-colors"
          />

          {/* Position with presets dropdown */}
          <PositionInput
            value={member.position}
            onChange={(v) => onUpdate(member.id, 'position', v)}
            businessType={businessType}
          />
        </div>
      </div>
    </div>
  );
}

// ─── Main component ───────────────────────────────────────────────────────────
export default function Step5Staff({ onNext, onBack, data, setData }) {
  const businessType = data.businessType || 'barbershop';
  const isBarber     = businessType === 'barbershop';
  const accent       = isBarber ? '#c9a227' : '#d4a0c8';

  const staff    = data.staff || [];
  const setStaff = (members) => setData({ ...data, staff: members });

  const addMember = () => {
    setStaff([...staff, { id: nextMemberId++, name: '', position: '', photo: null, photoName: null }]);
  };

  const updateMember = (id, field, value) => {
    setStaff(staff.map((m) => m.id === id ? { ...m, [field]: value } : m));
  };

  const deleteMember = (id) => {
    setStaff(staff.filter((m) => m.id !== id));
  };

  return (
    <div className="px-5 py-8 max-w-lg mx-auto w-full">

      {/* Header */}
      <div className="animate-fade-up mb-5">
        <div className="flex items-center gap-2 mb-1">
          <div
            className="w-5 h-5 rounded-full flex items-center justify-center border"
            style={{ borderColor: `${accent}50`, background: `${accent}10` }}
          >
            <span className="text-[9px] font-bold" style={{ color: accent }}>05</span>
          </div>
          <span className="text-[11px] text-[#666] tracking-widest uppercase font-medium">Team Roster</span>
        </div>
        <h2 className="text-2xl font-bold text-white tracking-tight">Introduce Your Team</h2>
        <p className="text-[#666] text-sm mt-1 leading-relaxed">
          Add each staff member's name, position, and photo. This builds the team section of your website and populates your booking calendar with the right profiles.
        </p>
      </div>

      {/* Count badge */}
      <div className="animate-fade-up delay-100 flex items-center justify-between mb-5">
        <div
          className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full border text-xs font-semibold"
          style={{ borderColor: `${accent}30`, background: `${accent}08`, color: accent }}
        >
          <User className="w-3.5 h-3.5" />
          {staff.length === 0
            ? 'No members added yet'
            : `${staff.length} team member${staff.length !== 1 ? 's' : ''}`}
        </div>
        {staff.length > 0 && (
          <span className="text-[11px] text-[#444]">
            Photos optional — our team can source headshots
          </span>
        )}
      </div>

      {/* Empty state */}
      {staff.length === 0 && (
        <div className="animate-fade-up delay-100 rounded-2xl border border-dashed border-[#1e1e1e] bg-[#080808] p-10 flex flex-col items-center gap-3 mb-5">
          <div
            className="w-14 h-14 rounded-full flex items-center justify-center border-2"
            style={{ borderColor: `${accent}20`, background: `${accent}08` }}
          >
            <User className="w-6 h-6" style={{ color: `${accent}60` }} />
          </div>
          <div className="text-center">
            <p className="text-[#666] text-sm font-medium">No team members yet</p>
            <p className="text-[#444] text-xs mt-1">
              Add your barbers, stylists, or aestheticians below.
            </p>
          </div>
        </div>
      )}

      {/* Member cards */}
      {staff.length > 0 && (
        <div className="flex flex-col gap-3 mb-4">
          {staff.map((member, i) => (
            <MemberCard
              key={member.id}
              member={member}
              index={i}
              businessType={businessType}
              onUpdate={updateMember}
              onDelete={deleteMember}
            />
          ))}
        </div>
      )}

      {/* Add member button */}
      <div className="animate-fade-up delay-200 mb-8">
        <button
          onClick={addMember}
          className="w-full flex items-center justify-center gap-2.5 py-3.5 rounded-2xl border border-dashed text-sm font-medium transition-all duration-200 active:scale-[0.98] hover:bg-[#c9a227]/5"
          style={{ borderColor: `${accent}25`, color: `${accent}99` }}
          onMouseEnter={(e) => {
            e.currentTarget.style.borderColor = accent;
            e.currentTarget.style.color = accent;
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.borderColor = `${accent}25`;
            e.currentTarget.style.color = `${accent}99`;
          }}
        >
          <Plus className="w-4 h-4" />
          Add Team Member
        </button>
      </div>

      {/* Skip note */}
      {staff.length === 0 && (
        <p className="text-center text-[11px] text-[#444] -mt-4 mb-6">
          Don't have this info to hand? You can skip this step — our team will follow up.
        </p>
      )}

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
          {staff.length === 0 ? 'Skip for Now' : 'Continue'}
          <ChevronRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}
