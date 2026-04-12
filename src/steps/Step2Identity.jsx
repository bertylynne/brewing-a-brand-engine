import { useState, useRef } from 'react';
import { Upload, ImageIcon, ChevronRight, ChevronLeft, RefreshCw, AlertCircle, Type, X, Plus, Store, Sofa, Sparkles, Building2, Phone, Link as LinkIcon, CreditCard } from 'lucide-react';

// Brand SVG icons not in this version of lucide-react
const FacebookIcon = ({ className, style }) => (
  <svg className={className} style={style} viewBox="0 0 24 24" fill="currentColor" width="16" height="16">
    <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"/>
  </svg>
);
const InstagramIcon = ({ className, style }) => (
  <svg className={className} style={style} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" width="16" height="16">
    <rect x="2" y="2" width="20" height="20" rx="5" ry="5"/><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/><line x1="17.5" y1="6.5" x2="17.51" y2="6.5"/>
  </svg>
);
import { slugify } from '../App';

const PAYMENT_OPTIONS = [
  { id: 'visa',        label: 'Visa' },
  { id: 'mastercard',  label: 'Mastercard' },
  { id: 'amex',        label: 'AMEX' },
  { id: 'cash',        label: 'Cash' },
  { id: 'apple_pay',   label: 'Apple Pay' },
  { id: 'google_pay',  label: 'Google Pay' },
];

const DEFAULT_HERO_TEXT = `Welcome to our premier barbershop and salon — where craftsmanship meets style. Our team of experienced professionals is dedicated to delivering exceptional cuts, styles, and grooming services tailored to you. Whether you're here for a classic fade, a fresh trim, or a full beauty treatment, we've got you covered. Walk in, sit back, and leave looking your absolute best.`;

const CHAR_LIMIT = 250;
const TAGLINE_LIMIT = 80;
const MAX_PHOTOS = 8;

const PHOTO_CATEGORIES = [
  {
    id: 'exterior',
    label: 'Exterior',
    icon: Store,
    hint: 'Storefront / outside view',
    example: 'e.g. your shopfront, signage, parking area',
  },
  {
    id: 'interior',
    label: 'Interior',
    icon: Sofa,
    hint: 'Inside the space',
    example: 'e.g. seating area, waiting room, ambience',
  },
  {
    id: 'highlight',
    label: 'Highlight',
    icon: Sparkles,
    hint: 'Unique / standout feature',
    example: 'e.g. décor, special equipment, artwork, vibe',
  },
  {
    id: 'other',
    label: 'Other',
    icon: ImageIcon,
    hint: 'Anything else',
    example: 'e.g. team photo, product display, event',
  },
];

function wordCount(str) {
  return str.trim() === '' ? 0 : str.trim().split(/\s+/).length;
}

