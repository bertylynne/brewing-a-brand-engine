import { useState, useRef } from 'react';
import {
  ChevronRight, ChevronLeft, Upload, UserCircle,
  Trash2, Plus, Users, Link, Mail, Phone, ImageIcon,
} from 'lucide-react';

let nextMemberId = 300;

const POSITION_PRESETS = {
  barbershop: ['Master Barber', 'Senior Barber', 'Barber', 'Apprentice Barber', 'Shop Manager'],
  salon:      ['Senior Stylist', 'Stylist', 'Colorist', 'Aesthetician', 'Nail Technician', 'Salon Manager'],
  default:    ['Owner', 'Manager', 'Senior Specialist', 'Specialist', 'Apprentice'],
};

// ─── Title dropdown ────────────────────────────────────────────────────────────
function TitleInput({ value, onChange, businessType }) {
  const [open, setOpen] = useState(false);
  const presets = POSITION_PRESETS[businessType] || POSITION_PRESETS.default;
  const filtered = presets.filter(
    (p) => value === '' || p.toLowerCase().includes(value.toLowerCase())
  );

  return (
    <div className="relative">
      <input
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        onFocus={() => setOpen(true)}
        onBlur={() => setTimeout(() => setOpen(false), 150)}
        placeholder="Title / Position"
        className="w-full bg-[#0e0e0e] border border-[#1e1e1e] rounded-lg px-3 py-2.5 text-sm text-[#ccc] outline-none placeholder-[#333] focus:border-[#c9a227]/40 transition-colors"
      />
      {open && filtered.length > 0 && (
        <div className="absolute top-full left-0 right-0 mt-1 z-30 rounded-xl border border-[#222] bg-[#0a0a0a] shadow-2xl shadow-black/70 overflow-hidden">
          <div className="p-1 flex flex-col gap-0.5">
            <p className="text-[9px] text-[#444] uppercase tracking-widest px-2.5 pt-1.5 pb-1 font-semibold">
              Suggested titles
            </p>
            {filtered.map((preset) => (
              <button
                key={preset}
                type="button"
                onMouseDown={() => onChange(preset)}
                className="text-left px-2.5 py-1.5 rounded-lg text-xs text-[#777] hover:text-[#ccc] hover:bg-[#161616] transition-colors"
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

// ─── Member card ───────────────────────────────────────────────────────────────
function MemberCard({ member, index, businessType, accent, onUpdate, onDelete }) {
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
      className="rounded-2xl border border-[#1a1a1a] bg-[#0d0d0d] overflow-hidden transition-all duration-200 hover:border-[#252525] animate-fade-up"
      style={{ animationDelay: `${index * 0.07}s` }}
    >
      {/* ── Card header bar ── */}
      <div className="flex items-center justify-between px-4 pt-4 pb-3 border-b border-[#141414]">
        <div className="flex items-center gap-2">
          <div
            className="w-5 h-5 rounded-full flex items-center justify-center text-[9px] font-bold text-black"
            style={{ background: accent }}
          >
            {index + 1}
          </div>
          <span className="text-[11px] text-[#555] uppercase tracking-widest font-semibold">
            Team Member
          </span>
        </div>
        <button
          onClick={() => onDelete(member.id)}
          className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-[#333] hover:text-red-400 hover:bg-red-400/10 transition-all text-[11px] font-medium"
        >
          <Trash2 className="w-3 h-3" />
          Remove
        </button>
      </div>

      <div className="p-4 flex flex-col gap-5">

        {/* ── Section A: Public Profile ── */}
        <div>
          <p className="text-[10px] text-[#555] uppercase tracking-widest font-semibold mb-3">
            Public Profile
          </p>

          {/* 16:9 Photo upload */}
          <div
            onDragOver={(e) => { e.preventDefault(); setDragging(true); }}
            onDragLeave={() => setDragging(false)}
            onDrop={handleDrop}
            onClick={() => fileRef.current?.click()}
            className={`relative w-full rounded-xl overflow-hidden border-2 border-dashed cursor-pointer transition-all duration-200 mb-3 ${
              dragging
                ? 'border-[#c9a227] bg-[#c9a227]/8'
                : member.photo
                ? 'border-[#c9a227]/30 bg-[#111]'
                : 'border-[#1e1e1e] bg-[#0a0a0a] hover:border-[#2a2a2a] hover:bg-[#0e0e0e]'
            }`}
            style={{ aspectRatio: '16 / 9' }}
          >
            {member.photo ? (
              <>
                <img
                  src={member.photo}
                  alt={member.name || 'Staff'}
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-black/55 flex flex-col items-center justify-center opacity-0 hover:opacity-100 transition-opacity gap-1.5">
                  <Upload className="w-5 h-5 text-white" />
                  <span className="text-[11px] text-white/80 font-medium">Replace photo</span>
                </div>
                {/* Filename tag */}
                <div className="absolute bottom-2 left-2 right-2">
                  <div className="bg-black/60 backdrop-blur-sm rounded-lg px-2.5 py-1.5 flex items-center gap-1.5">
                    <ImageIcon className="w-3 h-3 text-[#c9a227]" />
                    <span className="text-[10px] text-white/70 truncate">{member.photoName}</span>
                  </div>
                </div>
              </>
            ) : (
              <div className="absolute inset-0 flex flex-col items-center justify-center gap-2">
                {dragging ? (
                  <>
                    <Upload className="w-6 h-6 text-[#c9a227]" />
                    <span className="text-xs text-[#c9a227] font-medium">Drop to upload</span>
                  </>
                ) : (
                  <>
                    <div
                      className="w-10 h-10 rounded-full flex items-center justify-center border"
                      style={{ borderColor: `${accent}25`, background: `${accent}08` }}
                    >
                      <UserCircle className="w-5 h-5" style={{ color: `${accent}50` }} />
                    </div>
                    <div className="text-center">
                      <p className="text-[#666] text-xs font-medium">Upload headshot</p>
                      <p className="text-[#3a3a3a] text-[10px] mt-0.5">
                        Landscape · 16:9 ratio recommended
                      </p>
                    </div>
                  </>
                )}
              </div>
            )}

            {/* 16:9 ratio badge */}
            {!member.photo && (
              <div className="absolute top-2 right-2 px-1.5 py-0.5 rounded border border-[#1e1e1e] bg-[#0a0a0a] flex items-center gap-1">
                <div className="w-4 h-2.5 border border-[#444] rounded-[2px]" />
                <span className="text-[9px] text-[#444] font-mono">16:9</span>
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

          {/* Name + Title row */}
          <div className="grid grid-cols-2 gap-2.5 mb-2.5">
            <div>
              <label className="block text-[10px] text-[#555] uppercase tracking-widest font-semibold mb-1.5">
                Full Name
              </label>
              <input
                type="text"
                value={member.name}
                onChange={(e) => onUpdate(member.id, 'name', e.target.value)}
                placeholder="e.g. Marcus Webb"
                className="w-full bg-[#0e0e0e] border border-[#1e1e1e] rounded-lg px-3 py-2.5 text-sm text-[#ccc] outline-none placeholder-[#2e2e2e] focus:border-[#c9a227]/40 transition-colors"
              />
            </div>
            <div>
              <label className="block text-[10px] text-[#555] uppercase tracking-widest font-semibold mb-1.5">
                Title
              </label>
              <TitleInput
                value={member.title}
                onChange={(v) => onUpdate(member.id, 'title', v)}
                businessType={businessType}
              />
            </div>
          </div>

          {/* Booking link */}
          <div>
            <label className="block text-[10px] text-[#555] uppercase tracking-widest font-semibold mb-2">
              Booking Link
            </label>

            {/* Three-option selector */}
            <div className="grid grid-cols-3 gap-1.5 mb-2.5">
              {[
                { value: 'none',   label: 'None',          sub: 'No booking needed'   },
                { value: 'create', label: 'Build One',      sub: 'CBA will create it'  },
                { value: 'has',    label: 'I Have One',     sub: 'Paste link below'    },
              ].map((opt) => {
                const isActive = (member.bookingStatus || 'none') === opt.value;
                return (
                  <button
                    key={opt.value}
                    type="button"
                    onClick={() => {
                      onUpdate(member.id, 'bookingStatus', opt.value);
                      if (opt.value !== 'has') onUpdate(member.id, 'bookingLink', '');
                    }}
                    className="flex flex-col items-center gap-0.5 px-2 py-2.5 rounded-xl border transition-all duration-150 active:scale-[0.97]"
                    style={
                      isActive
                        ? { borderColor: `${accent}60`, background: `${accent}10`, color: accent }
                        : { borderColor: '#1a1a1a', background: '#0a0a0a', color: '#555' }
                    }
                  >
                    <span className={`text-xs font-semibold leading-tight ${isActive ? '' : 'text-[#666]'}`}>
                      {opt.label}
                    </span>
                    <span className="text-[9px] leading-tight text-center" style={{ color: isActive ? `${accent}99` : '#383838' }}>
                      {opt.sub}
                    </span>
                  </button>
                );
              })}
            </div>

            {/* Build-one callout */}
            {(member.bookingStatus || 'none') === 'create' && (
              <div
                className="flex items-start gap-2.5 rounded-xl border px-3 py-2.5"
                style={{ borderColor: `${accent}20`, background: `${accent}08` }}
              >
                <div className="w-4 h-4 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5" style={{ background: `${accent}20` }}>
                  <div className="w-1.5 h-1.5 rounded-full" style={{ background: accent }} />
                </div>
                <p className="text-[11px] leading-relaxed" style={{ color: `${accent}cc` }}>
                  Got it — CBA Solutions will build and configure a booking page for this team member as part of your website setup.
                </p>
              </div>
            )}

            {/* URL input — only when "I have one" */}
            {(member.bookingStatus || 'none') === 'has' && (
              <div className="flex items-center gap-2 bg-[#0e0e0e] border border-[#1e1e1e] rounded-lg px-3 py-2.5 focus-within:border-[#c9a227]/40 transition-colors">
                <Link className="w-3.5 h-3.5 text-[#444] flex-shrink-0" />
                <input
                  type="url"
                  value={member.bookingLink}
                  onChange={(e) => onUpdate(member.id, 'bookingLink', e.target.value)}
                  placeholder="https://booksy.com/..."
                  className="flex-1 bg-transparent text-sm text-[#ccc] outline-none placeholder-[#2e2e2e] min-w-0"
                  autoFocus
                />
              </div>
            )}
          </div>
        </div>

        {/* ── Divider ── */}
        <div className="flex items-center gap-3">
          <div className="flex-1 h-px bg-[#141414]" />
          <div className="flex items-center gap-1.5">
            <div className="w-1 h-1 rounded-full bg-[#252525]" />
            <span className="text-[9px] text-[#333] uppercase tracking-widest font-semibold">Internal Use Only</span>
            <div className="w-1 h-1 rounded-full bg-[#252525]" />
          </div>
          <div className="flex-1 h-px bg-[#141414]" />
        </div>

        {/* ── Section B: Internal Contact ── */}
        <div>
          <div className="flex items-start justify-between mb-3">
            <p className="text-[10px] text-[#555] uppercase tracking-widest font-semibold">
              Internal Contact
            </p>
          </div>

          <div className="grid grid-cols-2 gap-2.5 mb-2">
            {/* Personal email */}
            <div>
              <label className="block text-[10px] text-[#444] uppercase tracking-widest font-semibold mb-1.5">
                Email
              </label>
              <div className="flex items-center gap-2 bg-[#0a0a0a] border border-[#161616] rounded-lg px-3 py-2.5 focus-within:border-[#c9a227]/30 transition-colors">
                <Mail className="w-3 h-3 text-[#3a3a3a] flex-shrink-0" />
                <input
                  type="email"
                  value={member.contactEmail}
                  onChange={(e) => onUpdate(member.id, 'contactEmail', e.target.value)}
                  placeholder="name@email.com"
                  className="flex-1 bg-transparent text-xs text-[#aaa] outline-none placeholder-[#2a2a2a] min-w-0"
                />
              </div>
            </div>

            {/* Personal phone */}
            <div>
              <label className="block text-[10px] text-[#444] uppercase tracking-widest font-semibold mb-1.5">
                Phone
              </label>
              <div className="flex items-center gap-2 bg-[#0a0a0a] border border-[#161616] rounded-lg px-3 py-2.5 focus-within:border-[#c9a227]/30 transition-colors">
                <Phone className="w-3 h-3 text-[#3a3a3a] flex-shrink-0" />
                <input
                  type="tel"
                  value={member.contactPhone}
                  onChange={(e) => onUpdate(member.id, 'contactPhone', e.target.value)}
                  placeholder="(000) 000-0000"
                  className="flex-1 bg-transparent text-xs text-[#aaa] outline-none placeholder-[#2a2a2a] min-w-0"
                />
              </div>
            </div>
          </div>

          {/* Caption */}
          <p className="text-[11px] text-[#3a3a3a] leading-relaxed">
            Used for individual tech support and portfolio setup.
          </p>
        </div>

      </div>
    </div>
  );
}

// ─── Main component ────────────────────────────────────────────────────────────
export default function Step5Staff({ onNext, onBack, data, setData }) {
  const businessType = data.businessType || 'barbershop';
  const isBarber     = businessType === 'barbershop';
  const accent       = isBarber ? '#c9a227' : '#d4a0c8';

  const staff    = data.staff || [];
  const setStaff = (members) => setData({ ...data, staff: members });

  const addMember = () => {
    setStaff([
      ...staff,
      {
        id: nextMemberId++,
        name: '', title: '', photo: null, photoName: null,
        bookingStatus: 'none', bookingLink: '',
        contactEmail: '', contactPhone: '',
      },
    ]);
  };

  const updateMember = (id, field, value) =>
    setStaff(staff.map((m) => (m.id === id ? { ...m, [field]: value } : m)));

  const deleteMember = (id) =>
    setStaff(staff.filter((m) => m.id !== id));

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
          Add each team member's profile and contact details. This builds your website's team section and connects individual booking calendars.
        </p>
      </div>

      {/* Count pill */}
      <div className="animate-fade-up delay-100 flex items-center justify-between mb-5">
        <div
          className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full border text-xs font-semibold"
          style={{ borderColor: `${accent}30`, background: `${accent}08`, color: accent }}
        >
          <Users className="w-3.5 h-3.5" />
          {staff.length === 0
            ? 'No members added'
            : `${staff.length} member${staff.length !== 1 ? 's' : ''} added`}
        </div>
      </div>

      {/* Empty state */}
      {staff.length === 0 && (
        <div
          className="animate-fade-up delay-100 rounded-2xl border border-dashed bg-[#080808] p-10 flex flex-col items-center gap-3 mb-5"
          style={{ borderColor: `${accent}15` }}
        >
          <div
            className="w-14 h-14 rounded-full flex items-center justify-center border-2"
            style={{ borderColor: `${accent}20`, background: `${accent}08` }}
          >
            <Users className="w-6 h-6" style={{ color: `${accent}50` }} />
          </div>
          <div className="text-center">
            <p className="text-[#666] text-sm font-medium">No team members yet</p>
            <p className="text-[#444] text-xs mt-1 max-w-[220px]">
              Add your barbers, stylists, or aestheticians using the button below.
            </p>
          </div>
        </div>
      )}

      {/* Cards */}
      {staff.length > 0 && (
        <div className="flex flex-col gap-4 mb-4">
          {staff.map((member, i) => (
            <MemberCard
              key={member.id}
              member={member}
              index={i}
              businessType={businessType}
              accent={accent}
              onUpdate={updateMember}
              onDelete={deleteMember}
            />
          ))}
        </div>
      )}

      {/* Add button */}
      <div className="animate-fade-up delay-200 mb-3">
        <button
          onClick={addMember}
          className="w-full flex items-center justify-center gap-2.5 py-4 rounded-2xl border border-dashed text-sm font-semibold transition-all duration-200 active:scale-[0.98]"
          style={{ borderColor: `${accent}25`, color: `${accent}80` }}
          onMouseEnter={(e) => {
            e.currentTarget.style.borderColor = accent;
            e.currentTarget.style.color = accent;
            e.currentTarget.style.background = `${accent}08`;
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.borderColor = `${accent}25`;
            e.currentTarget.style.color = `${accent}80`;
            e.currentTarget.style.background = 'transparent';
          }}
        >
          <Plus className="w-4 h-4" />
          Add Another Team Member
        </button>
      </div>

      {/* Skip note */}
      {staff.length === 0 && (
        <p className="text-center text-[11px] text-[#3a3a3a] mb-6">
          Don't have this to hand? Skip for now — our team will follow up before launch.
        </p>
      )}

      {/* Navigation */}
      <div className="animate-fade-up delay-300 flex gap-3 mt-5">
        <button
          onClick={onBack}
          className="flex items-center gap-2 px-5 py-3.5 rounded-full border border-[#1e1e1e] text-[#555] text-sm font-medium hover:border-[#2a2a2a] hover:text-[#777] transition-all active:scale-95"
        >
          <ChevronLeft className="w-4 h-4" />
          Back
        </button>
        <button
          onClick={onNext}
          className="flex-1 flex items-center justify-center gap-2 px-6 py-3.5 rounded-full text-black font-semibold text-sm transition-all duration-200 hover:scale-[1.02] active:scale-95 shadow-md hover:shadow-[#c9a227]/20"
          style={{ background: 'linear-gradient(135deg, #c9a227 0%, #e8c96a 60%, #c9a227 100%)' }}
        >
          {staff.length === 0 ? 'Skip for Now' : 'Continue to Brief'}
          <ChevronRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}
