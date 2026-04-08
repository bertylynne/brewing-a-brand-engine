import { useState, useRef } from 'react';
import {
  ChevronRight, ChevronLeft, Upload, UserCircle,
  Trash2, Plus, Users, Link, Mail, Phone, ImageIcon, Briefcase,
} from 'lucide-react';

let nextMemberId = 300;

const POSITION_PRESETS = {
  barbershop: ['Master Barber', 'Senior Barber', 'Barber', 'Apprentice Barber', 'Shop Manager'],
  salon:      ['Senior Stylist', 'Stylist', 'Colorist', 'Aesthetician', 'Nail Technician', 'Salon Manager'],
  default:    ['Owner', 'Manager', 'Senior Specialist', 'Specialist', 'Apprentice'],
};

function TitleInput({ value, onChange, businessType }) {
  const [open, setOpen] = useState(false);
  const presets = POSITION_PRESETS[businessType] || POSITION_PRESETS.default;
  const filtered = presets.filter((p) => value === '' || p.toLowerCase().includes(value.toLowerCase()));

  return (
    <div className="relative">
      <input
        type="text" value={value}
        onChange={(e) => onChange(e.target.value)}
        onFocus={() => setOpen(true)}
        onBlur={() => setTimeout(() => setOpen(false), 150)}
        placeholder="Title / Position"
        className="w-full rounded-lg px-3 py-2.5 text-sm outline-none transition-colors border"
        style={{ background: 'var(--bg-surface)', borderColor: 'var(--border)', color: 'var(--text-primary)' }}
      />
      {open && filtered.length > 0 && (
        <div className="absolute top-full left-0 right-0 mt-1 z-30 rounded-xl border shadow-2xl overflow-hidden" style={{ borderColor: 'var(--border)', background: 'var(--bg-card)' }}>
          <div className="p-1 flex flex-col gap-0.5">
            <p className="text-[9px] uppercase tracking-widest px-2.5 pt-1.5 pb-1 font-semibold" style={{ color: 'var(--text-faint)' }}>
              Suggested titles
            </p>
            {filtered.map((preset) => (
              <button
                key={preset} type="button" onMouseDown={() => onChange(preset)}
                className="text-left px-2.5 py-1.5 rounded-lg text-xs transition-colors"
                style={{ color: 'var(--text-secondary)' }}
                onMouseEnter={(e) => { e.currentTarget.style.color = 'var(--text-primary)'; e.currentTarget.style.background = 'var(--bg-raised)'; }}
                onMouseLeave={(e) => { e.currentTarget.style.color = 'var(--text-secondary)'; e.currentTarget.style.background = 'transparent'; }}
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

function MemberCard({ member, index, businessType, accent, onUpdate, onDelete }) {
  const fileRef = useRef();
  const [dragging, setDragging] = useState(false);

  const handleFile = (file) => {
    if (!file || !file.type.startsWith('image/')) return;
    onUpdate(member.id, 'photo', URL.createObjectURL(file));
    onUpdate(member.id, 'photoName', file.name);
  };

  return (
    <div
      className="rounded-2xl border overflow-hidden transition-all duration-200 animate-fade-up"
      style={{ borderColor: 'var(--border)', background: 'var(--bg-card)', animationDelay: `${index * 0.07}s` }}
    >
      {/* Card header */}
      <div className="flex items-center justify-between px-4 pt-4 pb-3 border-b" style={{ borderColor: 'var(--border-sub)' }}>
        <div className="flex items-center gap-2">
          <div className="w-5 h-5 rounded-full flex items-center justify-center text-[9px] font-bold text-white" style={{ background: accent }}>
            {index + 1}
          </div>
          <span className="text-[11px] uppercase tracking-widest font-semibold" style={{ color: 'var(--text-muted)' }}>
            Team Member
          </span>
        </div>
        <button
          onClick={() => onDelete(member.id)}
          className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-[11px] font-medium transition-all"
          style={{ color: 'var(--text-faint)' }}
          onMouseEnter={(e) => { e.currentTarget.style.color = '#f87171'; e.currentTarget.style.background = 'rgba(248,113,113,0.1)'; }}
          onMouseLeave={(e) => { e.currentTarget.style.color = 'var(--text-faint)'; e.currentTarget.style.background = 'transparent'; }}
        >
          <Trash2 className="w-3 h-3" />
          Remove
        </button>
      </div>

      <div className="p-4 flex flex-col gap-5">
        {/* Public Profile */}
        <div>
          <p className="text-[10px] uppercase tracking-widest font-semibold mb-3" style={{ color: 'var(--text-muted)' }}>
            Public Profile
          </p>

          {/* Photo upload 16:9 */}
          <div
            onDragOver={(e) => { e.preventDefault(); setDragging(true); }}
            onDragLeave={() => setDragging(false)}
            onDrop={(e) => { e.preventDefault(); setDragging(false); handleFile(e.dataTransfer.files[0]); }}
            onClick={() => fileRef.current?.click()}
            className="relative w-full rounded-xl overflow-hidden border-2 border-dashed cursor-pointer transition-all duration-200 mb-3"
            style={{
              aspectRatio: '16 / 9',
              borderColor: dragging ? 'var(--gold)' : member.photo ? `${accent}40` : 'var(--border)',
              background: dragging ? 'rgba(201,162,39,0.06)' : member.photo ? 'var(--bg-raised)' : 'var(--bg-surface)',
            }}
          >
            {member.photo ? (
              <>
                <img src={member.photo} alt={member.name || 'Staff'} className="w-full h-full object-cover" />
                <div className="absolute inset-0 bg-black/55 flex flex-col items-center justify-center opacity-0 hover:opacity-100 transition-opacity gap-1.5">
                  <Upload className="w-5 h-5 text-white" />
                  <span className="text-[11px] text-white/80 font-medium">Replace photo</span>
                </div>
                <div className="absolute bottom-2 left-2 right-2">
                  <div className="bg-black/60 backdrop-blur-sm rounded-lg px-2.5 py-1.5 flex items-center gap-1.5">
                    <ImageIcon className="w-3 h-3" style={{ color: 'var(--gold)' }} />
                    <span className="text-[10px] text-white/70 truncate">{member.photoName}</span>
                  </div>
                </div>
              </>
            ) : (
              <div className="absolute inset-0 flex flex-col items-center justify-center gap-2">
                {dragging ? (
                  <>
                    <Upload className="w-6 h-6" style={{ color: 'var(--gold)' }} />
                    <span className="text-xs font-medium" style={{ color: 'var(--gold)' }}>Drop to upload</span>
                  </>
                ) : (
                  <>
                    <div className="w-10 h-10 rounded-full flex items-center justify-center border" style={{ borderColor: `${accent}25`, background: `${accent}08` }}>
                      <UserCircle className="w-5 h-5" style={{ color: `${accent}60` }} />
                    </div>
                    <div className="text-center">
                      <p className="text-xs font-medium" style={{ color: 'var(--text-secondary)' }}>Upload headshot</p>
                      <p className="text-[10px] mt-0.5" style={{ color: 'var(--text-faint)' }}>Landscape · 16:9 ratio recommended</p>
                    </div>
                  </>
                )}
              </div>
            )}
            {!member.photo && (
              <div className="absolute top-2 right-2 px-1.5 py-0.5 rounded border flex items-center gap-1" style={{ borderColor: 'var(--border)', background: 'var(--bg-surface)' }}>
                <div className="w-4 h-2.5 border rounded-[2px]" style={{ borderColor: 'var(--text-muted)' }} />
                <span className="text-[9px] font-mono" style={{ color: 'var(--text-muted)' }}>16:9</span>
              </div>
            )}
          </div>
          <input ref={fileRef} type="file" accept="image/*" className="hidden" onChange={(e) => handleFile(e.target.files[0])} />

          {/* Name + Title */}
          <div className="grid grid-cols-2 gap-2.5 mb-2.5">
            <div>
              <label className="block text-[10px] uppercase tracking-widest font-semibold mb-1.5" style={{ color: 'var(--text-faint)' }}>Full Name</label>
              <input
                type="text" value={member.name}
                onChange={(e) => onUpdate(member.id, 'name', e.target.value)}
                placeholder="e.g. Marcus Webb"
                className="w-full rounded-lg px-3 py-2.5 text-sm outline-none transition-colors border"
                style={{ background: 'var(--bg-surface)', borderColor: 'var(--border)', color: 'var(--text-primary)' }}
              />
            </div>
            <div>
              <label className="block text-[10px] uppercase tracking-widest font-semibold mb-1.5" style={{ color: 'var(--text-faint)' }}>Title</label>
              <TitleInput value={member.title} onChange={(v) => onUpdate(member.id, 'title', v)} businessType={businessType} />
            </div>
          </div>

          {/* Booking link */}
          <div>
            <label className="block text-[10px] uppercase tracking-widest font-semibold mb-2" style={{ color: 'var(--text-faint)' }}>Booking Link</label>
            <div className="grid grid-cols-3 gap-1.5 mb-2.5">
              {[
                { value: 'none',   label: 'None',      sub: 'No booking needed'  },
                { value: 'create', label: 'Build One',  sub: 'CBA will create it' },
                { value: 'has',    label: 'I Have One', sub: 'Paste link below'   },
              ].map((opt) => {
                const isActive = (member.bookingStatus || 'none') === opt.value;
                return (
                  <button
                    key={opt.value} type="button"
                    onClick={() => {
                      onUpdate(member.id, 'bookingStatus', opt.value);
                      if (opt.value !== 'has') onUpdate(member.id, 'bookingLink', '');
                    }}
                    className="flex flex-col items-center gap-0.5 px-2 py-2.5 rounded-xl border transition-all duration-150 active:scale-[0.97]"
                    style={
                      isActive
                        ? { borderColor: `${accent}60`, background: `${accent}10`, color: accent }
                        : { borderColor: 'var(--border)', background: 'var(--bg-surface)', color: 'var(--text-muted)' }
                    }
                  >
                    <span className="text-xs font-semibold leading-tight">{opt.label}</span>
                    <span className="text-[9px] leading-tight text-center" style={{ color: isActive ? `${accent}99` : 'var(--text-faint)' }}>
                      {opt.sub}
                    </span>
                  </button>
                );
              })}
            </div>

            {(member.bookingStatus || 'none') === 'create' && (
              <div className="flex items-start gap-2.5 rounded-xl border px-3 py-2.5" style={{ borderColor: `${accent}25`, background: `${accent}08` }}>
                <div className="w-4 h-4 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5" style={{ background: `${accent}25` }}>
                  <div className="w-1.5 h-1.5 rounded-full" style={{ background: accent }} />
                </div>
                <p className="text-[11px] leading-relaxed" style={{ color: `${accent}cc` }}>
                  Got it — CBA Solutions will build and configure a booking page for this team member as part of your website setup.
                </p>
              </div>
            )}

            {(member.bookingStatus || 'none') === 'has' && (
              <div className="flex items-center gap-2 rounded-lg px-3 py-2.5 focus-within:border-opacity-60 transition-colors border" style={{ background: 'var(--bg-surface)', borderColor: 'var(--border)' }}>
                <Link className="w-3.5 h-3.5 flex-shrink-0" style={{ color: 'var(--text-faint)' }} />
                <input
                  type="url" value={member.bookingLink}
                  onChange={(e) => onUpdate(member.id, 'bookingLink', e.target.value)}
                  placeholder="https://booksy.com/..."
                  className="flex-1 bg-transparent text-sm outline-none min-w-0"
                  style={{ color: 'var(--text-primary)' }}
                  autoFocus
                />
              </div>
            )}
          </div>
        </div>

        {/* Divider */}
        <div className="flex items-center gap-3">
          <div className="flex-1 h-px" style={{ background: 'var(--border-sub)' }} />
          <div className="flex items-center gap-1.5">
            <div className="w-1 h-1 rounded-full" style={{ background: 'var(--border)' }} />
            <span className="text-[9px] uppercase tracking-widest font-semibold" style={{ color: 'var(--text-faint)' }}>Internal Use Only</span>
            <div className="w-1 h-1 rounded-full" style={{ background: 'var(--border)' }} />
          </div>
          <div className="flex-1 h-px" style={{ background: 'var(--border-sub)' }} />
        </div>

        {/* Internal Contact */}
        <div>
          <p className="text-[10px] uppercase tracking-widest font-semibold mb-3" style={{ color: 'var(--text-muted)' }}>Internal Contact</p>
          <div className="grid grid-cols-2 gap-2.5 mb-2">
            <div>
              <label className="block text-[10px] uppercase tracking-widest font-semibold mb-1.5" style={{ color: 'var(--text-faint)' }}>Email</label>
              <div className="flex items-center gap-2 rounded-lg px-3 py-2.5 border transition-colors" style={{ background: 'var(--bg-surface)', borderColor: 'var(--border-sub)' }}>
                <Mail className="w-3 h-3 flex-shrink-0" style={{ color: 'var(--text-faint)' }} />
                <input type="email" value={member.contactEmail} onChange={(e) => onUpdate(member.id, 'contactEmail', e.target.value)} placeholder="name@email.com" className="flex-1 bg-transparent text-xs outline-none min-w-0" style={{ color: 'var(--text-primary)' }} />
              </div>
            </div>
            <div>
              <label className="block text-[10px] uppercase tracking-widest font-semibold mb-1.5" style={{ color: 'var(--text-faint)' }}>Phone</label>
              <div className="flex items-center gap-2 rounded-lg px-3 py-2.5 border transition-colors" style={{ background: 'var(--bg-surface)', borderColor: 'var(--border-sub)' }}>
                <Phone className="w-3 h-3 flex-shrink-0" style={{ color: 'var(--text-faint)' }} />
                <input type="tel" value={member.contactPhone} onChange={(e) => onUpdate(member.id, 'contactPhone', e.target.value)} placeholder="(000) 000-0000" className="flex-1 bg-transparent text-xs outline-none min-w-0" style={{ color: 'var(--text-primary)' }} />
              </div>
            </div>
          </div>
          <p className="text-[11px] leading-relaxed" style={{ color: 'var(--text-faint)' }}>Used for individual tech support and portfolio setup.</p>
        </div>
      </div>
    </div>
  );
}

export default function Step5Staff({ onNext, onBack, data, setData }) {
  const businessType = data.businessType || 'barbershop';
  const isBarber     = businessType === 'barbershop';
  const accent       = isBarber ? '#c9a227' : '#d4a0c8';

  const staff    = data.staff || [];
  const setStaff = (members) => setData({ ...data, staff: members });

  const hiring    = data.hiring || { active: false, roles: [], description: '' };
  const setHiring = (h) => setData({ ...data, hiring: h });

  const HIRING_ROLES = isBarber
    ? ['Barber', 'Apprentice Barber', 'Master Barber', 'Shop Manager']
    : ['Stylist', 'Colorist', 'Aesthetician', 'Nail Technician', 'Salon Manager'];

  const toggleRole = (role) => setHiring({ ...hiring, roles: hiring.roles.includes(role) ? hiring.roles.filter((r) => r !== role) : [...hiring.roles, role] });

  const addMember = () => setStaff([...staff, { id: nextMemberId++, name: '', title: '', photo: null, photoName: null, bookingStatus: 'none', bookingLink: '', contactEmail: '', contactPhone: '' }]);
  const updateMember = (id, field, value) => setStaff(staff.map((m) => (m.id === id ? { ...m, [field]: value } : m)));
  const deleteMember = (id) => setStaff(staff.filter((m) => m.id !== id));

  return (
    <div className="px-5 py-8 max-w-lg mx-auto w-full">
      {/* Header */}
      <div className="animate-fade-up mb-5">
        <p className="text-[11px] tracking-[0.2em] uppercase font-semibold mb-2" style={{ color: 'var(--coral)' }}>
          — Step 05 —
        </p>
        <h2 className="font-serif-display text-2xl font-bold tracking-tight" style={{ color: 'var(--text-primary)' }}>
          Introduce Your Team
        </h2>
        <div className="flex items-center gap-3 my-3">
          <div className="h-px w-8" style={{ background: 'var(--gold)' }} />
          <div className="w-1 h-1 rounded-full" style={{ background: 'var(--gold)' }} />
          <div className="h-px w-8" style={{ background: 'var(--gold)' }} />
        </div>
        <p className="text-sm leading-relaxed" style={{ color: 'var(--text-secondary)' }}>
          Add each team member's profile and contact details. This builds your website's team section and connects individual booking calendars.
        </p>
      </div>

      {/* Count pill */}
      <div className="animate-fade-up delay-100 flex items-center justify-between mb-5">
        <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full border text-xs font-semibold" style={{ borderColor: `${accent}30`, background: `${accent}0a`, color: accent }}>
          <Users className="w-3.5 h-3.5" />
          {staff.length === 0 ? 'No members added' : `${staff.length} member${staff.length !== 1 ? 's' : ''} added`}
        </div>
      </div>

      {/* Empty state */}
      {staff.length === 0 && (
        <div className="animate-fade-up delay-100 rounded-2xl border border-dashed p-10 flex flex-col items-center gap-3 mb-5" style={{ borderColor: `${accent}18`, background: 'var(--bg-raised)' }}>
          <div className="w-14 h-14 rounded-full flex items-center justify-center border-2" style={{ borderColor: `${accent}25`, background: `${accent}0a` }}>
            <Users className="w-6 h-6" style={{ color: `${accent}60` }} />
          </div>
          <div className="text-center">
            <p className="text-sm font-medium" style={{ color: 'var(--text-secondary)' }}>No team members yet</p>
            <p className="text-xs mt-1 max-w-[220px]" style={{ color: 'var(--text-muted)' }}>Add your barbers, stylists, or aestheticians using the button below.</p>
          </div>
        </div>
      )}

      {/* Member cards */}
      {staff.length > 0 && (
        <div className="flex flex-col gap-4 mb-4">
          {staff.map((member, i) => (
            <MemberCard key={member.id} member={member} index={i} businessType={businessType} accent={accent} onUpdate={updateMember} onDelete={deleteMember} />
          ))}
        </div>
      )}

      {/* Add button */}
      <div className="animate-fade-up delay-200 mb-3">
        <button
          onClick={addMember}
          className="w-full flex items-center justify-center gap-2.5 py-4 rounded-2xl border border-dashed text-sm font-semibold transition-all duration-200 active:scale-[0.98]"
          style={{ borderColor: `${accent}25`, color: `${accent}80` }}
          onMouseEnter={(e) => { e.currentTarget.style.borderColor = accent; e.currentTarget.style.color = accent; e.currentTarget.style.background = `${accent}08`; }}
          onMouseLeave={(e) => { e.currentTarget.style.borderColor = `${accent}25`; e.currentTarget.style.color = `${accent}80`; e.currentTarget.style.background = 'transparent'; }}
        >
          <Plus className="w-4 h-4" />
          Add Another Team Member
        </button>
      </div>

      {staff.length === 0 && (
        <p className="text-center text-[11px] mb-6" style={{ color: 'var(--text-faint)' }}>
          Don't have this to hand? Skip for now — our team will follow up before launch.
        </p>
      )}

      {/* Hiring section */}
      <div className="animate-fade-up delay-300 rounded-2xl border overflow-hidden mb-5" style={{ borderColor: 'var(--border)', background: 'var(--bg-card)' }}>
        <div className="flex items-center justify-between px-4 py-3.5 border-b" style={{ borderColor: 'var(--border-sub)' }}>
          <div className="flex items-center gap-2">
            <Briefcase className="w-3.5 h-3.5" style={{ color: `${accent}90` }} />
            <span className="text-[11px] uppercase tracking-widest font-semibold" style={{ color: 'var(--text-muted)' }}>Currently Hiring?</span>
          </div>
          <button
            type="button"
            onClick={() => setHiring({ ...hiring, active: !hiring.active })}
            className="relative rounded-full transition-all duration-200 flex-shrink-0"
            style={{ background: hiring.active ? accent : 'var(--border)', width: '40px', height: '22px' }}
          >
            <span className="absolute top-[3px] w-4 h-4 rounded-full bg-white shadow transition-all duration-200" style={{ left: hiring.active ? '20px' : '3px' }} />
          </button>
        </div>

        {hiring.active && (
          <div className="p-4 flex flex-col gap-4 animate-fade-up">
            <div>
              <p className="text-[10px] uppercase tracking-widest font-semibold mb-2.5" style={{ color: 'var(--text-muted)' }}>What roles are you looking to fill?</p>
              <div className="flex flex-wrap gap-2">
                {HIRING_ROLES.map((role) => {
                  const selected = hiring.roles.includes(role);
                  return (
                    <button
                      key={role} type="button" onClick={() => toggleRole(role)}
                      className="px-3 py-1.5 rounded-full text-xs font-medium border transition-all duration-150 active:scale-95"
                      style={selected
                        ? { borderColor: `${accent}60`, background: `${accent}12`, color: accent }
                        : { borderColor: 'var(--border)', background: 'var(--bg-surface)', color: 'var(--text-muted)' }
                      }
                    >
                      {role}
                    </button>
                  );
                })}
              </div>
            </div>
            <div>
              <div className="flex items-center justify-between mb-2">
                <p className="text-[10px] uppercase tracking-widest font-semibold" style={{ color: 'var(--text-muted)' }}>Brief Description</p>
                <span className="text-[11px] font-mono tabular-nums" style={{ color: (hiring.description || '').length > 240 ? '#f87171' : 'var(--text-faint)' }}>
                  {(hiring.description || '').length}<span style={{ color: 'var(--border)' }}>/250</span>
                </span>
              </div>
              <textarea
                value={hiring.description}
                onChange={(e) => setHiring({ ...hiring, description: e.target.value })}
                rows={3} maxLength={260}
                placeholder={`e.g. "Looking for an experienced barber who specialises in fades..."`}
                className="w-full rounded-xl px-3.5 py-3 text-sm outline-none resize-none leading-relaxed border transition-colors"
                style={{ background: 'var(--bg-surface)', borderColor: 'var(--border)', color: 'var(--text-primary)' }}
              />
              <p className="text-[11px] mt-1.5" style={{ color: 'var(--text-faint)' }}>
                A couple of sentences is enough — we'll include this in your brief so we can feature it on your site.
              </p>
            </div>
          </div>
        )}

        {!hiring.active && (
          <div className="px-4 py-3">
            <p className="text-[11px]" style={{ color: 'var(--text-faint)' }}>
              Toggle on if you'd like to feature a "Now Hiring" section on your website.
            </p>
          </div>
        )}
      </div>

      {/* Navigation */}
      <div className="animate-fade-up delay-400 flex gap-3 mt-5">
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
          className="flex-1 flex items-center justify-center gap-2 px-6 py-3.5 rounded-full font-bold text-sm uppercase tracking-wider text-white transition-all duration-200 hover:scale-[1.02] active:scale-95"
          style={{ background: 'var(--coral)', boxShadow: '0 4px 16px rgba(232,112,90,0.3)' }}
          onMouseEnter={(e) => { e.currentTarget.style.background = 'var(--coral-light)'; }}
          onMouseLeave={(e) => { e.currentTarget.style.background = 'var(--coral)'; }}
        >
          {staff.length === 0 ? 'Skip for Now' : 'Continue to Brief'}
          <ChevronRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}