function PhotoSlot({ photo, categoryDef, onUpload, onRemove }) {
  const [dragging, setDragging] = useState(false);
  const fileRef = useRef();
  const Icon = categoryDef.icon;

  const handleFile = (file) => {
    if (!file || !file.type.startsWith('image/')) return;
    onUpload({ id: photo.id, category: photo.category, url: URL.createObjectURL(file), name: file.name });
  };

  return (
    <div className="flex flex-col gap-1.5">
      {/* Category badge */}
      <div className="flex items-center gap-1.5">
        <Icon className="w-3 h-3" style={{ color: 'var(--gold)' }} />
        <span className="text-[11px] font-semibold uppercase tracking-wider" style={{ color: 'var(--text-muted)' }}>
          {categoryDef.label}
        </span>
      </div>

      {/* Drop zone */}
      <div
        onDragOver={(e) => { e.preventDefault(); setDragging(true); }}
        onDragLeave={() => setDragging(false)}
        onDrop={(e) => { e.preventDefault(); setDragging(false); handleFile(e.dataTransfer.files[0]); }}
        onClick={() => !photo.url && fileRef.current?.click()}
        className="relative rounded-xl border-2 border-dashed overflow-hidden transition-all duration-200"
        style={{
          aspectRatio: '4/3',
          cursor: photo.url ? 'default' : 'pointer',
          borderColor: dragging ? 'var(--gold)' : photo.url ? 'rgba(201,162,39,0.4)' : 'var(--border)',
          background: dragging ? 'rgba(201,162,39,0.06)' : 'var(--bg-raised)',
        }}
      >
        {photo.url ? (
          <>
            <img src={photo.url} alt={categoryDef.label} className="w-full h-full object-cover" />
            {/* Overlay: replace */}
            <div
              className="absolute inset-0 bg-black/55 flex flex-col items-center justify-center opacity-0 hover:opacity-100 transition-opacity cursor-pointer gap-1"
              onClick={() => fileRef.current?.click()}
            >
              <Upload className="w-4 h-4 text-white" />
              <span className="text-[10px] text-white/80 font-medium">Replace</span>
            </div>
            {/* Filename strip */}
            <div className="absolute bottom-0 inset-x-0 px-2 py-1.5" style={{ background: 'linear-gradient(to top, rgba(15,28,40,0.85), transparent)' }}>
              <p className="text-[10px] text-white/70 truncate">{photo.name}</p>
            </div>
            {/* Remove button */}
            <button
              onClick={(e) => { e.stopPropagation(); onRemove(photo.id); }}
              className="absolute top-1.5 right-1.5 w-6 h-6 rounded-full flex items-center justify-center transition-opacity bg-black/60 hover:bg-red-500/80"
            >
              <X className="w-3 h-3 text-white" />
            </button>
          </>
        ) : (
          <div className="absolute inset-0 flex flex-col items-center justify-center gap-2 p-3 text-center">
            {dragging ? (
              <>
                <Upload className="w-5 h-5" style={{ color: 'var(--gold)' }} />
                <span className="text-xs font-medium" style={{ color: 'var(--gold)' }}>Drop here</span>
              </>
            ) : (
              <>
                <div
                  className="w-9 h-9 rounded-lg border flex items-center justify-center"
                  style={{ borderColor: 'var(--border)', background: 'var(--bg-surface)' }}
                >
                  <Icon className="w-4 h-4" style={{ color: 'var(--text-faint)' }} />
                </div>
                <div>
                  <p className="text-[11px] font-medium leading-snug" style={{ color: 'var(--text-secondary)' }}>
                    {categoryDef.hint}
                  </p>
                  <p className="text-[10px] mt-0.5 leading-tight" style={{ color: 'var(--text-faint)' }}>
                    {categoryDef.example}
                  </p>
                </div>
              </>
            )}
          </div>
        )}
        <input ref={fileRef} type="file" accept="image/*" className="hidden" onChange={(e) => handleFile(e.target.files[0])} />
      </div>
    </div>
  );
}

export default function Step2Identity({ onNext, onBack, data, setData }) {
  const [heroDragging, setHeroDragging] = useState(false);
  const [logoDragging, setLogoDragging] = useState(false);
  const heroFileRef = useRef();
  const logoFileRef = useRef();
  const addFileRef = useRef();

  const handleTextChange = (e) => setData({ ...data, heroText: e.target.value });

  const handleHeroFile = (file) => {
    if (!file || !file.type.startsWith('image/')) return;
    setData({ ...data, heroImage: URL.createObjectURL(file), heroImageName: file.name });
  };

  const handleLogoFile = (file) => {
    if (!file || !file.type.startsWith('image/')) return;
    setData({ ...data, logo: URL.createObjectURL(file), logoName: file.name });
  };

  // Brand Photos helpers
  const brandPhotos = data.brandPhotos || [];

  const addPhoto = (file, category = 'other') => {
    if (!file || !file.type.startsWith('image/')) return;
    if (brandPhotos.length >= MAX_PHOTOS) return;
    const id = `bp-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`;
    setData({
      ...data,
      brandPhotos: [...brandPhotos, { id, category, url: URL.createObjectURL(file), name: file.name }],
    });
  };

  const updatePhoto = (updated) => {
    setData({
      ...data,
      brandPhotos: brandPhotos.map((p) => (p.id === updated.id ? { ...p, url: updated.url, name: updated.name } : p)),
    });
  };

  const removePhoto = (id) => {
    setData({ ...data, brandPhotos: brandPhotos.filter((p) => p.id !== id) });
  };

  // Suggest a category for new uploads based on what's least filled
  const suggestCategory = () => {
    const counts = {};
    PHOTO_CATEGORIES.forEach((c) => { counts[c.id] = 0; });
    brandPhotos.forEach((p) => { if (counts[p.category] !== undefined) counts[p.category]++; });
    return PHOTO_CATEGORIES.reduce((min, c) => (counts[c.id] < counts[min.id] ? c : min), PHOTO_CATEGORIES[0]).id;
  };

  const handleAddFiles = (files) => {
    Array.from(files).forEach((file) => {
      addPhoto(file, suggestCategory());
    });
  };

  // ── Social links helpers
  const socialLinks  = data.socialLinks  || { facebook: '', instagram: '', others: [] };
  const setSocial    = (patch) => setData({ ...data, socialLinks: { ...socialLinks, ...patch } });
  const addOther     = () => {
    const id = `sl-${Date.now()}`;
    setSocial({ others: [...(socialLinks.others || []), { id, label: '', url: '' }] });
  };
  const updateOther  = (id, field, val) =>
    setSocial({ others: socialLinks.others.map((o) => o.id === id ? { ...o, [field]: val } : o) });
  const removeOther  = (id) =>
    setSocial({ others: socialLinks.others.filter((o) => o.id !== id) });

  // ── Payment methods helpers
  const paymentMethods   = data.paymentMethods || [];
  const togglePayment    = (id) =>
    setData({ ...data, paymentMethods: paymentMethods.includes(id) ? paymentMethods.filter((p) => p !== id) : [...paymentMethods, id] });

  // ── Phone mask  (xxx) xxx-xxxx
  const applyPhoneMask = (raw) => {
    const digits = raw.replace(/\D/g, '').slice(0, 10);
    if (digits.length === 0) return '';
    if (digits.length <= 3)  return `(${digits}`;
    if (digits.length <= 6)  return `(${digits.slice(0,3)}) ${digits.slice(3)}`;
    return `(${digits.slice(0,3)}) ${digits.slice(3,6)}-${digits.slice(6)}`;
  };
  const handlePhone = (raw) => setData({ ...data, phone: applyPhoneMask(raw) });

  // ── Business Name / biz_id
  const handleBusinessName = (val) => {
    const slug = data.bizId && data.bizId !== slugify(data.businessName || '')
      ? data.bizId   // user has a URL-supplied bizId — don't overwrite
      : slugify(val);
    setData({ ...data, businessName: val, bizId: slug });
  };

  const text       = data.heroText || DEFAULT_HERO_TEXT;
  const charCount  = text.length;
  const words      = wordCount(text);
  const tagline    = data.tagline || '';
  const taglineLen = tagline.length;

  const nearLimit    = charCount >= 200;
  const overLimit    = charCount > CHAR_LIMIT;
  const taglineOver  = taglineLen > TAGLINE_LIMIT;

  const textareaBorder = overLimit
    ? '2px solid rgba(239,68,68,0.6)'
    : 'none';

  return (
    <div className="px-5 py-8 max-w-lg mx-auto w-full">
      {/* Header */}
      <div className="animate-fade-up mb-6">
        <p className="text-[11px] tracking-[0.2em] uppercase font-semibold mb-2" style={{ color: 'var(--coral)' }}>
          — Step 02 —
        </p>
        <h2 className="font-serif-display text-2xl font-bold tracking-tight" style={{ color: 'var(--text-primary)' }}>
          Brand Identity
        </h2>
        <div className="flex items-center gap-3 my-3">
          <div className="h-px w-8" style={{ background: 'var(--gold)' }} />
          <div className="w-1 h-1 rounded-full" style={{ background: 'var(--gold)' }} />
          <div className="h-px w-8" style={{ background: 'var(--gold)' }} />
        </div>
        <p className="text-sm leading-relaxed" style={{ color: 'var(--text-secondary)' }}>
          Review the opening statement for your site. Supply your logo, tagline, and brand photos if you have them ready.
        </p>
      </div>

      {/* Business Name */}
      <div className="animate-fade-up delay-100 mb-6">
        <label className="block text-xs uppercase tracking-wider font-semibold mb-2" style={{ color: 'var(--text-muted)' }}>
          Business Name <span style={{ color: 'var(--coral)' }}>*</span>
        </label>
        <div className="flex items-center gap-2.5 rounded-xl border px-3.5 py-3 transition-colors focus-within:border-opacity-80"
          style={{ background: 'var(--bg-raised)', borderColor: data.businessName ? 'rgba(201,162,39,0.4)' : 'var(--border)' }}>
          <Building2 className="w-4 h-4 flex-shrink-0" style={{ color: 'var(--text-faint)' }} />
          <input
            type="text"
            value={data.businessName || ''}
            onChange={(e) => handleBusinessName(e.target.value)}
            placeholder="e.g. The Grand Barber Studio"
            className="flex-1 bg-transparent text-sm outline-none"
            style={{ color: 'var(--text-primary)' }}
          />
        </div>
        {data.businessName && (
          <p className="text-[11px] mt-1.5 font-mono" style={{ color: 'var(--text-faint)' }}>
            ID: <span style={{ color: 'var(--gold)' }}>{data.bizId || slugify(data.businessName)}</span>
          </p>
        )}
      </div>

      {/* Business Phone */}
      <div className="animate-fade-up delay-100 mb-6">
        <label className="block text-xs uppercase tracking-wider font-semibold mb-2" style={{ color: 'var(--text-muted)' }}>
          Business Phone Number
        </label>
        <div
          className="flex items-center gap-2.5 rounded-xl border px-3.5 py-3 transition-colors focus-within:border-opacity-80"
          style={{ background: 'var(--bg-raised)', borderColor: data.phone ? 'rgba(201,162,39,0.4)' : 'var(--border)' }}
        >
          <Phone className="w-4 h-4 flex-shrink-0" style={{ color: 'var(--text-faint)' }} />
          <input
            type="tel"
            value={data.phone || ''}
            onChange={(e) => handlePhone(e.target.value)}
            placeholder="(555) 000-0000"
            className="flex-1 bg-transparent text-sm outline-none"
            style={{ color: 'var(--text-primary)' }}
          />
        </div>
      </div>

      {/* Opening Statement */}
      <div className="animate-fade-up delay-100 mb-6">
        <div className="flex justify-between items-center mb-2">
          <label className="text-xs uppercase tracking-wider font-semibold" style={{ color: 'var(--text-muted)' }}>
            Opening Statement
          </label>
          <div className="flex items-center gap-2">
            <span className="text-[11px] font-mono hidden sm:inline" style={{ color: 'var(--text-faint)' }}>
              {words} words
            </span>
            <span style={{ color: 'var(--border)' }}>·</span>
            <div className="flex items-center gap-1">
              {(nearLimit || overLimit) && (
                <AlertCircle className={`w-3.5 h-3.5 flex-shrink-0 ${overLimit ? 'text-red-400' : ''}`}
                  style={overLimit ? {} : { color: 'var(--gold)' }} />
              )}
              <span
                className="text-xs font-mono tabular-nums transition-colors duration-200"
                style={{ color: overLimit ? '#f87171' : nearLimit ? 'var(--gold)' : 'var(--text-faint)' }}
              >
                {charCount}
                <span style={{ color: 'var(--border)' }}>/{CHAR_LIMIT}</span>
              </span>
            </div>
          </div>
        </div>

        <div
          className="relative rounded-xl transition-all duration-200"
          style={{ background: 'var(--bg-raised)', border: overLimit ? textareaBorder : `1px solid var(--border)` }}
        >
          <textarea
            value={text}
            onChange={handleTextChange}
            rows={6}
            className="w-full bg-transparent text-sm leading-relaxed p-4 pb-5 resize-none outline-none rounded-xl"
            style={{ color: 'var(--text-primary)' }}
            placeholder="Write your hero section copy here..."
          />
          <div className="absolute bottom-0 inset-x-0 h-[3px] rounded-b-xl overflow-hidden" style={{ background: 'var(--bg-surface)' }}>
            <div
              className="h-full transition-all duration-300"
              style={{
                width: `${Math.min((charCount / CHAR_LIMIT) * 100, 100)}%`,
                background: overLimit ? '#ef4444' : nearLimit ? 'var(--gold)' : 'var(--border)',
              }}
            />
          </div>
        </div>

        {overLimit && (
          <p className="mt-2 text-xs text-red-400 flex items-center gap-1.5 animate-fade-up">
            <AlertCircle className="w-3.5 h-3.5 flex-shrink-0" />
            {charCount - CHAR_LIMIT} character{charCount - CHAR_LIMIT !== 1 ? 's' : ''} over the limit — trim your copy to continue.
          </p>
        )}

        <button
          onClick={() => setData({ ...data, heroText: DEFAULT_HERO_TEXT })}
          className="mt-2 flex items-center gap-1.5 text-[11px] transition-colors"
          style={{ color: 'var(--text-faint)' }}
          onMouseEnter={(e) => { e.currentTarget.style.color = 'var(--gold)'; }}
          onMouseLeave={(e) => { e.currentTarget.style.color = 'var(--text-faint)'; }}
        >
          <RefreshCw className="w-3 h-3" />
          Reset to default
        </button>
      </div>

      {/* Logo + Tagline */}
      <div className="animate-fade-up delay-200 mb-6">
        <div className="grid grid-cols-[auto_1fr] gap-4 items-start">

          {/* Logo upload */}
          <div>
            <label className="block text-xs uppercase tracking-wider font-semibold mb-2" style={{ color: 'var(--text-muted)' }}>
              Logo
            </label>
            <div
              onDragOver={(e) => { e.preventDefault(); setLogoDragging(true); }}
              onDragLeave={() => setLogoDragging(false)}
              onDrop={(e) => { e.preventDefault(); setLogoDragging(false); handleLogoFile(e.dataTransfer.files[0]); }}
              onClick={() => logoFileRef.current?.click()}
              className="relative w-[88px] h-[88px] rounded-xl border-2 border-dashed cursor-pointer transition-all duration-200 overflow-hidden flex items-center justify-center"
              style={
                logoDragging
                  ? { borderColor: 'var(--gold)', background: 'rgba(201,162,39,0.08)' }
                  : data.logo
                  ? { borderColor: 'rgba(201,162,39,0.4)', background: 'var(--bg-raised)' }
                  : { borderColor: 'var(--border)', background: 'var(--bg-raised)' }
              }
            >
              {data.logo ? (
                <>
                  <img src={data.logo} alt="Logo" className="w-full h-full object-contain p-2" />
                  <div className="absolute inset-0 bg-black/60 flex flex-col items-center justify-center opacity-0 hover:opacity-100 transition-opacity gap-1">
                    <Upload className="w-4 h-4 text-white" />
                    <span className="text-[10px] text-white/80 font-medium">Replace</span>
                  </div>
                </>
              ) : (
                <div className="flex flex-col items-center gap-1.5 p-2 text-center">
                  {logoDragging ? (
                    <>
                      <Upload className="w-5 h-5" style={{ color: 'var(--gold)' }} />
                      <span className="text-[9px] font-medium leading-tight" style={{ color: 'var(--gold)' }}>Drop here</span>
                    </>
                  ) : (
                    <>
                      <div className="w-8 h-8 rounded-lg border flex items-center justify-center" style={{ borderColor: 'var(--border)', background: 'var(--bg-surface)' }}>
                        <ImageIcon className="w-4 h-4" style={{ color: 'var(--text-faint)' }} />
                      </div>
                      <span className="text-[9px] leading-tight" style={{ color: 'var(--text-faint)' }}>Upload<br />logo</span>
                    </>
                  )}
                </div>
              )}
            </div>
            <input ref={logoFileRef} type="file" accept="image/*" className="hidden" onChange={(e) => handleLogoFile(e.target.files[0])} />
            {data.logo && (
              <button
                onClick={(e) => { e.stopPropagation(); setData({ ...data, logo: null, logoName: null }); }}
                className="mt-1.5 text-[10px] transition-colors w-full text-center"
                style={{ color: 'var(--text-faint)' }}
                onMouseEnter={(e) => { e.currentTarget.style.color = '#f87171'; }}
                onMouseLeave={(e) => { e.currentTarget.style.color = 'var(--text-faint)'; }}
              >
                Remove
              </button>
            )}
          </div>

          {/* Tagline */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <label className="text-xs uppercase tracking-wider font-semibold" style={{ color: 'var(--text-muted)' }}>
                Tagline
              </label>
              <span
                className="text-[11px] font-mono tabular-nums transition-colors"
                style={{ color: taglineLen > TAGLINE_LIMIT ? '#f87171' : taglineLen > 60 ? 'var(--gold)' : 'var(--text-faint)' }}
              >
                {taglineLen}<span style={{ color: 'var(--border)' }}>/{TAGLINE_LIMIT}</span>
              </span>
            </div>
            <div
              className="relative rounded-xl transition-all duration-200"
              style={{ background: 'var(--bg-raised)', border: taglineOver ? '2px solid rgba(239,68,68,0.6)' : `1px solid var(--border)` }}
            >
              <div className="flex items-start gap-2.5 px-3 pt-3 pb-2">
                <Type className="w-3.5 h-3.5 flex-shrink-0 mt-0.5" style={{ color: 'var(--text-faint)' }} />
                <textarea
                  value={tagline}
                  onChange={(e) => setData({ ...data, tagline: e.target.value })}
                  rows={3}
                  maxLength={TAGLINE_LIMIT + 20}
                  placeholder={`e.g. "Where Every Cut Tells a Story"`}
                  className="flex-1 bg-transparent text-sm leading-relaxed resize-none outline-none min-w-0"
                  style={{ color: 'var(--text-primary)' }}
                />
              </div>
              <div className="h-[2px] rounded-b-xl overflow-hidden" style={{ background: 'var(--bg-surface)' }}>
                <div
                  className="h-full transition-all duration-300"
                  style={{
                    width: `${Math.min((taglineLen / TAGLINE_LIMIT) * 100, 100)}%`,
                    background: taglineLen > TAGLINE_LIMIT ? '#ef4444' : taglineLen > 60 ? 'var(--gold)' : 'var(--border)',
                  }}
                />
              </div>
            </div>
            {taglineOver ? (
              <p className="mt-1.5 text-xs text-red-400 flex items-center gap-1.5 animate-fade-up">
                <AlertCircle className="w-3.5 h-3.5 flex-shrink-0" />
                {taglineLen - TAGLINE_LIMIT} character{taglineLen - TAGLINE_LIMIT !== 1 ? 's' : ''} over the limit.
              </p>
            ) : (
              <p className="text-[11px] mt-1.5 leading-relaxed" style={{ color: 'var(--text-faint)' }}>
                A short phrase that captures your brand. Leave blank if you don't have one yet.
              </p>
            )}
          </div>
        </div>
      </div>

      {/* Hero Photo */}
      <div className="animate-fade-up delay-300 mb-6">
        <label className="block text-xs uppercase tracking-wider font-semibold mb-2" style={{ color: 'var(--text-muted)' }}>
          Hero Photo
        </label>
        <div
          onDragOver={(e) => { e.preventDefault(); setHeroDragging(true); }}
          onDragLeave={() => setHeroDragging(false)}
          onDrop={(e) => { e.preventDefault(); setHeroDragging(false); handleHeroFile(e.dataTransfer.files[0]); }}
          onClick={() => heroFileRef.current?.click()}
          className="relative rounded-xl border-2 border-dashed cursor-pointer transition-all duration-200 overflow-hidden"
          style={
            heroDragging
              ? { borderColor: 'var(--gold)', background: 'rgba(201,162,39,0.05)' }
              : data.heroImage
              ? { borderColor: 'rgba(201,162,39,0.4)', background: 'var(--bg-raised)' }
              : { borderColor: 'var(--border)', background: 'var(--bg-raised)' }
          }
        >
          {data.heroImage ? (
            <div className="relative aspect-video">
              <img src={data.heroImage} alt="Hero" className="w-full h-full object-cover" />
              <div className="absolute inset-0 bg-black/50 flex flex-col items-center justify-center opacity-0 hover:opacity-100 transition-opacity">
                <Upload className="w-6 h-6 text-white mb-1" />
                <span className="text-white text-xs">Replace image</span>
              </div>
              <div className="absolute bottom-2 left-2 right-2">
                <div className="bg-black/60 backdrop-blur rounded-lg px-3 py-1.5 flex items-center gap-2">
                  <ImageIcon className="w-3 h-3" style={{ color: 'var(--gold)' }} />
                  <span className="text-[11px] text-white/80 truncate">{data.heroImageName}</span>
                </div>
              </div>
            </div>
          ) : (
            <div className="aspect-video flex flex-col items-center justify-center gap-3 p-8">
              <div
                className="w-14 h-14 rounded-full flex items-center justify-center border-2 transition-all duration-200"
                style={
                  heroDragging
                    ? { borderColor: 'var(--gold)', background: 'rgba(201,162,39,0.1)' }
                    : { borderColor: 'var(--border)', background: 'var(--bg-surface)' }
                }
              >
                <Upload className="w-6 h-6 transition-colors" style={{ color: heroDragging ? 'var(--gold)' : 'var(--text-faint)' }} />
              </div>
              <div className="text-center">
                <p className="text-sm font-medium" style={{ color: 'var(--text-secondary)' }}>
                  {heroDragging ? 'Drop your image here' : 'Upload hero photo'}
                </p>
                <p className="text-xs mt-0.5" style={{ color: 'var(--text-faint)' }}>
                  Drag & drop or click to browse · JPG, PNG, WebP
                </p>
              </div>
            </div>
          )}
        </div>
        <input ref={heroFileRef} type="file" accept="image/*" className="hidden" onChange={(e) => handleHeroFile(e.target.files[0])} />
        {!data.heroImage && (
          <p className="text-[11px] mt-2 text-center" style={{ color: 'var(--text-faint)' }}>
            No photo yet? Our team will source a professional placeholder — you can supply yours before launch.
          </p>
        )}
      </div>

      {/* ── Brand Photos ──────────────────────────────────── */}
      <div className="animate-fade-up delay-400 mb-8">
        {/* Section header */}
        <div className="flex items-end justify-between mb-1">
          <label className="block text-xs uppercase tracking-wider font-semibold" style={{ color: 'var(--text-muted)' }}>
            Brand Photos
          </label>
          <span className="text-[11px] font-mono tabular-nums" style={{ color: 'var(--text-faint)' }}>
            {brandPhotos.length}<span style={{ color: 'var(--border)' }}>/{MAX_PHOTOS}</span>
          </span>
        </div>
        <p className="text-[12px] mb-4 leading-relaxed" style={{ color: 'var(--text-faint)' }}>
          Help us capture the feel of your business. Upload photos of your storefront, interior, or anything that showcases your space.
        </p>

        {/* Category legend */}
        <div className="grid grid-cols-2 gap-2 mb-4">
          {PHOTO_CATEGORIES.map((cat) => {
            const CatIcon = cat.icon;
            return (
              <div
                key={cat.id}
                className="flex items-start gap-2 rounded-lg px-3 py-2.5"
                style={{ background: 'var(--bg-raised)', border: '1px solid var(--border)' }}
              >
                <CatIcon className="w-3.5 h-3.5 flex-shrink-0 mt-0.5" style={{ color: 'var(--gold)' }} />
                <div>
                  <p className="text-[11px] font-semibold leading-snug" style={{ color: 'var(--text-secondary)' }}>
                    {cat.label}
                  </p>
                  <p className="text-[10px] leading-tight mt-0.5" style={{ color: 'var(--text-faint)' }}>
                    {cat.example}
                  </p>
                </div>
              </div>
            );
          })}
        </div>

        {/* Uploaded photos grid */}
        {brandPhotos.length > 0 && (
          <div className="grid grid-cols-2 gap-3 mb-3">
            {brandPhotos.map((photo) => {
              const catDef = PHOTO_CATEGORIES.find((c) => c.id === photo.category) || PHOTO_CATEGORIES[3];
              return (
                <PhotoSlot
                  key={photo.id}
                  photo={photo}
                  categoryDef={catDef}
                  onUpload={updatePhoto}
                  onRemove={removePhoto}
                />
              );
            })}
          </div>
        )}

        {/* Add photos CTA */}
        {brandPhotos.length < MAX_PHOTOS && (
          <div>
            <button
              onClick={() => addFileRef.current?.click()}
              className="w-full flex items-center justify-center gap-2 rounded-xl border-2 border-dashed py-4 text-sm font-medium transition-all duration-200"
              style={{ borderColor: 'var(--border)', color: 'var(--text-muted)', background: 'var(--bg-raised)' }}
              onMouseEnter={(e) => {
                e.currentTarget.style.borderColor = 'rgba(201,162,39,0.5)';
                e.currentTarget.style.color = 'var(--gold)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.borderColor = 'var(--border)';
                e.currentTarget.style.color = 'var(--text-muted)';
              }}
            >
              <Plus className="w-4 h-4" />
              Add Photos ({MAX_PHOTOS - brandPhotos.length} remaining)
            </button>
            <input
              ref={addFileRef}
              type="file"
              accept="image/*"
              multiple
              className="hidden"
              onChange={(e) => handleAddFiles(e.target.files)}
            />
            <p className="text-[11px] mt-2 text-center" style={{ color: 'var(--text-faint)' }}>
              You can add up to {MAX_PHOTOS} photos · JPG, PNG, WebP · Drag & drop also works
            </p>
          </div>
        )}

        {brandPhotos.length === MAX_PHOTOS && (
          <p className="text-[11px] text-center" style={{ color: 'var(--text-faint)' }}>
            Maximum {MAX_PHOTOS} photos reached — remove one to add another.
          </p>
        )}
      </div>

      {/* ── Social Media Hub ──────────────────────────────── */}
      <div className="animate-fade-up delay-400 mb-6">
        <label className="block text-xs uppercase tracking-wider font-semibold mb-3" style={{ color: 'var(--text-muted)' }}>
          Social Media
        </label>
        <div className="flex flex-col gap-2.5">
          {/* Facebook */}
          <div className="flex items-center gap-2.5 rounded-xl border px-3.5 py-3" style={{ background: 'var(--bg-raised)', borderColor: 'var(--border)' }}>
            <FacebookIcon className="w-4 h-4 flex-shrink-0" style={{ color: '#1877F2' }} />
            <input type="url" value={socialLinks.facebook} onChange={(e) => setSocial({ facebook: e.target.value })}
              placeholder="https://facebook.com/yourbusiness"
              className="flex-1 bg-transparent text-sm outline-none" style={{ color: 'var(--text-primary)' }} />
          </div>
          {/* Instagram */}
          <div className="flex items-center gap-2.5 rounded-xl border px-3.5 py-3" style={{ background: 'var(--bg-raised)', borderColor: 'var(--border)' }}>
            <InstagramIcon className="w-4 h-4 flex-shrink-0" style={{ color: '#E1306C' }} />
            <input type="url" value={socialLinks.instagram} onChange={(e) => setSocial({ instagram: e.target.value })}
              placeholder="https://instagram.com/yourbusiness"
              className="flex-1 bg-transparent text-sm outline-none" style={{ color: 'var(--text-primary)' }} />
          </div>
          {/* Extra links */}
          {(socialLinks.others || []).map((other) => (
            <div key={other.id} className="flex items-center gap-2 rounded-xl border px-3 py-2.5" style={{ background: 'var(--bg-raised)', borderColor: 'var(--border)' }}>
              <LinkIcon className="w-4 h-4 flex-shrink-0" style={{ color: 'var(--text-faint)' }} />
              <input type="text" value={other.label} onChange={(e) => updateOther(other.id, 'label', e.target.value)}
                placeholder="Label (e.g. TikTok)" className="w-24 bg-transparent text-xs outline-none border-r pr-2 mr-1"
                style={{ color: 'var(--text-primary)', borderColor: 'var(--border)' }} />
              <input type="url" value={other.url} onChange={(e) => updateOther(other.id, 'url', e.target.value)}
                placeholder="https://" className="flex-1 bg-transparent text-sm outline-none"
                style={{ color: 'var(--text-primary)' }} />
              <button onClick={() => removeOther(other.id)} className="flex-shrink-0 w-6 h-6 rounded-full flex items-center justify-center transition-colors"
                style={{ color: 'var(--text-faint)' }}
                onMouseEnter={(e) => { e.currentTarget.style.color = '#f87171'; e.currentTarget.style.background = 'rgba(248,113,113,0.1)'; }}
                onMouseLeave={(e) => { e.currentTarget.style.color = 'var(--text-faint)'; e.currentTarget.style.background = 'transparent'; }}>
                <X className="w-3 h-3" />
              </button>
            </div>
          ))}
          <button onClick={addOther}
            className="flex items-center gap-2 text-xs font-medium transition-colors self-start px-1"
            style={{ color: 'var(--text-faint)' }}
            onMouseEnter={(e) => { e.currentTarget.style.color = 'var(--gold)'; }}
            onMouseLeave={(e) => { e.currentTarget.style.color = 'var(--text-faint)'; }}>
            <Plus className="w-3.5 h-3.5" /> Add another platform
          </button>
        </div>
      </div>

      {/* ── Payment Methods ────────────────────────────────── */}
      <div className="animate-fade-up delay-400 mb-8">
        <div className="flex items-center gap-2 mb-3">
          <CreditCard className="w-3.5 h-3.5" style={{ color: 'var(--gold)' }} />
          <label className="text-xs uppercase tracking-wider font-semibold" style={{ color: 'var(--text-muted)' }}>
            Payment Methods Accepted
          </label>
        </div>
        <div className="grid grid-cols-3 gap-2">
          {PAYMENT_OPTIONS.map((opt) => {
            const active = paymentMethods.includes(opt.id);
            return (
              <button key={opt.id} type="button" onClick={() => togglePayment(opt.id)}
                className="flex items-center justify-center gap-1.5 px-3 py-2.5 rounded-xl border text-xs font-semibold transition-all duration-150 active:scale-95"
                style={active
                  ? { borderColor: 'rgba(201,162,39,0.6)', background: 'rgba(201,162,39,0.1)', color: 'var(--gold)' }
                  : { borderColor: 'var(--border)', background: 'var(--bg-raised)', color: 'var(--text-muted)' }}>
                {active && <span className="w-1.5 h-1.5 rounded-full flex-shrink-0" style={{ background: 'var(--gold)' }} />}
                {opt.label}
              </button>
            );
          })}
        </div>
      </div>

      {/* Navigation */}
      <div className="animate-fade-up delay-500 flex gap-3">
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
          disabled={overLimit || taglineOver || !data.businessName?.trim()}
          title={overLimit ? `Trim your opening statement to under ${CHAR_LIMIT} characters` : taglineOver ? `Trim your tagline to under ${TAGLINE_LIMIT} characters` : undefined}
          className="flex-1 flex items-center justify-center gap-2 px-6 py-3.5 rounded-full font-bold text-sm uppercase tracking-wider text-white transition-all duration-200 active:scale-95"
          style={
            overLimit || taglineOver || !data.businessName?.trim()
              ? { background: 'var(--bg-raised)', color: 'var(--text-faint)', cursor: 'not-allowed' }
              : { background: 'var(--coral)', boxShadow: '0 4px 16px rgba(232,112,90,0.3)' }
          }
          onMouseEnter={(e) => { if (!overLimit && !taglineOver && data.businessName?.trim()) e.currentTarget.style.background = 'var(--coral-light)'; }}
          onMouseLeave={(e) => { if (!overLimit && !taglineOver && data.businessName?.trim()) e.currentTarget.style.background = 'var(--coral)'; }}
        >
          Continue
          <ChevronRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}
